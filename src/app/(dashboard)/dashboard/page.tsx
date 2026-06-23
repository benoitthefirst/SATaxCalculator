import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import TaxYearSelector from '@/components/dashboard/TaxYearSelector'
import { getActiveCompany } from '@/lib/company-context'

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

  // Get year from search params (default to 2025 for fiscal year 2025/2026)
  const params = await searchParams
  const selectedYear = params.year ? parseInt(params.year) : 2025

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
  // VAT collected = Total Income / 1.15 * 0.15 (extracting VAT from VAT-inclusive amounts)
  // For simplicity, we assume all income is VAT-inclusive for VAT-registered businesses
  const vatCollected = isVatRegistered ? totalIncomeGross - (totalIncomeGross / (1 + vatRate)) : 0
  const totalIncomeExclVat = isVatRegistered ? totalIncomeGross / (1 + vatRate) : totalIncomeGross

  // Similarly, expenses may include VAT that can be claimed back (input VAT)
  // For tax deductible expenses, the VAT portion can be claimed back, so only excl VAT is deductible
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
  // Only subtract deductions from actual income - if no income, taxable income is 0 (not negative from depreciation alone)
  const rawTaxableIncome = totalIncomeExclVat - deductibleExpensesExclVat - totalDepreciation
  const taxableIncome = totalIncomeExclVat > 0 ? rawTaxableIncome : 0

  // VAT payable to SARS (Output VAT - Input VAT)
  const vatPayable = vatCollected - vatOnExpenses

  // Net profit/loss for display (using ALL expenses, not just deductible)
  const netProfit = totalIncomeExclVat - totalExpenses

  // Calculate estimated tax (27% CIT rate) based on TAXABLE income
  const estimatedTax = taxableIncome > 0 ? taxableIncome * 0.27 : 0

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0]}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <TaxYearSelector currentYear={selectedYear} />
            <span className="hidden sm:inline text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">{company.name}</span>
            {isVatRegistered && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                VAT Registered
              </span>
            )}
          </div>
        </div>
        <Link
          href={`/reports/tax-computation?year=${selectedYear}`}
          className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
        >
          View Tax Report →
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-600">
              {isVatRegistered ? 'Income (excl. VAT)' : 'Total Income'}
            </p>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncomeExclVat)}</p>
          <p className="text-xs text-green-500 mt-1">
            {incomeCount} transactions
            {isVatRegistered && ` • Gross: ${formatCurrency(totalIncomeGross)}`}
          </p>
        </div>

        {/* Deductible Expenses */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-600">Deductible Expenses</p>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(totalDeductibleExpenses)}</p>
          <p className="text-xs text-red-500 mt-1">{deductibleExpenseCount} of {expenseCount} tax deductible</p>
        </div>

        {/* Taxable Income */}
        <div className={`rounded-2xl border p-6 ${
          taxableIncome >= 0
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
            : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-sm font-medium ${taxableIncome >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
              Taxable Income
            </p>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              taxableIncome >= 0 ? 'bg-blue-100' : 'bg-yellow-100'
            }`}>
              <svg className={`w-5 h-5 ${taxableIncome >= 0 ? 'text-blue-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className={`text-2xl font-bold ${taxableIncome >= 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
            {formatCurrency(Math.abs(taxableIncome))}
          </p>
          <p className={`text-xs mt-1 ${taxableIncome >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}>
            {totalIncomeExclVat > 0 ? 'After deductions & depreciation' : 'No income recorded'}
          </p>
        </div>

        {/* Estimated Tax */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-600">Estimated Tax</p>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(estimatedTax)}</p>
          <p className="text-xs text-purple-500 mt-1">@ 27% CIT rate</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className={`grid grid-cols-1 gap-4 ${isVatRegistered ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-gray-400 mt-1">Including non-deductible</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Depreciation</p>
          <p className="text-xl font-semibold text-orange-600 mt-1">{formatCurrency(totalDepreciation)}</p>
          <p className="text-xs text-gray-400 mt-1">{assets.length} assets (wear & tear)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Assets</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{formatCurrency(totalAssets)}</p>
          <p className="text-xs text-gray-400 mt-1">{assets.length} capital items</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Effective Tax Rate</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {totalIncomeExclVat > 0 ? ((estimatedTax / totalIncomeExclVat) * 100).toFixed(1) : '0.0'}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Tax / Income</p>
        </div>
        {isVatRegistered && (
          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl border border-cyan-100 p-6">
            <p className="text-sm font-medium text-cyan-600">VAT Payable</p>
            <p className="text-xl font-semibold text-cyan-700 mt-1">{formatCurrency(vatPayable)}</p>
            <p className="text-xs text-cyan-500 mt-1">
              Output: {formatCurrency(vatCollected)} - Input: {formatCurrency(vatOnExpenses)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/income/new"
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            + Add Income
          </Link>
          <Link
            href="/expenses/new"
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors"
          >
            + Add Expense
          </Link>
          <Link
            href="/assets/new"
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white text-sm font-medium rounded-xl hover:bg-orange-700 transition-colors"
          >
            + Add Asset
          </Link>
          <Link
            href="/vehicle-logbook/new"
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
          >
            + Log Trip
          </Link>
          <Link
            href="/reports"
            className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            View Reports
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Expense Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Top Expense Categories</h2>
            <Link href="/expenses" className="text-sm text-[#007AFF] hover:text-[#0051D5]">
              View all →
            </Link>
          </div>
          {expensesByCategory.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No expenses recorded yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {expensesByCategory.map((cat, index) => {
                const catData = cat as { category_id: string; _sum: { amount: unknown }; _count: number }
                return (
                  <div key={catData.category_id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {expenseCategoryMap[catData.category_id] || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(Number(catData._sum.amount || 0))}
                      </p>
                      <p className="text-xs text-gray-400">{catData._count} items</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Top Income Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Income by Category</h2>
            <Link href="/income" className="text-sm text-[#34C759] hover:text-[#248A3D]">
              View all →
            </Link>
          </div>
          {incomeByCategory.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No income recorded yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {incomeByCategory.map((cat, index) => {
                const catData = cat as { category_id: string; _sum: { amount: unknown }; _count: number }
                return (
                  <div key={catData.category_id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {incomeCategoryMap[catData.category_id] || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(Number(catData._sum.amount || 0))}
                      </p>
                      <p className="text-xs text-gray-400">{catData._count} items</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Income */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Income</h2>
            <Link href="/income" className="text-sm text-[#34C759] hover:text-[#248A3D]">
              View all →
            </Link>
          </div>
          {recentIncome.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-3">No income recorded yet</p>
              <Link href="/income/new" className="text-[#34C759] hover:text-[#248A3D] text-sm font-medium">
                Add your first income →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(recentIncome as IncomeWithCategory[]).map((income) => (
                <div key={income.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {income.description || income.source_name || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {income.category.name} • {new Date(income.income_date).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-green-600 flex-shrink-0">
                      +{formatCurrency(Number(income.amount))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link href="/expenses" className="text-sm text-[#007AFF] hover:text-[#0051D5]">
              View all →
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 mb-3">No expenses recorded yet</p>
              <Link href="/expenses/new" className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium">
                Add your first expense →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(recentExpenses as ExpenseWithCategory[]).map((expense) => (
                <div key={expense.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {expense.description || expense.vendor_name || 'No description'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {expense.category.name} • {new Date(expense.expense_date).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-red-600 flex-shrink-0">
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
