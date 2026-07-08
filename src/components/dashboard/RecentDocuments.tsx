import Link from 'next/link'

interface PendingDocument {
  id: string
  original_filename: string
  document_type: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  confidence: number
  created_at: Date
}

interface RecentDocumentsProps {
  documents: PendingDocument[]
}

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  const getStatusBadge = (status: PendingDocument['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F97316]/10 text-[#F97316]">
            Processing
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E]">
            Completed
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EF4444]/10 text-[#EF4444]">
            Rejected
          </span>
        )
    }
  }

  const getTypeIcon = (type: string) => {
    const normalizedType = type.toUpperCase()
    if (normalizedType === 'INVOICE') {
      return (
        <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
    if (normalizedType === 'RECEIPT') {
      return (
        <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      )
    }
    if (normalizedType === 'BANK_STATEMENT') {
      return (
        <svg className="w-5 h-5 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
    return (
      <svg className="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  }

  const formatDocumentType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E8EDF3] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#111827]">Recent Documents</h3>
        <Link href="/dashboard/documents" className="text-sm text-[#2563EB] hover:text-[#1d4ed8]">
          View all
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="px-6 py-12 text-center text-[#4B5563]">
          No documents uploaded yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8EDF3]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EDF3]">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F7F9FC] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(doc.document_type)}
                      <span className="text-sm font-medium text-[#111827] truncate max-w-[200px]">
                        {doc.original_filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {formatDocumentType(doc.document_type)}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {doc.confidence ? `${(doc.confidence * 100).toFixed(1)}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {new Date(doc.created_at).toLocaleDateString('en-ZA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
