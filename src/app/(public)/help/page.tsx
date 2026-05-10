import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Centre',
  description: 'Visit the ProcessX Help Centre for step-by-step guides, product tutorials, and answers to frequently asked questions.',
}

const categories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of ProcessX',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    articles: [
      { title: 'Creating your account', href: '#' },
      { title: 'Setting up your business profile', href: '#' },
      { title: 'Adding your first expense', href: '#' },
      { title: 'Recording income', href: '#' },
      { title: 'Understanding the dashboard', href: '#' },
    ],
  },
  {
    title: 'Expenses',
    description: 'Track and manage business expenses',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    articles: [
      { title: 'Adding expenses', href: '#' },
      { title: 'Uploading receipts', href: '#' },
      { title: 'Managing expense categories', href: '#' },
      { title: 'Setting up recurring expenses', href: '#' },
      { title: 'Exporting expenses for SARS', href: '#' },
    ],
  },
  {
    title: 'Income',
    description: 'Record and track your revenue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    articles: [
      { title: 'Recording income', href: '#' },
      { title: 'Income categories', href: '#' },
      { title: 'Adding VAT to income', href: '#' },
      { title: 'Income analytics', href: '#' },
      { title: 'Client tracking', href: '#' },
    ],
  },
  {
    title: 'Reports & Tax',
    description: 'Generate reports and stay compliant',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    articles: [
      { title: 'Generating profit & loss reports', href: '#' },
      { title: 'Understanding tax computation', href: '#' },
      { title: 'Deduction summary reports', href: '#' },
      { title: 'Exporting for your accountant', href: '#' },
      { title: 'Tax year settings', href: '#' },
    ],
  },
  {
    title: 'Vehicle Logbook',
    description: 'Track business travel for SARS',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    articles: [
      { title: 'Setting up your vehicle', href: '#' },
      { title: 'Recording trips', href: '#' },
      { title: 'Business vs personal travel', href: '#' },
      { title: 'Calculating deductions', href: '#' },
      { title: 'Exporting logbook data', href: '#' },
    ],
  },
  {
    title: 'Account & Billing',
    description: 'Manage your account settings',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    articles: [
      { title: 'Updating your profile', href: '#' },
      { title: 'Changing your password', href: '#' },
      { title: 'Managing company settings', href: '#' },
      { title: 'Understanding your plan', href: '#' },
      { title: 'Upgrading your subscription', href: '#' },
    ],
  },
]

const popularArticles = [
  { title: 'How do I add my first expense?', category: 'Getting Started' },
  { title: 'What documents do I need for SARS?', category: 'Reports & Tax' },
  { title: 'How to calculate vehicle deductions', category: 'Vehicle Logbook' },
  { title: 'Understanding profit & loss reports', category: 'Reports & Tax' },
  { title: 'Setting up recurring expenses', category: 'Expenses' },
]

const faqs = [
  {
    question: 'Is ProcessX free to use?',
    answer: 'Yes! Our Starter plan is completely free with no credit card required. It includes essential features for freelancers and solo entrepreneurs. You can upgrade to Professional or Business plans as your needs grow.',
  },
  {
    question: 'Is ProcessX SARS compliant?',
    answer: 'Yes. ProcessX is built specifically for South African businesses with SARS compliance in mind. Our exports, reports, and record-keeping features are designed to meet SARS requirements for income tax, VAT, and travel allowances.',
  },
  {
    question: 'How secure is my data?',
    answer: 'We take security seriously. All data is encrypted in transit and at rest using industry-standard encryption. Your financial data is stored securely in the cloud with regular backups. We never share your data with third parties.',
  },
  {
    question: 'Can I use ProcessX on my phone?',
    answer: 'Yes! ProcessX is fully responsive and works great on mobile browsers. You can add expenses, upload receipts, and check your dashboard from anywhere.',
  },
  {
    question: 'How do I export my data for my accountant?',
    answer: 'Navigate to Reports and select the report you need (Expenses, Income, Profit & Loss, etc.). Click the Export button to download a CSV file that\'s ready to share with your accountant.',
  },
  {
    question: 'Can I manage multiple businesses?',
    answer: 'Yes, with our Business plan you can manage multiple companies from a single account. Switch between businesses easily and keep all your records organized.',
  },
]

export default function HelpCentrePage() {
  return (
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
                key={article.title}
                href="#"
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
                key={category.title}
                className="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article.title}>
                      <Link
                        href={article.href}
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
            {faqs.map((faq, index) => (
              <details
                key={index}
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
                  {faq.answer}
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
                  href="mailto:support@processx.co.za"
                  className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white hover:bg-white/20 transition-all text-center"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
