'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Check,
  HardHat,
  Store,
  Utensils,
  HeartPulse,
  Truck,
  Briefcase,
  ShoppingCart,
  Factory,
  Folder,
  Cpu,
  TrendingUp,
  FileText,
  Calculator,
  Tag,
  CheckCircle,
  Camera,
  PieChart,
  DollarSign,
  Users,
  Wallet,
  Shield,
  Book,
  Fuel,
  Globe,
  Percent,
  BarChart,
  Package,
  Settings,
  Cog,
  Quote,
} from 'lucide-react'
import type { Industry } from '@/content/industries'

const industryIcons: Record<string, React.ReactNode> = {
  'hardhat': <HardHat className="w-10 h-10" />,
  'store': <Store className="w-10 h-10" />,
  'utensils': <Utensils className="w-10 h-10" />,
  'heart-pulse': <HeartPulse className="w-10 h-10" />,
  'truck': <Truck className="w-10 h-10" />,
  'briefcase': <Briefcase className="w-10 h-10" />,
  'shopping-cart': <ShoppingCart className="w-10 h-10" />,
  'factory': <Factory className="w-10 h-10" />,
}

const industryIconsSmall: Record<string, React.ReactNode> = {
  'hardhat': <HardHat className="w-6 h-6" />,
  'store': <Store className="w-6 h-6" />,
  'utensils': <Utensils className="w-6 h-6" />,
  'heart-pulse': <HeartPulse className="w-6 h-6" />,
  'truck': <Truck className="w-6 h-6" />,
  'briefcase': <Briefcase className="w-6 h-6" />,
  'shopping-cart': <ShoppingCart className="w-6 h-6" />,
  'factory': <Factory className="w-6 h-6" />,
}

const solutionIcons: Record<string, React.ReactNode> = {
  'folder': <Folder className="w-6 h-6" />,
  'cpu': <Cpu className="w-6 h-6" />,
  'truck': <Truck className="w-6 h-6" />,
  'trending-up': <TrendingUp className="w-6 h-6" />,
  'file-text': <FileText className="w-6 h-6" />,
  'calculator': <Calculator className="w-6 h-6" />,
  'tag': <Tag className="w-6 h-6" />,
  'check-circle': <CheckCircle className="w-6 h-6" />,
  'camera': <Camera className="w-6 h-6" />,
  'pie-chart': <PieChart className="w-6 h-6" />,
  'dollar-sign': <DollarSign className="w-6 h-6" />,
  'users': <Users className="w-6 h-6" />,
  'wallet': <Wallet className="w-6 h-6" />,
  'shield': <Shield className="w-6 h-6" />,
  'book': <Book className="w-6 h-6" />,
  'fuel': <Fuel className="w-6 h-6" />,
  'receipt': <FileText className="w-6 h-6" />,
  'bar-chart': <BarChart className="w-6 h-6" />,
  'sparkles': <Sparkles className="w-6 h-6" />,
  'globe': <Globe className="w-6 h-6" />,
  'percent': <Percent className="w-6 h-6" />,
  'package': <Package className="w-6 h-6" />,
  'settings': <Settings className="w-6 h-6" />,
  'cog': <Cog className="w-6 h-6" />,
}

interface IndustryPageClientProps {
  industry: Industry
  otherIndustries: Industry[]
}

export default function IndustryPageClient({ industry, otherIndustries }: IndustryPageClientProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#062C2E] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
              >
                {industryIconsSmall[industry.icon]}
                <span className="text-sm font-medium text-[#E8FF3F]">{industry.name}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              >
                {industry.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-xl text-[#E8FF3F]"
              >
                {industry.subheadline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 text-lg text-gray-400"
              >
                {industry.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-gray-600 px-8 py-4 text-base font-medium text-white hover:bg-white/5 transition-all"
                >
                  View Pricing
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-4"
            >
              {industry.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-[#081F22] border border-[#E8FF3F]/10 rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold text-[#E8FF3F]">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Common {industry.name.toLowerCase()} bookkeeping challenges
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We understand the unique financial complexities of your industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#062C2E]" />
              <span className="text-sm font-medium text-[#062C2E]">ProcessX Solutions</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How ProcessX helps {industry.name.toLowerCase()} businesses
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industry.solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:border-[#E8FF3F]/30 hover:shadow-lg transition-all"
              >
                <div className="h-14 w-14 rounded-2xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] flex-shrink-0">
                  {solutionIcons[solution.icon] || <Sparkles className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                  <p className="text-gray-600">{solution.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-24 bg-[#062C2E]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
                Features built for {industry.name.toLowerCase()}
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Everything you need to manage your finances professionally and stay compliant with SARS.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {industry.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E8FF3F]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#E8FF3F]" />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="w-32 h-32 rounded-3xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#E8FF3F]">
                {industryIcons[industry.icon]}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {industry.testimonial && (
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8FAFC] rounded-3xl p-8 md:p-12 text-center"
            >
              <Quote className="w-12 h-12 text-[#E8FF3F] mx-auto mb-6" />
              <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-6">
                &ldquo;{industry.testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex flex-col items-center">
                <div className="text-base font-semibold text-gray-900">
                  {industry.testimonial.author}
                </div>
                <div className="text-sm text-gray-600">
                  {industry.testimonial.role}, {industry.testimonial.company}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other Industries */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              ProcessX works for other industries too
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherIndustries.map((other, index) => (
              <motion.div
                key={other.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/industries/${other.slug}`}
                  className="block p-4 rounded-xl bg-white border border-gray-100 hover:border-[#E8FF3F]/50 hover:shadow-lg transition-all text-center group"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mx-auto mb-3 group-hover:bg-[#E8FF3F]/20 transition-colors">
                    {industryIconsSmall[other.icon]}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{other.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-[#062C2E] font-medium hover:gap-3 transition-all"
            >
              View all industries
              <ArrowRight className="w-4 h-4" />
            </Link>
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
              Ready to simplify your {industry.name.toLowerCase()} bookkeeping?
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Join thousands of South African {industry.name.toLowerCase()} businesses using ProcessX
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
                href="/contact"
                className="rounded-full border border-gray-600 px-8 py-4 text-base font-medium text-white hover:bg-white/5 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
