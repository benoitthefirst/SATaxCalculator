import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { VehicleLogEntry } from '@prisma/client'

type LogEntryWithAsset = VehicleLogEntry & {
  asset: {
    id: string
    name: string
    serial_number: string | null
  }
}

export const metadata = {
  title: 'Vehicle Logbook - ProcessX',
  description: 'Track vehicle trips for SARS compliance',
}

export default async function VehicleLogbookPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string; year?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  if (!membership) {
    redirect('/onboarding/company')
  }

  const { asset: assetId, year: yearParam } = await searchParams
  const currentYear = new Date().getFullYear()
  const year = yearParam ? parseInt(yearParam) : currentYear

  // South African fiscal year: March 1 to Feb 28/29
  const fiscalYearStart = new Date(year, 2, 1) // March 1
  const fiscalYearEnd = new Date(year + 1, 1, 28, 23, 59, 59) // Feb 28

  // Get all vehicles
  const vehicles = await prisma.asset.findMany({
    where: {
      company_id: membership.company.id,
      asset_type: 'vehicle',
      is_deleted: false,
    },
    orderBy: { name: 'asc' },
  })

  // Get log entries
  const entriesData = await prisma.vehicleLogEntry.findMany({
    where: {
      company_id: membership.company.id,
      ...(assetId && { asset_id: assetId }),
      trip_date: {
        gte: fiscalYearStart,
        lte: fiscalYearEnd,
      },
    },
    include: {
      asset: {
        select: {
          id: true,
          name: true,
          serial_number: true,
        },
      },
    },
    orderBy: { trip_date: 'desc' },
  })
  const entries = entriesData as LogEntryWithAsset[]

  // Calculate summary statistics
  const totalDistance = entries.reduce((sum, e) => sum + e.distance_km, 0)
  const businessDistance = entries
    .filter((e) => e.is_business)
    .reduce((sum, e) => sum + e.distance_km, 0)
  const personalDistance = totalDistance - businessDistance
  const businessPercentage = totalDistance > 0
    ? Math.round((businessDistance / totalDistance) * 100)
    : 0

  // SARS rate for 2025/2026: R4.64/km (this should be configurable)
  const sarsRate = 4.64
  const potentialDeduction = businessDistance * sarsRate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Vehicle Logbook</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track trips for SARS compliance - Tax Year {year}/{year + 1}
          </p>
        </div>
        <Link
          href="/vehicle-logbook/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF9500] rounded-xl hover:bg-[#FF6B00] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          defaultValue={year}
          onChange={(e) => {
            const url = new URL(window.location.href)
            url.searchParams.set('year', e.target.value)
            window.location.href = url.toString()
          }}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
        >
          {[2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>
              {y}/{y + 1}
            </option>
          ))}
        </select>

        {vehicles.length > 0 && (
          <select
            defaultValue={assetId || ''}
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set('asset', e.target.value)
              } else {
                url.searchParams.delete('asset')
              }
              window.location.href = url.toString()
            }}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]"
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Distance</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {totalDistance.toLocaleString()} km
          </p>
          <p className="text-xs text-gray-400 mt-1">{entries.length} trips logged</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Business Distance</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {businessDistance.toLocaleString()} km
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {entries.filter((e) => e.is_business).length} business trips
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6">
          <p className="text-sm font-medium text-orange-600">Business Use %</p>
          <p className="text-2xl font-semibold text-orange-900 mt-1">
            {businessPercentage}%
          </p>
          <p className="text-xs text-orange-500 mt-1">For SARS deduction claims</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <p className="text-sm font-medium text-green-600">Potential Deduction</p>
          <p className="text-2xl font-semibold text-green-700 mt-1">
            R {potentialDeduction.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-green-500 mt-1">@ R{sarsRate}/km SARS rate</p>
        </div>
      </div>

      {/* No Vehicles Warning */}
      {vehicles.length === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
          <svg className="w-12 h-12 mx-auto text-amber-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-amber-800 mb-2">No Vehicles Registered</h3>
          <p className="text-sm text-amber-600 mb-4">
            Register a vehicle as an asset before logging trips.
          </p>
          <Link
            href="/assets/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF9500] rounded-xl hover:bg-[#FF6B00] transition-colors"
          >
            Add Vehicle Asset
          </Link>
        </div>
      )}

      {/* Logbook Entries */}
      {vehicles.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Trip Log</h3>
          </div>

          {entries.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 mb-4">No trips logged for this period</p>
              <Link
                href="/vehicle-logbook/new"
                className="inline-block text-[#FF9500] hover:text-[#FF6B00] font-medium"
              >
                Log your first trip →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distance
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(entry.trip_date).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {entry.asset.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="font-medium">{entry.start_location}</span>
                        <span className="mx-2 text-gray-400">→</span>
                        <span className="font-medium">{entry.end_location}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {entry.purpose}
                        {entry.client_name && (
                          <span className="text-gray-400 ml-1">({entry.client_name})</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        {entry.distance_km} km
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.is_business ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700">
                            Business
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                            Personal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/vehicle-logbook/${entry.id}`}
                          className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SARS Compliance Note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900">SARS Logbook Requirements</h3>
            <p className="text-sm text-blue-700 mt-1">
              SARS requires a detailed logbook to claim vehicle expenses. Each trip must record:
              date, start/end locations, odometer readings, distance, and business purpose.
              Without proper documentation, vehicle deductions may be disallowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
