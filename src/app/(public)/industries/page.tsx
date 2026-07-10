'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  HardHat,
  Store,
  Utensils,
  HeartPulse,
  Truck,
  Briefcase,
  ShoppingCart,
  Factory,
  Check,
} from 'lucide-react'
import { industries } from '@/content/industries'

const industryIcons: Record<string, React.ReactNode> = {
  'hardhat': <HardHat className="w-8 h-8" />,
  'store': <Store className="w-8 h-8" />,
  'utensils': <Utensils className="w-8 h-8" />,
  'heart-pulse': <HeartPulse className="w-8 h-8" />,
  'truck': <Truck className="w-8 h-8" />,
  'briefcase': <Briefcase className="w-8 h-8" />,
  'shopping-cart': <ShoppingCart className="w-8 h-8" />,
  'factory': <Factory className="w-8 h-8" />,
}

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#062C2E] py-24 overflow-hidden">
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
              <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-sm font-medium text-[#E8FF3F]">Industry Solutions</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Bookkeeping built for
              <br />
              <span className="text-[#E8FF3F]">your industry</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
            >
              Every industry has unique financial challenges. ProcessX adapts to your needs with
              industry-specific features, expense categories, and reporting.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={`/industries/${industry.slug}`}
                  className="block h-full p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#E8FF3F]/50 hover:shadow-xl transition-all group"
                >
                  <div className="h-14 w-14 rounded-2xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-5 group-hover:bg-[#E8FF3F]/20 transition-colors">
                    {industryIcons[industry.icon]}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#062C2E]">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {industry.subheadline}
                  </p>
                  <div className="flex items-center text-sm font-medium text-[#062C2E] group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ProcessX for Your Industry */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why businesses choose ProcessX
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features that work for any industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI Document Processing',
                description: 'Upload invoices, receipts, and bank statements. AI extracts all the data automatically.',
                icon: <Sparkles className="w-6 h-6" />,
              },
              {
                title: 'Industry Expense Categories',
                description: 'Pre-built expense categories designed for your industry\'s specific needs.',
                icon: <Store className="w-6 h-6" />,
              },
              {
                title: 'SARS Compliance',
                description: 'Generate tax-ready reports that meet South African tax requirements.',
                icon: <Check className="w-6 h-6" />,
              },
              {
                title: 'Real-Time Dashboard',
                description: 'See your financial health at a glance with live metrics and insights.',
                icon: <Factory className="w-6 h-6" />,
              },
              {
                title: 'Vehicle Logbook',
                description: 'Built-in digital logbook for SARS travel deduction claims.',
                icon: <Truck className="w-6 h-6" />,
              },
              {
                title: 'Asset Management',
                description: 'Track equipment and vehicles with automatic depreciation calculations.',
                icon: <Briefcase className="w-6 h-6" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-100"
              >
                <div className="h-12 w-12 rounded-xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#062C2E]">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to simplify your bookkeeping?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Join thousands of South African businesses using ProcessX
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-gray-600 px-8 py-4 text-base font-medium text-white hover:bg-white/5 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
