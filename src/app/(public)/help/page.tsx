import { Metadata } from 'next'
import {
  getCategories,
  getPopularArticles,
  getFAQs,
  getHelpData,
  generateHelpCentreJsonLd,
  generateFAQJsonLd,
} from '@/lib/help'
import HelpPageClient from './HelpPageClient'

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

      <HelpPageClient
        categories={categories}
        popularArticles={popularArticles}
        faqs={faqs}
        helpData={helpData}
      />
    </>
  )
}
