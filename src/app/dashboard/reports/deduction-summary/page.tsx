'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCurrentFiscalYear } from '@/lib/utils/fiscal-year'
import UpgradePrompt from '@/components/reports/UpgradePrompt'

interface UpgradeRequired {
  error: string
  message: string
  feature: string
  upgradeRequired: true
}

interface DeductionData {
  fiscalYear: string
  categories: Array<{
    name: string
    grossAmount: number
    charges: number
    deductibleAmount: number
    count: number
    receiptsComplete: number
    receiptsMissing: number
  }>
  totals: {
    grossExpenses: number
    totalCharges: number
    totalDeductible: number
    expenseCount: number
  }
  company: {
    name: string
    taxNumber: string
    businessType: string
  }
}

export default function DeductionSummaryPage() {
  const [data, setData] = useState<DeductionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [year, setYear] = useState(() => getCurrentFiscalYear())
  const [upgradeRequired, setUpgradeRequired] = useState<UpgradeRequired | null>(null)

  useEffect(() => {
    fetchData()
  }, [year])

  const fetchData = async () => {
    try {
      setLoading(true)
      setUpgradeRequired(null)
      setError('')
      const res = await fetch(`/api/expenses/deduction-summary?year=${year}`)
      const json = await res.json()

      if (res.status === 403 && json.upgradeRequired) {
        setUpgradeRequired(json)
        setData(null)
      } else if (!res.ok) {
        throw new Error('Failed to fetch deduction summary')
      } else {
        setData(json)
      }
    } catch (err) {
      setError('Failed to load deduction summary')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
      </div>
    )
  }

  if (upgradeRequired) {
    return (
      <UpgradePrompt
        title="Unlock Deduction Summary"
        message={upgradeRequired.message}
        backLink="/dashboard/reports"
        backLabel="Back to Reports"
      />
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">
        {error || 'Failed to load data'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/reports"
          className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium"
        >
          ← Back to Reports
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Deduction Summary</h1>
            <p className="mt-1 text-sm text-gray-500">
              Expense Categories - Tax Year {data.fiscalYear}
            </p>
          </div>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF]"
          >
            {[2026, 2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>
                {y}/{y + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Gross Expenses</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {formatCurrency(data.totals.grossExpenses)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {data.totals.expenseCount} expense records
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Charges/Fees</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {formatCurrency(data.totals.totalCharges)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Bank charges and fees</p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
          <p className="text-sm font-medium text-green-600">Total Deductible</p>
          <p className="text-2xl font-semibold text-green-700 mt-1">
            {formatCurrency(data.totals.totalDeductible)}
          </p>
          <p className="text-xs text-green-500 mt-1">For SARS tax filing</p>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Expenses by Category</h3>
        </div>

        {data.categories.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-gray-500 mb-4">No expenses recorded for this period</p>
            <Link
              href="/dashboard/expenses/new"
              className="inline-block text-[#007AFF] hover:text-[#0051D5] font-medium"
            >
              Add your first expense →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductible
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.categories.map((cat) => (
                  <tr key={cat.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
                      {cat.count}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {formatCurrency(cat.grossAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right">
                      {formatCurrency(cat.charges)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600 text-right">
                      {formatCurrency(cat.deductibleAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cat.receiptsMissing > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-700">
                          {cat.receiptsMissing} missing
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700">
                          Complete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    Total ({data.categories.length} categories)
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {data.totals.expenseCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(data.totals.grossExpenses)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right">
                    {formatCurrency(data.totals.totalCharges)}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-700 text-right">
                    {formatCurrency(data.totals.totalDeductible)}
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Tax Savings Estimate */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Estimated Tax Savings</h3>
            <p className="text-sm text-blue-600 mt-1">
              Based on your deductible expenses @ 27% CIT rate
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-700">
              {formatCurrency(data.totals.totalDeductible * 0.27)}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              From {formatCurrency(data.totals.totalDeductible)} deductions
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Company: {data.company.name}
        </p>
        <div className="flex gap-3">
          <Link
            href="/dashboard/expenses"
            className="px-4 py-2 text-sm font-medium text-[#007AFF] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            View All Expenses
          </Link>
          <Link
            href="/dashboard/reports/tax-computation"
            className="px-4 py-2 text-sm font-medium text-white bg-[#007AFF] rounded-xl hover:bg-[#0051D5] transition-colors"
          >
            View Tax Computation →
          </Link>
        </div>
      </div>
    </div>
  )
}
