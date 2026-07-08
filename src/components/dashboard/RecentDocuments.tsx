'use client'

import Link from 'next/link'

export interface Document {
  id: string
  name: string
  type: 'Invoice' | 'Receipt' | 'Statement' | 'Other'
  status: 'processing' | 'completed' | 'failed'
  confidence?: number
  date: Date
}

interface RecentDocumentsProps {
  documents: Document[]
}

export default function RecentDocuments({ documents }: RecentDocumentsProps) {
  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F97316]/10 text-[#F97316]">
            Processing
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E]">
            Completed
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#EF4444]/10 text-[#EF4444]">
            Failed
          </span>
        )
    }
  }

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'Invoice':
        return (
          <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'Receipt':
        return (
          <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )
    }
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
                      {getTypeIcon(doc.type)}
                      <span className="text-sm font-medium text-[#111827] truncate max-w-[200px]">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">{doc.type}</td>
                  <td className="px-6 py-4">{getStatusBadge(doc.status)}</td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {doc.confidence ? `${doc.confidence.toFixed(1)}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {doc.date.toLocaleDateString('en-ZA')}
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
