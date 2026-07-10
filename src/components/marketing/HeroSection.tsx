'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Receipt, Building2, Users, Sparkles, Check } from 'lucide-react'
import { heroContent, heroStats, documentTypes } from '@/content/home'

interface HeroSectionProps {
  isLoggedIn?: boolean
}

const documentIcons: Record<string, React.ReactNode> = {
  Invoice: <FileText className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  'Bank Statement': <Building2 className="w-5 h-5" />,
  Payslip: <Users className="w-5 h-5" />,
}

const statIcons = [
  <FileText key="docs" className="w-5 h-5" />,
  <Sparkles key="time" className="w-5 h-5" />,
  <Check key="accuracy" className="w-5 h-5" />,
  <Check key="sars" className="w-5 h-5" />,
  <Users key="hours" className="w-5 h-5" />,
]

export default function HeroSection({ isLoggedIn = false }: HeroSectionProps) {
  return (
    <section className="relative min-h-[calc(100vh-73px)] flex flex-col overflow-hidden bg-[#062C2E]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />

      {/* Main content */}
      <div className="relative flex-1 flex items-center mx-auto w-full max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-5">
            {/* SA Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#081F22] border border-[#E8FF3F]/10 px-4 py-2 mb-8"
            >
              <span className="text-lg">{heroContent.badge.flag}</span>
              <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">
                {heroContent.badge.text}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
            >
              {heroContent.headline.line1}
              <br />
              {heroContent.headline.line2}
              <br />
              <span className="text-[#E8FF3F]">{heroContent.headline.highlight}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-400 leading-relaxed"
            >
              {heroContent.subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all shadow-lg shadow-[#E8FF3F]/20"
                >
                  Go to Dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    href={heroContent.cta.primary.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all shadow-lg shadow-[#E8FF3F]/20"
                  >
                    {heroContent.cta.primary.text}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href={heroContent.cta.secondary.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/5 transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {heroContent.cta.secondary.text}
                  </Link>
                </>
              )}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex -space-x-2">
                {heroContent.socialProof.avatars.map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B5563] to-[#374151] border-2 border-[#062C2E] flex items-center justify-center text-xs font-medium text-white"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(heroContent.socialProof.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#E8FF3F]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-400">{heroContent.socialProof.text}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Document Cards */}
          <div className="relative lg:col-span-7">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#E8FF3F]/10 via-[#22C55E]/10 to-[#E8FF3F]/10 rounded-3xl blur-2xl" />

            {/* Document cards grid */}
            <div className="relative grid grid-cols-2 gap-4">
              {documentTypes.map((doc, index) => (
                <motion.div
                  key={doc.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-[#081F22] border border-[#E8FF3F]/10 rounded-2xl p-5 hover:border-[#E8FF3F]/30 transition-all group"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#E8FF3F]">
                        {documentIcons[doc.type]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{doc.type}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">{doc.filename}</p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Processed'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}
                    >
                      {doc.status}
                    </div>
                  </div>

                  {/* Card details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount</span>
                      <span className="text-white font-medium">{doc.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vendor</span>
                      <span className="text-gray-300 truncate max-w-[120px]">{doc.vendor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="text-gray-300">{doc.date}</span>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div className="mt-4 pt-4 border-t border-[#E8FF3F]/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">AI Confidence</span>
                      <span className="text-[#E8FF3F]">{doc.confidence}%</span>
                    </div>
                    <div className="h-1.5 bg-[#E8FF3F]/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${doc.confidence}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-[#E8FF3F] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Processing Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#081F22]/95 backdrop-blur-sm border border-[#E8FF3F]/20 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#E8FF3F]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Processing Complete</p>
                <p className="text-xs text-gray-500">99% Accuracy • 60 Seconds</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative bg-[#081F22] border-t border-[#062C2E]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className={`flex items-center gap-4 ${
                  index < 4 ? 'md:border-r md:border-[#E8FF3F]/5 md:pr-4' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full border border-[#E8FF3F]/20 bg-[#E8FF3F]/5 flex items-center justify-center text-[#E8FF3F]">
                  {statIcons[index]}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-base font-normal text-gray-500 ml-1">{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
