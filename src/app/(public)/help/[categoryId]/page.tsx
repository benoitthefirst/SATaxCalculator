import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getCategoryById,
  getCategories,
  getHelpData,
} from '@/lib/help'

interface PageProps {
  params: Promise<{
    categoryId: string
  }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getCategories()
  return categories.map(category => ({
    categoryId: category.id,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId } = await params
  const category = getCategoryById(categoryId)
  const helpData = getHelpData()

  if (!category) {
    return {
      title: 'Category Not Found | ProcessX Help Centre',
    }
  }

  const canonicalUrl = `${helpData.siteInfo.url}/${categoryId}`

  return {
    title: `${category.title} | ProcessX Help Centre`,
    description: `${category.description}. Browse ${category.articles.length} helpful articles about ${category.title.toLowerCase()} in ProcessX.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.title} - ProcessX Help`,
      description: category.description,
      url: canonicalUrl,
      siteName: 'ProcessX Help Centre',
      type: 'website',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary',
      title: `${category.title} - ProcessX Help`,
      description: category.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
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

export default async function CategoryPage({ params }: PageProps) {
  const { categoryId } = await params
  const category = getCategoryById(categoryId)
  const allCategories = getCategories()

  if (!category) {
    notFound()
  }

  // Get other categories for the sidebar
  const otherCategories = allCategories.filter(c => c.id !== categoryId)

  // JSON-LD for collection page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category.title} - ProcessX Help`,
    'description': category.description,
    'url': `https://processx.co.za/help/${categoryId}`,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'ProcessX Help Centre',
      'url': 'https://processx.co.za/help',
    },
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': category.articles.length,
      'itemListElement': category.articles.map((article, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `https://processx.co.za/help/${categoryId}/${article.id}`,
        'name': article.title,
      })),
    },
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-[#fbfbfd] border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/help" className="text-gray-500 hover:text-gray-700">
                Help Centre
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{category.title}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-[#fbfbfd] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <CategoryIcon icon={category.icon} />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {category.title}
                </h1>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {category.articles.length} articles in this category
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Articles List */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Articles
                </h2>
                <div className="space-y-4">
                  {category.articles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/help/${categoryId}/${article.id}`}
                      className="block p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="mt-1 text-gray-500">
                            {article.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {article.keywords.slice(0, 3).map((keyword) => (
                              <span
                                key={keyword}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  {/* Other Categories */}
                  <div className="p-6 rounded-2xl bg-[#fbfbfd] border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                      Other Categories
                    </h3>
                    <ul className="space-y-3">
                      {otherCategories.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/help/${cat.id}`}
                            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-400 flex items-center justify-center">
                              <CategoryIcon icon={cat.icon} />
                            </div>
                            <span className="text-sm font-medium">{cat.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Need Help */}
                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Can&apos;t find what you need?
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Our support team is here to help.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Contact Support
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Help Centre */}
        <section className="py-8 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Help Centre
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
