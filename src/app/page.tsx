import { auth } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ProcessX | AI Bookkeeping Software that Works for You',
  description: 'ProcessX automatically extracts data from invoices, receipts, bank statements and payslips in under 60 seconds with 99% accuracy. Save time, reduce errors and stay SARS compliant.',
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

const heroStats = [
  {
    value: '10,000+',
    label: 'Documents Processed',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    value: '60',
    label: 'Average Processing Time',
    suffix: 'sec',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    value: '99%',
    label: 'AI Accuracy Rate',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    value: '100%',
    label: 'SARS Compliant',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    value: '30+',
    label: 'Hours Saved Monthly',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
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
    <div className="flex min-h-screen flex-col bg-[#062C2E]">
      <PublicHeader variant="dark" />
      <main className="flex-1">
        {/* Hero Section - Dark theme with lime accents - Full viewport height */}
        <section className="relative min-h-[calc(100vh-73px)] flex flex-col overflow-hidden bg-[#062C2E]">
          {/* Gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DFFB2D]/5 to-transparent" />

          {/* Main hero content - takes up available space */}
          <div className="relative flex-1 flex items-center mx-auto w-full max-w-7xl px-6 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
              {/* Left Column - Text Content (40%) */}
              <div className="lg:col-span-5">
                {/* SA Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-[#081F22] px-4 py-2 mb-8">
                  <span className="text-lg">🇿🇦</span>
                  <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">
                    Built for South African Businesses
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  AI Bookkeeping
                  <br />
                  Software that
                  <br />
                  <span className="text-[#DFFB2D]">Works for You.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-lg text-gray-400 leading-relaxed">
                  ProcessX automatically extracts data from invoices, receipts, bank statements and payslips in under{' '}
                  <span className="text-white font-semibold">60 seconds</span> with{' '}
                  <span className="text-white font-semibold">99% accuracy,</span> so you can save time, reduce errors and stay SARS compliant.
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  {session ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#DFFB2D] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#e8fc5a] transition-all"
                    >
                      Go to Dashboard
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#DFFB2D] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#e8fc5a] transition-all"
                      >
                        Start Free – It&apos;s Free Forever
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                      <Link
                        href="/features"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4B5563] bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/5 transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Watch 60 Second Demo
                      </Link>
                    </>
                  )}
                </div>

                {/* Social Proof */}
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex -space-x-2">
                    {['TM', 'ZN', 'PV', 'AM'].map((initials, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B5563] to-[#374151] border-2 border-[#062C2E] flex items-center justify-center text-xs font-medium text-white"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#DFFB2D]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      Trusted by <span className="text-white font-medium">100+ businesses</span>
                      <br />
                      across South Africa
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Dashboard Preview with Neon Glow (60%) */}
              <div className="relative lg:col-span-7">
                {/* Neon glow effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#DFFB2D]/20 via-[#22C55E]/20 to-[#DFFB2D]/20 rounded-2xl blur-xl opacity-75" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#DFFB2D]/30 to-[#22C55E]/30 rounded-2xl blur-md" />

                {/* Dashboard image container */}
                <div className="relative rounded-2xl overflow-hidden border border-[#DFFB2D]/20 shadow-2xl shadow-[#DFFB2D]/10">
                  <Image
                    src="/demo-dashboard.png"
                    alt="ProcessX Dashboard Preview"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>

                {/* AI Processing Complete Badge - Wider horizontal layout */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#081F22]/95 backdrop-blur-sm border border-[#DFFB2D]/20 rounded-2xl px-8 py-4 flex items-center gap-8 shadow-2xl shadow-black/50">
                  <div className="w-12 h-12 rounded-xl bg-[#DFFB2D]/10 border border-[#DFFB2D]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#DFFB2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-base font-semibold text-white whitespace-nowrap">AI Processing Complete</p>
                    <p className="text-sm text-[#4B5563] whitespace-nowrap">99% Accuracy • 60 Seconds</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar - Part of hero section, pinned to bottom */}
          <div className="relative bg-[#081F22] border-t border-[#062C2E]">
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
                {heroStats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-4 ${index < 4 ? 'md:border-r md:border-[#081F22] md:pr-4' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full border border-[#DFFB2D]/30 bg-[#DFFB2D]/5 flex items-center justify-center text-[#DFFB2D]">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                        {stat.suffix && <span className="text-base font-normal text-[#4B5563] ml-1">{stat.suffix}</span>}
                      </div>
                      <div className="text-xs text-[#4B5563]">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page with light theme */}
        <div className="bg-white">
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

          {/* Capabilities Section */}
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
          <section className="py-24 bg-[#062C2E]">
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Ready to simplify your bookkeeping?
                </h2>
                <p className="mt-4 text-lg text-[#4B5563]">
                  Join thousands of South African businesses already using ProcessX
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="rounded-full bg-[#DFFB2D] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#e8fc5a] transition-all"
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
                <p className="mt-6 text-sm text-[#4B5563]">
                  No credit card required. Free plan available forever.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
