import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

export const metadata = {
  title: 'Dashboard - ProcessX',
  description: 'Your business dashboard',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
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
    return null
  }

  // Get basic stats
  const expenseCount = await prisma.expense.count({
    where: {
      company_id: membership.company.id,
      is_deleted: false,
    },
  })

  const totalExpenses = await prisma.expense.aggregate({
    where: {
      company_id: membership.company.id,
      is_deleted: false,
    },
    _sum: {
      amount: true,
    },
  })

  const recentExpenses = await prisma.expense.findMany({
    where: {
      company_id: membership.company.id,
      is_deleted: false,
    },
    orderBy: {
      expense_date: 'desc',
    },
    take: 5,
    include: {
      category: true,
      user: true,
    },
  }) as Array<Prisma.ExpenseGetPayload<{ include: { category: true; user: true } }>>

  const stats = [
    {
      name: 'Total Expenses',
      value: `R ${(Number(totalExpenses._sum.amount) || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'All time',
    },
    {
      name: 'Expense Records',
      value: expenseCount.toString(),
      description: 'Total entries',
    },
    {
      name: 'Net Profit',
      value: 'R 0.00',
      description: 'Coming soon',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-gray-900">
          Welcome back, {session.user.name?.split(' ')[0]}
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Here's what's happening with your business
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 mb-2">
                    {stat.name}
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-gray-400">
                    {stat.description}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/expenses/new"
            className="group flex items-center justify-center px-5 py-4 bg-gradient-to-br from-[#007AFF] to-[#0051D5] rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-white">
              + Add Expense
            </span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center justify-center px-5 py-4 border-2 border-gray-200 rounded-xl hover:border-[#007AFF] hover:bg-blue-50 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#007AFF]">
              View Reports
            </span>
          </Link>
          <Link
            href="/calculators"
            className="flex items-center justify-center px-5 py-4 border-2 border-gray-200 rounded-xl hover:border-[#007AFF] hover:bg-blue-50 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#007AFF]">
              Tax Calculator
            </span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-center px-5 py-4 border-2 border-gray-200 rounded-xl hover:border-[#007AFF] hover:bg-blue-50 transition-all duration-200 active:scale-[0.98]"
          >
            <span className="text-sm font-medium text-gray-700 group-hover:text-[#007AFF]">
              Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Expenses
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentExpenses.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">No expenses yet</p>
              <Link
                href="/expenses/new"
                className="inline-block text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors"
              >
                Add your first expense →
              </Link>
            </div>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="px-8 py-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {expense.description || expense.vendor_name || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {expense.category.name} • {new Date(expense.expense_date).toLocaleDateString('en-ZA')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-semibold text-gray-900">
                      R {Number(expense.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {recentExpenses.length > 0 && (
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100">
            <Link
              href="/expenses"
              className="text-sm font-medium text-[#007AFF] hover:text-[#0051D5] transition-colors"
            >
              View all expenses →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
