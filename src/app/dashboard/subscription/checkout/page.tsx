'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Plan {
  id: string
  name: string
  tier: string
  description: string | null
  price_monthly: number
  price_yearly: number
  features: string[]
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get('plan')
  const cycle = searchParams.get('cycle') || 'monthly'

  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlan() {
      if (!planId) {
        setError('No plan selected')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/plans')
        if (!response.ok) throw new Error('Failed to fetch plans')
        const data = await response.json()
        const selectedPlan = data.plans.find((p: Plan) => p.id === planId)
        if (!selectedPlan) {
          setError('Plan not found')
        } else {
          setPlan(selectedPlan)
        }
      } catch {
        setError('Failed to load plan details')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [planId])

  const handleCheckout = async () => {
    if (!plan) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle: cycle.toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription')
      }

      if (data.checkoutUrl && data.formData) {
        // Create a hidden form and submit to PayFast
        // IMPORTANT: Fields must be in exact order per PayFast requirements
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.checkoutUrl

        // PayFast requires fields in this exact order
        const fieldOrder = [
          'merchant_id',
          'merchant_key',
          'return_url',
          'cancel_url',
          'notify_url',
          'name_first',
          'name_last',
          'email_address',
          'm_payment_id',
          'amount',
          'item_name',
          'item_description',
          'custom_str1',
          'custom_str2',
          'custom_str3',
          'subscription_type',
          'billing_date',
          'recurring_amount',
          'frequency',
          'cycles',
          'signature',
        ]

        // Add form fields in the correct order
        for (const key of fieldOrder) {
          if (data.formData[key] !== undefined) {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = data.formData[key] as string
            form.appendChild(input)
          }
        }

        document.body.appendChild(form)
        form.submit()
      } else if (data.subscription) {
        // Free plan - already subscribed
        router.push('/dashboard/subscription/success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const price = plan ? (cycle === 'yearly' ? plan.price_yearly : plan.price_monthly) : 0
  const billingLabel = cycle === 'yearly' ? 'per year' : 'per month'

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !plan) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">Please select a plan from our pricing page.</p>
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Plans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="mb-8">
        <Link href="/pricing" className="text-sm text-blue-600 hover:text-blue-700">
          &larr; Back to pricing
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Complete your subscription</h1>
          <p className="text-gray-600 mt-1">You&apos;re subscribing to the {plan?.name} plan</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Plan Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan?.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan?.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  R{price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{billingLabel}</p>
              </div>
            </div>

            {cycle === 'yearly' && plan && plan.price_monthly > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-green-600">
                  You save R{((plan.price_monthly * 12) - plan.price_yearly).toLocaleString()} per year with annual billing
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">What&apos;s included:</h4>
            <ul className="space-y-2">
              {plan?.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : price === 0 ? (
              'Activate Free Plan'
            ) : (
              `Pay R${price.toLocaleString()} with PayFast`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            {price > 0 && ' You will be redirected to PayFast to complete payment.'}
          </p>
        </div>
      </div>
    </div>
  )
}
