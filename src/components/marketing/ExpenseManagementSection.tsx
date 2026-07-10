'use client'

import { motion } from 'framer-motion'
import { Receipt, Camera, Sparkles, FolderOpen, ArrowRight, Check } from 'lucide-react'
import { expenseFeatures } from '@/content/home'

const stepIcons: Record<number, React.ReactNode> = {
  1: <Camera className="w-6 h-6" />,
  2: <Sparkles className="w-6 h-6" />,
  3: <FolderOpen className="w-6 h-6" />,
}

export default function ExpenseManagementSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
            >
              <Receipt className="w-4 h-4 text-[#062C2E]" />
              <span className="text-sm font-medium text-[#062C2E]">Expense Management</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Never lose a
              <br />
              <span className="text-[#062C2E]">receipt again</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 mb-10"
            >
              Snap a photo, and ProcessX does the rest. Our AI extracts vendor names, amounts, dates, and VAT
              automatically. Every expense is categorized and ready for tax time.
            </motion.p>

            {/* Steps */}
            <div className="space-y-6">
              {expenseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] flex-shrink-0">
                    {stepIcons[feature.step]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Phone mockup */}
            <div className="relative mx-auto w-[280px] sm:w-[320px]">
              {/* Phone frame */}
              <div className="bg-[#062C2E] rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-[#F8FAFC] px-6 py-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 bg-gray-400 rounded-sm" />
                      <div className="w-4 h-2 bg-gray-400 rounded-sm" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="bg-[#062C2E] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E8FF3F] flex items-center justify-center">
                        <span className="text-[#062C2E] text-xs font-bold">PX</span>
                      </div>
                      <span className="text-white font-medium">ProcessX</span>
                    </div>
                  </div>

                  {/* Receipt capture UI */}
                  <div className="p-4 space-y-4">
                    {/* Receipt image placeholder */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 border-2 border-dashed border-[#E8FF3F]/30">
                      <div className="aspect-[4/3] bg-white rounded-xl flex flex-col items-center justify-center border border-gray-100">
                        <Receipt className="w-8 h-8 text-gray-300 mb-2" />
                        <p className="text-xs text-gray-400">Receipt captured</p>
                      </div>
                    </div>

                    {/* Extracted data */}
                    <div className="bg-[#F8FAFC] rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#062C2E]" />
                        <span className="text-xs font-medium text-[#062C2E]">AI Extracted</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { label: 'Vendor', value: 'Engen Sandton' },
                          { label: 'Amount', value: 'R 1,250.00' },
                          { label: 'VAT', value: 'R 163.04' },
                          { label: 'Category', value: 'Fuel' },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-sm">
                            <span className="text-gray-500">{item.label}</span>
                            <span className="text-gray-900 font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save button */}
                    <button className="w-full flex items-center justify-center gap-2 bg-[#E8FF3F] text-[#062C2E] font-semibold py-3 rounded-xl">
                      <Check className="w-4 h-4" />
                      Save Expense
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -right-12 top-1/4 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Expense Saved</p>
                  <p className="text-[10px] text-gray-500">Just now</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -left-8 bottom-1/3 bg-[#062C2E] rounded-xl shadow-xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-[#E8FF3F]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">99% Confidence</p>
                  <p className="text-[10px] text-gray-400">AI Verified</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
