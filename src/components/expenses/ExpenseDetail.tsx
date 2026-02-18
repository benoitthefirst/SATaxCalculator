'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ExpenseForm from '@/components/forms/ExpenseForm'
import ExpenseAttachments from '@/components/expenses/ExpenseAttachments'
import { Button } from '@/components/ui/Button'

interface ExpenseDetailProps {
  expense: any
  categories: Array<{ id: string; name: string }>
  companyId: string
  userId: string
}

export default function ExpenseDetail({
  expense,
  categories,
  companyId,
  userId,
}: ExpenseDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)

      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete expense')
      }

      router.push('/expenses')
      router.refresh()
    } catch (error) {
      alert('Failed to delete expense. Please try again.')
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Edit Expense</h1>
            <p className="mt-1 text-sm text-gray-500">Update expense details</p>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <ExpenseForm
            companyId={companyId}
            userId={userId}
            categories={categories}
            expenseId={expense.id}
            initialData={{
              expense_date: new Date(expense.expense_date).toISOString().split('T')[0],
              amount: expense.amount.toString(),
              category_id: expense.category_id,
              payment_method: expense.payment_method,
              vendor_name: expense.vendor_name || '',
              description: expense.description || '',
              is_tax_deductible: expense.is_tax_deductible,
              notes: expense.notes || '',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/expenses"
              className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium"
            >
              ← Back to Expenses
            </Link>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Expense Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(expense.created_at).toLocaleDateString('en-ZA')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Amount and Date */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">Amount</div>
              <div className="text-4xl font-semibold text-gray-900">
                R {Number(expense.amount).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="text-lg font-medium text-gray-900">
                {new Date(expense.expense_date).toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Category</div>
              <div className="text-base text-gray-900">{expense.category.name}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Payment Method</div>
              <div className="text-base text-gray-900 capitalize">
                {expense.payment_method.replace('_', ' ')}
              </div>
            </div>

            {expense.vendor_name && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Vendor/Supplier</div>
                <div className="text-base text-gray-900">{expense.vendor_name}</div>
              </div>
            )}

            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Tax Deductible</div>
              <div className="text-base">
                {expense.is_tax_deductible ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-50 text-green-700">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                    No
                  </span>
                )}
              </div>
            </div>
          </div>

          {expense.description && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-2">Description</div>
              <div className="text-base text-gray-900">{expense.description}</div>
            </div>
          )}

          {expense.notes && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-2">Notes</div>
              <div className="text-base text-gray-700">{expense.notes}</div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-100 text-xs text-gray-400">
            <div className="flex items-center justify-between">
              <div>
                Added by {expense.user.first_name} {expense.user.last_name}
              </div>
              <div>
                Last updated {new Date(expense.updated_at).toLocaleDateString('en-ZA')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <ExpenseAttachments expenseId={expense.id} />
      </div>
    </div>
  )
}
