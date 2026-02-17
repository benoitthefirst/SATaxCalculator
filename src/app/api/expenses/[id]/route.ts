import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const expenseUpdateSchema = z.object({
  expense_date: z.string().optional(),
  amount: z.number().positive().optional(),
  category_id: z.string().optional(),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'eft', 'other']).optional(),
  vendor_name: z.string().optional(),
  description: z.string().optional(),
  is_tax_deductible: z.boolean().optional(),
  notes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: expense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this expense' },
        { status: 403 }
      )
    }

    return NextResponse.json({ expense })
  } catch (error) {
    console.error('Expense fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expense' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = expenseUpdateSchema.parse(body)

    // Get the expense to verify ownership
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingExpense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this expense' },
        { status: 403 }
      )
    }

    // Update expense
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(validatedData.expense_date && {
          expense_date: new Date(validatedData.expense_date),
        }),
        ...(validatedData.amount !== undefined && {
          amount: validatedData.amount,
        }),
        ...(validatedData.category_id && {
          category_id: validatedData.category_id,
        }),
        ...(validatedData.payment_method && {
          payment_method: validatedData.payment_method,
        }),
        ...(validatedData.vendor_name !== undefined && {
          vendor_name: validatedData.vendor_name,
        }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.is_tax_deductible !== undefined && {
          is_tax_deductible: validatedData.is_tax_deductible,
        }),
        ...(validatedData.notes !== undefined && {
          notes: validatedData.notes,
        }),
      },
      include: {
        category: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: 'Expense updated successfully',
      expense,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Expense update error:', error)
    return NextResponse.json(
      { error: 'Failed to update expense. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the expense to verify ownership
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingExpense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this expense' },
        { status: 403 }
      )
    }

    // Soft delete the expense
    await prisma.expense.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Expense deleted successfully',
    })
  } catch (error) {
    console.error('Expense delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense. Please try again.' },
      { status: 500 }
    )
  }
}
