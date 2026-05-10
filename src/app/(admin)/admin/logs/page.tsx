'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface AuditLog {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  old_values: unknown
  new_values: unknown
  ip_address: string | null
  user_agent: string | null
  metadata: unknown
  created_at: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

const actionLabels: Record<string, { label: string; color: string }> = {
  'user.created': { label: 'User Created', color: 'bg-green-100 text-green-700' },
  'user.updated': { label: 'User Updated', color: 'bg-blue-100 text-blue-700' },
  'user.deleted': { label: 'User Deleted', color: 'bg-red-100 text-red-700' },
  'company.activated': { label: 'Company Activated', color: 'bg-green-100 text-green-700' },
  'company.deactivated': { label: 'Company Deactivated', color: 'bg-red-100 text-red-700' },
  'ticket.updated': { label: 'Ticket Updated', color: 'bg-blue-100 text-blue-700' },
  'login.success': { label: 'Login Success', color: 'bg-green-100 text-green-700' },
  'login.failed': { label: 'Login Failed', color: 'bg-red-100 text-red-700' },
}

export default function AuditLogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [logs, setLogs] = useState<AuditLog[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ total: 0, page: 1, limit: 50, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState(searchParams.get('action') || '')
  const [entityTypeFilter, setEntityTypeFilter] = useState(searchParams.get('entityType') || '')

  const page = parseInt(searchParams.get('page') || '1')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '50')
      if (actionFilter) params.set('action', actionFilter)
      if (entityTypeFilter) params.set('entityType', entityTypeFilter)

      const response = await fetch(`/api/admin/logs?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
        setMeta(data.meta)
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }, [page, actionFilter, entityTypeFilter])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

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
    router.push(`/admin/logs?${params.toString()}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActionBadge = (action: string) => {
    const config = actionLabels[action]
    if (config) {
      return (
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.color}`}>
          {config.label}
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        {action}
      </span>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-1">Track all system activity</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => updateFilters({ action: e.target.value })}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Actions</option>
            <option value="user">User Actions</option>
            <option value="company">Company Actions</option>
            <option value="ticket">Ticket Actions</option>
            <option value="login">Login Actions</option>
          </select>

          {/* Entity Type Filter */}
          <select
            value={entityTypeFilter}
            onChange={(e) => updateFilters({ entityType: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Entity Types</option>
            <option value="User">User</option>
            <option value="Company">Company</option>
            <option value="SupportTicket">Support Ticket</option>
          </select>

          {/* Clear Filters */}
          {(actionFilter || entityTypeFilter) && (
            <button
              onClick={() => router.push('/admin/logs')}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">No logs found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {log.entity_type ? (
                        <div>
                          <span className="text-gray-900">{log.entity_type}</span>
                          {log.entity_id && (
                            <span className="text-gray-400 ml-1 font-mono text-xs">
                              #{log.entity_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <Link
                          href={`/admin/users/${log.user.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {log.user.first_name} {log.user.last_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">System</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} logs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/logs?page=${page - 1}`)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() => router.push(`/admin/logs?page=${page + 1}`)}
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
