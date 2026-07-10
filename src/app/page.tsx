import { auth } from '@/lib/auth'
import { Metadata } from 'next'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import {
  HeroSection,
  AIProcessingSection,
  DashboardPreviewSection,
  ExpenseManagementSection,
  SARSReportsSection,
  ComparisonSection,
  TestimonialsSection,
  CTASection,
} from '@/components/marketing'
import { metadata as homeMetadata } from '@/content/home'

export const metadata: Metadata = {
  title: homeMetadata.title,
  description: homeMetadata.description,
  keywords: homeMetadata.keywords,
  openGraph: {
    title: homeMetadata.title,
    description: homeMetadata.description,
    url: 'https://processx.co.za',
    siteName: 'ProcessX',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: homeMetadata.title,
    description: homeMetadata.description,
  },
}

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col bg-[#062C2E]">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection isLoggedIn={!!session} />

        {/* AI Processing Demo */}
        <AIProcessingSection />

        {/* Dashboard Preview */}
        <DashboardPreviewSection />

        {/* Expense Management */}
        <ExpenseManagementSection />

        {/* SARS Reports */}
        <SARSReportsSection />

        {/* AI vs Manual Comparison */}
        <ComparisonSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  )
}
