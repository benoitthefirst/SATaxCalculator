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

  const getCtaLabel = (plan: Plan) => {
    if (plan.tier === 'STARTER') return 'Get Started Free'
    if (plan.tier === 'ENTERPRISE') return 'Contact Sales'
    if (!subscriptionsEnabled) return 'Get Started'
    return 'Subscribe Now'
  }

  const getCtaUrl = (plan: Plan) => {
    if (plan.tier === 'STARTER') {
      return '/register'
    }
    if (plan.tier === 'ENTERPRISE') {
      return '/contact'
    }
    if (!subscriptionsEnabled) {
      return '/register'
    }
    return `/subscription/checkout?plan=${plan.id}&cycle=${isYearly ? 'yearly' : 'monthly'}`
  }

  const isProfessional = (tier: string) => tier === 'PROFESSIONAL'
  const isEnterprise = (tier: string) => tier === 'ENTERPRISE'

  return (
    <section className="py-16 -mt-12">
      <div className="mx-auto max-w-[1400px] px-6">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 flex flex-col ${
                isProfessional(plan.tier)
                  ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-2'
                  : isEnterprise(plan.tier)
                  ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
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
                  className={`text-lg font-semibold ${
                    isProfessional(plan.tier) || isEnterprise(plan.tier) ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    isProfessional(plan.tier) ? 'text-blue-100' : isEnterprise(plan.tier) ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                {isEnterprise(plan.tier) ? (
                  <span className="text-2xl font-bold text-white">Custom</span>
                ) : (
                  <>
                    <span
                      className={`text-3xl font-bold ${
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
                  </>
                )}
              </div>

              <Link
                href={getCtaUrl(plan)}
                className={`block w-full rounded-xl py-3 px-4 text-center font-semibold transition-all text-sm ${
                  isProfessional(plan.tier)
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : isEnterprise(plan.tier)
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : plan.tier === 'STARTER'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {getCtaLabel(plan)}
              </Link>

              <ul className="mt-6 space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                        isProfessional(plan.tier) ? 'text-blue-200' : isEnterprise(plan.tier) ? 'text-gray-400' : 'text-blue-600'
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
                      className={`text-xs ${
                        isProfessional(plan.tier) ? 'text-blue-100' : isEnterprise(plan.tier) ? 'text-gray-300' : 'text-gray-600'
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

        {/* Custom Solutions CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help choosing the right plan?{' '}
            <Link href="/contact" className="text-blue-600 font-medium hover:underline">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
