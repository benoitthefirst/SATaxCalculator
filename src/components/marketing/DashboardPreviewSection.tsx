'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { LayoutDashboard, Sparkles, Zap, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { dashboardFeatures } from '@/content/home'

const featureIcons = [
  <TrendingUp key="trending" className="w-5 h-5" />,
  <Sparkles key="sparkles" className="w-5 h-5" />,
  <Zap key="zap" className="w-5 h-5" />,
]

export default function DashboardPreviewSection() {
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
            <LayoutDashboard className="w-4 h-4 text-[#062C2E]" />
            <span className="text-sm font-medium text-[#062C2E]">Smart Dashboard</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900"
          >
            Your finances,
            <br />
            <span className="text-[#062C2E]">at a glance</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
          >
            A beautiful dashboard that shows you everything you need to know about your business finances.
            Real-time data, actionable insights, and one-click actions.
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#E8FF3F]/20 via-[#22C55E]/20 to-[#E8FF3F]/20 rounded-3xl blur-3xl opacity-50" />

          {/* Dashboard container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Browser chrome */}
            <div className="bg-[#F8FAFC] border-b border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-500 border border-gray-200">
                  app.processx.co.za/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content mockup */}
            <div className="p-6 lg:p-8 bg-[#F7F9FC]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Good morning, Demo</h3>
                  <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your business</p>
                </div>
                <div className="flex items-center gap-2 bg-[#E8FF3F] px-4 py-2 rounded-full text-sm font-medium text-[#062C2E]">
                  <span>Tax Year 2025/26</span>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Income (excl. VAT)', value: 'R 245,000', trend: '+12%', up: true, color: 'green' },
                  { label: 'Deductible Expenses', value: 'R 89,500', trend: '+8%', up: true, color: 'red' },
                  { label: 'Taxable Income', value: 'R 155,500', trend: '-3%', up: false, color: 'blue' },
                  { label: 'Estimated Tax', value: 'R 42,350', trend: '-5%', up: false, color: 'purple' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100"
                  >
                    <p className="text-xs text-gray-500 mb-2">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.trend}
                      </div>
                    </div>
                    {/* Mini sparkline placeholder */}
                    <div className="mt-3 h-8 flex items-end gap-0.5">
                      {[40, 65, 45, 80, 55, 70, 90].map((height, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-sm ${
                            stat.color === 'green' ? 'bg-green-200' :
                            stat.color === 'red' ? 'bg-red-200' :
                            stat.color === 'blue' ? 'bg-blue-200' :
                            'bg-purple-200'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick actions & AI insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {['Upload', 'Income', 'Expense', 'Asset', 'Trip', 'Reports'].map((action) => (
                      <div key={action} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] flex items-center justify-center">
                          <Zap className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-600">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-[#062C2E] rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
                    <h4 className="text-sm font-semibold">AI Insights</h4>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    You could save R 8,500 in tax by claiming your home office deduction.
                  </p>
                  <button className="text-xs text-[#E8FF3F] font-medium flex items-center gap-1">
                    Learn more <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {dashboardFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-4">
                {featureIcons[index]}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
