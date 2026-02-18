'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface RecurringExpense {
  id: string
  amount: number
  vendor_name: string | null
  description: string
  frequency: string
  next_occurrence: string
  is_active: boolean
  is_tax_deductible: boolean
  start_date: string
  end_date: string | null
  category: {
    name: string
  }
  created_by: {
    first_name: string
    last_name: string
  }
}

export default function RecurringExpensesPage() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchRecurringExpenses()
  }, [])

  const fetchRecurringExpenses = async () => {
    try {
      const res = await fetch('/api/recurring-expenses')
      if (res.ok) {
        const data = await res.json()
        setExpenses(data.recurringExpenses)
      }
    } catch (error) {
      console.error('Failed to fetch recurring expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/recurring-expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (res.ok) {
        await fetchRecurringExpenses()
      }
    } catch (error) {
      console.error('Failed to toggle recurring expense:', error)
    }
  }

  const deleteRecurring = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recurring expense?')) {
      return
    }

    try {
      const res = await fetch(`/api/recurring-expenses/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchRecurringExpenses()
      }
    } catch (error) {
      console.error('Failed to delete recurring expense:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatFrequency = (frequency: string) => {
    const map: Record<string, string> = {
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annually: 'Annually',
    }
    return map[frequency] || frequency
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AFF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recurring expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/expenses"
              className="text-[#007AFF] hover:text-[#0051D5] transition-colors"
            >
              ← Back to Expenses
            </Link>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Recurring Expenses
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage expenses that occur on a regular schedule
          </p>
        </div>
        <Link
          href="/expenses/recurring/new"
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
          Add Recurring Expense
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recurring expenses yet
          </h3>
          <p className="text-gray-500 mb-6">
            Set up expenses that repeat monthly, quarterly, or annually
          </p>
          <Link
            href="/expenses/recurring/new"
            className="inline-block text-[#007AFF] hover:text-[#0051D5] font-medium transition-colors"
          >
            Add your first recurring expense →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">
                          {expense.description}
                        </div>
                        {expense.vendor_name && (
                          <div className="text-gray-500 text-xs mt-1">
                            {expense.vendor_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(Number(expense.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFrequency(expense.frequency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.next_occurrence).toLocaleDateString(
                        'en-ZA'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          toggleActive(expense.id, expense.is_active)
                        }
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          expense.is_active
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {expense.is_active ? 'Active' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => deleteRecurring(expense.id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              How Recurring Expenses Work
            </h3>
            <p className="text-sm text-blue-700">
              Recurring expenses will automatically create expense entries on
              their scheduled dates. You can pause or delete them at any time.
              Each generated expense can be edited independently.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
