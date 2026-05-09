'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface TaxYearSelectorProps {
  currentYear: number
}

export default function TaxYearSelector({ currentYear }: TaxYearSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', year)
    router.push(`/dashboard?${params.toString()}`)
  }

  // Generate available tax years (current year back to 2020)
  const currentCalendarYear = new Date().getFullYear()
  const years = []
  for (let y = currentCalendarYear; y >= 2020; y--) {
    years.push(y)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tax-year" className="text-sm font-medium text-gray-600">
        Tax Year:
      </label>
      <select
        id="tax-year"
        value={currentYear}
        onChange={handleYearChange}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 hover:border-gray-300 transition-colors cursor-pointer"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}/{year + 1}
          </option>
        ))}
      </select>
    </div>
  )
}
