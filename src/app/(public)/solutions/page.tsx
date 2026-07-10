'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileEdit, Table, AlertTriangle, Receipt, Copy, Clock,
  TrendingDown, Calculator, Shield, Wallet, FileX, ArrowRight, Sparkles
} from 'lucide-react'
import { solutions } from '@/content/solutions'

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  FileEdit,
  Table,
  AlertTriangle,
  Receipt,
  Copy,
  Clock,
  TrendingDown,
  Calculator,
  Shield,
  Wallet,
  FileX,
}

export default function SolutionsPage() {
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
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#E8FF3F]/10 border border-[#E8FF3F]/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-[#E8FF3F] text-sm font-medium">AI-Powered Solutions</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Solving Your Biggest <span className="text-[#E8FF3F]">Bookkeeping Challenges</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Every business faces bookkeeping pain points. ProcessX uses AI to solve them automatically,
              saving you time, money, and headaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = iconMap[solution.icon] || FileEdit

              return (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/solutions/${solution.slug}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 h-full group">
                      <div className="w-14 h-14 bg-[#062C2E] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#E8FF3F] transition-colors">
                        <IconComponent className="w-7 h-7 text-[#E8FF3F] group-hover:text-[#062C2E] transition-colors" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#062C2E]">
                        {solution.problem}
                      </h3>

                      <p className="text-slate-600 mb-6 line-clamp-3">
                        {solution.description}
                      </p>

                      <div className="flex items-center gap-2 text-[#062C2E] font-semibold">
                        <span>See Solution</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
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
              Ready to Solve Your Bookkeeping Problems?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of South African businesses using ProcessX to automate their bookkeeping.
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
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
