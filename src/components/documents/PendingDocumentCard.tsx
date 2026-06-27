'use client'

import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ExtractedData {
  date?: string
  vendor?: string
  amount?: number
  description?: string
  category?: string
}

interface PendingDocument {
  id: string
  document_type: string
  confidence: number
  extracted_data: ExtractedData
  original_filename: string
  file_url: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
  uploader?: {
    first_name: string
    last_name: string
  }
}

interface PendingDocumentCardProps {
  document: PendingDocument
  onClick?: () => void
}

export default function PendingDocumentCard({
  document,
  onClick,
}: PendingDocumentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          label: 'Approved',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: CheckCircle,
        }
      case 'REJECTED':
        return {
          label: 'Rejected',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: XCircle,
        }
      default:
        return {
          label: 'Pending',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-700',
          borderColor: 'border-amber-200',
          icon: Clock,
        }
    }
  }

  const statusConfig = getStatusConfig(document.status)
  const StatusIcon = statusConfig.icon

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white border rounded-xl p-5 transition-all duration-200 cursor-pointer',
        document.status === 'PENDING'
          ? 'border-amber-200 hover:border-amber-300 hover:shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {document.original_filename}
            </p>
            <p className="text-xs text-gray-500">
              {document.document_type} • {formatDate(document.created_at)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md flex-shrink-0',
            statusConfig.bgColor,
            statusConfig.textColor
          )}
        >
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </span>
      </div>

      {/* Extracted Data */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-4">
        {document.extracted_data.amount !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Amount</span>
            <span className="text-sm font-semibold text-[#007AFF]">
              {formatCurrency(document.extracted_data.amount)}
            </span>
          </div>
        )}
        {document.extracted_data.vendor && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Vendor</span>
            <span className="text-sm font-medium text-gray-900 truncate ml-2">
              {document.extracted_data.vendor}
            </span>
          </div>
        )}
        {document.extracted_data.category && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Category</span>
            <span className="text-sm font-medium text-gray-900">
              {document.extracted_data.category}
            </span>
          </div>
        )}
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              document.confidence >= 0.9
                ? 'bg-green-500'
                : document.confidence >= 0.7
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            )}
            style={{ width: `${document.confidence * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-500">
          {(document.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* Uploader */}
      {document.uploader && (
        <p className="text-xs text-gray-400 mt-3">
          Uploaded by {document.uploader.first_name} {document.uploader.last_name}
        </p>
      )}
    </div>
  )
}
