import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const incomeUpdateSchema = z.object({
  income_date: z.string().optional(),
  amount: z.number().positive().optional(),
  category_id: z.string().optional(),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'eft', 'other']).optional(),
  source_name: z.string().optional(),
  description: z.string().optional(),
  invoice_number: z.string().optional(),
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

    const income = await prisma.income.findUnique({
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

    if (!income) {
      return NextResponse.json(
        { error: 'Income not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this income's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: income.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this income record' },
        { status: 403 }
      )
    }

    return NextResponse.json({ income })
  } catch (error) {
    console.error('Income fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch income' },
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
    const validatedData = incomeUpdateSchema.parse(body)

    // Get the income to verify ownership
    const existingIncome = await prisma.income.findUnique({
      where: { id },
    })

    if (!existingIncome) {
      return NextResponse.json(
        { error: 'Income not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this income's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingIncome.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this income record' },
        { status: 403 }
      )
    }

    // Update income
    const income = await prisma.income.update({
      where: { id },
      data: {
        ...(validatedData.income_date && {
          income_date: new Date(validatedData.income_date),
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
        ...(validatedData.source_name !== undefined && {
          source_name: validatedData.source_name,
        }),
        ...(validatedData.description !== undefined && {
          description: validatedData.description,
        }),
        ...(validatedData.invoice_number !== undefined && {
          invoice_number: validatedData.invoice_number,
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
      message: 'Income updated successfully',
      income,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Income update error:', error)
    return NextResponse.json(
      { error: 'Failed to update income. Please try again.' },
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

    // Get the income to verify ownership
    const existingIncome = await prisma.income.findUnique({
      where: { id },
    })

    if (!existingIncome) {
      return NextResponse.json(
        { error: 'Income not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this income's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingIncome.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this income record' },
        { status: 403 }
      )
    }

    // Soft delete the income
    await prisma.income.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Income deleted successfully',
    })
  } catch (error) {
    console.error('Income delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete income. Please try again.' },
      { status: 500 }
    )
  }
}
