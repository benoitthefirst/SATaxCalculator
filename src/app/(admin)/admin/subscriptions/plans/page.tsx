'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface FeatureLimits {
  transactions_per_month: number
  team_members: number
  companies: number
  api_access: boolean
  vehicle_logbook: boolean
  asset_management: boolean
  advanced_reports: boolean
  csv_exports: boolean
  multi_company: boolean
  document_analyzer: boolean
  priority_support: boolean
}

interface Plan {
  id: string
  name: string
  tier: string
  description: string | null
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: FeatureLimits
  is_active: boolean
  display_order: number
  total_subscriptions: number
  active_subscriptions: number
}

interface PlansResponse {
  plans: Plan[]
}

interface BillingSettings {
  subscriptions_enabled: boolean
  free_trial_days: number
  grace_period_days: number
  payfast_sandbox_mode: boolean
}

export default function AdminPlansPage() {
  const queryClient = useQueryClient()
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  // Fetch plans
  const { data: plansData, isLoading } = useQuery<PlansResponse>({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const response = await fetch('/api/admin/plans')
      if (!response.ok) throw new Error('Failed to fetch plans')
      return response.json()
    },
  })

  // Fetch billing settings
  const { data: settingsData } = useQuery<{ settings: BillingSettings }>({
    queryKey: ['admin-billing-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings/billing')
      if (!response.ok) throw new Error('Failed to fetch settings')
      return response.json()
    },
  })

  // Toggle subscriptions enabled
  const toggleSubscriptions = useMutation({
    mutationFn: async (enabled: boolean) => {
      const response = await fetch('/api/admin/settings/billing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptions_enabled: enabled }),
      })
      if (!response.ok) throw new Error('Failed to update settings')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-billing-settings'] })
    },
  })

  // Toggle plan active status
  const togglePlanActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const response = await fetch(`/api/admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active }),
      })
      if (!response.ok) throw new Error('Failed to update plan')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
    },
  })

  // Update plan
  const updatePlan = useMutation({
    mutationFn: async (plan: Partial<Plan> & { id: string }) => {
      const { id, ...data } = plan
      const response = await fetch(`/api/admin/plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update plan')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] })
      setEditingPlan(null)
    },
  })

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`

  const formatLimit = (value: number) => (value === -1 ? 'Unlimited' : value)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Plans</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure pricing, features, and limits for each plan
          </p>
        </div>
        <Link
          href="/admin/subscriptions"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          &larr; Back to Subscriptions
        </Link>
      </div>

      {/* Billing Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Subscriptions</p>
              <p className="text-sm text-gray-500">
                Turn off to disable all paid subscriptions (for testing)
              </p>
            </div>
            <button
              onClick={() =>
                toggleSubscriptions.mutate(
                  !settingsData?.settings.subscriptions_enabled
                )
              }
              disabled={toggleSubscriptions.isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settingsData?.settings.subscriptions_enabled
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settingsData?.settings.subscriptions_enabled
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">PayFast Sandbox Mode</p>
              <p className="text-sm text-gray-500">
                Use PayFast sandbox for testing payments
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                settingsData?.settings.payfast_sandbox_mode
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {settingsData?.settings.payfast_sandbox_mode ? 'Sandbox' : 'Production'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Free Trial Days</p>
              <p className="font-medium">{settingsData?.settings.free_trial_days || 14} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Grace Period Days</p>
              <p className="font-medium">{settingsData?.settings.grace_period_days || 7} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            Loading plans...
          </div>
        ) : !plansData?.plans.length ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No plans configured. Seed the database to create default plans.
          </div>
        ) : (
          plansData.plans.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border ${
                plan.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
              } p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        plan.tier === 'STARTER'
                          ? 'bg-gray-100 text-gray-700'
                          : plan.tier === 'PROFESSIONAL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {plan.tier}
                    </span>
                    {!plan.is_active && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      togglePlanActive.mutate({
                        id: plan.id,
                        is_active: !plan.is_active,
                      })
                    }
                    disabled={togglePlanActive.isPending}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      plan.is_active
                        ? 'border border-red-200 text-red-600 hover:bg-red-50'
                        : 'border border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {plan.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Monthly Price</p>
                  <p className="font-semibold text-gray-900">
                    {plan.price_monthly === 0 ? 'Free' : formatCurrency(plan.price_monthly)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Yearly Price</p>
                  <p className="font-semibold text-gray-900">
                    {plan.price_yearly === 0 ? 'Free' : formatCurrency(plan.price_yearly)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Subscriptions</p>
                  <p className="font-semibold text-green-600">{plan.active_subscriptions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Subscriptions</p>
                  <p className="font-semibold text-gray-900">{plan.total_subscriptions}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Limits</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">Transactions: </span>
                    <span className="font-medium">
                      {formatLimit(plan.limits.transactions_per_month)}/mo
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">Team: </span>
                    <span className="font-medium">{formatLimit(plan.limits.team_members)}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">Companies: </span>
                    <span className="font-medium">{formatLimit(plan.limits.companies)}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">API: </span>
                    <span className="font-medium">{plan.limits.api_access ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">Multi-company: </span>
                    <span className="font-medium">{plan.limits.multi_company ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1">
                    <span className="text-gray-500">Document Analyzer: </span>
                    <span className="font-medium">{plan.limits.document_analyzer ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {plan.features.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-50 rounded text-sm text-gray-600"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={data => updatePlan.mutate({ id: editingPlan.id, ...data })}
          isSaving={updatePlan.isPending}
        />
      )}
    </div>
  )
}

function EditPlanModal({
  plan,
  onClose,
  onSave,
  isSaving,
}: {
  plan: Plan
  onClose: () => void
  onSave: (data: Partial<Plan>) => void
  isSaving: boolean
}) {
  const [formData, setFormData] = useState({
    name: plan.name,
    description: plan.description || '',
    price_monthly: plan.price_monthly,
    price_yearly: plan.price_yearly,
    features: plan.features.join('\n'),
    limits: { ...plan.limits },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: formData.name,
      description: formData.description || undefined,
      price_monthly: formData.price_monthly,
      price_yearly: formData.price_yearly,
      features: formData.features.split('\n').filter(f => f.trim()),
      limits: formData.limits,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Plan: {plan.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier (Read-only)
              </label>
              <input
                type="text"
                value={plan.tier}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Price (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price_monthly}
                onChange={e =>
                  setFormData(d => ({ ...d, price_monthly: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yearly Price (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price_yearly}
                onChange={e =>
                  setFormData(d => ({ ...d, price_yearly: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              value={formData.features}
              onChange={e => setFormData(d => ({ ...d, features: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limits (-1 = unlimited)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500">Transactions/mo</label>
                <input
                  type="number"
                  value={formData.limits.transactions_per_month}
                  onChange={e =>
                    setFormData(d => ({
                      ...d,
                      limits: {
                        ...d.limits,
                        transactions_per_month: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Team members</label>
                <input
                  type="number"
                  value={formData.limits.team_members}
                  onChange={e =>
                    setFormData(d => ({
                      ...d,
                      limits: { ...d.limits, team_members: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Companies</label>
                <input
                  type="number"
                  value={formData.limits.companies}
                  onChange={e =>
                    setFormData(d => ({
                      ...d,
                      limits: { ...d.limits, companies: parseInt(e.target.value) || 0 },
                    }))
                  }
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { key: 'api_access', label: 'API Access' },
                { key: 'vehicle_logbook', label: 'Vehicle Logbook' },
                { key: 'asset_management', label: 'Asset Management' },
                { key: 'advanced_reports', label: 'Advanced Reports' },
                { key: 'csv_exports', label: 'CSV Exports' },
                { key: 'document_analyzer', label: 'AI Document Analyzer' },
                { key: 'multi_company', label: 'Multi-company' },
                { key: 'priority_support', label: 'Priority Support' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.limits[key as keyof FeatureLimits] as boolean}
                    onChange={e =>
                      setFormData(d => ({
                        ...d,
                        limits: { ...d.limits, [key]: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
