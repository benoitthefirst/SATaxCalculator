'use client'

import { motion } from 'framer-motion'
import { FileText, Calculator, Receipt, List, Download, Shield, CheckCircle } from 'lucide-react'
import { sarsReports } from '@/content/home'

const reportIcons: Record<string, React.ReactNode> = {
  chart: <FileText className="w-6 h-6" />,
  calculator: <Calculator className="w-6 h-6" />,
  receipt: <Receipt className="w-6 h-6" />,
  list: <List className="w-6 h-6" />,
}

export default function SARSReportsSection() {
  return (
    <section className="py-24 bg-[#062C2E]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Reports mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main report card */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#F8FAFC] px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8FF3F] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#062C2E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Tax Computation Report</p>
                    <p className="text-xs text-gray-500">Tax Year 2025/26</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  SARS Ready
                </div>
              </div>

              {/* Report content */}
              <div className="p-6 space-y-4">
                {/* Summary row */}
                <div className="bg-[#F8FAFC] rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">R 245,000</p>
                      <p className="text-xs text-gray-500">Total Income</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">R 89,500</p>
                      <p className="text-xs text-gray-500">Deductions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#062C2E]">R 42,350</p>
                      <p className="text-xs text-gray-500">Tax Payable</p>
                    </div>
                  </div>
                </div>

                {/* Line items */}
                <div className="space-y-3">
                  {[
                    { label: 'Gross Income', value: 'R 245,000.00' },
                    { label: 'Less: Business Expenses', value: '- R 65,000.00' },
                    { label: 'Less: Vehicle Allowance', value: '- R 18,500.00' },
                    { label: 'Less: Home Office', value: '- R 6,000.00' },
                    { label: 'Taxable Income', value: 'R 155,500.00', bold: true },
                    { label: 'Tax Calculated', value: 'R 42,350.00', bold: true },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex justify-between py-2 ${item.bold ? 'border-t border-gray-200 pt-3' : ''}`}
                    >
                      <span className={`text-sm ${item.bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                      <span className={`text-sm ${item.bold ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Export button */}
                <button className="w-full flex items-center justify-center gap-2 bg-[#062C2E] text-white font-medium py-3 rounded-xl hover:bg-[#081F22] transition-colors">
                  <Download className="w-4 h-4" />
                  Export for SARS eFiling
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-4 -right-4 bg-[#E8FF3F] rounded-xl shadow-xl p-4"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#062C2E]" />
                <div>
                  <p className="text-sm font-bold text-[#062C2E]">100% Compliant</p>
                  <p className="text-xs text-[#062C2E]/70">SARS Approved Format</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
            >
              <FileText className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-sm font-medium text-[#E8FF3F]">SARS Reports</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Tax-ready reports,
              <br />
              <span className="text-[#E8FF3F]">one click away</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 mb-10"
            >
              Generate SARS-compliant reports instantly. Profit & loss statements, tax computations, VAT summaries,
              and deduction reports - all formatted for SARS eFiling.
            </motion.p>

            {/* Report types */}
            <div className="grid grid-cols-2 gap-4">
              {sarsReports.map((report, index) => (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-[#081F22] border border-[#E8FF3F]/10 rounded-xl p-4 hover:border-[#E8FF3F]/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E8FF3F]/10 flex items-center justify-center text-[#E8FF3F] mb-3">
                    {reportIcons[report.icon]}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
