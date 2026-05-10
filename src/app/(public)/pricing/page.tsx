import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing & Plans',
  description: 'Simple, transparent pricing for South African businesses. Start free with our Starter plan and scale as you grow. No hidden fees, cancel anytime.',
}

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for freelancers and solo entrepreneurs just getting started.',
    features: [
      'Up to 50 transactions/month',
      'Basic expense tracking',
      'Income management',
      'Tax calculator access',
      'Single user',
      'Email support',
    ],
    cta: 'Get Started Free',
    href: '/register',
    featured: false,
  },
  {
    name: 'Professional',
    price: 'R299',
    period: '/month',
    description: 'For growing businesses that need more power and flexibility.',
    features: [
      'Unlimited transactions',
      'Advanced expense tracking',
      'Income & invoicing',
      'Vehicle logbook',
      'Asset management',
      'Financial reports & analytics',
      'CSV exports',
      'Up to 5 team members',
      'Priority email support',
    ],
    cta: 'Start 14-Day Trial',
    href: '/register',
    featured: true,
  },
  {
    name: 'Business',
    price: 'R599',
    period: '/month',
    description: 'For established businesses with advanced needs.',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Multi-company management',
      'Advanced reporting',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Phone support',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
]

const faqs = [
  {
    question: 'Is there really a free plan?',
    answer: 'Yes! Our Starter plan is completely free with no credit card required. It includes all the basics you need to manage your finances as a solo entrepreneur.',
  },
  {
    question: 'Can I change plans at any time?',
    answer: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at the end of your billing cycle.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use industry-standard encryption and security practices. Your data is stored securely in the cloud with regular backups. We never share your financial data with third parties.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Pay annually and get 2 months free. That\'s a 17% saving compared to monthly billing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, as well as EFT payments for annual subscriptions.',
  },
  {
    question: 'Is ProcessX SARS compliant?',
    answer: 'Yes. ProcessX is built specifically for South African businesses with SARS compliance in mind. Our reports and exports are formatted to meet SARS requirements.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Start free and scale as your business grows. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 ${
                  plan.featured
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600 ring-offset-2 scale-105'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold ${
                      plan.featured ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span
                      className={`text-4xl font-bold ${
                        plan.featured ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        className={`ml-1 text-base ${
                          plan.featured ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      plan.featured ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className={`h-5 w-5 flex-shrink-0 ${
                          plan.featured ? 'text-blue-200' : 'text-blue-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`text-sm ${
                          plan.featured ? 'text-blue-50' : 'text-gray-600'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    plan.featured
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Billing Banner */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Save 17% with annual billing - Get 2 months free!</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to simplify your bookkeeping?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Start your free trial today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
