'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Cpu,
  LayoutDashboard,
  Receipt,
  DollarSign,
  Car,
  Building2,
  FileText,
  Calculator,
  Users,
  Download,
  Briefcase,
  Code,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const mainFeatures = [
  {
    title: 'AI Document Analyzer',
    description:
      "Stop typing invoices manually. Our AI extracts transactions from bank statements, invoices, and receipts automatically. Spend more time advising clients, less time on data entry.",
    icon: <Cpu className="w-8 h-8" />,
    features: [
      'Upload bank statements & invoices',
      'AI extracts transactions automatically',
      'Review and approve in seconds',
      'Free your team for advisory work',
      'Save 15+ hours per month',
    ],
  },
  {
    title: 'Smart Dashboard',
    description:
      "Get a bird's eye view of your entire business. Real-time metrics, beautiful charts, and actionable insights all in one place.",
    icon: <LayoutDashboard className="w-8 h-8" />,
    features: [
      'Real-time financial overview',
      'Income vs expense tracking',
      'Monthly/yearly comparisons',
      'Quick action shortcuts',
      'Tax year progress tracking',
    ],
  },
  {
    title: 'Expense Tracking',
    description:
      'Never lose track of a business expense again. Upload receipts, categorize spending, and track recurring costs automatically.',
    icon: <Receipt className="w-8 h-8" />,
    features: [
      'Receipt photo uploads',
      'Expense categories & tags',
      'Recurring expense automation',
      'VAT tracking support',
      'CSV export for SARS',
    ],
  },
  {
    title: 'Income Management',
    description:
      'Track every rand that comes into your business. Multiple income streams, client tracking, and payment monitoring made simple.',
    icon: <DollarSign className="w-8 h-8" />,
    features: [
      'Multiple income categories',
      'Client/source tracking',
      'Payment date monitoring',
      'Income analytics',
      'VAT on income support',
    ],
  },
]

const additionalFeatures = [
  {
    title: 'Vehicle Logbook',
    description: 'Track business vs personal travel for SARS compliance. Calculate allowable deductions automatically.',
    icon: <Car className="w-6 h-6" />,
  },
  {
    title: 'Asset Management',
    description: 'Track business assets with automatic depreciation calculations for tax deductions.',
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    title: 'Financial Reports',
    description: 'Generate comprehensive profit & loss statements, tax summaries, and deduction reports.',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    title: 'Tax Computation',
    description: "Built-in tax calculators with 2025/26 tax brackets. See your tax liability in real-time.",
    icon: <Calculator className="w-6 h-6" />,
  },
  {
    title: 'Team Collaboration',
    description: 'Invite team members with role-based access. Collaborate on finances with your accountant or staff.',
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: 'CSV Exports',
    description: 'Export all your data in SARS-compatible formats. Ready for your accountant.',
    icon: <Download className="w-6 h-6" />,
  },
  {
    title: 'Multi-Company',
    description: 'Manage multiple businesses from one account. Perfect for serial entrepreneurs.',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: 'API Access',
    description: 'Integrate ProcessX with your existing tools. Build custom workflows with our developer API.',
    icon: <Code className="w-6 h-6" />,
  },
]

