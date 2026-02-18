'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const expenseSchema = z.object({
  expense_date: z.string().min(1, 'Date is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be a positive number'
  ),
  category_id: z.string().min(1, 'Category is required'),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'eft', 'other']),
  vendor_name: z.string().optional(),
  description: z.string().optional(),
  is_tax_deductible: z.boolean(),
  notes: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  companyId: string
  userId: string
  categories: Array<{ id: string; name: string }>
  initialData?: Partial<ExpenseFormData> & { is_tax_deductible?: boolean }
  expenseId?: string
}

export default function ExpenseForm({
  companyId,
  userId,
  categories,
  initialData,
  expenseId,
}: ExpenseFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      ...initialData,
      expense_date: initialData?.expense_date || new Date().toISOString().split('T')[0],
      payment_method: initialData?.payment_method || 'credit_card',
      is_tax_deductible: initialData?.is_tax_deductible ?? true,
    },
  })

  const isTaxDeductible = watch('is_tax_deductible')

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const url = expenseId ? `/api/expenses/${expenseId}` : '/api/expenses'
      const method = expenseId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(data.amount),
          company_id: companyId,
          user_id: userId,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save expense')
      }

      router.push('/expenses')
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
          {...register('expense_date')}
          type="date"
          label="Expense Date"
          error={errors.expense_date?.message}
          disabled={isLoading}
        />

        <Input
          {...register('amount')}
          type="number"
          step="0.01"
          label="Amount (ZAR)"
          placeholder="0.00"
          error={errors.amount?.message}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Category
          </label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            <option value="">Select a category</option>
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
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="eft">EFT/Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <Input
        {...register('vendor_name')}
        type="text"
        label="Vendor/Supplier Name"
        placeholder="e.g., Office Depot, FNB, etc."
        error={errors.vendor_name?.message}
        disabled={isLoading}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Brief description of the expense..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
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
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
        <input
          {...register('is_tax_deductible')}
          type="checkbox"
          id="tax_deductible"
          className="w-5 h-5 text-[#007AFF] border-gray-300 rounded focus:ring-[#007AFF]/20 focus:ring-2"
          disabled={isLoading}
        />
        <label htmlFor="tax_deductible" className="text-sm font-medium text-gray-900 cursor-pointer">
          This expense is tax deductible
        </label>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/expenses"
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
        >
          {expenseId ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  )
}
