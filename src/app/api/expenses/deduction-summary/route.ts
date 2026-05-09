import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { Expense, ExpenseCategory } from '@prisma/client'

type ExpenseWithCategory = Expense & {
  category: ExpenseCategory
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
      include: {
        company: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    // Calculate fiscal year dates (March 1 to Feb 28/29)
    const startDate = new Date(year, 2, 1) // March 1
    const endDate = new Date(year + 1, 1, 28) // Feb 28 next year

    // Get all expenses for the period grouped by category
    const expensesData = await prisma.expense.findMany({
      where: {
        company_id: membership.company.id,
        is_deleted: false,
        expense_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        expense_date: 'desc',
      },
    })
    const expenses = expensesData as ExpenseWithCategory[]

    // Group by category and calculate deductions
    const categoryMap = new Map<string, {
      name: string
      grossAmount: number
      charges: number
      deductibleAmount: number
      count: number
      receiptsComplete: number
      receiptsMissing: number
    }>()

    let totalGross = 0
    let totalCharges = 0
    let totalDeductible = 0

    for (const expense of expenses) {
      const categoryName = expense.category.name
      const amount = Number(expense.amount)
      const charges = Number(expense.charges || 0)
      const deductiblePercent = expense.deductible_percentage || 100
      const deductibleAmount = expense.is_tax_deductible
        ? (amount * deductiblePercent / 100)
        : 0

      totalGross += amount
      totalCharges += charges
      totalDeductible += deductibleAmount

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          grossAmount: 0,
          charges: 0,
          deductibleAmount: 0,
          count: 0,
          receiptsComplete: 0,
          receiptsMissing: 0,
        })
      }

      const cat = categoryMap.get(categoryName)!
      cat.grossAmount += amount
      cat.charges += charges
      cat.deductibleAmount += deductibleAmount
      cat.count += 1

      if (expense.receipt_status === 'yes') {
        cat.receiptsComplete += 1
      } else {
        cat.receiptsMissing += 1
      }
    }

    // Convert to array and sort by deductible amount
    const categories = Array.from(categoryMap.values())
      .sort((a, b) => b.deductibleAmount - a.deductibleAmount)

    return NextResponse.json({
      fiscalYear: `${year}/${year + 1}`,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      categories,
      totals: {
        grossExpenses: totalGross,
        totalCharges: totalCharges,
        totalDeductible: totalDeductible,
        expenseCount: expenses.length,
      },
      company: {
        name: membership.company.name,
        taxNumber: membership.company.tax_number,
        businessType: membership.company.business_type,
      },
    })
  } catch (error) {
    console.error('Deduction summary error:', error)
    return NextResponse.json(
      { error: 'Failed to generate deduction summary' },
      { status: 500 }
    )
  }
}
