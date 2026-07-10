'use client'

import { motion } from 'framer-motion'
import { Check, X, Sparkles, Clock, Shield, Zap } from 'lucide-react'
import { comparisonTable } from '@/content/home'

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#062C2E]/5 border border-[#062C2E]/10 px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#062C2E]" />
            <span className="text-sm font-medium text-[#062C2E]">AI vs Manual</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {comparisonTable.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            {comparisonTable.subtitle}
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-[#062C2E]">
            <div className="p-6">
              <span className="text-white font-medium">Feature</span>
            </div>
            <div className="p-6 text-center border-l border-white/10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-white font-medium">Manual Bookkeeping</span>
              </div>
            </div>
            <div className="p-6 text-center border-l border-white/10 bg-[#E8FF3F]/10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E8FF3F] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#062C2E]" />
                </div>
                <span className="text-[#E8FF3F] font-medium">ProcessX AI</span>
              </div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {comparisonTable.rows.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`grid grid-cols-3 ${row.highlight ? 'bg-[#E8FF3F]/5' : ''}`}
              >
                <div className="p-5 flex items-center">
                  <span className="text-gray-900 font-medium">{row.feature}</span>
                </div>
                <div className="p-5 flex items-center justify-center border-l border-gray-50">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{row.manual}</span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-center border-l border-gray-50 bg-[#E8FF3F]/5">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-[#062C2E] font-medium text-sm">{row.processx}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="w-6 h-6" />, title: '60x Faster', description: 'Process documents in seconds, not minutes' },
            { icon: <Shield className="w-6 h-6" />, title: '99% Accurate', description: 'AI-powered extraction with verification' },
            { icon: <Sparkles className="w-6 h-6" />, title: 'Always Learning', description: 'AI improves with every document' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
