import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

export const metadata = {
  title: 'Expenses - ProcessX',
  description: 'Manage your business expenses',
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
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
    redirect('/onboarding/company')
  }

  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const skip = (page - 1) * limit
  const search = searchParams.search || ''
  const categoryFilter = searchParams.category || ''

  const where: Prisma.ExpenseWhereInput = {
    company_id: membership.company.id,
    is_deleted: false,
    ...(search && {
      OR: [
        { description: { contains: search, mode: 'insensitive' as const } },
        { vendor_name: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryFilter && { category_id: categoryFilter }),
  }

  const [expensesRaw, total, categories] = await Promise.all([
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
      orderBy: { name: 'asc' },
    }),
  ])

  const expenses = expensesRaw as Array<Prisma.ExpenseGetPayload<{ include: { category: true; user: { select: { first_name: true; last_name: true } } } }>>

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Expenses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your business expenses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/expenses/recurring"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Recurring
          </Link>
          <Link
            href="/expenses/analytics"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Analytics
          </Link>
          <Link
            href={`/api/expenses/export?${search ? `search=${search}&` : ''}${categoryFilter ? `category=${categoryFilter}` : ''}`}
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </Link>
          <Link
            href="/expenses/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-[#007AFF] to-[#0051D5] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
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
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search expenses..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

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
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                      href={`/expenses?page=${page - 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/expenses?page=${page + 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
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
