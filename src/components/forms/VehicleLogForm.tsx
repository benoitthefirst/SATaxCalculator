'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const logEntrySchema = z.object({
  asset_id: z.string().min(1, 'Vehicle is required'),
  trip_date: z.string().min(1, 'Trip date is required'),
  start_location: z.string().min(1, 'Start location is required'),
  end_location: z.string().min(1, 'End location is required'),
  start_odometer: z.string().min(1, 'Start odometer is required').refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    'Must be a positive number'
  ),
  end_odometer: z.string().min(1, 'End odometer is required').refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    'Must be a positive number'
  ),
  purpose: z.string().min(1, 'Purpose is required'),
  client_name: z.string().optional(),
  is_business: z.boolean(),
  notes: z.string().optional(),
}).refine(
  (data) => parseInt(data.end_odometer) > parseInt(data.start_odometer),
  {
    message: 'End odometer must be greater than start odometer',
    path: ['end_odometer'],
  }
)

type LogEntryFormData = z.infer<typeof logEntrySchema>

interface Vehicle {
  id: string
  name: string
  serial_number?: string | null
}

interface VehicleLogFormProps {
  companyId: string
  vehicles: Vehicle[]
  preselectedVehicleId?: string
  initialData?: {
    asset_id: string
    trip_date: string
    start_location: string
    end_location: string
    start_odometer: number
    end_odometer: number
    purpose: string
    client_name?: string
    is_business: boolean
    notes?: string
  }
  entryId?: string
}

export default function VehicleLogForm({
  companyId,
  vehicles,
  preselectedVehicleId,
  initialData,
  entryId,
}: VehicleLogFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LogEntryFormData>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: {
      asset_id: initialData?.asset_id || preselectedVehicleId || '',
      trip_date: initialData?.trip_date || new Date().toISOString().split('T')[0],
      start_location: initialData?.start_location || '',
      end_location: initialData?.end_location || '',
      start_odometer: initialData?.start_odometer?.toString() || '',
      end_odometer: initialData?.end_odometer?.toString() || '',
      purpose: initialData?.purpose || '',
      client_name: initialData?.client_name || '',
      is_business: initialData?.is_business ?? true,
      notes: initialData?.notes || '',
    },
  })

  const startOdometer = watch('start_odometer')
  const endOdometer = watch('end_odometer')
  const isBusiness = watch('is_business')

  const distance =
    startOdometer && endOdometer &&
    !isNaN(parseInt(endOdometer)) && !isNaN(parseInt(startOdometer)) &&
    parseInt(endOdometer) > parseInt(startOdometer)
      ? parseInt(endOdometer) - parseInt(startOdometer)
      : 0

  const onSubmit = async (data: LogEntryFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const url = entryId ? `/api/vehicle-logbook/${entryId}` : '/api/vehicle-logbook'
      const method = entryId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          start_odometer: parseInt(data.start_odometer),
          end_odometer: parseInt(data.end_odometer),
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to save log entry')
      }

      router.push('/dashboard/vehicle-logbook')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Common trip purposes for quick selection
  const commonPurposes = [
    'Client meeting',
    'Site visit',
    'Delivery',
    'Sales call',
    'Training',
    'Conference',
    'Airport transfer',
    'Office commute',
    'Other business',
  ]

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

      {/* Vehicle Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Vehicle
        </label>
        <select
          {...register('asset_id')}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] hover:border-gray-300 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        >
          <option value="">Select a vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.name} {vehicle.serial_number ? `(${vehicle.serial_number})` : ''}
            </option>
          ))}
        </select>
        {errors.asset_id && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.asset_id.message}
          </p>
        )}
        {vehicles.length === 0 && (
          <p className="text-sm text-amber-600">
            No vehicles registered.{' '}
            <Link href="/dashboard/assets/new" className="text-[#FF9500] hover:underline">
              Add a vehicle first
            </Link>
          </p>
        )}
      </div>

      {/* Trip Date */}
      <Input
        {...register('trip_date')}
        type="date"
        label="Trip Date"
        error={errors.trip_date?.message}
        disabled={isLoading}
      />

      {/* Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          {...register('start_location')}
          type="text"
          label="Start Location"
          placeholder="e.g., Office, Home, Client Site"
          error={errors.start_location?.message}
          disabled={isLoading}
        />
        <Input
          {...register('end_location')}
          type="text"
          label="End Location"
          placeholder="e.g., Client Office, Airport"
          error={errors.end_location?.message}
          disabled={isLoading}
        />
      </div>

      {/* Odometer Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          {...register('start_odometer')}
          type="number"
          label="Start Odometer (km)"
          placeholder="0"
          error={errors.start_odometer?.message}
          disabled={isLoading}
        />
        <Input
          {...register('end_odometer')}
          type="number"
          label="End Odometer (km)"
          placeholder="0"
          error={errors.end_odometer?.message}
          disabled={isLoading}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Distance
          </label>
          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-lg font-semibold text-gray-900">
              {distance} km
            </span>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Purpose of Trip
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {commonPurposes.map((purpose) => (
            <button
              key={purpose}
              type="button"
              onClick={() => setValue('purpose', purpose)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {purpose}
            </button>
          ))}
        </div>
        <Input
          {...register('purpose')}
          type="text"
          placeholder="Describe the business purpose..."
          error={errors.purpose?.message}
          disabled={isLoading}
        />
      </div>

      {/* Client Name */}
      <Input
        {...register('client_name')}
        type="text"
        label="Client Name (Optional)"
        placeholder="e.g., ABC Company"
        error={errors.client_name?.message}
        disabled={isLoading}
      />

      {/* Business vs Personal */}
      <div className="p-4 bg-gray-50 rounded-xl space-y-4">
        <div className="flex items-center gap-3">
          <input
            {...register('is_business')}
            type="checkbox"
            id="is_business"
            className="w-5 h-5 text-[#FF9500] border-gray-300 rounded focus:ring-[#FF9500]/20 focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="is_business" className="text-sm font-medium text-gray-900 cursor-pointer">
            This is a business trip
          </label>
        </div>
        {!isBusiness && (
          <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            Personal trips are tracked but not included in business use calculations for SARS.
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">
          Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Any additional notes about the trip..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500] hover:border-gray-300 transition-all disabled:bg-gray-50 disabled:text-gray-500"
          disabled={isLoading}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/vehicle-logbook"
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || vehicles.length === 0}
          size="lg"
          className="bg-[#FF9500] hover:bg-[#FF6B00]"
        >
          {entryId ? 'Update Trip' : 'Log Trip'}
        </Button>
      </div>
    </form>
  )
}
