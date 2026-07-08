import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import TaxYearSelector from '@/components/dashboard/TaxYearSelector'
import { getActiveCompany } from '@/lib/company-context'
import { getCurrentFiscalYear } from '@/lib/utils/fiscal-year'
import AIProcessingCenter from '@/components/dashboard/AIProcessingCenter'
import CashFlowChart from '@/components/dashboard/CashFlowChart'
import IncomeCategoryChart from '@/components/dashboard/IncomeCategoryChart'
import RecentDocuments from '@/components/dashboard/RecentDocuments'
import RecentActivity from '@/components/dashboard/RecentActivity'

type IncomeWithCategory = Prisma.IncomeGetPayload<{ include: { category: true } }>
type ExpenseWithCategory = Prisma.ExpenseGetPayload<{ include: { category: true } }>

export const metadata = {
  title: 'Dashboard - ProcessX',
  description: 'Your business dashboard',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  // Get user's active company (from cookie or default to first)
  const activeCompany = await getActiveCompany(session.user.id)

  if (!activeCompany) {
    return null
  }

  // Get company details
  const company = await prisma.company.findUnique({
    where: { id: activeCompany.companyId },
  })

  if (!company) {
    return null
  }

  // Get year from search params (default to current fiscal year)
  const params = await searchParams
  const selectedYear = params.year ? parseInt(params.year) : getCurrentFiscalYear()

  // Fiscal year starts March 1 of selected year, ends Feb 28/29 of next year
  const fiscalYearStart = new Date(selectedYear, 2, 1) // March 1
  const fiscalYearEnd = new Date(selectedYear + 1, 1, 28, 23, 59, 59) // Feb 28

  const companyId = company.id

  // Get all stats in parallel
  const [
    incomeAgg,
    incomeCount,
    expenseAgg,
    expenseCount,
    deductibleExpenseAgg,
    deductibleExpenseCount,
    assets,
    recentIncome,
    recentExpenses,
    expensesByCategory,
    incomeByCategory,
    monthlyIncome,
    monthlyExpenses,
    recentDocuments,
  ] = await Promise.all([
    // Income totals for fiscal year
    prisma.income.aggregate({
      where: {
        company_id: companyId,
        is_deleted: false,
        income_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
      _sum: { amount: true },
    }),
    prisma.income.count({
      where: {
        company_id: companyId,
        is_deleted: false,
        income_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
    }),
    // ALL Expense totals for fiscal year (for display)
    prisma.expense.aggregate({
      where: {
        company_id: companyId,
        is_deleted: false,
        expense_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
      _sum: { amount: true },
    }),
    prisma.expense.count({
      where: {
        company_id: companyId,
        is_deleted: false,
        expense_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
    }),
    // DEDUCTIBLE Expense totals for fiscal year (for tax calculation)
    prisma.expense.aggregate({
      where: {
        company_id: companyId,
        is_deleted: false,
        is_tax_deductible: true,
        expense_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
      _sum: { amount: true },
    }),
    prisma.expense.count({
      where: {
        company_id: companyId,
        is_deleted: false,
        is_tax_deductible: true,
        expense_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
    }),
    // Assets for depreciation calculation
    prisma.asset.findMany({
      where: { company_id: companyId, is_deleted: false },
    }),
    // Recent income
    prisma.income.findMany({
      where: {
        company_id: companyId,
        is_deleted: false,
      },
      orderBy: { income_date: 'desc' },
      take: 5,
      include: { category: true },
    }),
    // Recent expenses
    prisma.expense.findMany({
      where: {
        company_id: companyId,
        is_deleted: false,
      },
      orderBy: { expense_date: 'desc' },
      take: 5,
      include: { category: true },
    }),
    // Expenses by category (top 5)
    prisma.expense.groupBy({
      by: ['category_id'],
      where: {
        company_id: companyId,
        is_deleted: false,
        expense_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
      take: 5,
    }),
    // Income by category
    prisma.income.groupBy({
      by: ['category_id'],
      where: {
        company_id: companyId,
        is_deleted: false,
        income_date: { gte: fiscalYearStart, lte: fiscalYearEnd },
      },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
      take: 5,
    }),
    // Monthly income for chart
    prisma.$queryRaw<{ month: number; total: number }[]>`
      SELECT EXTRACT(MONTH FROM income_date) as month, SUM(amount) as total
      FROM income
      WHERE company_id = ${companyId}
        AND is_deleted = false
        AND income_date >= ${fiscalYearStart}
        AND income_date <= ${fiscalYearEnd}
      GROUP BY EXTRACT(MONTH FROM income_date)
      ORDER BY month
    `,
    // Monthly expenses for chart
    prisma.$queryRaw<{ month: number; total: number }[]>`
      SELECT EXTRACT(MONTH FROM expense_date) as month, SUM(amount) as total
      FROM expenses
      WHERE company_id = ${companyId}
        AND is_deleted = false
        AND expense_date >= ${fiscalYearStart}
        AND expense_date <= ${fiscalYearEnd}
      GROUP BY EXTRACT(MONTH FROM expense_date)
      ORDER BY month
    `,
    // Recent documents
    prisma.pendingDocument.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: 'desc' },
      take: 5,
    }),
  ])

  // Get category names for expense breakdown
  const expenseCategoryIds = expensesByCategory.map(e => (e as { category_id: string }).category_id)
  const expenseCategories = await prisma.expenseCategory.findMany({
    where: { id: { in: expenseCategoryIds } },
  })
  const expenseCategoryMap = Object.fromEntries(expenseCategories.map(c => [c.id, c.name]))

  // Get category names for income breakdown
  const incomeCategoryIds = incomeByCategory.map(i => (i as { category_id: string }).category_id)
  const incomeCategories = await prisma.incomeCategory.findMany({
    where: { id: { in: incomeCategoryIds } },
  })
  const incomeCategoryMap = Object.fromEntries(incomeCategories.map(c => [c.id, c.name]))

  const totalIncomeGross = Number(incomeAgg._sum.amount || 0)
  const totalExpenses = Number(expenseAgg._sum.amount || 0)
  const totalDeductibleExpenses = Number(deductibleExpenseAgg._sum.amount || 0)

  // Check if company is VAT registered
  const isVatRegistered = Boolean(company.vat_number)
  const vatRate = 0.15 // 15% VAT in South Africa

  // For VAT-registered businesses, income includes VAT collected which is not taxable income
  const vatCollected = isVatRegistered ? totalIncomeGross - (totalIncomeGross / (1 + vatRate)) : 0
  const totalIncomeExclVat = isVatRegistered ? totalIncomeGross / (1 + vatRate) : totalIncomeGross

  // Similarly, expenses may include VAT that can be claimed back (input VAT)
  const vatOnExpenses = isVatRegistered ? totalDeductibleExpenses - (totalDeductibleExpenses / (1 + vatRate)) : 0
  const deductibleExpensesExclVat = isVatRegistered ? totalDeductibleExpenses / (1 + vatRate) : totalDeductibleExpenses

  // Calculate depreciation for all assets
  const totalDepreciation = assets.reduce((sum, asset) => {
    const purchaseCost = Number(asset.purchase_cost)
    const residualValue = Number(asset.residual_value || 0)
    const usefulLife = asset.useful_life_years
    const businessUsePercent = asset.business_use_percent || 100
    const annualDepreciation = ((purchaseCost - residualValue) / usefulLife) * (businessUsePercent / 100)
    return sum + annualDepreciation
  }, 0)

  const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.purchase_cost), 0)

  // Calculate taxable income (using VAT-exclusive amounts for VAT-registered businesses)
  const rawTaxableIncome = totalIncomeExclVat - deductibleExpensesExclVat - totalDepreciation
  const taxableIncome = totalIncomeExclVat > 0 ? rawTaxableIncome : 0

  // VAT payable to SARS (Output VAT - Input VAT)
  const vatPayable = vatCollected - vatOnExpenses

  // Calculate estimated tax (27% CIT rate) based on TAXABLE income
  const estimatedTax = taxableIncome > 0 ? taxableIncome * 0.27 : 0

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  // Prepare cash flow chart data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const incomeByMonth = Object.fromEntries(monthlyIncome.map(m => [Number(m.month), Number(m.total)]))
  const expensesByMonth = Object.fromEntries(monthlyExpenses.map(m => [Number(m.month), Number(m.total)]))

  const cashFlowData = monthNames.map((month, index) => ({
    month,
    income: incomeByMonth[index + 1] || 0,
    expenses: expensesByMonth[index + 1] || 0,
  }))

  // Prepare income category chart data
  const incomeCategoryChartData = incomeByCategory.map((cat) => {
    const catData = cat as { category_id: string; _sum: { amount: unknown } }
    return {
      name: incomeCategoryMap[catData.category_id] || 'Unknown',
      value: Number(catData._sum.amount || 0),
      color: '#22C55E',
    }
  })

  // Calculate document stats for AI Processing Center
  const documentsProcessing = recentDocuments.filter(d => d.status === 'PENDING').length
  const documentsCompleted = recentDocuments.filter(d => d.status === 'APPROVED').length
  const avgConfidence = recentDocuments.length > 0
    ? (recentDocuments.reduce((sum, d) => sum + d.confidence, 0) / recentDocuments.length) * 100
    : 0

  // Build recent activities from income and expenses
  const activities = [
    ...(recentIncome as IncomeWithCategory[]).map((income) => ({
      id: income.id,
      type: 'income' as const,
      description: `Added income: ${income.description || income.source_name || 'No description'}`,
      timestamp: new Date(income.created_at),
      amount: Number(income.amount),
    })),
    ...(recentExpenses as ExpenseWithCategory[]).map((expense) => ({
      id: expense.id,
      type: 'expense' as const,
      description: `Added expense: ${expense.description || expense.vendor_name || 'No description'}`,
      timestamp: new Date(expense.created_at),
      amount: Number(expense.amount),
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">
            {getGreeting()}, {session.user.name?.split(' ')[0]} <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">
            Here&apos;s what&apos;s happening with {company.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TaxYearSelector currentYear={selectedYear} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#111827] font-medium">{company.name}</span>
            {isVatRegistered && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#22C55E]/10 text-[#22C55E]">
                VAT Registered
              </span>
            )}
          </div>
          <Link
            href={`/dashboard/reports/tax-computation?year=${selectedYear}`}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#062C2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3d42] transition-colors"
          >
            View Tax Report →
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#4B5563]">
              {isVatRegistered ? 'Income (excl. VAT)' : 'Total Income'}
            </p>
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totalIncomeExclVat)}</p>
          <p className="text-xs text-[#4B5563] mt-1">
            {incomeCount} transactions
            {isVatRegistered && ` • Gross: ${formatCurrency(totalIncomeGross)}`}
          </p>
        </div>

        {/* Deductible Expenses */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#4B5563]">Deductible Expenses</p>
            <div className="w-10 h-10 bg-[#EF4444]/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totalDeductibleExpenses)}</p>
          <p className="text-xs text-[#4B5563] mt-1">{deductibleExpenseCount} of {expenseCount} tax deductible</p>
        </div>

        {/* Taxable Income */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#4B5563]">Taxable Income</p>
            <div className="w-10 h-10 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2563EB]">{formatCurrency(Math.abs(taxableIncome))}</p>
          <p className="text-xs text-[#4B5563] mt-1">
            {totalIncomeExclVat > 0 ? 'After deductions & depreciation' : 'No income recorded'}
          </p>
        </div>

        {/* Estimated Tax */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#4B5563]">Estimated Tax</p>
            <div className="w-10 h-10 bg-[#9333EA]/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-[#9333EA]">{formatCurrency(estimatedTax)}</p>
          <p className="text-xs text-[#4B5563] mt-1">@ 27% CIT rate</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className={`grid grid-cols-2 gap-4 ${isVatRegistered ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4">
          <p className="text-xs font-medium text-[#4B5563]">Total Expenses</p>
          <p className="text-lg font-semibold text-[#111827] mt-1">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-[#4B5563] mt-0.5">Including non-deductible</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4">
          <p className="text-xs font-medium text-[#4B5563]">Depreciation</p>
          <p className="text-lg font-semibold text-[#EF4444] mt-1">{formatCurrency(totalDepreciation)}</p>
          <p className="text-xs text-[#4B5563] mt-0.5">{assets.length} assets</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4">
          <p className="text-xs font-medium text-[#4B5563]">Total Assets</p>
          <p className="text-lg font-semibold text-[#111827] mt-1">{formatCurrency(totalAssets)}</p>
          <p className="text-xs text-[#4B5563] mt-0.5">{assets.length} capital items</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4">
          <p className="text-xs font-medium text-[#4B5563]">Effective Tax Rate</p>
          <p className="text-lg font-semibold text-[#111827] mt-1">
            {totalIncomeExclVat > 0 ? ((estimatedTax / totalIncomeExclVat) * 100).toFixed(1) : '0.0'}%
          </p>
          <p className="text-xs text-[#4B5563] mt-0.5">Tax / Income</p>
        </div>
        {isVatRegistered && (
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-4">
            <p className="text-xs font-medium text-[#4B5563]">VAT Payable</p>
            <p className="text-lg font-semibold text-[#2563EB] mt-1">{formatCurrency(vatPayable)}</p>
            <p className="text-xs text-[#4B5563] mt-0.5">Output - Input</p>
          </div>
        )}
      </div>

      {/* Quick Actions & AI Processing Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8EDF3] p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <Link
              href="/dashboard/documents"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Upload</span>
            </Link>
            <Link
              href="/dashboard/income/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Income</span>
            </Link>
            <Link
              href="/dashboard/expenses/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Expense</span>
            </Link>
            <Link
              href="/dashboard/assets/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Asset</span>
            </Link>
            <Link
              href="/dashboard/vehicle-logbook/new"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#9333EA]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Trip</span>
            </Link>
            <Link
              href="/dashboard/reports"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4B5563]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Reports</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E8EDF3] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4B5563]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#4B5563] text-center">Settings</span>
            </Link>
          </div>
        </div>

        {/* AI Processing Center */}
        <AIProcessingCenter
          documentsProcessing={documentsProcessing}
          documentsCompleted={documentsCompleted}
          averageConfidence={avgConfidence}
        />
      </div>

      {/* Cash Flow, Expense Categories & Income Categories - All in one row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <CashFlowChart data={cashFlowData} />

        {/* Top Expense Categories */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8EDF3] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">Top Expense Categories</h2>
            <Link href="/dashboard/expenses" className="text-sm text-[#2563EB] hover:text-[#1d4ed8]">
              View all
            </Link>
          </div>
          {expensesByCategory.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#4B5563]">
              No expenses recorded yet
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {expensesByCategory.map((cat, index) => {
                const catData = cat as { category_id: string; _sum: { amount: unknown }; _count: number }
                const amount = Number(catData._sum.amount || 0)
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
                return (
                  <div key={catData.category_id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 flex-shrink-0 bg-[#F7F9FC] rounded-full flex items-center justify-center text-xs font-semibold text-[#4B5563]">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-[#111827] truncate">
                          {expenseCategoryMap[catData.category_id] || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-sm font-semibold text-[#111827]">
                          {formatCurrency(amount)}
                        </span>
                        <span className="text-xs text-[#4B5563]">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#F7F9FC] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22C55E] rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Income by Category */}
        <IncomeCategoryChart data={incomeCategoryChartData} totalIncome={totalIncomeExclVat} />
      </div>

      {/* Recent Documents */}
      <RecentDocuments documents={recentDocuments} />

      {/* Recent Activity & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity activities={activities} />

        {/* Recent Income */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8EDF3] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">Recent Income</h2>
            <Link href="/dashboard/income" className="text-sm text-[#22C55E] hover:text-[#16a34a]">
              View all
            </Link>
          </div>
          {recentIncome.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#4B5563] mb-3">No income recorded yet</p>
              <Link href="/dashboard/income/new" className="text-[#22C55E] hover:text-[#16a34a] text-sm font-medium">
                Add your first income
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E8EDF3]">
              {(recentIncome as IncomeWithCategory[]).slice(0, 4).map((income) => (
                <div key={income.id} className="px-6 py-4 hover:bg-[#F7F9FC] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-[#111827] truncate">
                        {income.description || income.source_name || 'No description'}
                      </p>
                      <p className="text-xs text-[#4B5563] mt-0.5">
                        {income.category.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#22C55E] flex-shrink-0">
                      +{formatCurrency(Number(income.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8EDF3] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">Recent Expenses</h2>
            <Link href="/dashboard/expenses" className="text-sm text-[#EF4444] hover:text-[#dc2626]">
              View all
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#4B5563] mb-3">No expenses recorded yet</p>
              <Link href="/dashboard/expenses/new" className="text-[#EF4444] hover:text-[#dc2626] text-sm font-medium">
                Add your first expense
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E8EDF3]">
              {(recentExpenses as ExpenseWithCategory[]).slice(0, 4).map((expense) => (
                <div key={expense.id} className="px-6 py-4 hover:bg-[#F7F9FC] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-[#111827] truncate">
                        {expense.description || expense.vendor_name || 'No description'}
                      </p>
                      <p className="text-xs text-[#4B5563] mt-0.5">
                        {expense.category.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-[#EF4444] flex-shrink-0">
                      -{formatCurrency(Number(expense.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
