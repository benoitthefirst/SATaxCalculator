'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface AnalysisResult {
  success: boolean
  fileName: string
  documentType: string
  confidence: number
  extractedInfo: {
    date?: string
    vendor?: string
    amount?: number
    description?: string
    category?: string
  }
  suggestedCategory: string
  notes?: string
}

export default function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile)
      setError(null)
      setResult(null)
    } else {
      setError('Please upload a PDF, JPG, or PNG file')
    }
  }, [])

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    return validTypes.includes(file.type)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (isValidFileType(selected)) {
        setFile(selected)
        setError(null)
        setResult(null)
      } else {
        setError('Please upload a PDF, JPG, or PNG file')
      }
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1]

        const response = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64Content: base64,
          }),
        })

        const data = await response.json()

        if (data.success) {
          setResult(data)
        } else {
          setError(data.error || 'Analysis failed')
        }
        setAnalyzing(false)
      }

      reader.onerror = () => {
        setError('Failed to read file')
        setAnalyzing(false)
      }

      reader.readAsDataURL(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAnalyzing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
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

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!result && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
            isDragging
              ? 'border-[#007AFF] bg-blue-50/50'
              : 'border-gray-200 hover:border-gray-300',
            file && 'border-[#007AFF] bg-blue-50/30'
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
          />

          <div className="flex flex-col items-center gap-3">
            {file ? (
              <>
                <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#007AFF]" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setFile(null)
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Choose different file
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">
                    Drop your document here
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    or click to browse
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Supports PDF, JPG, PNG
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Analysis Error</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Analyze Button */}
      {!result && (
        <Button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          isLoading={analyzing}
          fullWidth
          size="lg"
        >
          {analyzing ? 'Analyzing Document...' : 'Analyze Document'}
        </Button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Success Header */}
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Analysis Complete
              </p>
              <p className="text-sm text-green-600">{result.fileName}</p>
            </div>
          </div>

          {/* Document Type Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Document Type
            </p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {result.documentType}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {(result.confidence * 100).toFixed(0)}% confident
              </span>
            </div>
          </div>

          {/* Extracted Information */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Extracted Information
              </p>
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(result.extractedInfo || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-3"
                >
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

          {/* Suggested Category */}
          <div className="bg-[#007AFF]/5 border border-[#007AFF]/20 rounded-xl p-5">
            <p className="text-xs font-medium text-[#007AFF] uppercase tracking-wide">
              Suggested Category
            </p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {result.suggestedCategory}
            </p>
            {result.notes && (
              <p className="text-sm text-gray-600 mt-2">{result.notes}</p>
            )}
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="secondary" fullWidth size="lg">
            Analyze Another Document
          </Button>
        </div>
      )}
    </div>
  )
}
