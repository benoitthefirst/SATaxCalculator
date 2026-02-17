'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Attachment {
  id: string
  file_name: string
  file_type: string
  file_size: number
  created_at: string
}

interface ExpenseAttachmentsProps {
  expenseId: string
}

export default function ExpenseAttachments({ expenseId }: ExpenseAttachmentsProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAttachments()
  }, [expenseId])

  const fetchAttachments = async () => {
    try {
      const res = await fetch(`/api/expenses/${expenseId}/attachments`)
      if (res.ok) {
        const data = await res.json()
        setAttachments(data.attachments)
      }
    } catch (error) {
      console.error('Failed to fetch attachments:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/expenses/${expenseId}/attachments`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      await fetchAttachments()
      router.refresh()
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload file')
    } finally {
      setIsUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleDelete = async (attachmentId: string) => {
    if (!confirm('Are you sure you want to delete this attachment?')) {
      return
    }

    try {
      const res = await fetch(
        `/api/expenses/${expenseId}/attachments/${attachmentId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        throw new Error('Failed to delete attachment')
      }

      await fetchAttachments()
      router.refresh()
    } catch (error) {
      alert('Failed to delete attachment. Please try again.')
    }
  }

  const viewAttachment = async (attachmentId: string) => {
    try {
      const res = await fetch(
        `/api/expenses/${expenseId}/attachments/${attachmentId}`
      )
      const data = await res.json()

      if (data.attachment?.file_url) {
        // Open in new tab
        const win = window.open()
        if (win) {
          win.document.write(`
            <html>
              <head><title>${data.attachment.file_name}</title></head>
              <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;">
                ${
                  data.attachment.file_type.startsWith('image/')
                    ? `<img src="${data.attachment.file_url}" style="max-width:100%;max-height:100vh;" />`
                    : `<embed src="${data.attachment.file_url}" type="${data.attachment.file_type}" style="width:100%;height:100vh;" />`
                }
              </body>
            </html>
          `)
        }
      }
    } catch (error) {
      alert('Failed to view attachment')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Receipts & Attachments</h3>
          <p className="text-sm text-gray-500 mt-1">
            Upload receipts, invoices, or other supporting documents
          </p>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <span className="inline-flex items-center px-4 py-2 bg-[#007AFF] text-white text-sm font-medium rounded-xl hover:bg-[#0051D5] transition-all active:scale-[0.98] disabled:opacity-50">
            {isUploading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Upload File
              </>
            )}
          </span>
        </label>
      </div>

      {uploadError && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
          {uploadError}
        </div>
      )}

      {attachments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No attachments yet</p>
          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, or PDF files (max 5MB)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {attachment.file_type.startsWith('image/') ? (
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)} •{' '}
                    {new Date(attachment.created_at).toLocaleDateString('en-ZA')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => viewAttachment(attachment.id)}
                  className="px-3 py-1.5 text-sm font-medium text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(attachment.id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Accepted formats: JPG, PNG, PDF • Maximum file size: 5MB
      </p>
    </div>
  )
}
