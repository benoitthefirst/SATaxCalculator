import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

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
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Bookkeeping Made{' '}
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
                Track expenses, manage income, and stay tax-compliant. Built specifically for South African businesses.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105"
                  >
                    Get Started Free
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-200 opacity-20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-300 opacity-20 blur-3xl" />
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
                  Track all income sources and generate invoices for your clients.
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
                  Generate comprehensive reports and analytics to understand your business performance.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax Compliance</h3>
                <p className="text-gray-600">
                  Built-in SARS tax calculators and compliance tools for the 2025/26 tax year.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">
                  Invite team members with role-based access control and permissions.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-3xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud-Based</h3>
                <p className="text-gray-600">
                  Access your financial data anywhere, anytime with secure cloud storage.
                </p>
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
                Join South African businesses already using ProcessX
              </p>
              <div className="mt-10">
                <Link
                  href="/register"
                  className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg hover:bg-gray-50 transition-all hover:scale-105 inline-block"
                >
                  Start Free Trial
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
