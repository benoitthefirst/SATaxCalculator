import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { industries, getIndustryBySlug, getAllIndustrySlugs } from '@/content/industries'
import IndustryPageClient from './IndustryPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)

  if (!industry) {
    return {
      title: 'Industry Not Found | ProcessX',
    }
  }

  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    keywords: industry.keywords.join(', '),
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `https://processx.co.za/industries/${slug}`,
      siteName: 'ProcessX',
      type: 'website',
      locale: 'en_ZA',
    },
    twitter: {
      card: 'summary_large_image',
      title: industry.metaTitle,
      description: industry.metaDescription,
    },
    alternates: {
      canonical: `https://processx.co.za/industries/${slug}`,
    },
  }
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)

  if (!industry) {
    notFound()
  }

  // Get other industries for the "Other Industries" section
  const otherIndustries = industries.filter(i => i.slug !== slug).slice(0, 4)

  return <IndustryPageClient industry={industry} otherIndustries={otherIndustries} />
}
