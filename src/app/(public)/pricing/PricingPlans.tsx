'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-1 rounded-full bg-[#062C2E]/5 border border-[#062C2E]/10 p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-[#062C2E] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly
                  ? 'bg-[#062C2E] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isYearly ? 'bg-[#E8FF3F] text-[#062C2E]' : 'bg-[#E8FF3F]/20 text-[#062C2E]'
              }`}>
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={`relative rounded-3xl p-6 flex flex-col ${
                isProfessional(plan.tier)
                  ? 'bg-[#062C2E] text-white ring-4 ring-[#E8FF3F] ring-offset-2'
                  : isEnterprise(plan.tier)
                  ? 'bg-gradient-to-br from-[#062C2E] to-[#081F22] text-white'
                  : 'bg-white border border-gray-200 hover:border-[#E8FF3F]/50 hover:shadow-lg transition-all'
              }`}
            >
              {isProfessional(plan.tier) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8FF3F] px-4 py-1.5 text-xs font-semibold text-[#062C2E]">
                    <Sparkles className="w-3 h-3" />
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
                    isProfessional(plan.tier) ? 'text-gray-300' : isEnterprise(plan.tier) ? 'text-gray-400' : 'text-gray-600'
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
                          isProfessional(plan.tier) ? 'text-gray-300' : 'text-gray-600'
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
                className={`block w-full rounded-full py-3 px-4 text-center font-semibold transition-all text-sm ${
                  isProfessional(plan.tier)
                    ? 'bg-[#E8FF3F] text-[#062C2E] hover:bg-[#d4eb38]'
                    : isEnterprise(plan.tier)
                    ? 'bg-white text-[#062C2E] hover:bg-gray-100'
                    : plan.tier === 'STARTER'
                    ? 'bg-[#062C2E] text-white hover:bg-[#081F22]'
                    : 'bg-[#062C2E] text-white hover:bg-[#081F22]'
                }`}
              >
                {getCtaLabel(plan)}
              </Link>

              <ul className="mt-6 space-y-3 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check
                      className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                        isProfessional(plan.tier)
                          ? 'text-[#E8FF3F]'
                          : isEnterprise(plan.tier)
                          ? 'text-[#E8FF3F]'
                          : 'text-[#062C2E]'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isProfessional(plan.tier) ? 'text-gray-300' : isEnterprise(plan.tier) ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Custom Solutions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600">
            Need help choosing the right plan?{' '}
            <Link href="/contact" className="text-[#062C2E] font-semibold hover:underline">
              Talk to our team
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
