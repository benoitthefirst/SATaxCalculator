import Link from 'next/link'
import { Metadata } from 'next'
import {
  getCategories,
  getPopularArticles,
  getFAQs,
  getHelpData,
  generateHelpCentreJsonLd,
  generateFAQJsonLd,
} from '@/lib/help'

export const metadata: Metadata = {
  title: 'Help Centre | ProcessX - Expense Tracking & Tax Compliance',
  description: 'Visit the ProcessX Help Centre for step-by-step guides, product tutorials, and answers to frequently asked questions about expense tracking, income management, and SARS tax compliance.',
  keywords: 'ProcessX help, expense tracking guide, SARS compliance, tax deductions, vehicle logbook, business expenses, South Africa tax',
  alternates: {
    canonical: 'https://processx.co.za/help',
  },
  openGraph: {
    title: 'ProcessX Help Centre',
    description: 'Find answers, learn best practices, and get the most out of ProcessX for your business finances.',
    url: 'https://processx.co.za/help',
    siteName: 'ProcessX',
    type: 'website',
    locale: 'en_ZA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProcessX Help Centre',
    description: 'Find answers, learn best practices, and get the most out of ProcessX.',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
}

// Icon component based on icon name
function CategoryIcon({ icon }: { icon: string }) {
  const iconClass = "w-6 h-6"

  switch (icon) {
    case 'zap':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'calculator':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    case 'dollar':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'car':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}

export default function HelpCentrePage() {
  const categories = getCategories()
  const popularArticles = getPopularArticles()
  const faqs = getFAQs()
  const helpData = getHelpData()
  const helpCentreJsonLd = generateHelpCentreJsonLd()
  const faqJsonLd = generateFAQJsonLd()

  return (
    <>
      {/* JSON-LD Structured Data for Help Centre */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(helpCentreJsonLd) }}
      />
      {/* JSON-LD Structured Data for FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-[#fbfbfd] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Help Centre
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
                Find answers, learn best practices, and get the most out of ProcessX
              </p>

              {/* Search Box */}
              <div className="mx-auto mt-10 max-w-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help..."
                    className="w-full rounded-full border border-gray-300 bg-white px-6 py-4 pl-14 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <svg
                    className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-12 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Popular Articles
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularArticles.map((article) => (
                <Link
                  key={article.id}
                  href={article.href}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <span>{article.title}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-10">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <Link href={`/help/${category.id}`} className="block">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                      <CategoryIcon icon={category.icon} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {category.description}
                    </p>
                  </Link>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={`/help/${category.id}/${article.id}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-[#fbfbfd]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-2xl bg-white border border-gray-200 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-6 text-left">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <svg
                      className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    <p>{faq.answer}</p>
                    {faq.relatedArticles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">Related articles:</p>
                        <div className="flex flex-wrap gap-2">
                          {faq.relatedArticles.map((articleId) => {
                            // Find the article across all categories
                            let articleHref = '#'
                            let articleTitle = articleId
                            for (const cat of categories) {
                              const found = cat.articles.find(a => a.id === articleId)
                              if (found) {
                                articleHref = `/help/${cat.id}/${articleId}`
                                articleTitle = found.title
                                break
                              }
                            }
                            return (
                              <Link
                                key={articleId}
                                href={articleHref}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                {articleTitle}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-gray-900 p-12 md:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-semibold text-white">
                    Still need help?
                  </h2>
                  <p className="mt-4 text-lg text-gray-400">
                    Our support team is here to assist you. Get in touch and we&apos;ll respond as soon as possible.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white hover:bg-blue-700 transition-all"
                  >
                    Contact Support
                  </Link>
                  <a
                    href={`mailto:${helpData.siteInfo.organization.email}`}
                    className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white hover:bg-white/20 transition-all text-center"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Topics for SEO */}
        <section className="py-12 bg-[#fbfbfd] border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              All Help Topics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <h3 className="font-medium text-gray-900 mb-2">
                    <Link href={`/help/${category.id}`} className="hover:text-blue-600">
                      {category.title}
                    </Link>
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {category.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={`/help/${category.id}/${article.id}`}
                          className="hover:text-blue-600"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
