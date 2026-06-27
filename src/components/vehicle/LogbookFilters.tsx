'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Vehicle {
  id: string
  name: string
}

interface LogbookFiltersProps {
  year: number
  assetId?: string
  vehicles: Vehicle[]
}

export default function LogbookFilters({ year, assetId, vehicles }: LogbookFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleYearChange = (newYear: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', newYear)
    router.push(`/dashboard/vehicle-logbook?${params.toString()}`)
  }

  const handleAssetChange = (newAssetId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newAssetId) {
      params.set('asset', newAssetId)
    } else {
      params.delete('asset')
    }
    router.push(`/dashboard/vehicle-logbook?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={year}
        onChange={(e) => handleYearChange(e.target.value)}
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
          value={assetId || ''}
          onChange={(e) => handleAssetChange(e.target.value)}
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
  )
}
