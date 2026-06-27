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

interface TaxData {
  fiscalYear: string
  company: {
    name: string
    taxNumber: string
    vatNumber: string | null
    businessType: string
    isSBC: boolean
    isVatRegistered: boolean
  }
  income: {
    gross: number
    grossWithVat: number
    byCategory: Record<string, number>
    recordCount: number
  }
  expenses: {
    totalDeductible: number
    byCategory: Record<string, { gross: number; deductible: number; count: number }>
    recordCount: number
  }
  depreciation: {
    total: number
    schedule: Array<{
      name: string
      purchaseCost: number
      businessUsePercent: number
      annualDepreciation: number
    }>
    assetCount: number
  }
  vat: {
    vatRate: number
    outputVat: number
    inputVat: number
    vatPayable: number
  } | null
  taxComputation: {
    grossIncome: number
    lessDeductibleExpenses: number
    lessDepreciation: number
    taxableIncome: number
    citRate: number
    citTax: number
    sbcTax: number
    applicableTax: number
    potentialSavingsIfSBC: number
  }
}

export default function TaxComputationPage() {
  const [data, setData] = useState<TaxData | null>(null)
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
      const res = await fetch(`/api/tax-computation?year=${year}`)
      const json = await res.json()

      if (res.status === 403 && json.upgradeRequired) {
        setUpgradeRequired(json)
        setData(null)
      } else if (!res.ok) {
        throw new Error('Failed to fetch tax computation')
      } else {
        setData(json)
      }
    } catch (err) {
      setError('Failed to load tax computation')
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
        title="Unlock Tax Computation"
        message={upgradeRequired.message}
        backLink="/reports"
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/reports"
          className="text-[#007AFF] hover:text-[#0051D5] text-sm font-medium"
        >
          ← Back to Reports
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Tax Computation</h1>
            <p className="mt-1 text-sm text-gray-500">
              Corporate Income Tax - Year of Assessment {data.fiscalYear}
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

      {/* Company Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{data.company.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tax Number: {data.company.taxNumber || 'Not set'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {data.company.isVatRegistered && (
              <div className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-cyan-50 text-cyan-700">
                VAT Registered
              </div>
            )}
            <div className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium ${
              data.company.isSBC
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {data.company.isSBC ? 'Small Business Corp' : 'Standard Company'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Computation Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Tax Computation</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {/* Income Section */}
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">
                  INCOME {data.company.isVatRegistered && '(excl. VAT)'}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({data.income.recordCount} records)
                </span>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(data.taxComputation.grossIncome)}
              </span>
            </div>
            {data.company.isVatRegistered && (
              <div className="mt-2 text-sm text-gray-500">
                Gross (incl. VAT): {formatCurrency(data.income.grossWithVat)}
              </div>
            )}
            {Object.entries(data.income.byCategory).length > 0 && (
              <div className="mt-3 pl-4 space-y-1">
                {Object.entries(data.income.byCategory).map(([cat, amount]) => (
                  <div key={cat} className="flex justify-between text-sm text-gray-500">
                    <span>{cat}</span>
                    <span>{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses Section */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">LESS: Deductible Expenses</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({data.expenses.recordCount} records)
                </span>
              </div>
              <span className="text-lg font-semibold text-red-600">
                ({formatCurrency(data.taxComputation.lessDeductibleExpenses)})
              </span>
            </div>
            {Object.entries(data.expenses.byCategory).length > 0 && (
              <div className="mt-3 pl-4 space-y-1">
                {Object.entries(data.expenses.byCategory)
                  .sort(([, a], [, b]) => b.deductible - a.deductible)
                  .slice(0, 5)
                  .map(([cat, val]) => (
                    <div key={cat} className="flex justify-between text-sm text-gray-500">
                      <span>{cat}</span>
                      <span>{formatCurrency(val.deductible)}</span>
                    </div>
                  ))}
                {Object.keys(data.expenses.byCategory).length > 5 && (
                  <div className="text-sm text-gray-400 italic">
                    + {Object.keys(data.expenses.byCategory).length - 5} more categories
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Depreciation Section */}
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">LESS: Depreciation (Wear & Tear)</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({data.depreciation.assetCount} assets)
                </span>
              </div>
              <span className="text-lg font-semibold text-red-600">
                ({formatCurrency(data.taxComputation.lessDepreciation)})
              </span>
            </div>
            {data.depreciation.schedule.length > 0 && (
              <div className="mt-3 pl-4 space-y-1">
                {data.depreciation.schedule.slice(0, 3).map((asset, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-500">
                    <span>{asset.name} ({asset.businessUsePercent}% business use)</span>
                    <span>{formatCurrency(asset.annualDepreciation)}</span>
                  </div>
                ))}
              </div>
            )}
            {data.depreciation.assetCount === 0 && (
              <div className="mt-2 text-sm text-gray-400">
                <Link href="/assets" className="text-[#007AFF] hover:underline">
                  Add assets to claim depreciation →
                </Link>
              </div>
            )}
          </div>

          {/* Taxable Income */}
          <div className="px-6 py-4 bg-blue-50">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-900">TAXABLE INCOME</span>
              <span className="text-xl font-bold text-blue-700">
                {formatCurrency(data.taxComputation.taxableIncome)}
              </span>
            </div>
          </div>

          {/* Tax Calculation */}
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Corporate Income Tax @ {(data.taxComputation.citRate * 100).toFixed(0)}%
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(data.taxComputation.citTax)}
              </span>
            </div>
          </div>

          {/* SBC Comparison */}
          {!data.company.isSBC && data.taxComputation.potentialSavingsIfSBC > 0 && (
            <div className="px-6 py-4 bg-green-50">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-900">If SBC Tax Rates Applied</span>
                  <span className="text-lg font-semibold text-green-700">
                    {formatCurrency(data.taxComputation.sbcTax)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Potential Tax Savings</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(data.taxComputation.potentialSavingsIfSBC)}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Confirm SBC eligibility with your accountant: All members must be natural persons, gross income ≤ R20m, ≤20% from investments/personal services
                </p>
              </div>
            </div>
          )}

          {/* VAT Summary - Only for VAT-registered businesses */}
          {data.vat && (
            <div className="px-6 py-4 bg-cyan-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-cyan-900">VAT SUMMARY</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-700">Output VAT (collected on income)</span>
                  <span className="font-medium text-cyan-900">{formatCurrency(data.vat.outputVat)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-700">Less: Input VAT (on expenses)</span>
                  <span className="font-medium text-cyan-900">({formatCurrency(data.vat.inputVat)})</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-cyan-200">
                  <span className="font-semibold text-cyan-900">
                    VAT {data.vat.vatPayable >= 0 ? 'Payable to SARS' : 'Refundable from SARS'}
                  </span>
                  <span className="font-bold text-cyan-700">
                    {formatCurrency(Math.abs(data.vat.vatPayable))}
                  </span>
                </div>
              </div>
              <p className="text-xs text-cyan-600 mt-3">
                VAT201 submission due by the 25th of each month following the VAT period
              </p>
            </div>
          )}

          {/* Final Amount */}
          <div className="px-6 py-6 bg-gray-900">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-lg">INCOME TAX PAYABLE</span>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(data.taxComputation.applicableTax)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Based on {data.income.recordCount} income records and {data.expenses.recordCount} expense records
        </div>
        <div className="flex gap-3">
          <Link
            href="/income"
            className="px-4 py-2 text-sm font-medium text-[#007AFF] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            View Income
          </Link>
          <Link
            href="/expenses"
            className="px-4 py-2 text-sm font-medium text-[#007AFF] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            View Expenses
          </Link>
        </div>
      </div>
    </div>
  )
}
