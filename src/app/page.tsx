import { auth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ProcessX | Bookkeeping Made Simple, Business Made Easy',
  description: 'Grow your small business with ProcessX. Simple bookkeeping, expense tracking, SARS-compliant tax tools, and free business reports. Start free today.',
}

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics & Insights',
    description: 'Track your business growth with detailed analytics, performance metrics, and real-time dashboards.',
    color: 'blue',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Streamlined Tracking',
    description: 'Keep track of all your business activities on one platform. Expenses, income, assets, and more.',
    color: 'green',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Income & Expenses',
    description: 'Monitor your cash flow as it happens and get a detailed view of your financial history.',
    color: 'purple',
  },
]

const capabilities = [
  {
    title: 'Smart Dashboard',
    description: 'Get a complete overview of your business finances at a glance. Track income, expenses, and profit in real-time with beautiful visualizations.',
    image: '/dashboard-preview.png',
    features: ['Real-time financial overview', 'Interactive charts & graphs', 'Quick action shortcuts'],
  },
  {
    title: 'Expense Management',
    description: 'Never lose track of a receipt again. Upload photos, categorize expenses, and let ProcessX handle the organization.',
    image: '/expenses-preview.png',
    features: ['Receipt photo uploads', 'Automatic categorization', 'Recurring expense tracking'],
  },
  {
    title: 'Tax-Ready Reports',
    description: 'Generate SARS-compliant reports with one click. Profit & loss statements, tax summaries, and deduction reports ready for your accountant.',
    image: '/reports-preview.png',
    features: ['SARS-compliant exports', 'Profit & loss statements', 'Tax computation reports'],
  },
]

const testimonials = [
  {
    quote: "ProcessX has completely transformed how I manage my freelance finances. Tax season is no longer stressful!",
    author: "Thabo Molefe",
    role: "Freelance Developer",
    location: "Johannesburg",
    avatar: "TM",
  },
  {
    quote: "Finally, a bookkeeping tool that understands South African tax requirements. The SARS compliance features are invaluable.",
    author: "Zanele Nkosi",
    role: "Small Business Owner",
    location: "Cape Town",
    avatar: "ZN",
  },
  {
    quote: "The vehicle logbook feature alone saves me hours every month. Highly recommend for any business owner with company vehicles.",
    author: "Pieter van der Berg",
    role: "Transport Company Owner",
    location: "Pretoria",
    avatar: "PV",
  },
]

const stats = [
  { value: '2x', label: 'More Productive' },
  { value: '15 - 40hrs', label: 'Saved Monthly' },
  { value: '100%', label: 'SARS Compliant' },
  { value: 'Free', label: 'To Get Started' },
]

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in under a minute. No credit card required for the free plan.',
  },
  {
    number: '02',
    title: 'Set Up Your Business',
    description: 'Add your company details, VAT registration, and configure your preferences.',
  },
  {
    number: '03',
    title: 'Start Tracking',
    description: 'Add income and expenses. ProcessX handles calculations and reports automatically.',
  },
]

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section - Apple-inspired minimal design */}
        <section className="relative overflow-hidden bg-[#fbfbfd]">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 text-sm font-medium tracking-wide text-blue-600 uppercase">
                Built for South African Businesses
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Bookkeeping Made Simple.
                <br />
                <span className="text-gray-500">Business Made Easy.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
                Take the hassle out of managing your business. Track expenses, manage income,
                and stay SARS-compliant with tools designed for South African entrepreneurs.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="w-full sm:w-auto rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-blue-700 transition-all"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      href="/features"
                      className="w-full sm:w-auto rounded-full bg-gray-100 px-8 py-4 text-base font-medium text-gray-900 hover:bg-gray-200 transition-all"
                    >
                      Explore Features
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto max-w-6xl px-6 pb-20">
            <div className="relative rounded-2xl bg-gradient-to-b from-gray-100 to-gray-200 p-2 shadow-2xl">
              <div className="rounded-xl bg-white overflow-hidden">
                <div className="h-8 bg-gray-100 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100 mb-6">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">Your Dashboard Awaits</p>
                    <p className="mt-2 text-gray-500">Sign up to see your personalized business dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Banner */}
        <section className="bg-blue-600 py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="flex -space-x-2">
                {['TM', 'ZN', 'PV', 'AM'].map((initials, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-blue-500 border-2 border-blue-600 flex items-center justify-center text-xs font-medium text-white">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-white text-lg">
                <span className="font-semibold">85% of ProcessX users</span> say it takes the stress out of managing their business finances
              </p>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                Go all the way with ProcessX
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to manage your business finances in one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${
                    feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    feature.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section - Apple-style alternating layout */}
        <section className="py-24 bg-[#fbfbfd]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                Powerful features, simple experience
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Designed with the complexity of business in mind, built for simplicity
              </p>
            </div>

            <div className="space-y-32">
              {capabilities.map((cap, index) => (
                <div
                  key={cap.title}
                  className={`flex flex-col gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  <div className="flex-1 max-w-xl">
                    <h3 className="text-2xl font-semibold text-gray-900 sm:text-3xl mb-4">
                      {cap.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {cap.description}
                    </p>
                    <ul className="space-y-3">
                      {cap.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-gray-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 p-4 shadow-lg">
                      <div className="rounded-xl bg-white aspect-[4/3] flex items-center justify-center">
                        <div className="text-center px-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm">{cap.title} Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                Get started in minutes
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Three simple steps to financial clarity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white text-xl font-semibold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
              >
                Start your free account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-[#fbfbfd]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
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
                  className="p-8 rounded-3xl bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tax Calculator Promo */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 p-12 md:p-16">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Free SARS Tax Calculator
                </h2>
                <p className="mt-4 text-lg text-green-100">
                  Calculate your South African income tax instantly. Updated for the 2025/26 tax year.
                  Works for both salaried employees and business owners.
                </p>
                <div className="mt-8">
                  <Link
                    href="/calculators"
                    className="inline-block rounded-full bg-white px-8 py-4 text-base font-medium text-green-600 shadow-sm hover:bg-green-50 transition-all"
                  >
                    Try Free Calculator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gray-900">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Ready to simplify your bookkeeping?
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
                  href="/pricing"
                  className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white hover:bg-white/20 transition-all"
                >
                  View Pricing
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                No credit card required. Free plan available forever.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  )
}
