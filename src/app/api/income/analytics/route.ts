import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveCompanyForUser } from '@/lib/company-context'
import { checkFeatureAccess } from '@/lib/subscription/feature-gate'

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
        { status: 403 }
      )
    }

    // Check feature access - advanced reports requires Professional plan or higher
    const hasAccess = await checkFeatureAccess(companyId, 'advanced_reports')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: 'Income Analytics is available on Professional and Business plans. Upgrade to access detailed income trends and insights.',
          feature: 'advanced_reports',
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Get date range from query params (default to fiscal year 2025)
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
      ? parseInt(searchParams.get('year')!)
      : 2025

    // Use fiscal year (March to Feb)
    const startDate = new Date(year, 2, 1) // March 1
    const endDate = new Date(year + 1, 1, 28, 23, 59, 59) // Feb 28

    // Fetch all income for the fiscal year
    const incomeRaw = await prisma.income.findMany({
      where: {
        company_id: companyId,
        is_deleted: false,
        income_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        income_date: 'asc',
      },
    })

    const income = incomeRaw as Array<typeof incomeRaw[0] & { category: { name: string } }>

    // Calculate total income
    const totalIncome = income.reduce(
      (sum, inc) => sum + Number(inc.amount),
      0
    )

    // Group by category
    const categoryData = income.reduce((acc, inc) => {
      const categoryName = inc.category?.name || 'Uncategorized'
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          count: 0,
        }
      }
      acc[categoryName].value += Number(inc.amount)
      acc[categoryName].count += 1
      return acc
    }, {} as Record<string, { name: string; value: number; count: number }>)

    const incomeByCategory = Object.values(categoryData).sort(
      (a, b) => b.value - a.value
    )

    // Group by month (fiscal year: March=0 to Feb=11)
    const monthlyData = income.reduce((acc, inc) => {
      const date = new Date(inc.income_date)
      const calendarMonth = date.getMonth() // 0-11
      // Convert to fiscal month (March=0, April=1, ..., Feb=11)
      const fiscalMonth = calendarMonth >= 2 ? calendarMonth - 2 : calendarMonth + 10

      if (!acc[fiscalMonth]) {
        // Get the actual month name
        const monthDate = new Date(year, calendarMonth >= 2 ? calendarMonth : calendarMonth)
        const adjustedYear = calendarMonth < 2 ? year + 1 : year
        const monthName = new Date(adjustedYear, calendarMonth).toLocaleString('en-ZA', {
          month: 'short',
        })
        acc[fiscalMonth] = {
          month: monthName,
          total: 0,
          count: 0,
          fiscalMonth,
        }
      }
      acc[fiscalMonth].total += Number(inc.amount)
      acc[fiscalMonth].count += 1
      return acc
    }, {} as Record<number, { month: string; total: number; count: number; fiscalMonth: number }>)

    // Fill in missing months with zero values (fiscal year order)
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

    const incomeByMonth = fiscalMonths.map((fm) => {
      return (
        monthlyData[fm.index] || {
          month: fm.name,
          total: 0,
          count: 0,
        }
      )
    })

    // Calculate average monthly income (only months with data)
    const monthsWithData = incomeByMonth.filter((m) => m.total > 0).length
    const averageMonthlyIncome = monthsWithData > 0 ? totalIncome / monthsWithData : 0

    // Calculate month-over-month growth
    const monthlyGrowth = incomeByMonth.map((month, index) => {
      if (index === 0) return { ...month, growth: 0, growthPercent: 0 }
      const prevMonth = incomeByMonth[index - 1]
      const growth = month.total - prevMonth.total
      const growthPercent = prevMonth.total > 0 ? (growth / prevMonth.total) * 100 : 0
      return { ...month, growth, growthPercent }
    })

    // Get top 5 income sources
    const topIncome = income
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map((inc) => ({
        id: inc.id,
        description: inc.description || inc.source_name || 'No description',
        amount: Number(inc.amount),
        category: inc.category?.name || 'Uncategorized',
        date: inc.income_date,
        source: inc.source_name,
      }))

    // Calculate best and worst months
    const sortedMonths = [...incomeByMonth].filter(m => m.total > 0).sort((a, b) => b.total - a.total)
    const bestMonth = sortedMonths[0] || null
    const worstMonth = sortedMonths[sortedMonths.length - 1] || null

    return NextResponse.json({
      summary: {
        totalIncome,
        totalCount: income.length,
        averageMonthlyIncome,
        year,
        fiscalYear: `${year}/${year + 1}`,
        bestMonth,
        worstMonth,
      },
      incomeByCategory,
      incomeByMonth: monthlyGrowth,
      topIncome,
    })
  } catch (error) {
    console.error('Income analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch income analytics data' },
      { status: 500 }
    )
  }
}
