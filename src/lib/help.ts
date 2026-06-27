import fs from 'fs'
import path from 'path'
import helpData from '@/content/help/index.json'

export interface Article {
  id: string
  title: string
  description: string
  keywords: string[]
  order: number
  categoryId?: string
  categoryTitle?: string
}

export interface Category {
  id: string
  title: string
  description: string
  icon: string
  order: number
  articles: Article[]
}

export interface FAQ {
  id: string
  question: string
  answer: string
  relatedArticles: string[]
}

export interface PopularArticle {
  id: string
  categoryId: string
  title: string
}

export interface HelpData {
  siteInfo: {
    name: string
    description: string
    url: string
    organization: {
      name: string
      url: string
      email: string
      country: string
    }
  }
  categories: Category[]
  popularArticles: PopularArticle[]
  faqs: FAQ[]
}

// Get all help data
export function getHelpData(): HelpData {
  return helpData as HelpData
}

// Get all categories
export function getCategories(): Category[] {
  return helpData.categories as Category[]
}

// Get a specific category by ID
export function getCategoryById(categoryId: string): Category | undefined {
  return (helpData.categories as Category[]).find(cat => cat.id === categoryId)
}

// Get article metadata from JSON
export function getArticleMetadata(categoryId: string, articleId: string): Article | undefined {
  const category = getCategoryById(categoryId)
  if (!category) return undefined

  const article = category.articles.find(a => a.id === articleId)
  if (!article) return undefined

  return {
    ...article,
    categoryId: category.id,
    categoryTitle: category.title,
  }
}

// Get article content from markdown file
export function getArticleContent(categoryId: string, articleId: string): string | null {
  const filePath = path.join(
    process.cwd(),
    'src/content/help/articles',
    categoryId,
    `${articleId}.md`
  )

  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

// Get all articles across all categories
export function getAllArticles(): (Article & { categoryId: string; categoryTitle: string })[] {
  const articles: (Article & { categoryId: string; categoryTitle: string })[] = []

  for (const category of helpData.categories as Category[]) {
    for (const article of category.articles) {
      articles.push({
        ...article,
        categoryId: category.id,
        categoryTitle: category.title,
      })
    }
  }

  return articles
}

// Get all article slugs for static generation
export function getAllArticleSlugs(): { categoryId: string; articleId: string }[] {
  const slugs: { categoryId: string; articleId: string }[] = []

  for (const category of helpData.categories as Category[]) {
    for (const article of category.articles) {
      slugs.push({
        categoryId: category.id,
        articleId: article.id,
      })
    }
  }

  return slugs
}

// Get popular articles with full data
export function getPopularArticles(): (PopularArticle & { href: string })[] {
  return (helpData.popularArticles as PopularArticle[]).map(article => ({
    ...article,
    href: `/help/${article.categoryId}/${article.id}`,
  }))
}

// Get FAQs
export function getFAQs(): FAQ[] {
  return helpData.faqs as FAQ[]
}

// Get related articles for an article
export function getRelatedArticles(categoryId: string, currentArticleId: string): Article[] {
  const category = getCategoryById(categoryId)
  if (!category) return []

  // Return other articles in the same category
  return category.articles
    .filter(a => a.id !== currentArticleId)
    .slice(0, 3)
    .map(a => ({
      ...a,
      categoryId: category.id,
      categoryTitle: category.title,
    }))
}

// Search articles (simple text search)
export function searchArticles(query: string): (Article & { categoryId: string; categoryTitle: string })[] {
  const normalizedQuery = query.toLowerCase()
  const allArticles = getAllArticles()

  return allArticles.filter(article => {
    const searchText = `${article.title} ${article.description} ${article.keywords.join(' ')}`.toLowerCase()
    return searchText.includes(normalizedQuery)
  })
}

// Generate sitemap data for help articles
export function getHelpSitemapData(): { url: string; lastModified: Date; priority: number }[] {
  const sitemapData: { url: string; lastModified: Date; priority: number }[] = []
  const baseUrl = helpData.siteInfo.url.replace('/help', '')

  // Main help page
  sitemapData.push({
    url: `${baseUrl}/help`,
    lastModified: new Date(),
    priority: 0.9,
  })

  // Category pages
  for (const category of helpData.categories as Category[]) {
    sitemapData.push({
      url: `${baseUrl}/help/${category.id}`,
      lastModified: new Date(),
      priority: 0.8,
    })

    // Article pages
    for (const article of category.articles) {
      sitemapData.push({
        url: `${baseUrl}/help/${category.id}/${article.id}`,
        lastModified: new Date(),
        priority: 0.7,
      })
    }
  }

  return sitemapData
}

// Generate JSON-LD structured data for an article
export function generateArticleJsonLd(categoryId: string, articleId: string): object | null {
  const article = getArticleMetadata(categoryId, articleId)
  if (!article) return null

  const siteInfo = helpData.siteInfo

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': article.title,
    'description': article.description,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteInfo.url}/${categoryId}/${articleId}`,
    },
    'author': {
      '@type': 'Organization',
      'name': siteInfo.organization.name,
      'url': siteInfo.organization.url,
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteInfo.organization.name,
      'url': siteInfo.organization.url,
    },
    'inLanguage': 'en-ZA',
    'isPartOf': {
      '@type': 'WebSite',
      'name': siteInfo.name,
      'url': siteInfo.url,
    },
  }
}

// Generate JSON-LD for FAQ page
export function generateFAQJsonLd(): object {
  const faqs = getFAQs()

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

// Generate JSON-LD for the help centre
export function generateHelpCentreJsonLd(): object {
  const siteInfo = helpData.siteInfo
  const categories = getCategories()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': siteInfo.name,
    'description': siteInfo.description,
    'url': siteInfo.url,
    'publisher': {
      '@type': 'Organization',
      'name': siteInfo.organization.name,
      'url': siteInfo.organization.url,
      'email': siteInfo.organization.email,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': siteInfo.organization.country,
      },
    },
    'hasPart': categories.map(category => ({
      '@type': 'CollectionPage',
      'name': category.title,
      'description': category.description,
      'url': `${siteInfo.url}/${category.id}`,
    })),
  }
}
