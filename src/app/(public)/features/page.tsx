import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features - ProcessX Dashboard',
  description: 'Manage and keep track of your sales, transactions, expenses, and more on ProcessX. Powerful analytics, streamlined tracking, and SARS-compliant reports.',
}

const mainFeatures = [
  {
    title: 'Smart Dashboard',
    description: 'Get a bird\'s eye view of your entire business. Real-time metrics, beautiful charts, and actionable insights all in one place.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    features: [
      'Real-time financial overview',
      'Income vs expense tracking',
      'Monthly/yearly comparisons',
      'Quick action shortcuts',
      'Tax year progress tracking',
    ],
    color: 'blue',
  },
  {
    title: 'Expense Tracking',
    description: 'Never lose track of a business expense again. Upload receipts, categorize spending, and track recurring costs automatically.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    features: [
      'Receipt photo uploads',
      'Expense categories & tags',
      'Recurring expense automation',
      'VAT tracking support',
      'CSV export for SARS',
    ],
    color: 'orange',
  },
  {
    title: 'Income Management',
    description: 'Track every rand that comes into your business. Multiple income streams, client tracking, and payment monitoring made simple.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    features: [
      'Multiple income categories',
      'Client/source tracking',
      'Payment date monitoring',
      'Income analytics',
      'VAT on income support',
    ],
    color: 'green',
  },
]

const additionalFeatures = [
  {
    title: 'Vehicle Logbook',
    description: 'Track business vs personal travel for SARS compliance. Calculate allowable deductions automatically.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Asset Management',
    description: 'Track business assets with automatic depreciation calculations for tax deductions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Financial Reports',
    description: 'Generate comprehensive profit & loss statements, tax summaries, and deduction reports.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Tax Computation',
    description: 'Built-in tax calculators with 2025/26 tax brackets. See your tax liability in real-time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'CSV Exports',
    description: 'Export all your data in SARS-compatible formats. Ready for your accountant.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Multi-Company',
    description: 'Manage multiple businesses from one account. Perfect for serial entrepreneurs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
]

const comparisonTable = [
  { feature: 'Expense Tracking', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Income Management', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Tax Calculator', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Monthly Transactions', starter: '50', basic: '200', professional: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Vehicle Logbook', starter: false, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Asset Management', starter: false, basic: false, professional: true, business: true, enterprise: true },
  { feature: 'AI Document Analyzer', starter: false, basic: '25/mo', professional: '100/mo', business: '500/mo', enterprise: 'Unlimited' },
  { feature: 'Financial Reports', starter: 'Basic', basic: 'Basic', professional: 'Full', business: 'Advanced', enterprise: 'Advanced' },
  { feature: 'CSV Exports', starter: false, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Team Members', starter: '1', basic: '2', professional: '5', business: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Multi-Company', starter: false, basic: false, professional: false, business: true, enterprise: true },
  { feature: 'API Access', starter: false, basic: false, professional: false, business: true, enterprise: true },
  { feature: 'Priority Support', starter: false, basic: false, professional: true, business: true, enterprise: true },
  { feature: 'Dedicated Account Manager', starter: false, basic: false, professional: false, business: false, enterprise: true },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#fbfbfd] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Everything you need to run your business
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Powerful features designed for South African entrepreneurs. From expense tracking to tax compliance, ProcessX has you covered.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto rounded-full bg-gray-100 px-8 py-4 text-base font-medium text-gray-900 hover:bg-gray-200 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className={`flex flex-col gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
              >
                <div className="flex-1 max-w-xl">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6 ${
                    feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    feature.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-xl">
                  <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-lg">
                    <div className="rounded-xl bg-white aspect-[4/3] flex items-center justify-center">
                      <div className={`h-20 w-20 rounded-2xl flex items-center justify-center ${
                        feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        feature.color === 'green' ? 'bg-green-100 text-green-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-[#fbfbfd]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900">
              And so much more
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Every tool you need to stay organized and compliant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900">
              Compare plans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find the perfect plan for your business needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 text-left text-sm font-semibold text-gray-900 min-w-[180px]">Feature</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900 min-w-[100px]">Starter</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900 min-w-[100px]">Basic</th>
                  <th className="py-4 text-center text-sm font-semibold text-blue-600 min-w-[100px]">Professional</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900 min-w-[100px]">Business</th>
                  <th className="py-4 text-center text-sm font-semibold text-gray-900 min-w-[100px]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-4 px-4 text-sm text-gray-900">{row.feature}</td>
                    <td className="py-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.basic}</span>
                      )}
                    </td>
                    <td className="py-4 text-center bg-blue-50/50">
                      {typeof row.professional === 'boolean' ? (
                        row.professional ? (
                          <svg className="w-5 h-5 text-blue-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-sm font-medium text-blue-600">{row.professional}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.business}</span>
                      )}
                    </td>
                    <td className="py-4 text-center bg-gray-900/5">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <svg className="w-5 h-5 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              View full pricing details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Join thousands of South African businesses already using ProcessX
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white hover:bg-white/20 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
