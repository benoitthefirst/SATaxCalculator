'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Shield, Clock, Check } from 'lucide-react'
import { ctaContent } from '@/content/home'

export default function CTASection() {
  return (
    <section className="py-24 bg-[#062C2E] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-[#E8FF3F]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
            <span className="text-sm font-medium text-[#E8FF3F]">Start Free Today</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            {ctaContent.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10"
          >
            {ctaContent.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href={ctaContent.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all shadow-lg shadow-[#E8FF3F]/20"
            >
              {ctaContent.primaryCta.text}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={ctaContent.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/5 transition-all"
            >
              {ctaContent.secondaryCta.text}
            </Link>
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-gray-500 mb-12"
          >
            {ctaContent.note}
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
          >
            {[
              { icon: <Clock className="w-5 h-5" />, text: 'Setup in 2 minutes' },
              { icon: <Shield className="w-5 h-5" />, text: 'Bank-level security' },
              { icon: <Check className="w-5 h-5" />, text: 'No credit card required' },
            ].map((item, index) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-[#E8FF3F]/10 flex items-center justify-center text-[#E8FF3F]">
                  {item.icon}
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
