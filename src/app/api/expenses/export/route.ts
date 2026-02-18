import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

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
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('category') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''

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

    if (startDate) {
      where.expense_date = {
        ...where.expense_date,
        gte: new Date(startDate),
      }
    }

    if (endDate) {
      where.expense_date = {
        ...where.expense_date,
        lte: new Date(endDate),
      }
    }

    const expensesRaw = await prisma.expense.findMany({
      where,
      orderBy: { expense_date: 'desc' },
      include: {
        category: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    })

    const expenses = expensesRaw as Array<Prisma.ExpenseGetPayload<{ include: { category: true; user: { select: { first_name: true; last_name: true } } } }>>

    // Generate CSV
    const headers = [
      'Date',
      'Description',
      'Vendor',
      'Category',
      'Amount (ZAR)',
      'Payment Method',
      'Tax Deductible',
      'Notes',
      'Added By',
    ]

    const rows = expenses.map((expense) => [
      new Date(expense.expense_date).toLocaleDateString('en-ZA'),
      expense.description || '',
      expense.vendor_name || '',
      expense.category.name,
      Number(expense.amount).toFixed(2),
      expense.payment_method?.replace('_', ' ').toUpperCase() || '',
      expense.is_tax_deductible ? 'Yes' : 'No',
      expense.notes || '',
      `${expense.user.first_name} ${expense.user.last_name}`,
    ])

    // Escape CSV fields
    const escapeCsvField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }

    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...rows.map((row) => row.map(escapeCsvField).join(',')),
    ].join('\n')

    const filename = `expenses_${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { error: 'Failed to export expenses' },
      { status: 500 }
    )
  }
}
