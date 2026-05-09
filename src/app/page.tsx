import { auth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

const testimonials = [
  {
    quote: "ProcessX has completely transformed how I manage my freelance finances. Tax season is no longer stressful!",
    author: "Thabo Molefe",
    role: "Freelance Developer",
    location: "Johannesburg",
  },
  {
    quote: "Finally, a bookkeeping tool that understands South African tax requirements. The SARS compliance features are invaluable.",
    author: "Zanele Nkosi",
    role: "Small Business Owner",
    location: "Cape Town",
  },
  {
    quote: "The vehicle logbook feature alone saves me hours every month. Highly recommend for any business owner with company vehicles.",
    author: "Pieter van der Berg",
    role: "Transport Company Owner",
    location: "Pretoria",
  },
]

const stats = [
  { value: '10,000+', label: 'Active Users' },
  { value: 'R500M+', label: 'Transactions Tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
]

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                Built for South African Businesses
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Bookkeeping Made{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                Track expenses, manage income, and stay tax-compliant. Built specifically for South African businesses with SARS compliance in mind.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      href="/calculators"
                      className="w-full sm:w-auto rounded-2xl border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 hover:border-gray-400 transition-all"
                    >
                      Try Tax Calculator
                    </Link>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required. Free plan available.
              </p>
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-300 opacity-20 blur-3xl" />
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything you need to manage your business finances
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Powerful features designed for South African businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expense Tracking</h3>
                <p className="text-gray-600">
                  Track all your business expenses with receipt uploads, categories, and recurring expenses.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Income Management</h3>
                <p className="text-gray-600">
                  Track all income sources, manage invoices, and monitor cash flow in real-time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Reports</h3>
                <p className="text-gray-600">
                  Generate comprehensive reports including profit/loss, expense analytics, and tax summaries.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">SARS Tax Compliance</h3>
                <p className="text-gray-600">
                  Built-in tax calculators and compliance tools for the 2025/26 tax year with VAT support.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Logbook</h3>
                <p className="text-gray-600">
                  Track business vs personal travel for SARS compliance with automatic deduction calculations.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Asset Management</h3>
                <p className="text-gray-600">
                  Track business assets with automatic depreciation calculations for tax deductions.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                View all features and pricing
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Get started in minutes
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Simple setup, powerful results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up in under a minute. No credit card required for the free plan.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Up Your Business</h3>
                <p className="text-gray-600">
                  Add your company details, VAT registration, and configure your tax settings.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Tracking</h3>
                <p className="text-gray-600">
                  Add income, expenses, and let ProcessX handle the rest. Reports generate automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Trusted by South African businesses
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                See what our users are saying
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 rounded-3xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} &middot; {testimonial.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tax Calculator Promo */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-12 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Free SARS Tax Calculator
              </h2>
              <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
                Calculate your South African income tax instantly. Works for both salaried employees and business owners. Updated for the 2025/26 tax year.
              </p>
              <div className="mt-8">
                <Link
                  href="/calculators"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-green-600 shadow-lg hover:bg-green-50 transition-all inline-block"
                >
                  Try Free Tax Calculator
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to simplify your bookkeeping?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of South African businesses already using ProcessX
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-all hover:scale-105 inline-block"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-2xl border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all inline-block"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
