'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  Loader2,
  User,
  Shield
} from 'lucide-react'

interface Reply {
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
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  created_at: string
  updated_at: string
  resolved_at: string | null
  closed_at: string | null
  replies: Reply[]
}

const statusConfig = {
  OPEN: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  WAITING_CUSTOMER: { label: 'Awaiting Your Reply', color: 'bg-orange-100 text-orange-700', icon: MessageSquare },
  RESOLVED: { label: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-600', icon: CheckCircle2 },
}

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
}

const categoryLabels: Record<string, string> = {
  general: 'General Inquiry',
  billing: 'Billing & Subscription',
  technical: 'Technical Issue',
  feature: 'Feature Request',
  bug: 'Bug Report',
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTicket()
  }, [id])

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/support/${id}`)
      if (!response.ok) throw new Error('Failed to fetch ticket')

      const data = await response.json()
      setTicket(data.ticket)
    } catch (err) {
      console.error('Error fetching ticket:', err)
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/support/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send reply')
      }

      setReplyMessage('')
      fetchTicket()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Ticket not found</h2>
          <p className="text-slate-600 mb-6">This ticket may have been deleted or you don&apos;t have access to it.</p>
          <Link
            href="/dashboard/support"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#062C2E] text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Support
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[ticket.status].icon
  const canReply = ticket.status !== 'CLOSED'

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/support"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Support
      </Link>

      {/* Ticket Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {ticket.ticket_number}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[ticket.status].color}`}>
            <StatusIcon className="w-4 h-4" />
            {statusConfig[ticket.status].label}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[ticket.priority].color}`}>
            {priorityConfig[ticket.priority].label} Priority
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
            {categoryLabels[ticket.category] || ticket.category}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">{ticket.subject}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>Created: {formatDate(ticket.created_at)}</span>
          {ticket.resolved_at && <span>Resolved: {formatDate(ticket.resolved_at)}</span>}
          {ticket.closed_at && <span>Closed: {formatDate(ticket.closed_at)}</span>}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4 mb-6">
        {/* Original Message */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#062C2E] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[#E8FF3F]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-slate-900">You</span>
                <span className="text-sm text-slate-500">{formatDate(ticket.created_at)}</span>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="whitespace-pre-wrap text-slate-700">{ticket.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        {ticket.replies.map((reply) => {
          const isStaff = reply.user.role === 'ADMIN' || reply.user.role === 'SUPER_ADMIN'

          return (
            <div
              key={reply.id}
              className={`rounded-2xl border p-6 ${
                isStaff ? 'bg-blue-50 border-blue-100' : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isStaff ? 'bg-blue-600' : 'bg-[#062C2E]'
                }`}>
                  {isStaff ? (
                    <Shield className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-[#E8FF3F]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-slate-900">
                      {isStaff ? 'ProcessX Support' : `${reply.user.first_name} ${reply.user.last_name}`}
                    </span>
                    {isStaff && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Staff
                      </span>
                    )}
                    <span className="text-sm text-slate-500">{formatDate(reply.created_at)}</span>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700">{reply.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reply Form */}
      {canReply ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-medium text-slate-900 mb-4">Add a Reply</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitReply}>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent resize-none mb-4 text-slate-900 placeholder:text-slate-400"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !replyMessage.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#062C2E] text-white font-medium rounded-xl hover:bg-[#0a3d40] transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl p-6 text-center">
          <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600">This ticket is closed and cannot receive new replies.</p>
          <Link
            href="/dashboard/support"
            className="inline-flex items-center gap-2 mt-4 text-[#062C2E] font-medium hover:underline"
          >
            Create a new ticket if you need further assistance
          </Link>
        </div>
      )}
    </div>
  )
}
