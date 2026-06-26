'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSubscription, useSubscriptionPlans } from '@/hooks/useSubscription'

export default function SubscriptionSettingsPage() {
  const queryClient = useQueryClient()
  const { data: subscriptionData, isLoading } = useSubscription()
  const { data: plans } = useSubscriptionPlans()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel subscription')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      setShowCancelModal(false)
    },
  })

  const checkoutMutation = useMutation({
    mutationFn: async ({
      planId,
      billingCycle,
    }: {
      planId: string
      billingCycle: string
    }) => {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout')
      }
      return response.json()
    },
    onSuccess: data => {
      // Redirect to PayFast
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.checkoutUrl

      Object.entries(data.formData).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    },
  })

  const formatCurrency = (amount: number) =>
    `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription</h1>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Loading...
        </div>
      </div>
    )
  }

  const currentTier = subscriptionData?.tier || 'STARTER'
  const isActive = subscriptionData?.isActive
  const subscription = subscriptionData?.subscription
  const limits = subscriptionData?.limits
  const usage = subscriptionData?.usage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Subscription</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your subscription plan and billing
          </p>
        </div>
        <Link
          href="/settings"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Settings
        </Link>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span
                className={`text-2xl font-bold ${
                  currentTier === 'STARTER'
                    ? 'text-gray-900'
                    : currentTier === 'PROFESSIONAL'
                    ? 'text-blue-600'
                    : 'text-purple-600'
                }`}
              >
                {subscription?.plan?.name || 'Starter'}
              </span>
              {subscription?.cancel_at_period_end && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                  Cancelling
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentTier === 'STARTER'
                ? 'Free plan with basic features'
                : subscription?.plan?.tier === 'PROFESSIONAL'
                ? 'Full features for growing businesses'
                : 'Enterprise features for large teams'}
            </p>
          </div>

          {subscription && !subscription.cancel_at_period_end && currentTier !== 'STARTER' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Cancel subscription
            </button>
          )}
        </div>

        {subscription && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${subscription.cancel_at_period_end ? 'text-amber-700' : 'text-gray-900'}`}>
                {subscription.cancel_at_period_end ? 'Cancelling' : subscription.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {subscription.cancel_at_period_end ? 'Access Until' : 'Next Billing'}
              </p>
              <p className="font-medium text-gray-900">{formatDate(subscription.current_period_end)}</p>
            </div>
            {!subscription.cancel_at_period_end && (
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">
                  {formatCurrency(subscription.amount || 0)}/
                  {subscription.billing_cycle === 'YEARLY' ? 'year' : 'month'}
                </p>
              </div>
            )}
          </div>
        )}

        {subscription?.cancel_at_period_end && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              Your subscription has been cancelled. You will continue to have access to{' '}
              {subscription.plan?.name} features until{' '}
              {formatDate(subscription.current_period_end)}. After that, you will be
              downgraded to the Starter plan.
            </p>
          </div>
        )}
      </div>

      {/* Usage */}
      {limits && usage && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Transactions</span>
                <span className="font-medium">
                  {usage.transactions_this_month}
                  {limits.transactions_per_month !== -1 &&
                    ` / ${limits.transactions_per_month}`}
                </span>
              </div>
              {limits.transactions_per_month !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usage.transactions_this_month >= limits.transactions_per_month
                        ? 'bg-red-500'
                        : usage.transactions_this_month >= limits.transactions_per_month * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (usage.transactions_this_month / limits.transactions_per_month) * 100
                      )}%`,
                    }}
                  />
                </div>
              )}
              {limits.transactions_per_month === -1 && (
                <p className="text-xs text-green-600">Unlimited</p>
              )}
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Team Members</span>
                <span className="font-medium">
                  {usage.team_members}
                  {limits.team_members !== -1 && ` / ${limits.team_members}`}
                </span>
              </div>
              {limits.team_members !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      usage.team_members >= limits.team_members
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (usage.team_members / limits.team_members) * 100
                      )}%`,
                    }}
                  />
                </div>
              )}
              {limits.team_members === -1 && (
                <p className="text-xs text-green-600">Unlimited</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plans */}
      {plans && plans.length > 0 && (currentTier !== 'BUSINESS' || subscription?.cancel_at_period_end) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {subscription?.cancel_at_period_end
              ? 'Resubscribe or Change Plan'
              : currentTier === 'STARTER'
              ? 'Upgrade Your Plan'
              : 'Change Plan'}
          </h2>

          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                billingCycle === 'MONTHLY'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                billingCycle === 'YEARLY'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">(Save 17%)</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {plans
              .filter(plan => {
                // Always hide Starter from upgrade options
                if (plan.tier === 'STARTER') return false
                // If subscription is cancelling, show all paid plans including current tier
                if (subscription?.cancel_at_period_end) return true
                // Otherwise hide current tier
                return plan.tier !== currentTier
              })
              .map(plan => (
                <div
                  key={plan.id}
                  className={`border rounded-xl p-4 ${
                    selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        plan.tier === 'PROFESSIONAL'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {plan.tier}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        billingCycle === 'YEARLY' ? plan.price_yearly : plan.price_monthly
                      )}
                    </span>
                    <span className="text-gray-500">
                      /{billingCycle === 'YEARLY' ? 'year' : 'month'}
                    </span>
                  </div>

                  <ul className="space-y-1 mb-4 text-sm text-gray-600">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan.id)
                      checkoutMutation.mutate({ planId: plan.id, billingCycle })
                    }}
                    disabled={checkoutMutation.isPending}
                    className={`w-full py-2 rounded-lg text-sm font-medium ${
                      plan.tier === 'PROFESSIONAL'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    } disabled:opacity-50`}
                  >
                    {checkoutMutation.isPending && selectedPlan === plan.id
                      ? 'Processing...'
                      : subscription?.cancel_at_period_end && plan.tier === currentTier
                      ? `Resubscribe to ${plan.name}`
                      : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              ))}
          </div>

          {checkoutMutation.isError && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {checkoutMutation.error.message}
            </p>
          )}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel Subscription?
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your subscription? You will continue to
              have access until{' '}
              {subscription ? formatDate(subscription.current_period_end) : 'the end of your billing period'}
              , then be downgraded to the Starter plan.
            </p>

            {cancelMutation.isError && (
              <p className="text-sm text-red-600 mb-4">
                {cancelMutation.error.message}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
