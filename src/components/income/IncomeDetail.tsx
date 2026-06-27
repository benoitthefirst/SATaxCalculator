'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import IncomeForm from '@/components/forms/IncomeForm'

interface IncomeDetailProps {
  income: any
  categories: Array<{ id: string; name: string }>
  companyId: string
  userId: string
  isVatRegistered?: boolean
}

export default function IncomeDetail({
  income,
  categories,
  companyId,
  userId,
  isVatRegistered = false,
}: IncomeDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this income record? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)

      const res = await fetch(`/api/income/${income.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete income')
      }

      router.push('/income')
      router.refresh()
    } catch (error) {
      alert('Failed to delete income. Please try again.')
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Edit Income</h1>
            <p className="mt-1 text-sm text-gray-500">Update income details</p>
          </div>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <IncomeForm
            companyId={companyId}
            userId={userId}
            categories={categories}
            incomeId={income.id}
            isVatRegistered={isVatRegistered}
            initialData={{
              income_date: new Date(income.income_date).toISOString().split('T')[0],
              amount: income.amount.toString(),
              category_id: income.category_id,
              payment_method: income.payment_method || 'eft',
              source_name: income.source_name || '',
              description: income.description || '',
              invoice_number: income.invoice_number || '',
              notes: income.notes || '',
              is_vat_inclusive: income.is_vat_inclusive ?? false,
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/income"
              className="text-[#34C759] hover:text-[#248A3D] transition-colors text-sm font-medium"
            >
              ← Back to Income
            </Link>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900">Income Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Created on {new Date(income.created_at).toLocaleDateString('en-ZA')}
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
            className="px-6 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Amount and Date */}
          <div className="flex items-start justify-between pb-6 border-b border-gray-100">
            <div>
              <div className="text-sm text-gray-500 mb-1">Amount</div>
              <div className="text-4xl font-semibold text-green-600">
                R {Number(income.amount).toLocaleString('en-ZA', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="text-lg font-medium text-gray-900">
                {new Date(income.income_date).toLocaleDateString('en-ZA', {
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
              <div className="text-sm font-medium text-gray-500 mb-2">Income Type</div>
              <div className="text-base text-gray-900">{income.category.name}</div>
            </div>

            {income.payment_method && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Payment Method</div>
                <div className="text-base text-gray-900 capitalize">
                  {income.payment_method.replace('_', ' ')}
                </div>
              </div>
            )}

            {income.source_name && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Source/Customer</div>
                <div className="text-base text-gray-900">{income.source_name}</div>
              </div>
            )}

            {income.invoice_number && (
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Invoice Number</div>
                <div className="text-base">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium">
                    #{income.invoice_number}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {income.description && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-2">Description</div>
              <div className="text-base text-gray-900">{income.description}</div>
            </div>
          )}

          {/* Notes */}
          {income.notes && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-2">Notes</div>
              <div className="text-base text-gray-700">{income.notes}</div>
            </div>
          )}

          {/* Source Document */}
          {income.source_document && (
            <div className="pt-6 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-500 mb-2">Source Document</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {income.source_document.original_filename}
                    </div>
                    <div className="text-xs text-gray-500">
                      {income.source_document.document_type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <a
                  href={income.source_document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#34C759] text-white text-sm font-medium rounded-xl hover:bg-[#248A3D] transition-all active:scale-[0.98]"
                >
                  View Document
                </a>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-100 text-xs text-gray-400">
            <div className="flex items-center justify-between">
              <div>
                Added by {income.user.first_name} {income.user.last_name}
              </div>
              <div>
                Last updated {new Date(income.updated_at).toLocaleDateString('en-ZA')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
