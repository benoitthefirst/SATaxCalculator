import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveCompanyForUser } from '@/lib/company-context'
import { checkFeatureAccess } from '@/lib/subscription/feature-gate'
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

    const companyId = await getActiveCompanyForUser(session.user.id)

    if (!companyId) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 404 }
      )
    }

    // Get company details
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check feature access - advanced reports requires Professional plan or higher
    const hasAccess = await checkFeatureAccess(companyId, 'advanced_reports')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: 'Deduction Summary reports are available on Professional and Business plans. Upgrade to view your tax-deductible expenses by category.',
          feature: 'advanced_reports',
          upgradeRequired: true,
        },
        { status: 403 }
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
        company_id: companyId,
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
        name: company.name,
        taxNumber: company.tax_number,
        businessType: company.business_type,
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
