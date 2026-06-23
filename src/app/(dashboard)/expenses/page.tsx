import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import ExpenseFilters from '@/components/expenses/ExpenseFilters'
import { ExportButton } from '@/components/common/ExportButton'
import { getActiveCompanyForUser } from '@/lib/company-context'

export const metadata = {
  title: 'Expenses - ProcessX',
  description: 'Manage your business expenses',
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; year?: string; month?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const companyId = await getActiveCompanyForUser(session.user.id)

  if (!companyId) {
    redirect('/onboarding/company')
  }

  const { page: pageParam, search, category: categoryFilter, year: yearParam, month: monthParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const limit = 20
  const skip = (page - 1) * limit
  const searchQuery = search || ''
  const categoryId = categoryFilter || ''

  // Default to fiscal year 2025/2026 (most recent with data)
  // Users can select different years from the dropdown
  const year = yearParam ? parseInt(yearParam) : 2025
  const month = monthParam ? parseInt(monthParam) : null

  // Calculate date range based on year/month
  let dateStart: Date
  let dateEnd: Date

  if (month) {
    // Specific month selected
    if (month >= 3) {
      dateStart = new Date(year, month - 1, 1)
      dateEnd = new Date(year, month, 0, 23, 59, 59)
    } else {
      // Jan or Feb belong to next calendar year in fiscal year
      dateStart = new Date(year + 1, month - 1, 1)
      dateEnd = new Date(year + 1, month, 0, 23, 59, 59)
    }
  } else {
    // Full fiscal year (March 1 to Feb 28/29)
    dateStart = new Date(year, 2, 1) // March 1
    dateEnd = new Date(year + 1, 1, 28, 23, 59, 59) // Feb 28
  }

  const where: Prisma.ExpenseWhereInput = {
    company_id: companyId,
    is_deleted: false,
    expense_date: {
      gte: dateStart,
      lte: dateEnd,
    },
    ...(searchQuery && {
      OR: [
        { description: { contains: searchQuery, mode: 'insensitive' as const } },
        { vendor_name: { contains: searchQuery, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { category_id: categoryId }),
  }

  const [expensesRaw, total, categories, periodTotals] = await Promise.all([
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
    prisma.expenseCategory.findMany({
      where: { company_id: companyId },
      orderBy: { name: 'asc' },
    }),
    prisma.expense.aggregate({
      where,
      _sum: { amount: true, charges: true },
      _count: true,
    }),
  ])

  const expenses = expensesRaw as Array<Prisma.ExpenseGetPayload<{ include: { category: true; user: { select: { first_name: true; last_name: true } } } }>>

  const totalPages = Math.ceil(total / limit)

  // Calculate page totals
  const pageTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const periodTotal = Number(periodTotals._sum.amount || 0)
  const periodCharges = Number(periodTotals._sum.charges || 0)
  const avgPerTransaction = periodTotals._count > 0 ? periodTotal / periodTotals._count : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Expenses</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage all your business expenses - Tax Year {year}/{year + 1}
            </p>
          </div>
          <Link
            href="/expenses/new"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Expense
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/expenses/recurring"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Recurring
          </Link>
          <Link
            href="/expenses/analytics"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics
          </Link>
          <ExportButton
            href={`/api/expenses/export?year=${year}${month ? `&month=${month}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}${categoryId ? `&category=${categoryId}` : ''}`}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export
          </ExportButton>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">
            {month ? 'Month Total' : 'Year Total'}
          </p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            R {periodTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {periodTotals._count} transactions
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Charges</p>
          <p className="text-2xl font-semibold text-orange-600 mt-1">
            R {periodCharges.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">Bank fees, service charges</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Page Total</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            R {pageTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{expenses.length} items on this page</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Average per Transaction</p>
          <p className="text-2xl font-semibold text-purple-600 mt-1">
            R {avgPerTransaction.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">For filtered period</p>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters
        year={year}
        month={month}
        search={searchQuery}
        categoryFilter={categoryId}
        categories={categories}
      />

      {/* Expenses List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {expenses.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No expenses found</p>
            <Link
              href="/expenses/new"
              className="inline-block text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors"
            >
              Add your first expense →
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((expense, index) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {skip + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.expense_date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {expense.description || 'No description'}
                          {expense.is_tax_deductible && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700">
                              Tax Deductible
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.vendor_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                        R {Number(expense.amount).toLocaleString('en-ZA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/expenses/${expense.id}`}
                          className="text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-700">
                      Page Total ({expenses.length} items)
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      R {pageTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} expenses
                </div>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/expenses?page=${page - 1}&year=${year}${month ? `&month=${month}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}${categoryId ? `&category=${categoryId}` : ''}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/expenses?page=${page + 1}&year=${year}${month ? `&month=${month}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}${categoryId ? `&category=${categoryId}` : ''}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
