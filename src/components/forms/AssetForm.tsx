'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const ASSET_TYPES = [
  { value: 'vehicle', label: 'Motor Vehicle', defaultYears: 5 },
  { value: 'computer', label: 'Computer/Laptop', defaultYears: 3 },
  { value: 'phone', label: 'Cell Phone', defaultYears: 2 },
  { value: 'camera', label: 'Camera/Photography', defaultYears: 6 },
  { value: 'furniture', label: 'Office Furniture', defaultYears: 6 },
  { value: 'equipment', label: 'Equipment/Machinery', defaultYears: 5 },
  { value: 'other', label: 'Other', defaultYears: 5 },
]

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  description: z.string().optional(),
  asset_type: z.enum(['vehicle', 'computer', 'phone', 'camera', 'furniture', 'equipment', 'other']),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  purchase_cost: z.string().min(1, 'Purchase cost is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Cost must be a positive number'
  ),
  useful_life_years: z.string().refine(
    (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0),
    'Must be a positive number'
  ).optional(),
  residual_value: z.string().optional(),
  business_use_percent: z.string().refine(
    (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 100),
    'Must be between 0 and 100'
  ).optional(),
  serial_number: z.string().optional(),
  notes: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface AssetFormProps {
  companyId: string
  initialData?: any
  assetId?: string
}

export default function AssetForm({
  companyId,
  initialData,
  assetId,
}: AssetFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ...initialData,
      purchase_date: initialData?.purchase_date || new Date().toISOString().split('T')[0],
      asset_type: initialData?.asset_type || 'computer',
      business_use_percent: initialData?.business_use_percent?.toString() || '100',
      useful_life_years: initialData?.useful_life_years?.toString() || '',
      residual_value: initialData?.residual_value?.toString() || '0',
      purchase_cost: initialData?.purchase_cost?.toString() || '',
    },
  })

  const selectedType = watch('asset_type')
  const purchaseCost = watch('purchase_cost')
  const usefulLifeYears = watch('useful_life_years')
  const businessUsePercent = watch('business_use_percent')

  // Calculate annual depreciation for preview
  const cost = parseFloat(purchaseCost || '0')
  const years = parseInt(usefulLifeYears || '0') || ASSET_TYPES.find(t => t.value === selectedType)?.defaultYears || 5
  const businessUse = parseInt(businessUsePercent || '100')
  const annualDepreciation = (cost / years) * (businessUse / 100)

  const onSubmit = async (data: AssetFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const url = assetId ? `/api/assets/${assetId}` : '/api/assets'
      const method = assetId ? 'PUT' : 'POST'

      const defaultYears = ASSET_TYPES.find(t => t.value === data.asset_type)?.defaultYears || 5

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          purchase_cost: parseFloat(data.purchase_cost),
          useful_life_years: data.useful_life_years ? parseInt(data.useful_life_years) : defaultYears,
          residual_value: data.residual_value ? parseFloat(data.residual_value) : 0,
          business_use_percent: data.business_use_percent ? parseInt(data.business_use_percent) : 100,
          company_id: companyId,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save asset')
      }

      router.push('/dashboard/assets')
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
          {...register('name')}
          type="text"
          label="Asset Name"
          placeholder="e.g., MacBook Pro 16-inch"
          error={errors.name?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Asset Type
          </label>
          <select
            {...register('asset_type')}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            {ASSET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.defaultYears} year life)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('purchase_date')}
          type="date"
          label="Purchase Date"
          error={errors.purchase_date?.message}
          disabled={isLoading}
        />

        <Input
          {...register('purchase_cost')}
          type="number"
          step="0.01"
          label="Purchase Cost (ZAR)"
          placeholder="0.00"
          error={errors.purchase_cost?.message}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Useful Life (Years)
          </label>
          <input
            {...register('useful_life_years')}
            type="number"
            min="1"
            max="50"
            placeholder={`${ASSET_TYPES.find(t => t.value === selectedType)?.defaultYears || 5}`}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] transition-colors"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">Leave blank for SARS default</p>
        </div>

        <Input
          {...register('residual_value')}
          type="number"
          step="0.01"
          label="Residual Value (ZAR)"
          placeholder="0.00"
          error={errors.residual_value?.message}
          disabled={isLoading}
          helperText="Value at end of useful life"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Business Use %
          </label>
          <div className="relative">
            <input
              {...register('business_use_percent')}
              type="number"
              min="0"
              max="100"
              placeholder="100"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] transition-colors pr-8"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="text-xs text-gray-500">For mixed-use assets</p>
        </div>
      </div>

      <Input
        {...register('serial_number')}
        type="text"
        label="Serial Number (Optional)"
        placeholder="e.g., SN123456789"
        error={errors.serial_number?.message}
        disabled={isLoading}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Description (Optional)
        </label>
        <textarea
          {...register('description')}
          rows={2}
          placeholder="Additional details about the asset..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
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
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        />
      </div>

      {/* Depreciation Preview */}
      {cost > 0 && (
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h4 className="text-sm font-semibold text-orange-900 mb-2">Depreciation Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-orange-600">Useful Life:</span>
              <span className="font-medium text-orange-900 ml-2">{years} years</span>
            </div>
            <div>
              <span className="text-orange-600">Annual Rate:</span>
              <span className="font-medium text-orange-900 ml-2">{(100 / years).toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-orange-600">Business Use:</span>
              <span className="font-medium text-orange-900 ml-2">{businessUse}%</span>
            </div>
            <div>
              <span className="text-orange-600">Annual Deduction:</span>
              <span className="font-semibold text-orange-900 ml-2">
                R {annualDepreciation.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/assets"
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
          className="bg-gradient-to-br from-[#FF9500] to-[#FF6B00] hover:shadow-lg hover:shadow-orange-500/30"
        >
          {assetId ? 'Update Asset' : 'Add Asset'}
        </Button>
      </div>
    </form>
  )
}
