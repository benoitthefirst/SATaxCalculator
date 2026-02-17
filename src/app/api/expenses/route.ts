import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const expenseCreateSchema = z.object({
  company_id: z.string(),
  user_id: z.string(),
  expense_date: z.string(),
  amount: z.number().positive(),
  category_id: z.string(),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'eft', 'other']),
  vendor_name: z.string().optional(),
  description: z.string().optional(),
  is_tax_deductible: z.boolean().default(true),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = expenseCreateSchema.parse(body)

    // Verify user has access to this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: validatedData.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this company' },
        { status: 403 }
      )
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        company_id: validatedData.company_id,
        user_id: session.user.id,
        expense_date: new Date(validatedData.expense_date),
        amount: validatedData.amount,
        category_id: validatedData.category_id,
        payment_method: validatedData.payment_method,
        vendor_name: validatedData.vendor_name,
        description: validatedData.description,
        is_tax_deductible: validatedData.is_tax_deductible,
        notes: validatedData.notes,
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

    return NextResponse.json(
      {
        message: 'Expense created successfully',
        expense,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Expense creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create expense. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's active company membership
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('category') || ''

    const where: any = {
      company_id: membership.company_id,
      is_deleted: false,
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { vendor_name: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoryId) {
      where.category_id = categoryId
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { expense_date: 'desc' },
        take: limit,
        skip,
        include: {
          category: true,
          user: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.expense.count({ where }),
    ])

    return NextResponse.json({
      expenses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Expense fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}
