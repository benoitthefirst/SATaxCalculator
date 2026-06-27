'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const incomeSchema = z.object({
  income_date: z.string().min(1, 'Date is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be a positive number'
  ),
  is_vat_inclusive: z.boolean().optional(),
  category_id: z.string().min(1, 'Category is required'),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'eft', 'other']).optional(),
  source_name: z.string().optional(),
  description: z.string().optional(),
  invoice_number: z.string().optional(),
  notes: z.string().optional(),
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeFormProps {
  companyId: string
  userId: string
  categories: Array<{ id: string; name: string }>
  initialData?: Partial<IncomeFormData>
  incomeId?: string
  isVatRegistered?: boolean
}

export default function IncomeForm({
  companyId,
  userId,
  categories,
  initialData,
  incomeId,
  isVatRegistered = false,
}: IncomeFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      ...initialData,
      income_date: initialData?.income_date || new Date().toISOString().split('T')[0],
      payment_method: initialData?.payment_method || 'eft',
      is_vat_inclusive: initialData?.is_vat_inclusive ?? isVatRegistered,
    },
  })

  const onSubmit = async (data: IncomeFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const url = incomeId ? `/api/income/${incomeId}` : '/api/income'
      const method = incomeId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          is_vat_inclusive: data.is_vat_inclusive ?? false,
          company_id: companyId,
          user_id: userId,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save income')
      }

      router.push('/dashboard/income')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('income_date')}
          type="date"
          label="Income Date"
          error={errors.income_date?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <Input
            {...register('amount')}
            type="number"
            step="0.01"
            label="Amount (ZAR)"
            placeholder="0.00"
            error={errors.amount?.message}
            disabled={isLoading}
          />
          {isVatRegistered && (
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                {...register('is_vat_inclusive')}
                disabled={isLoading}
                className="w-4 h-4 rounded border-gray-300 text-[#34C759] focus:ring-[#34C759]"
              />
              Amount includes VAT (15%)
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Income Type
          </label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            <option value="">Select income type</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.category_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Payment Method
          </label>
          <select
            {...register('payment_method')}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            <option value="eft">EFT/Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('source_name')}
          type="text"
          label="Source/Customer Name"
          placeholder="e.g., Client ABC, Google AdSense, etc."
          error={errors.source_name?.message}
          disabled={isLoading}
        />

        <Input
          {...register('invoice_number')}
          type="text"
          label="Invoice Number (Optional)"
          placeholder="e.g., INV-2025-001"
          error={errors.invoice_number?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Brief description of the income..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Any additional notes..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34C759]/20 focus:border-[#34C759] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/income"
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-br from-[#34C759] to-[#248A3D] hover:shadow-lg hover:shadow-green-500/30"
        >
          {incomeId ? 'Update Income' : 'Add Income'}
        </Button>
      </div>
    </form>
  )
}
