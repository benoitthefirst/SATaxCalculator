'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquarePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  Loader2,
  MessageSquare,
  Filter
} from 'lucide-react'

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
  replies: { id: string }[]
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
  general: 'General',
  billing: 'Billing',
  technical: 'Technical',
  feature: 'Feature Request',
  bug: 'Bug Report',
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('general')
  const [priority, setPriority] = useState('MEDIUM')

  useEffect(() => {
    fetchTickets()
  }, [statusFilter])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/support?${params}`)
      if (!response.ok) throw new Error('Failed to fetch tickets')

      const data = await response.json()
      setTickets(data.tickets)
    } catch (err) {
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, category, priority }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create ticket')
      }

      const data = await response.json()
      setSuccess(`Ticket ${data.ticket.ticket_number} created successfully!`)
      setShowNewTicketForm(false)
      setSubject('')
      setDescription('')
      setCategory('general')
      setPriority('MEDIUM')
      fetchTickets()

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      ticket.ticket_number.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query)
    )
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support</h1>
          <p className="text-slate-600 mt-1">Get help from our team</p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#062C2E] text-white font-medium rounded-xl hover:bg-[#0a3d40] transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* New Ticket Form Modal */}
      {showNewTicketForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create Support Ticket</h2>
              <p className="text-slate-600 text-sm mt-1">Describe your issue and we&apos;ll get back to you</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
                >
                  <option value="LOW">Low - General question or feedback</option>
                  <option value="MEDIUM">Medium - Issue affecting my work</option>
                  <option value="HIGH">High - Significant impact on my business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your issue"
                  required
                  minLength={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible..."
                  required
                  minLength={20}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum 20 characters. Include steps to reproduce if reporting a bug.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewTicketForm(false)
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-[#062C2E] text-white font-medium rounded-xl hover:bg-[#0a3d40] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket number or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#062C2E] focus:border-transparent"
          >
            <option value="all">All Tickets</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_CUSTOMER">Awaiting Reply</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No tickets found</h3>
          <p className="text-slate-600 mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : "You haven't created any support tickets yet"}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowNewTicketForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#062C2E] text-white font-medium rounded-xl hover:bg-[#0a3d40] transition-colors"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Create Your First Ticket
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket) => {
            const StatusIcon = statusConfig[ticket.status].icon

            return (
              <Link
                key={ticket.id}
                href={`/dashboard/support/${ticket.id}`}
                className="block bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-slate-500">
                        {ticket.ticket_number}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[ticket.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[ticket.status].label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[ticket.priority].color}`}>
                        {priorityConfig[ticket.priority].label}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 truncate group-hover:text-[#062C2E]">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>{categoryLabels[ticket.category] || ticket.category}</span>
                      <span>•</span>
                      <span>{formatDate(ticket.created_at)}</span>
                      {ticket.replies.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {ticket.replies.length} {ticket.replies.length === 1 ? 'reply' : 'replies'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Help Links */}
      <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
        <h3 className="font-medium text-slate-900 mb-3">Need quick help?</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Browse Help Centre
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Contact Us
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
