import { auth } from '@/lib/auth'

import { prisma } from '@/lib/db'
import Link from 'next/link'

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
  })

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
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your business
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-gray-500">
                    {stat.description}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/expenses/new"
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 hover:text-blue-700">
              + Add Expense
            </span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 hover:text-blue-700">
              📊 View Reports
            </span>
          </Link>
          <Link
            href="/calculators"
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 hover:text-blue-700">
              🧮 Tax Calculator
            </span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 hover:text-blue-700">
              ⚙️ Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Expenses
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentExpenses.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No expenses yet</p>
              <Link
                href="/expenses/new"
                className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first expense
              </Link>
            </div>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {expense.description || expense.vendor_name || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {expense.category.name} • {new Date(expense.expense_date).toLocaleDateString('en-ZA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      R {Number(expense.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {recentExpenses.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Link
              href="/expenses"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all expenses →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
