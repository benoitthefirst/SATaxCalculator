'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import VehicleLogForm from '@/components/forms/VehicleLogForm'

interface VehicleLogEntry {
  id: string
  asset_id: string
  trip_date: Date
  start_location: string
  end_location: string
  start_odometer: number
  end_odometer: number
  distance_km: number
  purpose: string
  client_name: string | null
  is_business: boolean
  notes: string | null
  created_at: Date
  asset: {
    id: string
    name: string
    serial_number: string | null
  }
}

interface Vehicle {
  id: string
  name: string
  serial_number?: string | null
}

interface VehicleLogDetailProps {
  entry: VehicleLogEntry
  vehicles: Vehicle[]
  companyId: string
}

export default function VehicleLogDetail({
  entry,
  vehicles,
  companyId,
}: VehicleLogDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip entry?')) {
      return
    }

    try {
      setIsDeleting(true)
      setError('')

      const res = await fetch(`/api/vehicle-logbook/${entry.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete entry')
      }

      router.push('/dashboard/vehicle-logbook')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsDeleting(false)
    }
  }

  // SARS rate for 2025/2026
  const sarsRate = 4.64
  const deductionValue = entry.is_business ? entry.distance_km * sarsRate : 0

  if (isEditing) {
    return (
      <>
        <div>
          <button
            onClick={() => setIsEditing(false)}
            className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium mb-2 inline-block"
          >
            ← Back to Details
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Trip</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update trip details
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <VehicleLogForm
            companyId={companyId}
            vehicles={vehicles.map(v => ({ ...v, serial_number: v.serial_number || undefined }))}
            entryId={entry.id}
            initialData={{
              asset_id: entry.asset_id,
              trip_date: new Date(entry.trip_date).toISOString().split('T')[0],
              start_location: entry.start_location,
              end_location: entry.end_location,
              start_odometer: entry.start_odometer,
              end_odometer: entry.end_odometer,
              purpose: entry.purpose,
              client_name: entry.client_name || undefined,
              is_business: entry.is_business,
              notes: entry.notes || undefined,
            }}
          />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/vehicle-logbook"
            className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium mb-2 inline-block"
          >
            ← Back to Logbook
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Trip Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(entry.trip_date).toLocaleDateString('en-ZA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#FF9500] bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Trip Summary Card */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600">Distance Traveled</p>
              <p className="text-2xl font-bold text-orange-900">{entry.distance_km} km</p>
            </div>
          </div>
          {entry.is_business ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-green-100 text-green-700">
              Business Trip
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600">
              Personal Trip
            </span>
          )}
        </div>

        {entry.is_business && (
          <div className="pt-4 border-t border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-600">Deduction Value (@ R{sarsRate}/km)</span>
              <span className="text-lg font-semibold text-green-700">
                R {deductionValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Route</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500">From</p>
            <p className="text-base font-medium text-gray-900">{entry.start_location}</p>
            <p className="text-sm text-gray-400 mt-1">
              Odometer: {entry.start_odometer.toLocaleString()} km
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm text-gray-500">To</p>
            <p className="text-base font-medium text-gray-900">{entry.end_location}</p>
            <p className="text-sm text-gray-400 mt-1">
              Odometer: {entry.end_odometer.toLocaleString()} km
            </p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="text-base font-medium text-gray-900">{entry.asset.name}</p>
            {entry.asset.serial_number && (
              <p className="text-sm text-gray-400">{entry.asset.serial_number}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Purpose</p>
            <p className="text-base font-medium text-gray-900">{entry.purpose}</p>
          </div>
          {entry.client_name && (
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="text-base font-medium text-gray-900">{entry.client_name}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Logged On</p>
            <p className="text-base font-medium text-gray-900">
              {new Date(entry.created_at).toLocaleDateString('en-ZA')}
            </p>
          </div>
        </div>

        {entry.notes && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-base text-gray-700 mt-1">{entry.notes}</p>
          </div>
        )}
      </div>

      {/* Link to Vehicle */}
      <div className="flex justify-end">
        <Link
          href={`/dashboard/assets/${entry.asset_id}`}
          className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium"
        >
          View Vehicle Details →
        </Link>
      </div>
    </>
  )
}
