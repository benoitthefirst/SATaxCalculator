'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsData {
  summary: {
    totalIncome: number
    totalCount: number
    averageMonthlyIncome: number
    year: number
    fiscalYear: string
    bestMonth: { month: string; total: number } | null
    worstMonth: { month: string; total: number } | null
  }
  incomeByCategory: Array<{
    name: string
    value: number
    count: number
  }>
  incomeByMonth: Array<{
    month: string
    total: number
    count: number
    growth?: number
    growthPercent?: number
  }>
  topIncome: Array<{
    id: string
    description: string
    amount: number
    category: string
    date: string
    source: string | null
  }>
}

const COLORS = [
  '#34C759',
  '#007AFF',
  '#FF9500',
  '#AF52DE',
  '#5AC8FA',
  '#FF3B30',
  '#FFCC00',
  '#FF2D55',
]

export default function IncomeAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(2025)

  useEffect(() => {
    fetchAnalytics()
  }, [selectedYear])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/income/analytics?year=${selectedYear}`)
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34C759] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/income"
              className="text-[#34C759] hover:text-[#248A3D] transition-colors"
            >
              ← Back to Income
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Income Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Track revenue trends and identify growth opportunities
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Tax Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}/{year + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-600">
              Total Revenue
            </h3>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(data.summary.totalIncome)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {data.summary.totalCount} transactions
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Monthly Average
            </h3>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(data.summary.averageMonthlyIncome)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Per month</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Best Month</h3>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          {data.summary.bestMonth ? (
            <>
              <p className="text-3xl font-bold text-emerald-600">
                {data.summary.bestMonth.month}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(data.summary.bestMonth.total)}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-400">No data</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Lowest Month</h3>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
          </div>
          {data.summary.worstMonth ? (
            <>
              <p className="text-3xl font-bold text-amber-600">
                {data.summary.worstMonth.month}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(data.summary.worstMonth.total)}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-400">No data</p>
          )}
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Monthly Revenue Trend - Tax Year {data.summary.fiscalYear}
        </h3>
        {data.incomeByMonth.some((m) => m.total > 0) ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.incomeByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#34C759"
                strokeWidth={3}
                dot={{ fill: '#34C759', r: 5 }}
                activeDot={{ r: 7 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500">
            No income data available for {data.summary.fiscalYear}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Revenue by Category
          </h3>
          {data.incomeByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.incomeByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / data.summary.totalIncome) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.incomeByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No income data available
            </div>
          )}
        </div>

        {/* Monthly Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Monthly Revenue Comparison
          </h3>
          {data.incomeByMonth.some((m) => m.total > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.incomeByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="total" fill="#34C759" radius={[8, 8, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No income data available
            </div>
          )}
        </div>
      </div>

      {/* Month-over-Month Growth */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Month-over-Month Growth
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.incomeByMonth.map((month, index) => (
            <div key={month.month} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-600">{month.month}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {formatCurrency(month.total)}
              </p>
              {index > 0 && month.growthPercent !== undefined && (
                <p className={`text-sm mt-1 font-medium ${
                  month.growthPercent > 0 ? 'text-green-600' : month.growthPercent < 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {month.growthPercent > 0 ? '+' : ''}{month.growthPercent.toFixed(1)}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Income Sources Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Top 5 Income Sources
        </h3>
        {data.topIncome.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Source
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topIncome.map((income) => (
                  <tr
                    key={income.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {income.description}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {income.source || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {income.category}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(income.date).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600 text-right">
                      {formatCurrency(income.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No income recorded yet
          </div>
        )}
      </div>
    </div>
  )
}
