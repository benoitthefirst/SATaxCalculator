'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface Category {
  id: string
  name: string
}

interface ExpenseFiltersProps {
  year: number
  month: number | null
  search: string
  categoryFilter: string
  categories: Category[]
}

export default function ExpenseFilters({
  year,
  month,
  search,
  categoryFilter,
  categories,
}: ExpenseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(search)

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Reset page when filters change
    params.delete('page')

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/expenses?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchValue || null })
  }

  const monthNames = [
    { value: '', label: 'Full Tax Year' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Year
          </label>
          <select
            value={year}
            onChange={(e) => updateFilters({ year: e.target.value, month: null })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
          >
            {[2026, 2025, 2024, 2023, 2022].map((y) => (
              <option key={y} value={y}>
                {y}/{y + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <select
            value={month || ''}
            onChange={(e) => updateFilters({ month: e.target.value || null })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
          >
            {monthNames.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => updateFilters({ category: e.target.value || null })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search description, vendor..."
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Active Filters */}
      {(search || categoryFilter || month) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
              Search: {search}
              <button
                onClick={() => {
                  setSearchValue('')
                  updateFilters({ search: null })
                }}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-orange-50 text-orange-700">
              Category: {categories.find(c => c.id === categoryFilter)?.name}
              <button
                onClick={() => updateFilters({ category: null })}
                className="ml-1 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
          {month && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700">
              Month: {monthNames.find(m => m.value === String(month))?.label}
              <button
                onClick={() => updateFilters({ month: null })}
                className="ml-1 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchValue('')
              router.push(`/expenses?year=${year}`)
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
