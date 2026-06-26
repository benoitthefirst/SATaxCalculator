'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import BankStatementReview from './BankStatementReview'

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

interface AnalysisResult {
  success: boolean
  fileName: string
  pendingDocumentId?: string
  documentType: string
  confidence: number
  // For standard documents
  extractedInfo?: {
    date?: string
    vendor?: string
    amount?: number
    description?: string
    category?: string
  }
  suggestedCategory?: string
  // For bank statements
  bankInfo?: BankInfo
  transactions?: Transaction[]
  summary?: {
    totalDebits: number
    totalCredits: number
    transactionCount: number
  }
  notes?: string
}

interface FileWithStatus {
  file: File
  status: 'pending' | 'analyzing' | 'complete' | 'error'
  result?: AnalysisResult
  error?: string
}

export default function DocumentAnalyzer() {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(isValidFileType)
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [])

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    return validTypes.includes(file.type)
  }

  const addFiles = (newFiles: File[]) => {
    const fileObjects: FileWithStatus[] = newFiles.map((file) => ({
      file,
      status: 'pending' as const,
    }))
    setFiles((prev) => [...prev, ...fileObjects])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(isValidFileType)
    if (selected.length > 0) {
      addFiles(selected)
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const analyzeFile = async (fileWithStatus: FileWithStatus, index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: 'analyzing' as const } : f))
    )

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(fileWithStatus.file)
      })

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fileWithStatus.file.name,
          fileType: fileWithStatus.file.type,
          base64Content: base64,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: 'complete' as const, result: data } : f
          )
        )
      } else {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? { ...f, status: 'error' as const, error: data.error || 'Analysis failed' }
              : f
          )
        )
      }
    } catch (err) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: 'error' as const,
                error: err instanceof Error ? err.message : 'An error occurred',
              }
            : f
        )
      )
    }
  }

  const analyzeAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await analyzeFile(files[i], i)
      }
    }
  }

  const handleReset = () => {
    setFiles([])
    setSelectedResult(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const pendingCount = files.filter((f) => f.status === 'pending').length
  const analyzingCount = files.filter((f) => f.status === 'analyzing').length
  const completeCount = files.filter((f) => f.status === 'complete').length
  const isAnalyzing = analyzingCount > 0

  // If viewing a bank statement result
  if (selectedResult && selectedResult.documentType === 'BANK_STATEMENT') {
    return (
      <BankStatementReview
        result={selectedResult}
        onBack={() => setSelectedResult(null)}
      />
    )
  }

  // If viewing a standard document result
  if (selectedResult) {
    return (
      <div className="space-y-4">
        {/* Success Header */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">Analysis Complete</p>
            <p className="text-sm text-green-600">{selectedResult.fileName}</p>
          </div>
        </div>

        {/* Document Type Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Document Type
          </p>
          <p className="text-xl font-semibold text-gray-900 mt-1">
            {selectedResult.documentType}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                style={{ width: `${selectedResult.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500">
              {(selectedResult.confidence * 100).toFixed(0)}% confident
            </span>
          </div>
        </div>

        {/* Extracted Information */}
        {selectedResult.extractedInfo && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Extracted Information
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(selectedResult.extractedInfo).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-gray-600">{formatLabel(key)}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {key === 'amount' && typeof value === 'number'
                      ? formatCurrency(value)
                      : String(value || '-')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Category */}
        {selectedResult.suggestedCategory && (
          <div className="bg-[#007AFF]/5 border border-[#007AFF]/20 rounded-xl p-5">
            <p className="text-xs font-medium text-[#007AFF] uppercase tracking-wide">
              Suggested Category
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {selectedResult.suggestedCategory}
            </p>
            {selectedResult.notes && (
              <p className="text-sm text-gray-600 mt-2">{selectedResult.notes}</p>
            )}
          </div>
        )}

        {/* Back Button */}
        <Button onClick={() => setSelectedResult(null)} variant="secondary" fullWidth size="lg">
          Back to Results
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Area Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
            isDragging
              ? 'border-[#007AFF] bg-blue-50/50'
              : 'border-gray-200 hover:border-gray-300',
            files.length > 0 && 'border-[#007AFF] bg-blue-50/30'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-input"
            multiple
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-base font-medium text-gray-900">
                Drop your documents here
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supports PDF, JPG, PNG • Multiple files allowed
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            {completeCount > 0 && (
              <p className="text-sm text-green-600">
                {completeCount} analyzed
              </p>
            )}
          </div>

          <div className="space-y-2">
            {files.map((fileItem, index) => (
              <div
                key={`${fileItem.file.name}-${index}`}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                  fileItem.status === 'complete'
                    ? 'bg-green-50 border-green-200 cursor-pointer hover:bg-green-100'
                    : fileItem.status === 'error'
                      ? 'bg-red-50 border-red-200'
                      : fileItem.status === 'analyzing'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200'
                )}
                onClick={() => {
                  if (fileItem.status === 'complete' && fileItem.result) {
                    setSelectedResult(fileItem.result)
                  }
                }}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    fileItem.status === 'complete'
                      ? 'bg-green-100'
                      : fileItem.status === 'error'
                        ? 'bg-red-100'
                        : fileItem.status === 'analyzing'
                          ? 'bg-blue-100'
                          : 'bg-gray-100'
                  )}
                >
                  {fileItem.status === 'analyzing' ? (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : fileItem.status === 'complete' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : fileItem.status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fileItem.status === 'analyzing'
                      ? 'Analyzing...'
                      : fileItem.status === 'complete' && fileItem.result
                        ? `${fileItem.result.documentType} • ${(fileItem.result.confidence * 100).toFixed(0)}% confidence`
                        : fileItem.status === 'error'
                          ? fileItem.error
                          : `${(fileItem.file.size / 1024).toFixed(1)} KB`}
                  </p>
                </div>

                {fileItem.status === 'pending' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {fileItem.status === 'complete' && (
                  <span className="text-xs text-[#007AFF] font-medium">
                    View →
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex-1"
              disabled={isAnalyzing}
            >
              Clear All
            </Button>
            <Button
              onClick={analyzeAll}
              disabled={pendingCount === 0 || isAnalyzing}
              isLoading={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing
                ? `Analyzing (${analyzingCount}/${files.length})`
                : `Analyze ${pendingCount} File${pendingCount !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
