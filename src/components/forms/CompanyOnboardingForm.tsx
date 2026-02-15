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
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  businessType: z.enum(['small_business_corporation', 'standard_company', 'sole_proprietor']),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyOnboardingFormProps {
  userId: string
}

export default function CompanyOnboardingForm({ userId }: CompanyOnboardingFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      businessType: 'small_business_corporation',
    },
  })

  const onSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to create company')
      }

      router.push('/dashboard')
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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <Input
          {...register('name')}
          type="text"
          label="Company Name *"
          placeholder="Acme Corporation (Pty) Ltd"
          error={errors.name?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Business Type *
          </label>
          <select
            {...register('businessType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            disabled={isLoading}
          >
            <option value="small_business_corporation">Small Business Corporation (SBC)</option>
            <option value="standard_company">Standard Company (Pty Ltd)</option>
            <option value="sole_proprietor">Sole Proprietor</option>
          </select>
          {errors.businessType && (
            <p className="text-sm text-red-600">{errors.businessType.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('registrationNumber')}
            type="text"
            label="Registration Number"
            placeholder="2023/123456/07"
            error={errors.registrationNumber?.message}
            disabled={isLoading}
          />

          <Input
            {...register('taxNumber')}
            type="text"
            label="Tax Number"
            placeholder="9123456789"
            error={errors.taxNumber?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('vatNumber')}
          type="text"
          label="VAT Number (if registered)"
          placeholder="4123456789"
          error={errors.vatNumber?.message}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('phone')}
            type="tel"
            label="Phone Number"
            placeholder="+27 11 123 4567"
            error={errors.phone?.message}
            disabled={isLoading}
          />

          <Input
            {...register('email')}
            type="email"
            label="Company Email"
            placeholder="info@company.com"
            error={errors.email?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('address')}
          type="text"
          label="Street Address"
          placeholder="123 Main Street"
          error={errors.address?.message}
          disabled={isLoading}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input
            {...register('city')}
            type="text"
            label="City"
            placeholder="Johannesburg"
            error={errors.city?.message}
            disabled={isLoading}
          />

          <Input
            {...register('province')}
            type="text"
            label="Province"
            placeholder="Gauteng"
            error={errors.province?.message}
            disabled={isLoading}
          />

          <Input
            {...register('postalCode')}
            type="text"
            label="Postal Code"
            placeholder="2000"
            error={errors.postalCode?.message}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          size="lg"
        >
          Complete Setup
        </Button>
      </div>
    </form>
  )
}
