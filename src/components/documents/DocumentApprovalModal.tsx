'use client'

import { useState } from 'react'
import {
  X,
  FileText,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader,
  Building2,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
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

interface ExtractedData {
  date?: string
  vendor?: string
  amount?: number
  description?: string
  category?: string
  // Bank statement fields
  bankInfo?: BankInfo
  transactions?: Transaction[]
  summary?: {
    totalDebits: number
    totalCredits: number
    transactionCount: number
  }
}

interface PendingDocument {
  id: string
  document_type: string
  confidence: number
  extracted_data: ExtractedData
  original_filename: string
  file_url: string
  file_size: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  approved_at?: string
  rejection_reason?: string
  notes?: string
  linked_expense_id?: string | null
  linked_income_id?: string | null
  uploader?: {
    first_name: string
    last_name: string
    email: string
  }
  approver?: {
    first_name: string
    last_name: string
  }
}

interface DocumentApprovalModalProps {
  document: PendingDocument
  onClose: () => void
  onApprove: (id: string, notes?: string, editedData?: ExtractedData) => Promise<void>
  onReject: (id: string, reason?: string) => Promise<void>
  onCreateRecord?: (id: string) => Promise<void>
  mode?: 'view' | 'edit'
}

const EXPENSE_CATEGORIES = [
  'Office',
  'Travel',
  'Utilities',
  'Marketing',
  'Equipment',
  'Salary',
  'Bank Charges',
  'Insurance',
  'Professional Services',
  'Other',
]

const INCOME_CATEGORIES = [
  'Service Revenue',
  'Product Sales',
  'Interest Income',
  'Rental Income',
  'Other Income',
]

export default function DocumentApprovalModal({
  document,
  onClose,
  onApprove,
  onReject,
  onCreateRecord,
  mode = 'edit',
}: DocumentApprovalModalProps) {
  const [processing, setProcessing] = useState(false)
  const [action, setAction] = useState<'approve' | 'reject' | 'createRecord' | null>(null)
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [editingCell, setEditingCell] = useState<{ index: number; field: 'date' | 'description' | 'category' | 'amount' } | null>(null)
  const [editedTransactions, setEditedTransactions] = useState<Transaction[]>(
    document.extracted_data.transactions || []
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const updateTransaction = (index: number, field: 'date' | 'description' | 'category' | 'amount', value: string | number) => {
    setEditedTransactions((prev) => {
      const updated = [...prev]
      if (field === 'amount') {
        // Update debit or credit based on transaction type
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
        if (updated[index].type === 'INCOME') {
          updated[index] = { ...updated[index], credit: numValue, debit: 0 }
        } else {
          updated[index] = { ...updated[index], debit: numValue, credit: 0 }
        }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const handleApprove = async () => {
    setProcessing(true)
    setAction('approve')
    try {
      // Build edited data with updated transactions
      const editedData: ExtractedData = {
        ...document.extracted_data,
        transactions: editedTransactions,
      }
      await onApprove(document.id, notes, editedData)
      onClose()
    } catch {
      setProcessing(false)
      setAction(null)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    setAction('reject')
    try {
      await onReject(document.id, rejectionReason)
      onClose()
    } catch {
      setProcessing(false)
      setAction(null)
    }
  }

  const handleCreateRecord = async () => {
    if (!onCreateRecord) return
    setProcessing(true)
    setAction('createRecord')
    try {
      await onCreateRecord(document.id)
      onClose()
    } catch {
      setProcessing(false)
      setAction(null)
    }
  }

  const isPending = document.status === 'PENDING'
  const isEditMode = mode === 'edit' && isPending
  const isViewOnly = mode === 'view' || !isPending
  const isApprovedWithoutRecord = document.status === 'APPROVED' &&
    !document.linked_expense_id &&
    !document.linked_income_id &&
    (document.document_type === 'INVOICE' || document.document_type === 'RECEIPT')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden",
        document.document_type === 'BANK_STATEMENT' ? 'max-w-3xl' : 'max-w-lg'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isViewOnly ? 'View Document' : 'Review Document'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* File Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {document.original_filename}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {document.document_type} • {formatFileSize(document.file_size)}
              </p>
              <a
                href={document.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#007AFF] hover:underline mt-2"
              >
                View original
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Confidence */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              AI Confidence
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    document.confidence >= 0.9
                      ? 'bg-green-500'
                      : document.confidence >= 0.7
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  )}
                  style={{ width: `${document.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {(document.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Bank Statement Info */}
          {document.document_type === 'BANK_STATEMENT' && document.extracted_data.bankInfo && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">
                      {document.extracted_data.bankInfo.bankName || 'Bank Statement'}
                    </p>
                    {document.extracted_data.bankInfo.accountNumber && (
                      <p className="text-sm text-gray-400">
                        Account {document.extracted_data.bankInfo.accountNumber}
                      </p>
                    )}
                  </div>
                </div>
                {document.extracted_data.bankInfo.accountHolder && (
                  <p className="text-sm text-gray-300">{document.extracted_data.bankInfo.accountHolder}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {document.extracted_data.bankInfo.statementPeriod && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Period</p>
                    <p className="text-sm font-medium">
                      {document.extracted_data.bankInfo.statementPeriod.from} - {document.extracted_data.bankInfo.statementPeriod.to}
                    </p>
                  </div>
                )}
                {document.extracted_data.bankInfo.openingBalance !== undefined && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Opening Balance</p>
                    <p className="text-base font-semibold">
                      {formatCurrency(document.extracted_data.bankInfo.openingBalance)}
                    </p>
                  </div>
                )}
                {document.extracted_data.bankInfo.closingBalance !== undefined && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Closing Balance</p>
                    <p className="text-base font-semibold">
                      {formatCurrency(document.extracted_data.bankInfo.closingBalance)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Statement Summary */}
          {document.document_type === 'BANK_STATEMENT' && document.extracted_data.summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-500">Transactions</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">
                  {document.extracted_data.summary.transactionCount}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-gray-500">Income</p>
                </div>
                <p className="text-xl font-semibold text-green-600 mt-1">
                  {formatCurrency(document.extracted_data.summary.totalCredits)}
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <p className="text-sm font-medium text-gray-500">Expenses</p>
                </div>
                <p className="text-xl font-semibold text-red-600 mt-1">
                  {formatCurrency(document.extracted_data.summary.totalDebits)}
                </p>
              </div>
            </div>
          )}

          {/* Bank Statement Transactions - Editable */}
          {document.document_type === 'BANK_STATEMENT' && editedTransactions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Transactions ({editedTransactions.length})
                </p>
                {isEditMode && (
                  <p className="text-xs text-gray-400">
                    <Pencil className="w-3 h-3 inline mr-1" />
                    Click to edit
                  </p>
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {editedTransactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {/* Date - Editable */}
                        <td className="px-4 py-2.5">
                          {editingCell?.index === idx && editingCell?.field === 'date' ? (
                            <input
                              type="date"
                              value={tx.date}
                              onChange={(e) => {
                                updateTransaction(idx, 'date', e.target.value)
                                setEditingCell(null)
                              }}
                              className="px-2 py-1.5 text-sm text-gray-900 bg-white border border-[#007AFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                              autoFocus
                              onBlur={() => setEditingCell(null)}
                            />
                          ) : (
                            <span
                              className={cn(
                                "text-sm text-gray-600 whitespace-nowrap",
                                isEditMode && "cursor-pointer hover:text-[#007AFF] transition-colors"
                              )}
                              onClick={() => isEditMode && setEditingCell({ index: idx, field: 'date' })}
                            >
                              {tx.date}
                            </span>
                          )}
                        </td>
                        {/* Description - Editable */}
                        <td className="px-4 py-2.5">
                          {editingCell?.index === idx && editingCell?.field === 'description' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={tx.description}
                                onChange={(e) => updateTransaction(idx, 'description', e.target.value)}
                                className="flex-1 px-2 py-1.5 text-sm text-gray-900 bg-white border border-[#007AFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Escape') {
                                    setEditingCell(null)
                                  }
                                }}
                              />
                              <button
                                onClick={() => setEditingCell(null)}
                                className="p-1 rounded bg-[#007AFF] text-white hover:bg-[#0051D5] transition-colors"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                "text-sm text-gray-900 truncate max-w-[200px]",
                                isEditMode && "cursor-pointer hover:text-[#007AFF] transition-colors"
                              )}
                              onClick={() => isEditMode && setEditingCell({ index: idx, field: 'description' })}
                            >
                              {tx.description}
                              {isEditMode && <Pencil className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100" />}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {editingCell?.index === idx && editingCell?.field === 'category' ? (
                            <select
                              value={tx.category}
                              onChange={(e) => {
                                updateTransaction(idx, 'category', e.target.value)
                                setEditingCell(null)
                              }}
                              className="px-2 py-1.5 text-sm text-gray-900 bg-white border border-[#007AFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                              autoFocus
                              onBlur={() => setEditingCell(null)}
                            >
                              {(tx.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={cn(
                                'inline-flex px-2 py-0.5 text-xs font-medium rounded-md',
                                tx.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
                                isEditMode && 'cursor-pointer hover:ring-2 hover:ring-[#007AFF]/30 transition-all'
                              )}
                              onClick={() => isEditMode && setEditingCell({ index: idx, field: 'category' })}
                            >
                              {tx.category}
                            </span>
                          )}
                        </td>
                        {/* Amount - Editable */}
                        <td className="px-4 py-2.5 text-right">
                          {editingCell?.index === idx && editingCell?.field === 'amount' ? (
                            <div className="flex items-center justify-end gap-2">
                              <input
                                type="number"
                                step="0.01"
                                value={tx.credit > 0 ? tx.credit : tx.debit}
                                onChange={(e) => updateTransaction(idx, 'amount', e.target.value)}
                                className="w-32 px-3 py-1.5 text-sm text-gray-900 font-medium bg-white text-right border border-[#007AFF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Escape') {
                                    setEditingCell(null)
                                  }
                                }}
                                onBlur={() => setEditingCell(null)}
                              />
                            </div>
                          ) : (
                            <span
                              className={cn(
                                'text-sm font-semibold whitespace-nowrap',
                                tx.credit > 0 ? 'text-green-600' : 'text-red-600',
                                isEditMode && 'cursor-pointer hover:underline transition-colors'
                              )}
                              onClick={() => isEditMode && setEditingCell({ index: idx, field: 'amount' })}
                            >
                              {tx.credit > 0 ? '+' : '-'}{formatCurrency(tx.credit > 0 ? tx.credit : tx.debit)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Extracted Data (for non-bank-statement documents) */}
          {document.document_type !== 'BANK_STATEMENT' && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Extracted Information
            </p>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
              {document.extracted_data.date && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm font-medium text-gray-900">
                    {document.extracted_data.date}
                  </span>
                </div>
              )}
              {document.extracted_data.vendor && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Vendor</span>
                  <span className="text-sm font-medium text-gray-900">
                    {document.extracted_data.vendor}
                  </span>
                </div>
              )}
              {document.extracted_data.amount !== undefined && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-semibold text-[#007AFF]">
                    {formatCurrency(document.extracted_data.amount)}
                  </span>
                </div>
              )}
              {document.extracted_data.description && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Description</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-[200px] truncate">
                    {document.extracted_data.description}
                  </span>
                </div>
              )}
              {document.extracted_data.category && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium text-gray-900">
                    {document.extracted_data.category}
                  </span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Upload Info */}
          <div className="text-xs text-gray-500">
            <p>
              Uploaded {formatDate(document.created_at)}
              {document.uploader &&
                ` by ${document.uploader.first_name} ${document.uploader.last_name}`}
            </p>
          </div>

          {/* Notes Input (for edit mode only) */}
          {isEditMode && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this document..."
                rows={2}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] resize-none"
              />
            </div>
          )}

          {/* Rejection Reason (shows when rejecting) */}
          {isEditMode && action === 'reject' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Why is this document being rejected?"
                rows={2}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 focus:border-[#007AFF] resize-none"
              />
            </div>
          )}

          {/* Status Info (for processed documents) */}
          {!isPending && (
            <div
              className={cn(
                'p-4 rounded-xl',
                document.status === 'APPROVED'
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-red-50 border border-red-100'
              )}
            >
              <div className="flex items-center gap-2">
                {document.status === 'APPROVED' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={cn(
                    'text-sm font-medium',
                    document.status === 'APPROVED'
                      ? 'text-green-800'
                      : 'text-red-800'
                  )}
                >
                  {document.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                  {document.approved_at && ` on ${formatDate(document.approved_at)}`}
                </p>
              </div>
              {document.approver && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    document.status === 'APPROVED'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  by {document.approver.first_name} {document.approver.last_name}
                </p>
              )}
              {document.rejection_reason && (
                <p className="text-sm text-red-700 mt-2">
                  Reason: {document.rejection_reason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer - Edit mode with approve/reject buttons */}
        {isEditMode && (
          <div className="flex items-center gap-3 p-5 border-t border-gray-100 bg-gray-50">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (action === 'reject') {
                  handleReject()
                } else {
                  setAction('reject')
                }
              }}
              disabled={processing}
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {processing && action === 'reject' ? (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              {action === 'reject' ? 'Confirm Reject' : 'Reject'}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              isLoading={processing && action === 'approve'}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        )}

        {/* Footer - View mode for pending (just close button) */}
        {isPending && !isEditMode && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <Button variant="secondary" onClick={onClose} fullWidth>
              Close
            </Button>
          </div>
        )}

        {/* Footer - Processed documents (approved/rejected) */}
        {!isPending && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            {isApprovedWithoutRecord ? (
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button
                  onClick={handleCreateRecord}
                  disabled={processing}
                  isLoading={processing && action === 'createRecord'}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Expense Record
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={onClose} fullWidth>
                Close
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
