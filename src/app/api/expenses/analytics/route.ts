import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company
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

    // Get date range from query params (default to current year)
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
      ? parseInt(searchParams.get('year')!)
      : new Date().getFullYear()

    const startDate = new Date(year, 0, 1) // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59) // December 31st

    // Fetch all expenses for the year
    const expensesRaw = await prisma.expense.findMany({
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
        expense_date: 'asc',
      },
    })

    const expenses = expensesRaw as Array<typeof expensesRaw[0] & { category: { name: string } }>

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    // Group by category
    const categoryData = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name || 'Uncategorized'
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          count: 0,
        }
      }
      acc[categoryName].value += Number(expense.amount)
      acc[categoryName].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number }>)

    const expensesByCategory = Object.values(categoryData).sort(
      (a, b) => b.value - a.value
    )

    // Group by month
    const monthlyData = expenses.reduce((acc, expense) => {
      const month = new Date(expense.expense_date).getMonth()
      const monthName = new Date(year, month).toLocaleString('en-ZA', {
        month: 'short',
      })

      if (!acc[month]) {
        acc[month] = {
          month: monthName,
          total: 0,
          count: 0,
        }
      }
      acc[month].total += Number(expense.amount)
      acc[month].count += 1
      return acc
    }, {} as Record<number, { month: string; total: number; count: number }>)

    // Fill in missing months with zero values
    const expensesByMonth = Array.from({ length: 12 }, (_, i) => {
      const monthName = new Date(year, i).toLocaleString('en-ZA', {
        month: 'short',
      })
      return (
        monthlyData[i] || {
          month: monthName,
          total: 0,
          count: 0,
        }
      )
    })

    // Calculate average monthly expense
    const averageMonthlyExpense =
      totalExpenses / expensesByMonth.filter((m) => m.total > 0).length || 0

    // Get top 5 expenses
    const topExpenses = expenses
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map((expense) => ({
        id: expense.id,
        description: expense.description,
        amount: Number(expense.amount),
        category: expense.category?.name || 'Uncategorized',
        date: expense.expense_date,
      }))

    return NextResponse.json({
      summary: {
        totalExpenses,
        totalCount: expenses.length,
        averageMonthlyExpense,
        year,
      },
      expensesByCategory,
      expensesByMonth,
      topExpenses,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
