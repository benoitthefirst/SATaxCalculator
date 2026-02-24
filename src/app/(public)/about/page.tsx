import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="py-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About ProcessX
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              We're on a mission to simplify bookkeeping for South African businesses,
              helping entrepreneurs focus on what they do best.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              ProcessX was born from a simple observation: South African small businesses
              struggle with complex bookkeeping software that's either too expensive,
              too complicated, or not designed for local needs.
            </p>
            <p>
              We started with a tax calculator to help business owners understand their
              SARS obligations. The response was overwhelming. Business owners told us
              they needed more - a simple way to track expenses, manage income, and stay
              compliant without the overhead of enterprise accounting software.
            </p>
            <p>
              Today, ProcessX is evolving into a comprehensive bookkeeping and CRM platform
              built specifically for South African businesses. We're combining the simplicity
              entrepreneurs need with the power accountants demand.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Simplicity First</h3>
              <p className="text-gray-600">
                We believe powerful software doesn't have to be complicated. Every feature
                is designed to be intuitive and easy to use.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trust & Security</h3>
              <p className="text-gray-600">
                Your financial data is precious. We use bank-level encryption and security
                to keep your information safe.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                We listen to our users and build features they actually need. Your feedback
                shapes our roadmap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Behind ProcessX
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                  T
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    The Process Enterprise
                  </h3>
                  <p className="text-gray-600 mb-4">
                    ProcessX is built by The Process Enterprise, a South African technology
                    company focused on creating tools that help businesses grow. We combine
                    deep understanding of local business needs with modern technology to
                    deliver solutions that actually work.
                  </p>
                  <a
                    href="https://theprocesse.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Visit The Process Enterprise
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100">South African Built</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">2025</div>
              <div className="text-blue-100">Tax Year Ready</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Cloud Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join us on this journey
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Be part of building better bookkeeping for South African businesses
          </p>
          <Link
            href="/register"
            className="inline-block rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
