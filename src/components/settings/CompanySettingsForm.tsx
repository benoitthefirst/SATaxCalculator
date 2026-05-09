'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  registration_number: z.string().optional(),
  tax_number: z.string().optional(),
  vat_number: z.string().optional(),
  business_type: z.enum(['small_business_corporation', 'standard_company', 'sole_proprietor']),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanySettingsFormProps {
  company: {
    id: string
    name: string
    registration_number: string | null
    tax_number: string | null
    vat_number: string | null
    business_type: string | null
    phone: string | null
    email: string | null
    address_line1: string | null
    city: string | null
    province: string | null
    postal_code: string | null
  }
  onCancel: () => void
}

export default function CompanySettingsForm({
  company,
  onCancel,
}: CompanySettingsFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      registration_number: company.registration_number || '',
      tax_number: company.tax_number || '',
      vat_number: company.vat_number || '',
      business_type: (company.business_type as 'small_business_corporation' | 'standard_company' | 'sole_proprietor') || 'standard_company',
      phone: company.phone || '',
      email: company.email || '',
      address_line1: company.address_line1 || '',
      city: company.city || '',
      province: company.province || '',
      postal_code: company.postal_code || '',
    },
  })

  const vatNumber = watch('vat_number')

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const res = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to update company')
      }

      router.refresh()
      onCancel()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      setError(errorMessage)
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

      {/* Company Name */}
      <Input
        {...register('name')}
        type="text"
        label="Company Name"
        placeholder="Your Company Name"
        error={errors.name?.message}
        disabled={isLoading}
      />

      {/* Business Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Business Type
        </label>
        <select
          {...register('business_type')}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        >
          <option value="small_business_corporation">Small Business Corporation (SBC)</option>
          <option value="standard_company">Standard Company</option>
          <option value="sole_proprietor">Sole Proprietor</option>
        </select>
        <p className="text-xs text-gray-500">
          SBC status provides reduced tax rates for qualifying small businesses
        </p>
      </div>

      {/* Tax Registration Section */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Tax Registration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('tax_number')}
            type="text"
            label="SARS Tax Number"
            placeholder="e.g., 9185206241"
            error={errors.tax_number?.message}
            disabled={isLoading}
          />

          <Input
            {...register('registration_number')}
            type="text"
            label="CIPC Registration Number"
            placeholder="e.g., 2024/123456/07"
            error={errors.registration_number?.message}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Input
            {...register('vat_number')}
            type="text"
            label="VAT Registration Number"
            placeholder="e.g., 4123456789"
            error={errors.vat_number?.message}
            disabled={isLoading}
          />
          {vatNumber ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              VAT Registered - Income will be treated as VAT inclusive
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Leave blank if not VAT registered. Required if annual turnover exceeds R1 million.
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Contact Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...register('phone')}
            type="tel"
            label="Phone Number"
            placeholder="e.g., 011 123 4567"
            error={errors.phone?.message}
            disabled={isLoading}
          />

          <Input
            {...register('email')}
            type="email"
            label="Company Email"
            placeholder="e.g., info@company.co.za"
            error={errors.email?.message}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Business Address</h3>

        <Input
          {...register('address_line1')}
          type="text"
          label="Street Address"
          placeholder="e.g., 123 Main Road"
          error={errors.address_line1?.message}
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            {...register('city')}
            type="text"
            label="City"
            placeholder="e.g., Johannesburg"
            error={errors.city?.message}
            disabled={isLoading}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Province
            </label>
            <select
              {...register('province')}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
              disabled={isLoading}
            >
              <option value="">Select province</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Gauteng">Gauteng</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="North West">North West</option>
              <option value="Northern Cape">Northern Cape</option>
              <option value="Western Cape">Western Cape</option>
            </select>
          </div>

          <Input
            {...register('postal_code')}
            type="text"
            label="Postal Code"
            placeholder="e.g., 2000"
            error={errors.postal_code?.message}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          disabled={isLoading}
        >
          Cancel
        </button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
        >
          Save Changes
        </Button>
      </div>
    </form>
  )
}
