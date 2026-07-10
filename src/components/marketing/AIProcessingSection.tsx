'use client'

import { motion } from 'framer-motion'
import { Upload, Cpu, Sparkles, CheckCircle, ArrowRight } from 'lucide-react'
import { aiProcessingSteps } from '@/content/home'

const stepIcons: Record<string, React.ReactNode> = {
  upload: <Upload className="w-6 h-6" />,
  cpu: <Cpu className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  check: <CheckCircle className="w-6 h-6" />,
}

export default function AIProcessingSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#062C2E]" />
            <span className="text-sm font-medium text-[#062C2E]">AI-Powered Processing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            From document to data
            <br />
            <span className="text-[#062C2E]">in 60 seconds</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Our AI reads your documents, extracts all the important data, and categorizes everything automatically.
            No more manual data entry.
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
          {aiProcessingSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < aiProcessingSteps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gradient-to-r from-[#E8FF3F] to-[#E8FF3F]/30" />
              )}

              <div className="relative bg-[#F8FAFC] rounded-2xl p-6 text-center hover:bg-white hover:shadow-xl transition-all group border border-transparent hover:border-[#E8FF3F]/20">
                {/* Step number */}
                <div className="absolute -top-3 left-6 bg-[#062C2E] text-white text-xs font-bold px-2 py-1 rounded-full">
                  Step {step.step}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-6 group-hover:bg-[#E8FF3F]/20 transition-colors">
                  {stepIcons[step.icon]}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 bg-[#062C2E] rounded-3xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left - Document preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-10 h-10 rounded-lg bg-[#E8FF3F]/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#062C2E]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">invoice_march_2024.pdf</p>
                    <p className="text-xs text-gray-500">Uploaded just now</p>
                  </div>
                </div>

                {/* Simulated document content */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-8 bg-[#E8FF3F]/20 rounded mt-4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>

                {/* AI scanning overlay effect */}
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#E8FF3F] to-transparent rounded-full"
                  style={{ top: '30%' }}
                />
              </div>
            </div>

            {/* Right - Extracted data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[#E8FF3F]" />
                <span className="text-[#E8FF3F] font-medium">AI Extracted Data</span>
              </div>

              {[
                { label: 'Vendor', value: 'Office Supplies Ltd', confidence: 99 },
                { label: 'Amount', value: 'R 12,450.00', confidence: 99 },
                { label: 'VAT (15%)', value: 'R 1,623.91', confidence: 98 },
                { label: 'Date', value: '15 March 2024', confidence: 99 },
                { label: 'Category', value: 'Office Expenses', confidence: 97 },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between bg-[#081F22] rounded-xl p-4"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-white font-medium">{item.value}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#E8FF3F]">{item.confidence}%</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 1 }}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#E8FF3F] text-[#062C2E] font-semibold py-3 rounded-xl hover:bg-[#d4eb38] transition-colors"
              >
                Confirm & Save
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
