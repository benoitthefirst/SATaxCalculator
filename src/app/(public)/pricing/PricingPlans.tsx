'use client'

import { useState } from 'react'
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

interface PricingPlansProps {
  plans: Plan[]
  subscriptionsEnabled: boolean
}

export function PricingPlans({ plans, subscriptionsEnabled }: PricingPlansProps) {
  const [isYearly, setIsYearly] = useState(false)

  const getPrice = (plan: Plan) => {
    return isYearly ? plan.price_yearly : plan.price_monthly
  }

  const getPriceLabel = (plan: Plan) => {
    const price = getPrice(plan)
    if (price === 0) return 'Free'
    return `R${price.toLocaleString()}`
  }

  const getPeriodLabel = () => {
    return isYearly ? '/year' : '/month'
  }

  const getCtaUrl = (plan: Plan) => {
    if (plan.tier === 'STARTER') {
      return '/register'
    }
    if (!subscriptionsEnabled) {
      return '/register'
    }
    return `/subscription/checkout?plan=${plan.id}&cycle=${isYearly ? 'yearly' : 'monthly'}`
  }

  const getCtaLabel = (plan: Plan) => {
    if (plan.tier === 'STARTER') return 'Get Started Free'
    if (!subscriptionsEnabled) return 'Get Started'
    return 'Subscribe Now'
  }

  const isProfessional = (tier: string) => tier === 'PROFESSIONAL'

  return (
    <section className="py-16 -mt-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 ${
                isProfessional(plan.tier)
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-2'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {isProfessional(plan.tier) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-xl font-semibold ${
                    isProfessional(plan.tier) ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    isProfessional(plan.tier) ? 'text-blue-100' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={`text-4xl font-bold ${
                    isProfessional(plan.tier) ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {getPriceLabel(plan)}
                </span>
                {getPrice(plan) > 0 && (
                  <span
                    className={`text-sm ${
                      isProfessional(plan.tier) ? 'text-blue-100' : 'text-gray-600'
                    }`}
                  >
                    {getPeriodLabel()}
                  </span>
                )}
              </div>

              <Link
                href={getCtaUrl(plan)}
                className={`block w-full rounded-2xl py-3 px-4 text-center font-semibold transition-all ${
                  isProfessional(plan.tier)
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : plan.tier === 'STARTER'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {getCtaLabel(plan)}
              </Link>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className={`h-5 w-5 flex-shrink-0 ${
                        isProfessional(plan.tier) ? 'text-blue-200' : 'text-blue-600'
                      }`}
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
                    <span
                      className={`text-sm ${
                        isProfessional(plan.tier) ? 'text-blue-100' : 'text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need a custom solution for your enterprise?{' '}
            <Link href="/contact" className="text-blue-600 font-medium hover:underline">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
