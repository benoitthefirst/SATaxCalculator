'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface Plan {
  id: string
  name: string
  tier: string
  price_monthly: number
  price_yearly: number
}

interface Subscription {
  id: string
  status: string
  billing_cycle: string
  amount: number
  current_period_end: string
  cancel_at_period_end: boolean
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  plan: {
    id: string
    name: string
    tier: string
  }
  _count: {
    payments: number
  }
}

interface SubscriptionsResponse {
  subscriptions: Subscription[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: {
    total: number
    active: number
    trialing: number
    past_due: number
    cancelled: number
    expired: number
    mrr: number
  }
}

export default function AdminSubscriptionsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY')
  const [durationMonths, setDurationMonths] = useState(12)
  const [assignNotes, setAssignNotes] = useState('')

  const { data, isLoading, error } = useQuery<SubscriptionsResponse>({
    queryKey: ['admin-subscriptions', page, statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      })
      if (statusFilter) params.set('status', statusFilter)
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/subscriptions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch subscriptions')
      return response.json()
    },
  })

  // Query for users (for assignment modal)
  const { data: usersData } = useQuery<{ users: User[] }>({
    queryKey: ['admin-users-search', userSearch],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '10' })
      if (userSearch) params.set('search', userSearch)
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    },
    enabled: showAssignModal,
  })

  // Query for plans
  const { data: plansData } = useQuery<{ plans: Plan[] }>({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await fetch('/api/admin/plans')
      if (!response.ok) throw new Error('Failed to fetch plans')
      return response.json()
    },
    enabled: showAssignModal,
  })

  // Mutation for assigning subscription
  const assignMutation = useMutation({
    mutationFn: async (data: {
      userId: string
      planId: string
      billingCycle: 'MONTHLY' | 'YEARLY'
      durationMonths: number
      notes?: string
    }) => {
      const response = await fetch('/api/admin/subscriptions/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign subscription')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] })
      setShowAssignModal(false)
      resetAssignForm()
    },
  })

  const resetAssignForm = () => {
    setSelectedUser(null)
    setUserSearch('')
    setSelectedPlanId('')
    setBillingCycle('YEARLY')
    setDurationMonths(12)
    setAssignNotes('')
  }

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd && status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          Cancelling
        </span>
      )
    }

    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      TRIALING: 'bg-blue-100 text-blue-800',
      PAST_DUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-gray-100 text-gray-600',
    }

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          styles[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load subscriptions
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer subscriptions and billing
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Assign Subscription
          </button>
          <Link
            href="/admin/subscriptions/plans"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manage Plans
          </Link>
        </div>
      </div>

      {/* Stats */}
      {data?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-semibold text-green-600">{data.stats.active}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Trialing</p>
            <p className="text-2xl font-semibold text-blue-600">{data.stats.trialing}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Past Due</p>
            <p className="text-2xl font-semibold text-red-600">{data.stats.past_due}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="text-2xl font-semibold text-gray-600">{data.stats.cancelled}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-semibold text-gray-400">{data.stats.expired}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
            <p className="text-sm text-green-600">MRR</p>
            <p className="text-2xl font-semibold text-green-700">
              {formatCurrency(data.stats.mrr)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="TRIALING">Trialing</option>
            <option value="PAST_DUE">Past Due</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : !data?.subscriptions.length ? (
          <div className="p-8 text-center text-gray-500">
            No subscriptions found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Billing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Renews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/users/${sub.user.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {sub.user.first_name} {sub.user.last_name}
                        </Link>
                        <p className="text-xs text-gray-500">{sub.user.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {sub.plan.name}
                        </span>
                        <p className="text-xs text-gray-500">{sub.plan.tier}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(sub.status, sub.cancel_at_period_end)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.billing_cycle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(sub.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sub.current_period_end)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub._count.payments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 20 + 1} to{' '}
                  {Math.min(page * 20, data.pagination.total)} of{' '}
                  {data.pagination.total} subscriptions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page >= data.pagination.totalPages}
                    className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Assign Subscription Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Assign Subscription
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manually assign a subscription plan to a user (e.g., Enterprise deals)
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                {selectedUser ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {usersData?.users && usersData.users.length > 0 && (
                      <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                        {usersData.users.map(user => (
                          <button
                            key={user.id}
                            onClick={() => {
                              setSelectedUser(user)
                              setUserSearch('')
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <p className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Plan
                </label>
                <select
                  value={selectedPlanId}
                  onChange={e => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a plan...</option>
                  {plansData?.plans
                    .filter(p => p.tier !== 'STARTER')
                    .map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.tier}) - R{plan.price_monthly}/mo or R{plan.price_yearly}/yr
                      </option>
                    ))}
                </select>
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Cycle
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billingCycle"
                      checked={billingCycle === 'MONTHLY'}
                      onChange={() => setBillingCycle('MONTHLY')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Monthly</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billingCycle"
                      checked={billingCycle === 'YEARLY'}
                      onChange={() => setBillingCycle('YEARLY')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Yearly</span>
                  </label>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={durationMonths}
                  onChange={e => setDurationMonths(parseInt(e.target.value) || 12)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Subscription will be active for this many months without payment
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  placeholder="e.g., Enterprise deal, custom pricing agreement..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {assignMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {assignMutation.error.message}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  resetAssignForm()
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedUser && selectedPlanId) {
                    assignMutation.mutate({
                      userId: selectedUser.id,
                      planId: selectedPlanId,
                      billingCycle,
                      durationMonths,
                      notes: assignNotes || undefined,
                    })
                  }
                }}
                disabled={!selectedUser || !selectedPlanId || assignMutation.isPending}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {assignMutation.isPending ? 'Assigning...' : 'Assign Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
