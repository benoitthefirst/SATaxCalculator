'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TicketReply {
  id: string
  message: string
  is_internal: boolean
  created_at: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

interface Ticket {
  id: string
  ticket_number: string
  subject: string
  description: string
  status: string
  priority: string
  category: string | null
  contact_name: string | null
  contact_email: string | null
  contact_company: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  closed_at: string | null
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  assigned_to: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  replies: TicketReply[]
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  WAITING_CUSTOMER: 'bg-orange-100 text-orange-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-700',
}

const priorityColors: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700',
  HIGH: 'bg-orange-100 text-orange-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [submittingReply, setSubmittingReply] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/admin/support/${id}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data)
      } else if (response.status === 404) {
        router.push('/admin/support')
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTicket = async (updates: Record<string, string | null>) => {
    if (!ticket) return
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/support/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        const data = await response.json()
        setTicket({ ...ticket, ...data })
      }
    } catch (error) {
      console.error('Failed to update ticket:', error)
    } finally {
      setSaving(false)
    }
  }

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setSubmittingReply(true)
    try {
      const response = await fetch(`/api/admin/support/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMessage,
          is_internal: isInternal,
        }),
      })
      if (response.ok) {
        const newReply = await response.json()
        setTicket((prev) => prev ? {
          ...prev,
          replies: [...prev.replies, newReply],
          status: prev.status === 'OPEN' ? 'IN_PROGRESS' : prev.status,
        } : null)
        setReplyMessage('')
        setIsInternal(false)
      }
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setSubmittingReply(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/support" className="hover:text-gray-700">Support Tickets</Link>
        <span>/</span>
        <span className="text-gray-900">{ticket.ticket_number}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-gray-500 mb-2">{ticket.ticket_number}</p>
                <h1 className="text-xl font-semibold text-gray-900">{ticket.subject}</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Replies */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversation ({ticket.replies.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {ticket.replies.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No replies yet</div>
              ) : (
                ticket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-6 ${reply.is_internal ? 'bg-yellow-50' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {reply.user.first_name.charAt(0)}{reply.user.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {reply.user.first_name} {reply.user.last_name}
                          </span>
                          {(reply.user.role === 'ADMIN' || reply.user.role === 'SUPER_ADMIN') && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                              Staff
                            </span>
                          )}
                          {reply.is_internal && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-200 text-yellow-800">
                              Internal Note
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(reply.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reply Form */}
          {ticket.status !== 'CLOSED' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Add Reply</h2>
              <form onSubmit={submitReply}>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your reply..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Internal note (not visible to customer)</span>
                  </label>
                  <button
                    type="submit"
                    disabled={submittingReply || !replyMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submittingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => updateTicket({ status: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="WAITING_CUSTOMER">Waiting Customer</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={ticket.priority}
                  onChange={(e) => updateTicket({ priority: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact</h2>
            {ticket.user ? (
              <Link
                href={`/admin/users/${ticket.user.id}`}
                className="flex items-center gap-3 p-3 -m-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {ticket.user.first_name.charAt(0)}{ticket.user.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.user.first_name} {ticket.user.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{ticket.user.email}</p>
                </div>
              </Link>
            ) : (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-900">{ticket.contact_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{ticket.contact_email || '-'}</p>
                </div>
                {ticket.contact_company && (
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-gray-900">{ticket.contact_company}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">{new Date(ticket.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">{new Date(ticket.updated_at).toLocaleString()}</p>
              </div>
              {ticket.resolved_at && (
                <div>
                  <p className="text-sm text-gray-500">Resolved</p>
                  <p className="text-gray-900">{new Date(ticket.resolved_at).toLocaleString()}</p>
                </div>
              )}
              {ticket.closed_at && (
                <div>
                  <p className="text-sm text-gray-500">Closed</p>
                  <p className="text-gray-900">{new Date(ticket.closed_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
