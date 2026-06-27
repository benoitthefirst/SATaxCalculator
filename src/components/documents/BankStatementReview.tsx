'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Transaction {
  date: string
  description: string
  reference?: string
  debit: number
  credit: number
  balance: number
  type: 'INCOME' | 'EXPENSE'
  category: string
}

interface BankInfo {
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  statementPeriod?: {
    from: string
    to: string
  }
  openingBalance?: number
  closingBalance?: number
}

interface BankStatementResult {
  success: boolean
  fileName: string
  pendingDocumentId?: string
  documentType: string
  confidence: number
  bankInfo?: BankInfo
  transactions?: Transaction[]
  summary?: {
    totalDebits: number
    totalCredits: number
    transactionCount: number
  }
  notes?: string
}

interface BankStatementReviewProps {
  result: BankStatementResult
  onBack: () => void
}

export default function BankStatementReview({ result, onBack }: BankStatementReviewProps) {
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set())
  const [sortColumn, setSortColumn] = useState<'date' | 'amount'>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')

  const transactions = result.transactions || []
  const bankInfo = result.bankInfo

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const toggleTransaction = (index: number) => {
    const newSelected = new Set(selectedTransactions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedTransactions(newSelected)
  }

  const selectAll = () => {
    if (selectedTransactions.size === filteredTransactions.length) {
      setSelectedTransactions(new Set())
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map((_, i) => i)))
    }
  }

  const handleSort = (column: 'date' | 'amount') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'all') return true
    return t.type === filterType
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0
    if (sortColumn === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
    } else {
      const aAmount = a.credit > 0 ? a.credit : -a.debit
      const bAmount = b.credit > 0 ? b.credit : -b.debit
      comparison = aAmount - bAmount
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const incomeTotal = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.credit, 0)
  const expenseTotal = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.debit, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bank Statement Review</h2>
          <p className="text-sm text-gray-500">{result.fileName}</p>
        </div>
      </div>

      {/* Bank Info Card */}
      {bankInfo && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold">{bankInfo.bankName || 'Bank Statement'}</p>
                {bankInfo.accountNumber && (
                  <p className="text-sm text-gray-400">Account {bankInfo.accountNumber}</p>
                )}
              </div>
            </div>
            {bankInfo.accountHolder && (
              <p className="text-sm text-gray-300">{bankInfo.accountHolder}</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {bankInfo.statementPeriod && (
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400">Period</p>
                </div>
                <p className="text-sm font-medium">
                  {formatDate(bankInfo.statementPeriod.from)} - {formatDate(bankInfo.statementPeriod.to)}
                </p>
              </div>
            )}
            {bankInfo.openingBalance !== undefined && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Opening Balance</p>
                <p className="text-lg font-semibold">{formatCurrency(bankInfo.openingBalance)}</p>
              </div>
            )}
            {bankInfo.closingBalance !== undefined && (
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Closing Balance</p>
                <p className="text-lg font-semibold">{formatCurrency(bankInfo.closingBalance)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Stats - 4 column grid like Expenses page */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Transactions</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {transactions.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-sm font-medium text-gray-500">Income</p>
          </div>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {formatCurrency(incomeTotal)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <p className="text-sm font-medium text-gray-500">Expenses</p>
          </div>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {formatCurrency(expenseTotal)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">AI Confidence</p>
          <p className="text-2xl font-semibold text-[#007AFF] mt-1">
            {(result.confidence * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'INCOME', 'EXPENSE'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
              filterType === type
                ? 'bg-[#007AFF] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {type === 'all' ? 'All' : type === 'INCOME' ? 'Income' : 'Expenses'}
            <span className="ml-2 opacity-60">
              {type === 'all'
                ? transactions.length
                : transactions.filter((t) => t.type === type).length}
            </span>
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortColumn === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Category
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    {sortColumn === 'amount' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className={cn(
                    'transition-colors',
                    selectedTransactions.has(index) ? 'bg-blue-50' : 'hover:bg-gray-50'
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(index)}
                      onChange={() => toggleTransaction(index)}
                      className="w-4 h-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {transaction.description}
                    </p>
                    {transaction.reference && (
                      <p className="text-xs text-gray-500">{transaction.reference}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md',
                        transaction.type === 'INCOME'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {transaction.credit > 0 ? (
                      <span className="text-sm font-semibold text-green-600">
                        +{formatCurrency(transaction.credit)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-red-600">
                        -{formatCurrency(transaction.debit)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-600 whitespace-nowrap">
                    {formatCurrency(transaction.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No transactions found</p>
          </div>
        )}
      </div>

      {/* Selection Actions */}
      {selectedTransactions.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6">
            <span className="text-sm">
              <span className="font-semibold">{selectedTransactions.size}</span> selected
            </span>
            <div className="h-6 w-px bg-gray-700" />
            <button className="flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Import as Income
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
              <XCircle className="w-4 h-4" />
              Import as Expense
            </button>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Button onClick={onBack} variant="secondary" fullWidth size="lg">
        Back to Documents
      </Button>
    </div>
  )
}
