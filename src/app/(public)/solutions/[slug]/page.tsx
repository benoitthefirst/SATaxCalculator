import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSolutionBySlug, getAllSolutionSlugs } from '@/content/solutions'
import SolutionPageClient from './SolutionPageClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSolutionSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    return {
      title: 'Solution Not Found | ProcessX',
    }
  }

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    keywords: solution.keywords.join(', '),
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      type: 'website',
    },
  }
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params
  const solution = getSolutionBySlug(slug)

  if (!solution) {
    notFound()
  }

  return <SolutionPageClient solution={solution} />
}
