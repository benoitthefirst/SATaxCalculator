import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import IncomeFilters from '@/components/income/IncomeFilters'
import { getActiveCompanyForUser } from '@/lib/company-context'

export const metadata = {
  title: 'Income - ProcessX',
  description: 'Manage your business income',
}

export default async function IncomePage({
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

  const {
    page: pageParam,
    search: searchParam,
    category: categoryParam,
    year: yearParam,
    month: monthParam
  } = await searchParams

  const page = parseInt(pageParam || '1')
  const limit = 20
  const skip = (page - 1) * limit
  const search = searchParam || ''
  const categoryFilter = categoryParam || ''

  // Default to fiscal year 2025/2026 (most recent with data)
  // Users can select different years from the dropdown
  const year = yearParam ? parseInt(yearParam) : 2025
  const month = monthParam ? parseInt(monthParam) : null

  // Build date filter
  let dateFilter: Prisma.IncomeWhereInput = {}
  if (month) {
    // Filter by specific month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    dateFilter = {
      income_date: {
        gte: startDate,
        lte: endDate,
      }
    }
  } else {
    // Filter by fiscal year (March 1 to Feb 28)
    const fiscalYearStart = new Date(year, 2, 1) // March 1
    const fiscalYearEnd = new Date(year + 1, 1, 28, 23, 59, 59) // Feb 28
    dateFilter = {
      income_date: {
        gte: fiscalYearStart,
        lte: fiscalYearEnd,
      }
    }
  }

  const where: Prisma.IncomeWhereInput = {
    company_id: companyId,
    is_deleted: false,
    ...dateFilter,
    ...(search && {
      OR: [
        { description: { contains: search, mode: 'insensitive' as const } },
        { source_name: { contains: search, mode: 'insensitive' as const } },
        { invoice_number: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryFilter && { category_id: categoryFilter }),
  }

  // Get totals for the entire filtered period (not just current page)
  const [incomeRecordsRaw, total, categories, periodTotals] = await Promise.all([
    prisma.income.findMany({
      where,
      orderBy: { income_date: 'desc' },
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
    prisma.income.count({ where }),
    prisma.incomeCategory.findMany({
      where: {
        OR: [
          { is_system: true },
          { company_id: companyId },
        ],
        is_active: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.income.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    }),
  ])

  const incomeRecords = incomeRecordsRaw as Array<Prisma.IncomeGetPayload<{ include: { category: true; user: { select: { first_name: true; last_name: true } } } }>>

  const totalPages = Math.ceil(total / limit)
  const pageTotal = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0)
  const periodTotal = Number(periodTotals._sum.amount || 0)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const periodLabel = month
    ? `${monthNames[month - 1]} ${year}`
    : `Tax Year ${year}/${year + 1}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Income</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your business income
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/income/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-[#34C759] to-[#248A3D] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-[0.98]"
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
            Add Income
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <p className="text-sm font-medium text-green-600">{periodLabel} Total</p>
          <p className="text-3xl font-semibold text-green-700 mt-1">
            R {periodTotal.toLocaleString('en-ZA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-green-500 mt-1">{periodTotals._count} transactions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">This Page Total</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            R {pageTotal.toLocaleString('en-ZA', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{incomeRecords.length} of {total} shown</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Average per Transaction</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            R {periodTotals._count > 0
              ? (periodTotal / periodTotals._count).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '0.00'
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">Based on {periodLabel}</p>
        </div>
      </div>

      {/* Filters */}
      <IncomeFilters
        year={year}
        month={month}
        search={search}
        categoryFilter={categoryFilter}
        categories={categories}
      />

      {/* Income List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {incomeRecords.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No income records found for {periodLabel}</p>
            <Link
              href="/income/new"
              className="inline-block text-[#34C759] hover:text-[#248A3D] font-medium transition-colors"
            >
              Add your first income →
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
                      Source
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
                  {incomeRecords.map((income, index) => (
                    <tr
                      key={income.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {skip + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(income.income_date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-xs">{income.description || 'No description'}</span>
                          {income.invoice_number && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                              #{income.invoice_number}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {income.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {income.source_name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                        R {Number(income.amount).toLocaleString('en-ZA', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link
                          href={`/income/${income.id}`}
                          className="text-[#34C759] hover:text-[#248A3D] font-medium transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td colSpan={5} className="px-6 py-4 text-sm font-semibold text-gray-900">
                      Page Total ({incomeRecords.length} items)
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-green-700">
                      R {pageTotal.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
                  Showing {skip + 1} to {Math.min(skip + limit, total)} of {total} income records
                </div>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/income?page=${page - 1}&year=${year}${month ? `&month=${month}` : ''}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="px-4 py-2 text-sm font-medium text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/income?page=${page + 1}&year=${year}${month ? `&month=${month}` : ''}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
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
