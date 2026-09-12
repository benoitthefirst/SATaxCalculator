'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface Company {
  id: string
  name: string
  business_type: string | null
  created_at: string
  days_since_creation: number
  created_by: {
    id: string
    first_name: string
    last_name: string
    email: string
    last_login_at: string | null
  }
  _count: {
    members: number
    expenses: number
    income: number
    pending_documents: number
  }
  last_follow_up: {
    id: string
    email_type: string
    sent_at: string
  } | null
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

const businessTypeLabels: Record<string, string> = {
  small_business_corporation: 'SBC',
  standard_company: 'Standard',
  sole_proprietor: 'Sole Proprietor',
}

const emailTypeLabels: Record<string, string> = {
  WELCOME_FOLLOWUP: 'Welcome Follow-up',
  ACTIVATION_REMINDER: 'Activation Reminder',
  CUSTOM: 'Custom Message',
}

export default function FollowUpsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [companies, setCompanies] = useState<Company[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 20, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [filter, setFilter] = useState(searchParams.get('filter') || 'inactive')

  // Selection state
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailType, setEmailType] = useState<'WELCOME_FOLLOWUP' | 'ACTIVATION_REMINDER' | 'CUSTOM'>('WELCOME_FOLLOWUP')
  const [customMessage, setCustomMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; errors: string[] } | null>(null)

  const page = parseInt(searchParams.get('page') || '1')

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '20')
      params.set('filter', filter)
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/follow-ups?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setLoading(false)
    }
  }, [page, search, filter])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // Reset selection when data changes
  useEffect(() => {
    setSelectedCompanies(new Set())
    setSelectAll(false)
  }, [companies])

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
    router.push(`/admin/follow-ups?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCompanies(new Set())
    } else {
      setSelectedCompanies(new Set(companies.map(c => c.id)))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectCompany = (companyId: string) => {
    const newSelected = new Set(selectedCompanies)
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId)
    } else {
      newSelected.add(companyId)
    }
    setSelectedCompanies(newSelected)
    setSelectAll(newSelected.size === companies.length)
  }

  const handleSendEmails = async () => {
    if (selectedCompanies.size === 0) return

    setSending(true)
    setSendResult(null)

    try {
      const response = await fetch('/api/admin/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyIds: Array.from(selectedCompanies),
          emailType,
          customMessage: emailType === 'CUSTOM' ? customMessage : undefined,
          senderName: senderName || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSendResult(data.results)
        // Refresh the list after sending
        setTimeout(() => {
          fetchCompanies()
          setSelectedCompanies(new Set())
          setSelectAll(false)
        }, 2000)
      } else {
        setSendResult({ sent: 0, failed: selectedCompanies.size, errors: [data.error] })
      }
    } catch (error) {
      setSendResult({ sent: 0, failed: selectedCompanies.size, errors: ['Network error'] })
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Follow-ups</h1>
          <p className="text-gray-500 mt-1">Reach out to inactive users and help them get started</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/follow-ups/history"
            className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Email History
          </Link>
        {selectedCompanies.size > 0 && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-4 py-2.5 bg-[#062C2E] text-[#E8FF3F] rounded-xl font-medium hover:bg-[#0a3d40] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Follow-up ({selectedCompanies.size})
          </button>
        )}
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
                placeholder="Search by company or owner name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
              />
            </div>
          </form>

          {/* Activity Filter */}
          <select
            value={filter}
            onChange={(e) => updateFilters({ filter: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
          >
            <option value="inactive">No Activity (Recommended)</option>
            <option value="no_transactions">No Transactions</option>
            <option value="no_documents">No Documents</option>
            <option value="">All Companies</option>
          </select>

          {/* Clear Filters */}
          {(search || filter !== 'inactive') && (
            <button
              onClick={() => {
                setSearch('')
                router.push('/admin/follow-ups?filter=inactive')
              }}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Needs Attention</p>
              <p className="text-xl font-semibold text-gray-900">{meta.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Selected</p>
              <p className="text-xl font-semibold text-gray-900">{selectedCompanies.size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Previously Contacted</p>
              <p className="text-xl font-semibold text-gray-900">
                {companies.filter(c => c.last_follow_up).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#062C2E] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-900 font-medium">All caught up!</p>
            <p className="text-gray-500 mt-1">No inactive companies need follow-up right now.</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-[#062C2E] focus:ring-[#062C2E]"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Follow-up</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.map((company) => (
                  <tr key={company.id} className={`hover:bg-gray-50 transition-colors ${selectedCompanies.has(company.id) ? 'bg-[#062C2E]/5' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.has(company.id)}
                        onChange={() => handleSelectCompany(company.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#062C2E] focus:ring-[#062C2E]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/admin/companies/${company.id}`} className="text-sm font-medium text-gray-900 hover:text-[#062C2E]">
                          {company.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {company.business_type ? businessTypeLabels[company.business_type] || company.business_type : 'Not specified'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/admin/users/${company.created_by.id}`} className="text-sm text-blue-600 hover:text-blue-700">
                          {company.created_by.first_name} {company.created_by.last_name}
                        </Link>
                        <p className="text-xs text-gray-500">{company.created_by.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded inline-block w-fit ${
                          company._count.expenses === 0 && company._count.income === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {company._count.expenses + company._count.income} transactions
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded inline-block w-fit ${
                          company._count.pending_documents === 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {company._count.pending_documents} documents
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(company.created_at)}</p>
                        <p className="text-xs text-gray-500">{company.days_since_creation} days ago</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {company.last_follow_up ? (
                        <div>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {emailTypeLabels[company.last_follow_up.email_type] || company.last_follow_up.email_type}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(company.last_follow_up.sent_at)}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Never contacted</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCompanies(new Set([company.id]))
                          setShowEmailModal(true)
                        }}
                        className="text-[#062C2E] hover:text-[#0a3d40] text-sm font-medium"
                      >
                        Send Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} companies
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/follow-ups?page=${page - 1}&filter=${filter}`)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => router.push(`/admin/follow-ups?page=${page + 1}&filter=${filter}`)}
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

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Send Follow-up Email</h2>
                <button
                  onClick={() => {
                    setShowEmailModal(false)
                    setSendResult(null)
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Sending to {selectedCompanies.size} {selectedCompanies.size === 1 ? 'company' : 'companies'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {sendResult ? (
                <div className={`p-4 rounded-xl ${sendResult.sent > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {sendResult.sent > 0 ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    <div>
                      <p className={`font-medium ${sendResult.sent > 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {sendResult.sent > 0 ? `${sendResult.sent} emails sent successfully!` : 'Failed to send emails'}
                      </p>
                      {sendResult.failed > 0 && (
                        <p className="text-sm text-red-600 mt-1">{sendResult.failed} failed</p>
                      )}
                      {sendResult.errors.length > 0 && (
                        <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                          {sendResult.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Email Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                    <div className="space-y-2">
                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="emailType"
                          value="WELCOME_FOLLOWUP"
                          checked={emailType === 'WELCOME_FOLLOWUP'}
                          onChange={() => setEmailType('WELCOME_FOLLOWUP')}
                          className="mt-0.5 w-4 h-4 text-[#062C2E] focus:ring-[#062C2E]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Welcome Follow-up</p>
                          <p className="text-sm text-gray-500">Friendly welcome message offering to help them get started</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="emailType"
                          value="ACTIVATION_REMINDER"
                          checked={emailType === 'ACTIVATION_REMINDER'}
                          onChange={() => setEmailType('ACTIVATION_REMINDER')}
                          className="mt-0.5 w-4 h-4 text-[#062C2E] focus:ring-[#062C2E]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Activation Reminder</p>
                          <p className="text-sm text-gray-500">Encourage them to upload their first document</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="emailType"
                          value="CUSTOM"
                          checked={emailType === 'CUSTOM'}
                          onChange={() => setEmailType('CUSTOM')}
                          className="mt-0.5 w-4 h-4 text-[#062C2E] focus:ring-[#062C2E]"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Custom Message</p>
                          <p className="text-sm text-gray-500">Write your own personalized message</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Custom Message (when selected) */}
                  {emailType === 'CUSTOM' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={5}
                        placeholder="Hi there! I noticed you've set up your company on ProcessX..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The recipient's name and company will be added automatically.
                      </p>
                    </div>
                  )}

                  {/* Sender Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sign off as (optional)</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Your name or leave blank for default"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setSendResult(null)
                }}
                className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              >
                {sendResult ? 'Close' : 'Cancel'}
              </button>
              {!sendResult && (
                <button
                  onClick={handleSendEmails}
                  disabled={sending || (emailType === 'CUSTOM' && !customMessage.trim())}
                  className="px-4 py-2.5 bg-[#062C2E] text-[#E8FF3F] rounded-xl font-medium hover:bg-[#0a3d40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E8FF3F]"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Emails
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
