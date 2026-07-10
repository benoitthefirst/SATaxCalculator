import { MetadataRoute } from 'next'
import { getCategories } from '@/lib/help'
import { getAllIndustrySlugs } from '@/content/industries'
import { getAllSolutionSlugs } from '@/content/solutions'
import { getAllCalculatorSlugs } from '@/content/calculators'

const BASE_URL = 'https://www.processx.co.za'

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories()
  const industrySlugs = getAllIndustrySlugs()
  const solutionSlugs = getAllSolutionSlugs()
  const calculatorSlugs = getAllCalculatorSlugs()

  // Generate help centre URLs
  const helpCategoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/help/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const helpArticleUrls: MetadataRoute.Sitemap = categories.flatMap((category) =>
    category.articles.map((article) => ({
      url: `${BASE_URL}/help/${category.id}/${article.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  )

  // Generate industry page URLs
  const industryUrls: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${BASE_URL}/industries/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Generate solution page URLs
  const solutionUrls: MetadataRoute.Sitemap = solutionSlugs.map((slug) => ({
    url: `${BASE_URL}/solutions/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Generate calculator page URLs
  const calculatorUrls: MetadataRoute.Sitemap = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/calculators/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/industries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Help Centre categories and articles
    ...helpCategoryUrls,
    ...helpArticleUrls,
    // Industry pages
    ...industryUrls,
    // Solution pages
    ...solutionUrls,
    // Calculator landing pages
    ...calculatorUrls,
  ]
}
