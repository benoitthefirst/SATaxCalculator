'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  HelpCircle,
  Search,
  Zap,
  Calculator,
  DollarSign,
  BarChart3,
  Car,
  Settings,
  FileText,
  ChevronRight,
  ChevronDown,
  Mail,
  MessageSquare,
} from 'lucide-react'
import type { Category, FAQ, HelpData } from '@/lib/help'

interface PopularArticle {
  id: string
  categoryId: string
  title: string
  href: string
}

interface HelpPageClientProps {
  categories: Category[]
  popularArticles: PopularArticle[]
  faqs: FAQ[]
  helpData: HelpData
}

// Icon component based on icon name
function CategoryIcon({ icon }: { icon: string }) {
  const iconClass = "w-6 h-6"

  switch (icon) {
    case 'zap':
      return <Zap className={iconClass} />
    case 'calculator':
      return <Calculator className={iconClass} />
    case 'dollar':
      return <DollarSign className={iconClass} />
    case 'chart':
      return <BarChart3 className={iconClass} />
    case 'car':
      return <Car className={iconClass} />
    case 'settings':
      return <Settings className={iconClass} />
    default:
      return <FileText className={iconClass} />
  }
}

export default function HelpPageClient({
  categories,
  popularArticles,
  faqs,
  helpData,
}: HelpPageClientProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#062C2E] py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
            >
              <HelpCircle className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-sm font-medium text-[#E8FF3F]">Help Centre</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
            >
              How can we help you?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 max-w-xl text-lg text-gray-400"
            >
              Find answers, learn best practices, and get the most out of ProcessX
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 pl-14 text-white placeholder:text-gray-500 focus:border-[#E8FF3F]/50 focus:outline-none focus:ring-2 focus:ring-[#E8FF3F]/20"
                />
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
              Popular Articles
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={article.href}
                    className="inline-flex items-center gap-2 rounded-full bg-[#062C2E]/5 border border-[#062C2E]/10 px-4 py-2 text-sm text-[#062C2E] hover:bg-[#062C2E]/10 hover:border-[#E8FF3F]/30 transition-all"
                  >
                    <span>{article.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-10"
          >
            Browse by Category
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#E8FF3F]/50 hover:shadow-lg transition-all"
              >
                <Link href={`/help/${category.id}`} className="block">
                  <div className="h-12 w-12 rounded-xl bg-[#E8FF3F]/10 text-[#062C2E] flex items-center justify-center mb-4">
                    <CategoryIcon icon={category.icon} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-[#062C2E] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {category.description}
                  </p>
                </Link>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/help/${category.id}/${article.id}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#062C2E] transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#062C2E]/5 border border-[#062C2E]/10 px-4 py-2 mb-6">
              <HelpCircle className="w-4 h-4 text-[#062C2E]" />
              <span className="text-sm font-medium text-[#062C2E]">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group rounded-2xl bg-[#F8FAFC] border border-gray-100 overflow-hidden hover:border-[#E8FF3F]/50 transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 text-left">
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  <p>{faq.answer}</p>
                  {faq.relatedArticles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Related articles:</p>
                      <div className="flex flex-wrap gap-2">
                        {faq.relatedArticles.map((articleId) => {
                          // Find the article across all categories
                          let articleHref = '#'
                          let articleTitle = articleId
                          for (const cat of categories) {
                            const found = cat.articles.find(a => a.id === articleId)
                            if (found) {
                              articleHref = `/help/${cat.id}/${articleId}`
                              articleTitle = found.title
                              break
                            }
                          }
                          return (
                            <Link
                              key={articleId}
                              href={articleHref}
                              className="text-sm text-[#062C2E] hover:text-[#062C2E]/80 font-medium underline underline-offset-2"
                            >
                              {articleTitle}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-[#062C2E]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-[#081F22] to-[#062C2E] border border-white/10 p-12 md:p-16"
          >
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white">
                  Still need help?
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                  Our support team is here to assist you. Get in touch and we&apos;ll respond as soon as possible.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  Contact Support
                </Link>
                <a
                  href={`mailto:${helpData.siteInfo.organization.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Topics for SEO */}
      <section className="py-12 bg-[#F8FAFC] border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            All Help Topics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id}>
                <h3 className="font-medium text-gray-900 mb-2">
                  <Link href={`/help/${category.id}`} className="hover:text-[#062C2E]">
                    {category.title}
                  </Link>
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {category.articles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/help/${category.id}/${article.id}`}
                        className="hover:text-[#062C2E]"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
