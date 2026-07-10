import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCalculatorBySlug, getAllCalculatorSlugs } from '@/content/calculators'
import CalculatorPageClient from './CalculatorPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCalculatorSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const calculator = getCalculatorBySlug(slug)

  if (!calculator) {
    return {
      title: 'Calculator Not Found | ProcessX',
    }
  }

  return {
    title: calculator.metaTitle,
    description: calculator.metaDescription,
    keywords: calculator.keywords.join(', '),
    openGraph: {
      title: calculator.metaTitle,
      description: calculator.metaDescription,
      type: 'website',
    },
  }
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params
  const calculator = getCalculatorBySlug(slug)

  if (!calculator) {
    notFound()
  }

  return <CalculatorPageClient calculator={calculator} />
}
