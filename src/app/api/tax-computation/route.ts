import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// SARS Tax Rates 2025/2026
const CIT_RATE = 0.27 // Corporate Income Tax rate

const SBC_BRACKETS = [
  { min: 0, max: 95750, rate: 0, base: 0 },
  { min: 95751, max: 365000, rate: 0.07, base: 0 },
  { min: 365001, max: 550000, rate: 0.21, base: 18848 },
  { min: 550001, max: Infinity, rate: 0.27, base: 57698 },
]

function calculateSBCTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0

  for (const bracket of SBC_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return bracket.base + (taxableIncome - bracket.min + 1) * bracket.rate
    }
  }
  return 0
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

    // Get all income for the period
    const incomeRecords = await prisma.income.findMany({
      where: {
        company_id: membership.company.id,
        is_deleted: false,
        income_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    })

    // Get all expenses for the period
    const expenses = await prisma.expense.findMany({
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
    })

    // Get assets for depreciation calculation
    const assets = await prisma.asset.findMany({
      where: {
        company_id: membership.company.id,
        is_deleted: false,
        purchase_date: {
          lte: endDate,
        },
        OR: [
          { disposal_date: null },
          { disposal_date: { gte: startDate } },
        ],
      },
    })

    // Calculate income
    const grossIncome = incomeRecords.reduce((sum, inc) => sum + Number(inc.amount), 0)

    // Group income by category
    const incomeByCategory = incomeRecords.reduce((acc, inc) => {
      const catName = inc.category.name
      if (!acc[catName]) acc[catName] = 0
      acc[catName] += Number(inc.amount)
      return acc
    }, {} as Record<string, number>)

    // Calculate deductible expenses
    let totalDeductible = 0
    const expensesByCategory: Record<string, { gross: number; deductible: number; count: number }> = {}

    for (const expense of expenses) {
      const amount = Number(expense.amount)
      const deductiblePercent = expense.deductible_percentage || 100
      const deductibleAmount = expense.is_tax_deductible
        ? (amount * deductiblePercent / 100)
        : 0

      totalDeductible += deductibleAmount

      const catName = expense.category.name
      if (!expensesByCategory[catName]) {
        expensesByCategory[catName] = { gross: 0, deductible: 0, count: 0 }
      }
      expensesByCategory[catName].gross += amount
      expensesByCategory[catName].deductible += deductibleAmount
      expensesByCategory[catName].count += 1
    }

    // Calculate depreciation
    let totalDepreciation = 0
    const depreciationSchedule: Array<{
      name: string
      purchaseCost: number
      businessUsePercent: number
      annualDepreciation: number
    }> = []

    for (const asset of assets) {
      const purchaseCost = Number(asset.purchase_cost)
      const residualValue = Number(asset.residual_value || 0)
      const usefulLife = asset.useful_life_years
      const businessUsePercent = asset.business_use_percent || 100

      // Straight-line depreciation
      const annualDepreciation = ((purchaseCost - residualValue) / usefulLife) * (businessUsePercent / 100)
      totalDepreciation += annualDepreciation

      depreciationSchedule.push({
        name: asset.name,
        purchaseCost,
        businessUsePercent,
        annualDepreciation,
      })
    }

    // Calculate taxable income
    const taxableIncome = grossIncome - totalDeductible - totalDepreciation

    // Calculate tax
    const businessType = membership.company.business_type
    const isSBC = businessType === 'small_business_corporation'

    const citTax = Math.max(0, taxableIncome * CIT_RATE)
    const sbcTax = calculateSBCTax(Math.max(0, taxableIncome))
    const applicableTax = isSBC ? sbcTax : citTax
    const potentialSavings = isSBC ? 0 : (citTax - sbcTax)

    return NextResponse.json({
      fiscalYear: `${year}/${year + 1}`,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      company: {
        name: membership.company.name,
        taxNumber: membership.company.tax_number,
        businessType: businessType,
        isSBC,
      },
      income: {
        gross: grossIncome,
        byCategory: incomeByCategory,
        recordCount: incomeRecords.length,
      },
      expenses: {
        totalDeductible,
        byCategory: expensesByCategory,
        recordCount: expenses.length,
      },
      depreciation: {
        total: totalDepreciation,
        schedule: depreciationSchedule,
        assetCount: assets.length,
      },
      taxComputation: {
        grossIncome,
        lessDeductibleExpenses: totalDeductible,
        lessDepreciation: totalDepreciation,
        taxableIncome: Math.max(0, taxableIncome),
        citRate: CIT_RATE,
        citTax,
        sbcTax,
        applicableTax,
        potentialSavingsIfSBC: potentialSavings,
      },
    })
  } catch (error) {
    console.error('Tax computation error:', error)
    return NextResponse.json(
      { error: 'Failed to compute tax' },
      { status: 500 }
    )
  }
}
