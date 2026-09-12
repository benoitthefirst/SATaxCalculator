'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface FollowUpEmail {
  id: string
  email_type: string
  subject: string
  message: string
  status: string
  sent_at: string
  opened_at: string | null
  clicked_at: string | null
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  company: {
    id: string
    name: string
  } | null
  sender: {
    id: string
    first_name: string
    last_name: string
  }
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

const emailTypeLabels: Record<string, string> = {
  WELCOME_FOLLOWUP: 'Welcome Follow-up',
  ACTIVATION_REMINDER: 'Activation Reminder',
  CUSTOM: 'Custom Message',
}

const statusColors: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-700',
  opened: 'bg-green-100 text-green-700',
  clicked: 'bg-purple-100 text-purple-700',
  bounced: 'bg-red-100 text-red-700',
}

export default function FollowUpHistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [emails, setEmails] = useState<FollowUpEmail[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 20, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [emailTypeFilter, setEmailTypeFilter] = useState(searchParams.get('emailType') || '')

  const page = parseInt(searchParams.get('page') || '1')

  const fetchEmails = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '20')
      if (search) params.set('search', search)
      if (emailTypeFilter) params.set('emailType', emailTypeFilter)

      const response = await fetch(`/api/admin/follow-ups/history?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error('Failed to fetch email history:', error)
    } finally {
      setLoading(false)
    }
  }, [page, search, emailTypeFilter])

  useEffect(() => {
    fetchEmails()
  }, [fetchEmails])

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    params.set('page', '1')
    router.push(`/admin/follow-ups/history?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/follow-ups"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Email History</h1>
            <p className="text-gray-500 mt-1">View all follow-up emails sent from the admin portal</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by recipient name, email, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
              />
            </div>
          </form>

          {/* Email Type Filter */}
          <select
            value={emailTypeFilter}
            onChange={(e) => updateFilters({ emailType: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="WELCOME_FOLLOWUP">Welcome Follow-up</option>
            <option value="ACTIVATION_REMINDER">Activation Reminder</option>
            <option value="CUSTOM">Custom Message</option>
          </select>

          {/* Clear Filters */}
          {(search || emailTypeFilter) && (
            <button
              onClick={() => {
                setSearch('')
                router.push('/admin/follow-ups/history')
              }}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Emails Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#062C2E] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading email history...</p>
          </div>
        ) : emails.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-900 font-medium">No emails sent yet</p>
            <p className="text-gray-500 mt-1">Follow-up emails will appear here once sent.</p>
            <Link
              href="/admin/follow-ups"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#062C2E] text-[#E8FF3F] rounded-xl font-medium mt-4 hover:bg-[#0a3d40] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Follow-ups
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {emails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/admin/users/${email.user.id}`} className="text-sm font-medium text-gray-900 hover:text-[#062C2E]">
                          {email.user.first_name} {email.user.last_name}
                        </Link>
                        <p className="text-xs text-gray-500">{email.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {email.company ? (
                        <Link href={`/admin/companies/${email.company.id}`} className="text-sm text-blue-600 hover:text-blue-700">
                          {email.company.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {emailTypeLabels[email.email_type] || email.email_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-[200px]" title={email.subject}>
                        {email.subject}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[email.status] || 'bg-gray-100 text-gray-700'}`}>
                        {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {email.sender.first_name} {email.sender.last_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(email.sent_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} emails
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/follow-ups/history?page=${page - 1}`)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => router.push(`/admin/follow-ups/history?page=${page + 1}`)}
                    disabled={page === meta.totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
