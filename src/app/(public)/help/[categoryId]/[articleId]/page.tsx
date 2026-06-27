import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getArticleMetadata,
  getArticleContent,
  getAllArticleSlugs,
  getCategoryById,
  getRelatedArticles,
  generateArticleJsonLd,
  getHelpData,
} from '@/lib/help'

interface PageProps {
  params: Promise<{
    categoryId: string
    articleId: string
  }>
}

// Generate static params for all articles
export async function generateStaticParams() {
  return getAllArticleSlugs()
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoryId, articleId } = await params
  const article = getArticleMetadata(categoryId, articleId)
  const helpData = getHelpData()

  if (!article) {
    return {
      title: 'Article Not Found | ProcessX Help Centre',
    }
  }

  const canonicalUrl = `${helpData.siteInfo.url}/${categoryId}/${articleId}`

  return {
    title: `${article.title} | ${article.categoryTitle} | ProcessX Help`,
    description: article.description,
    keywords: article.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonicalUrl,
      siteName: 'ProcessX Help Centre',
      type: 'article',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.description,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  }
}

// Simple markdown to HTML converter (basic implementation)
function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-900 mt-8 mb-3">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mt-10 mb-4">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-6">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm"><code>$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-800">$1</code>')

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg text-gray-700">$1</blockquote>')

  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim())
    if (cells.every(c => /^[-:\s]+$/.test(c))) {
      return '' // Skip separator row
    }
    const isHeader = cells.some(c => c.includes('**'))
    const cellTag = isHeader ? 'th' : 'td'
    const cellClass = isHeader
      ? 'px-4 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50'
      : 'px-4 py-3 text-sm text-gray-700 border-t border-gray-200'
    const row = cells.map(c => `<${cellTag} class="${cellClass}">${c.trim().replace(/\*\*/g, '')}</${cellTag}>`).join('')
    return `<tr>${row}</tr>`
  })

  // Wrap tables - use RegExp constructor for the 's' flag
  html = html.replace(new RegExp('(<tr>.*<\\/tr>\\s*)+', 'gs'), (match) => {
    return `<div class="overflow-x-auto my-6"><table class="min-w-full border border-gray-200 rounded-lg overflow-hidden">${match}</table></div>`
  })

  // Links - internal links to /help/
  html = html.replace(/\[([^\]]+)\]\(\/help\/([^)]+)\)/g, '<a href="/help/$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  // Links - external
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  // Links - other internal
  html = html.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, '<a href="/$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')

  // Unordered lists
  html = html.replace(/^\- \[x\] (.*$)/gim, '<li class="flex items-start gap-2 ml-4"><span class="text-green-500">&#10003;</span> $1</li>')
  html = html.replace(/^\- \[ \] (.*$)/gim, '<li class="flex items-start gap-2 ml-4"><span class="text-gray-400">&#9744;</span> $1</li>')
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')
  html = html.replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc space-y-2 my-4 ml-4">$&</ul>')

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 text-gray-700">$1</li>')

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-8 border-t border-gray-200" />')

  // Paragraphs
  html = html.replace(/^(?!<[a-z])(.*$)/gim, (match) => {
    if (match.trim() && !match.startsWith('<')) {
      return `<p class="text-gray-700 leading-relaxed my-4">${match}</p>`
    }
    return match
  })

  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*"><\/p>/g, '')
  html = html.replace(/<p class="[^"]*">\s*<\/p>/g, '')

  return html
}

export default async function ArticlePage({ params }: PageProps) {
  const { categoryId, articleId } = await params
  const article = getArticleMetadata(categoryId, articleId)
  const category = getCategoryById(categoryId)
  const content = getArticleContent(categoryId, articleId)
  const relatedArticles = getRelatedArticles(categoryId, articleId)
  const jsonLd = generateArticleJsonLd(categoryId, articleId)

  if (!article || !category || !content) {
    notFound()
  }

  const htmlContent = markdownToHtml(content)

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
          <div className="mx-auto max-w-4xl px-6 py-4">
            <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/help" className="text-gray-500 hover:text-gray-700">
                Help Centre
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/help/${categoryId}`} className="text-gray-500 hover:text-gray-700">
                {category.title}
              </Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{article.title}</span>
            </nav>
          </div>
        </div>

        {/* Article Content */}
        <article className="mx-auto max-w-4xl px-6 py-12">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {category.title}
              </span>
            </div>
            <p className="text-lg text-gray-600">{article.description}</p>
          </header>

          {/* Article Body */}
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Keywords for AI/SEO */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Topics covered:</p>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/help/${categoryId}/${related.id}`}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">{related.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{related.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Category */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/help/${categoryId}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {category.title}
            </Link>
          </div>
        </article>

        {/* Help CTA */}
        <section className="bg-[#fbfbfd] py-12 border-t border-gray-200">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Need more help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is ready to assist you.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Browse All Articles
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
