import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

export const metadata = {
  title: 'Income - ProcessX',
  description: 'Manage your business income',
}

export default async function IncomePage({
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

  const where: Prisma.IncomeWhereInput = {
    company_id: membership.company.id,
    is_deleted: false,
    ...(search && {
      OR: [
        { description: { contains: search, mode: 'insensitive' as const } },
        { source_name: { contains: search, mode: 'insensitive' as const } },
        { invoice_number: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryFilter && { category_id: categoryFilter }),
  }

  const [incomeRecordsRaw, total, categories] = await Promise.all([
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
          { company_id: membership.company.id },
        ],
        is_active: true,
      },
      orderBy: { name: 'asc' },
    }),
  ])

  const incomeRecords = incomeRecordsRaw as Array<Prisma.IncomeGetPayload<{ include: { category: true; user: { select: { first_name: true; last_name: true } } } }>>

  const totalPages = Math.ceil(total / limit)

  // Calculate totals
  const totalIncome = incomeRecords.reduce((sum, record) => sum + Number(record.amount), 0)

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

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Total Income (This Page)</p>
            <p className="text-3xl font-semibold text-green-700 mt-1">
              R {totalIncome.toLocaleString('en-ZA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
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
        </div>
      </div>

      {/* Filters */}
      <form className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search income..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              defaultValue={categoryFilter}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] transition-all"
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
      </form>

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
            <p className="text-gray-500 mb-4">No income records found</p>
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
                      Source
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
                  {incomeRecords.map((income) => (
                    <tr
                      key={income.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(income.income_date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {income.description || 'No description'}
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
                      href={`/income?page=${page - 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/income?page=${page + 1}${search ? `&search=${search}` : ''}${categoryFilter ? `&category=${categoryFilter}` : ''}`}
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
