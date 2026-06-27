'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentFiscalYear } from '@/lib/utils/fiscal-year'
import { Lock, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts'

interface UpgradeRequired {
  error: string
  message: string
  feature: string
  upgradeRequired: true
}

interface ReportData {
  summary: {
    fiscalYear: string
    year: number
    totalIncome: number
    totalExpenses: number
    netProfit: number
    profitMargin: number
    incomeCount: number
    expenseCount: number
    profitableMonths: number
    lossMonths: number
  }
  monthlyComparison: Array<{
    month: string
    income: number
    expenses: number
    profit: number
    profitMargin: number
  }>
  incomeByCategory: Array<{ name: string; value: number; count: number }>
  expensesByCategory: Array<{ name: string; value: number; count: number }>
}

export default function ProfitLossPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(() => getCurrentFiscalYear())
  const [upgradeRequired, setUpgradeRequired] = useState<UpgradeRequired | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReport()
  }, [selectedYear])

  const fetchReport = async () => {
    try {
      setIsLoading(true)
      setUpgradeRequired(null)
      setError(null)
      const res = await fetch(`/api/reports/profit-loss?year=${selectedYear}`)
      const responseData = await res.json()

      if (res.ok) {
        setData(responseData)
      } else if (res.status === 403 && responseData.upgradeRequired) {
        setUpgradeRequired(responseData)
        setData(null)
      } else {
        setError(responseData.error || 'Failed to load report')
        setData(null)
      }
    } catch (err) {
      console.error('Failed to fetch report:', err)
      setError('Failed to load report data')
      setData(null)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (upgradeRequired) {
    return (
      <div className="p-4 sm:p-8">
        <Link
          href="/reports"
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ← Back to Reports
        </Link>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Upgrade to Access Profit & Loss Reports
            </h2>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {upgradeRequired.message}
            </p>

            <div className="bg-white rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">
                What you get with Professional & Business plans:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Detailed Profit & Loss statements with monthly breakdowns</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Income & Expense analytics with category insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tax computation reports for SARS filing</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Deduction summaries by expense category</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">CSV exports for all your data</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/settings/subscription">
                <Button className="w-full sm:w-auto">
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="secondary" className="w-full sm:w-auto">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-8">
        <Link
          href="/reports"
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ← Back to Reports
        </Link>

        <div className="mt-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Report
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Failed to load report data. Please try again.'}
          </p>
          <Button onClick={() => fetchReport()} variant="secondary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)
  const isProfitable = data.summary.netProfit >= 0

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/reports"
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ← Back to Reports
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Profit & Loss Statement
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Income vs Expenses comparison for business decisions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tax Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}/{year + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
          <h3 className="text-sm font-medium text-green-600 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-700">
            {formatCurrency(data.summary.totalIncome)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {data.summary.incomeCount} transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-6">
          <h3 className="text-sm font-medium text-red-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-700">
            {formatCurrency(data.summary.totalExpenses)}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {data.summary.expenseCount} transactions
          </p>
        </div>

        <div className={`rounded-2xl border p-6 ${
          isProfitable
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
            : 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100'
        }`}>
          <h3 className={`text-sm font-medium mb-2 ${isProfitable ? 'text-blue-600' : 'text-amber-600'}`}>
            Net {isProfitable ? 'Profit' : 'Loss'}
          </h3>
          <p className={`text-3xl font-bold ${isProfitable ? 'text-blue-700' : 'text-amber-700'}`}>
            {formatCurrency(Math.abs(data.summary.netProfit))}
          </p>
          <p className={`text-sm mt-1 ${isProfitable ? 'text-blue-600' : 'text-amber-600'}`}>
            {data.summary.profitMargin.toFixed(1)}% margin
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Health</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-green-600">
              {data.summary.profitableMonths}
            </p>
            <span className="text-gray-400">/</span>
            <p className="text-xl font-bold text-red-600">
              {data.summary.lossMonths}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Profitable / Loss months
          </p>
        </div>
      </div>

      {/* Monthly Income vs Expenses Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Monthly Income vs Expenses - Tax Year {data.summary.fiscalYear}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data.monthlyComparison}>
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
            <Bar dataKey="income" name="Income" fill="#34C759" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#FF3B30" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="profit"
              name="Net Profit/Loss"
              stroke="#007AFF"
              strokeWidth={3}
              dot={{ fill: '#007AFF', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Profit Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Profit/Loss Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyComparison}>
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
            <Area
              type="monotone"
              dataKey="profit"
              name="Net Profit/Loss"
              stroke="#007AFF"
              fill="url(#profitGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Monthly Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left py-3 px-4 text-sm font-medium rounded-tl-xl">
                  Month
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium">
                  Income
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium">
                  Expenses
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium">
                  Net Profit/Loss
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium rounded-tr-xl">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyComparison.map((month, index) => (
                <tr
                  key={month.month}
                  className={`border-b border-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {month.month}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-green-600 font-medium">
                    {formatCurrency(month.income)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-red-600 font-medium">
                    {formatCurrency(month.expenses)}
                  </td>
                  <td className={`py-3 px-4 text-sm text-right font-bold ${
                    month.profit >= 0 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {month.profit >= 0 ? '' : '-'}{formatCurrency(Math.abs(month.profit))}
                  </td>
                  <td className={`py-3 px-4 text-sm text-right ${
                    month.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {month.profitMargin.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-900 text-white font-bold">
                <td className="py-3 px-4 text-sm rounded-bl-xl">Total</td>
                <td className="py-3 px-4 text-sm text-right">
                  {formatCurrency(data.summary.totalIncome)}
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  {formatCurrency(data.summary.totalExpenses)}
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  {formatCurrency(data.summary.netProfit)}
                </td>
                <td className="py-3 px-4 text-sm text-right rounded-br-xl">
                  {data.summary.profitMargin.toFixed(1)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Category Breakdown Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Income by Category
          </h3>
          {data.incomeByCategory.length > 0 ? (
            <div className="space-y-3">
              {data.incomeByCategory.slice(0, 5).map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(cat.value)}
                    </p>
                    <p className="text-xs text-gray-400">{cat.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No income data</p>
          )}
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expenses by Category
          </h3>
          {data.expensesByCategory.length > 0 ? (
            <div className="space-y-3">
              {data.expensesByCategory.slice(0, 5).map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-medium text-red-600">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {formatCurrency(cat.value)}
                    </p>
                    <p className="text-xs text-gray-400">{cat.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No expense data</p>
          )}
        </div>
      </div>
    </div>
  )
}
