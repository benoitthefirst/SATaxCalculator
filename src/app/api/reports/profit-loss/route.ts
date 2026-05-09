import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

type IncomeWithCategory = Prisma.IncomeGetPayload<{ include: { category: true } }>
type ExpenseWithCategory = Prisma.ExpenseGetPayload<{ include: { category: true } }>

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

    const companyId = membership.company_id

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
      ? parseInt(searchParams.get('year')!)
      : 2025

    // Use fiscal year (March to Feb)
    const startDate = new Date(year, 2, 1) // March 1
    const endDate = new Date(year + 1, 1, 28, 23, 59, 59) // Feb 28

    // Fetch income and expenses
    const [incomeRaw, expenseRaw] = await Promise.all([
      prisma.income.findMany({
        where: {
          company_id: companyId,
          is_deleted: false,
          income_date: { gte: startDate, lte: endDate },
        },
        include: { category: true },
        orderBy: { income_date: 'asc' },
      }),
      prisma.expense.findMany({
        where: {
          company_id: companyId,
          is_deleted: false,
          expense_date: { gte: startDate, lte: endDate },
        },
        include: { category: true },
        orderBy: { expense_date: 'asc' },
      }),
    ])

    const incomeRecords = incomeRaw as IncomeWithCategory[]
    const expenseRecords = expenseRaw as ExpenseWithCategory[]

    // Calculate totals
    const totalIncome = incomeRecords.reduce((sum, inc) => sum + Number(inc.amount), 0)
    const totalExpenses = expenseRecords.reduce((sum, exp) => sum + Number(exp.amount), 0)
    const netProfit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0

    // Group by month (fiscal year order)
    const fiscalMonths = [
      { index: 0, name: 'Mar', calMonth: 2 },
      { index: 1, name: 'Apr', calMonth: 3 },
      { index: 2, name: 'May', calMonth: 4 },
      { index: 3, name: 'Jun', calMonth: 5 },
      { index: 4, name: 'Jul', calMonth: 6 },
      { index: 5, name: 'Aug', calMonth: 7 },
      { index: 6, name: 'Sep', calMonth: 8 },
      { index: 7, name: 'Oct', calMonth: 9 },
      { index: 8, name: 'Nov', calMonth: 10 },
      { index: 9, name: 'Dec', calMonth: 11 },
      { index: 10, name: 'Jan', calMonth: 0 },
      { index: 11, name: 'Feb', calMonth: 1 },
    ]

    // Initialize monthly data
    const monthlyData: Record<number, { income: number; expenses: number; profit: number }> = {}
    fiscalMonths.forEach((fm) => {
      monthlyData[fm.index] = { income: 0, expenses: 0, profit: 0 }
    })

    // Aggregate income by fiscal month
    incomeRecords.forEach((inc) => {
      const calMonth = new Date(inc.income_date).getMonth()
      const fiscalMonth = calMonth >= 2 ? calMonth - 2 : calMonth + 10
      monthlyData[fiscalMonth].income += Number(inc.amount)
    })

    // Aggregate expenses by fiscal month
    expenseRecords.forEach((exp) => {
      const calMonth = new Date(exp.expense_date).getMonth()
      const fiscalMonth = calMonth >= 2 ? calMonth - 2 : calMonth + 10
      monthlyData[fiscalMonth].expenses += Number(exp.amount)
    })

    // Calculate profit for each month
    Object.keys(monthlyData).forEach((key) => {
      const index = parseInt(key)
      monthlyData[index].profit = monthlyData[index].income - monthlyData[index].expenses
    })

    // Create monthly comparison array
    const monthlyComparison = fiscalMonths.map((fm) => ({
      month: fm.name,
      income: monthlyData[fm.index].income,
      expenses: monthlyData[fm.index].expenses,
      profit: monthlyData[fm.index].profit,
      profitMargin: monthlyData[fm.index].income > 0
        ? (monthlyData[fm.index].profit / monthlyData[fm.index].income) * 100
        : 0,
    }))

    // Find profitable and loss months
    const profitableMonths = monthlyComparison.filter((m) => m.profit > 0)
    const lossMonths = monthlyComparison.filter((m) => m.profit < 0)

    // Group expenses by category for breakdown
    const expensesByCategory = expenseRecords.reduce((acc, exp) => {
      const catName = exp.category?.name || 'Uncategorized'
      if (!acc[catName]) {
        acc[catName] = { name: catName, value: 0, count: 0 }
      }
      acc[catName].value += Number(exp.amount)
      acc[catName].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number }>)

    // Group income by category
    const incomeByCategory = incomeRecords.reduce((acc, inc) => {
      const catName = inc.category?.name || 'Uncategorized'
      if (!acc[catName]) {
        acc[catName] = { name: catName, value: 0, count: 0 }
      }
      acc[catName].value += Number(inc.amount)
      acc[catName].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number }>)

    return NextResponse.json({
      summary: {
        fiscalYear: `${year}/${year + 1}`,
        year,
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        incomeCount: incomeRecords.length,
        expenseCount: expenseRecords.length,
        profitableMonths: profitableMonths.length,
        lossMonths: lossMonths.length,
      },
      monthlyComparison,
      incomeByCategory: Object.values(incomeByCategory).sort((a, b) => b.value - a.value),
      expensesByCategory: Object.values(expensesByCategory).sort((a, b) => b.value - a.value),
    })
  } catch (error) {
    console.error('Profit/Loss report error:', error)
    return NextResponse.json(
      { error: 'Failed to generate profit/loss report' },
      { status: 500 }
    )
  }
}
