'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileEdit, Table, AlertTriangle, Receipt, Copy, Clock,
  TrendingDown, Calculator, Shield, Wallet, FileX, ArrowRight,
  CheckCircle, Scan, Tags, Zap, Building2, History, Database,
  FileText, Search, RefreshCw, Bell, Camera, Cloud, Link as LinkIcon,
  AlertCircle, Check, BarChart3, Calendar, Settings, FileCheck,
  Smartphone, CheckSquare, Mail, GitBranch, CreditCard, Layers,
  Quote, Sparkles
} from 'lucide-react'
import { Solution, solutions } from '@/content/solutions'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  FileEdit, Table, AlertTriangle, Receipt, Copy, Clock,
  TrendingDown, Calculator, Shield, Wallet, FileX,
  CheckCircle, Scan, Tags, Zap, Building2, History, Database,
  FileText, Search, RefreshCw, Bell, Camera, Cloud, Link: LinkIcon,
  AlertCircle, Check, BarChart3, Calendar, Settings, FileCheck,
  Smartphone, CheckSquare, Mail, GitBranch, CreditCard, Layers,
}

interface SolutionPageClientProps {
  solution: Solution
}

export default function SolutionPageClient({ solution }: SolutionPageClientProps) {
  const HeroIcon = iconMap[solution.icon] || FileEdit

  // Get other solutions for cross-linking
  const otherSolutions = solutions.filter(s => s.id !== solution.id).slice(0, 3)

  return (
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
              href="/solutions"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              All Solutions
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#E8FF3F]/20 rounded-2xl flex items-center justify-center">
                <HeroIcon className="w-8 h-8 text-[#E8FF3F]" />
              </div>
              <span className="text-[#E8FF3F] font-medium">Problem: {solution.problem}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {solution.headline}
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              {solution.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors"
              >
                Solve This Problem
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            {solution.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="py-8 px-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#062C2E] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
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
              Sound Familiar?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              These are the challenges businesses face with {solution.problem.toLowerCase()}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {solution.painPoints.map((pain, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-red-50 border border-red-100 rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{pain.title}</h3>
                    <p className="text-slate-600">{pain.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Help Section */}
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
              <span className="text-[#062C2E] text-sm font-medium">The ProcessX Solution</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How ProcessX Solves This
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform tackles these challenges automatically.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {solution.howWeHelp.map((help, index) => {
              const IconComponent = iconMap[help.icon] || CheckCircle

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#062C2E] rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#E8FF3F] rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-[#062C2E]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{help.title}</h3>
                      <p className="text-white/70">{help.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
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
                  The Results You&apos;ll See
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  With ProcessX handling your {solution.problem.toLowerCase()}, you can expect these outcomes.
                </p>

                <ul className="space-y-4">
                  {solution.benefits.map((benefit, index) => (
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

              {/* Testimonial */}
              {solution.testimonial && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#062C2E] rounded-3xl p-8"
                >
                  <Quote className="w-12 h-12 text-[#E8FF3F] mb-6" />
                  <blockquote className="text-xl text-white mb-6">
                    &ldquo;{solution.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E8FF3F] rounded-full flex items-center justify-center">
                      <span className="text-[#062C2E] font-bold text-lg">
                        {solution.testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">{solution.testimonial.author}</div>
                      <div className="text-white/60 text-sm">
                        {solution.testimonial.role}, {solution.testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Solutions */}
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
              Other Problems We Solve
            </h2>
            <p className="text-xl text-slate-600">
              ProcessX tackles all your bookkeeping challenges.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {otherSolutions.map((sol, index) => {
              const IconComponent = iconMap[sol.icon] || FileEdit

              return (
                <motion.div
                  key={sol.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/solutions/${sol.slug}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
                      <div className="w-12 h-12 bg-[#062C2E] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E8FF3F] transition-colors">
                        <IconComponent className="w-6 h-6 text-[#E8FF3F] group-hover:text-[#062C2E] transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{sol.problem}</h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{sol.description}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-[#062C2E] font-semibold hover:underline"
            >
              View All Solutions
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
              Ready to Solve {solution.problem}?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              {solution.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
