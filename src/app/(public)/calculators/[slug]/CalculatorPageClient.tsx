'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calculator, Building2, Building, Wallet, Banknote, GraduationCap,
  BookOpen, FileText, ArrowRight, CheckCircle, HelpCircle,
  Percent, BadgePercent, Scale, Shield, Receipt, Calendar,
  TrendingDown, Search, Heart, PiggyBank, ArrowDown, ArrowUp,
  ListChecks, Layers, ListMinus, CheckSquare, GitBranch,
  FileSearch, AlertCircle, Sparkles
} from 'lucide-react'
import { Calculator as CalculatorType, calculators } from '@/content/calculators'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Calculator, Building2, Building, Wallet, Banknote, GraduationCap,
  BookOpen, FileText, Percent, BadgePercent, Scale, Shield,
  Receipt, Calendar, TrendingDown, Search, Heart, PiggyBank,
  ArrowDown, ArrowUp, ListChecks, Layers, ListMinus, CheckSquare,
  GitBranch, FileSearch, AlertCircle,
}

interface CalculatorPageClientProps {
  calculator: CalculatorType
}

export default function CalculatorPageClient({ calculator }: CalculatorPageClientProps) {
  const HeroIcon = iconMap[calculator.icon] || Calculator

  // Get other calculators for cross-linking
  const otherCalculators = calculators.filter(c => c.id !== calculator.id).slice(0, 3)

  // JSON-LD Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": calculator.name,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "ZAR"
    },
    "description": calculator.description,
    "author": {
      "@type": "Organization",
      "name": "ProcessX"
    }
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": calculator.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Hero Section */}
        <section className="relative bg-[#062C2E] py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#E8FF3F] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#E8FF3F] rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                All Calculators
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#E8FF3F]/20 rounded-2xl flex items-center justify-center">
                  <HeroIcon className="w-8 h-8 text-[#E8FF3F]" />
                </div>
                <span className="text-[#E8FF3F] font-medium">Free Tax Calculator</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {calculator.headline}
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-2xl">
                {calculator.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/calculators#calculator"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors"
                >
                  <Calculator className="mr-2 w-5 h-5" />
                  Use Calculator Now
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Try ProcessX Free
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What This Calculator Does
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {calculator.description}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {calculator.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Calculator

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#062C2E] rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-[#E8FF3F]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-[#E8FF3F]/20 border border-[#E8FF3F]/30 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#062C2E]" />
                <span className="text-[#062C2E] text-sm font-medium">Simple Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                How It Works
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Connection line */}
                <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-[#E8FF3F] hidden md:block" />

                <div className="space-y-8">
                  {calculator.howItWorks.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-6"
                    >
                      <div className="w-16 h-16 bg-[#062C2E] rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10">
                        <span className="text-2xl font-bold text-[#E8FF3F]">{step.step}</span>
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    Why Use Our Calculator
                  </h2>

                  <ul className="space-y-4">
                    {calculator.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-lg text-slate-700">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#062C2E] rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Need More Than a Calculator?
                  </h3>
                  <p className="text-white/80 mb-6">
                    ProcessX automates your entire bookkeeping, not just tax calculations.
                    Track expenses, manage invoices, and generate reports automatically.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-[#E8FF3F]" />
                      AI-powered document processing
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-[#E8FF3F]" />
                      Automatic VAT calculations
                    </li>
                    <li className="flex items-center gap-3 text-white/80">
                      <CheckCircle className="w-5 h-5 text-[#E8FF3F]" />
                      SARS-ready tax reports
                    </li>
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center w-full px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 mb-4">
                <HelpCircle className="w-4 h-4 text-slate-600" />
                <span className="text-slate-600 text-sm font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {calculator.faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Calculators */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Other Tax Calculators
              </h2>
              <p className="text-xl text-slate-600">
                Explore our full suite of free tax calculators.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {otherCalculators.map((calc, index) => {
                const IconComponent = iconMap[calc.icon] || Calculator

                return (
                  <motion.div
                    key={calc.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/calculators/${calc.slug}`}>
                      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 group h-full">
                        <div className="w-12 h-12 bg-[#062C2E] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E8FF3F] transition-colors">
                          <IconComponent className="w-6 h-6 text-[#E8FF3F] group-hover:text-[#062C2E] transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{calc.name}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2">{calc.subheadline}</p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 text-[#062C2E] font-semibold hover:underline"
              >
                View All Calculators
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#062C2E]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Simplify Your Tax?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of South African businesses using ProcessX to automate bookkeeping and tax compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/calculators#calculator"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors"
                >
                  <Calculator className="mr-2 w-5 h-5" />
                  Use Calculator
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Try ProcessX Free
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
