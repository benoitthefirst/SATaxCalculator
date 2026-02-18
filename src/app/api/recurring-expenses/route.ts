import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const recurringExpenseSchema = z.object({
  category_id: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  vendor_name: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  payment_method: z.string().optional(),
  is_tax_deductible: z.boolean().default(true),
  frequency: z.enum(['monthly', 'quarterly', 'annually']),
  start_date: z.string(),
  end_date: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
      include: {
        company: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 403 }
      )
    }

    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        company_id: membership.company_id,
      },
      include: {
        category: true,
        created_by: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        next_occurrence: 'asc',
      },
    })

    return NextResponse.json({ recurringExpenses })
  } catch (error) {
    console.error('Fetch recurring expenses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recurring expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
      include: {
        company: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = recurringExpenseSchema.parse(body)

    const startDate = new Date(validatedData.start_date)
    const endDate = validatedData.end_date
      ? new Date(validatedData.end_date)
      : null

    // Calculate next occurrence based on frequency
    const nextOccurrence = new Date(startDate)

    const recurringExpense = await prisma.recurringExpense.create({
      data: {
        company_id: membership.company_id,
        category_id: validatedData.category_id,
        created_by_id: session.user.id,
        amount: validatedData.amount,
        vendor_name: validatedData.vendor_name,
        description: validatedData.description,
        payment_method: validatedData.payment_method,
        is_tax_deductible: validatedData.is_tax_deductible,
        frequency: validatedData.frequency,
        start_date: startDate,
        end_date: endDate,
        next_occurrence: nextOccurrence,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ recurringExpense }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Create recurring expense error:', error)
    return NextResponse.json(
      { error: 'Failed to create recurring expense' },
      { status: 500 }
    )
  }
}