const comparisonTable = [
  { feature: 'Expense Tracking', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Income Management', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Tax Calculator', starter: true, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Monthly Transactions', starter: '50', basic: '200', professional: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Vehicle Logbook', starter: false, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Asset Management', starter: false, basic: false, professional: true, business: true, enterprise: true },
  { feature: 'AI Document Analyzer', starter: false, basic: '25/mo', professional: '100/mo', business: '500/mo', enterprise: 'Unlimited' },
  { feature: 'Financial Reports', starter: 'Basic', basic: 'Basic', professional: 'Full', business: 'Advanced', enterprise: 'Advanced' },
  { feature: 'CSV Exports', starter: false, basic: true, professional: true, business: true, enterprise: true },
  { feature: 'Team Members', starter: '1', basic: '2', professional: '5', business: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Multi-Company', starter: false, basic: false, professional: false, business: true, enterprise: true },
  { feature: 'API Access', starter: false, basic: false, professional: false, business: true, enterprise: true },
  { feature: 'Priority Support', starter: false, basic: false, professional: true, business: true, enterprise: true },
  { feature: 'Dedicated Account Manager', starter: false, basic: false, professional: false, business: false, enterprise: true },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#062C2E] py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/20 px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-sm font-medium text-[#E8FF3F]">Powerful Features</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Everything you need to
              <br />
              <span className="text-[#E8FF3F]">run your business</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-400"
            >
              Powerful features designed for South African entrepreneurs. From expense tracking to tax compliance,
              ProcessX has you covered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-gray-600 px-8 py-4 text-base font-medium text-white hover:bg-white/5 transition-all"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="space-y-24">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                }`}
              >
                <div className="flex-1 max-w-xl">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8FF3F]/10 text-[#062C2E] mb-6">
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
                  <p className="text-lg text-gray-600 mb-8">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-[#E8FF3F]/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#062C2E]" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full max-w-xl">
                  <div className="rounded-3xl bg-[#F8FAFC] p-6 border border-gray-100">
                    {/* AI Document Analyzer Visual */}
                    {index === 0 && (
                      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-[#E8FF3F]/10 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-[#062C2E]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">bank_statement.pdf</p>
                            <p className="text-xs text-gray-500">Analyzing...</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: 'Transactions Found', value: '47' },
                            { label: 'Total Credits', value: 'R 128,500.00' },
                            { label: 'Total Debits', value: 'R 45,200.00' },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between items-center py-2 px-3 bg-[#F8FAFC] rounded-lg">
                              <span className="text-sm text-gray-600">{item.label}</span>
                              <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-[#E8FF3F]/10 rounded-lg">
                          <Sparkles className="w-4 h-4 text-[#062C2E]" />
                          <span className="text-sm text-[#062C2E]">AI Confidence: 99%</span>
                        </div>
                      </div>
                    )}

                    {/* Smart Dashboard Visual */}
                    {index === 1 && (
                      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            { label: 'Income', value: 'R 245K', color: 'green' },
                            { label: 'Expenses', value: 'R 89K', color: 'red' },
                            { label: 'Tax', value: 'R 42K', color: 'blue' },
                            { label: 'Net', value: 'R 114K', color: 'purple' },
                          ].map((stat) => (
                            <div key={stat.label} className="bg-[#F8FAFC] rounded-xl p-3">
                              <p className="text-xs text-gray-500">{stat.label}</p>
                              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                              <div className="mt-2 h-6 flex items-end gap-0.5">
                                {[40, 65, 45, 80, 55, 70].map((h, i) => (
                                  <div key={i} className={`flex-1 rounded-t-sm ${
                                    stat.color === 'green' ? 'bg-green-200' :
                                    stat.color === 'red' ? 'bg-red-200' :
                                    stat.color === 'blue' ? 'bg-blue-200' : 'bg-purple-200'
                                  }`} style={{ height: `${h}%` }} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-[#062C2E] rounded-xl">
                          <div className="flex items-center gap-2 text-[#E8FF3F] text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>Save R 8,500 with home office deduction</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expense Tracking Visual */}
                    {index === 2 && (
                      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
                        {[
                          { vendor: 'Engen Fuel', amount: 'R 1,250.00', category: 'Fuel', date: 'Today' },
                          { vendor: 'Makro Office', amount: 'R 3,450.00', category: 'Office', date: 'Yesterday' },
                          { vendor: 'Vodacom', amount: 'R 899.00', category: 'Telecom', date: '2 days ago' },
                        ].map((expense) => (
                          <div key={expense.vendor} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-100">
                                <Receipt className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{expense.vendor}</p>
                                <p className="text-xs text-gray-500">{expense.category} • {expense.date}</p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{expense.amount}</span>
                          </div>
                        ))}
                        <button className="w-full py-3 bg-[#E8FF3F] rounded-xl text-sm font-semibold text-[#062C2E] flex items-center justify-center gap-2">
                          <Receipt className="w-4 h-4" />
                          Add Expense
                        </button>
                      </div>
                    )}

                    {/* Income Management Visual */}
                    {index === 3 && (
                      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
                        {[
                          { client: 'ABC Corp', amount: 'R 45,000.00', status: 'Received', color: 'green' },
                          { client: 'XYZ Ltd', amount: 'R 28,500.00', status: 'Pending', color: 'yellow' },
                          { client: 'Tech Solutions', amount: 'R 65,000.00', status: 'Received', color: 'green' },
                        ].map((income) => (
                          <div key={income.client} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#E8FF3F]/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-[#062C2E]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{income.client}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  income.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{income.status}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-green-600">+{income.amount}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-600">Total Income</span>
                          <span className="text-lg font-bold text-gray-900">R 138,500.00</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">And so much more</h2>
            <p className="mt-4 text-lg text-gray-600">Every tool you need to stay organized and compliant</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-[#E8FF3F]/30 transition-all group"
              >
                <div className="h-12 w-12 rounded-xl bg-[#E8FF3F]/10 flex items-center justify-center text-[#062C2E] mb-4 group-hover:bg-[#E8FF3F]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Compare plans</h2>
            <p className="mt-4 text-lg text-gray-600">Find the perfect plan for your business needs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-x-auto rounded-2xl border border-gray-200"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-[#062C2E]">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-white min-w-[180px]">Feature</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-white min-w-[100px]">Starter</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-white min-w-[100px]">Basic</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-[#E8FF3F] min-w-[100px] bg-[#E8FF3F]/10">
                    Professional
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-white min-w-[100px]">Business</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-white min-w-[100px]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.basic}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-[#E8FF3F]/5">
                      {typeof row.professional === 'boolean' ? (
                        row.professional ? (
                          <Check className="w-5 h-5 text-[#062C2E] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-[#062C2E]">{row.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600">{row.business}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? (
                          <Check className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-[#062C2E] font-medium hover:text-[#081F22]"
            >
              View full pricing details
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
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-400">
              Join thousands of South African businesses already using ProcessX
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
