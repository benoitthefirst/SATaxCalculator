'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Play, Upload, FileText, Receipt, CreditCard, FileSpreadsheet,
  Sparkles, CheckCircle, ArrowRight, Clock, Zap, Shield,
  BarChart3, FileCheck, Building2
} from 'lucide-react'

const demoSteps = [
  {
    id: 1,
    title: 'Upload Any Document',
    description: 'Drop invoices, receipts, bank statements, or payslips. ProcessX accepts PDF, JPG, PNG, and HEIC formats.',
    icon: Upload,
    demo: {
      type: 'upload',
      documents: [
        { name: 'invoice_march_2024.pdf', type: 'Invoice', icon: FileText },
        { name: 'fuel_receipt.jpg', type: 'Receipt', icon: Receipt },
        { name: 'fnb_statement.pdf', type: 'Bank Statement', icon: CreditCard },
        { name: 'payslip_feb.pdf', type: 'Payslip', icon: FileSpreadsheet },
      ]
    }
  },
  {
    id: 2,
    title: 'AI Extracts Everything',
    description: 'Our AI reads the document and extracts vendor, amount, date, VAT, and category automatically in under 60 seconds.',
    icon: Sparkles,
    demo: {
      type: 'extraction',
      fields: [
        { label: 'Vendor', value: 'Office Supplies Ltd', confidence: 99.2 },
        { label: 'Amount', value: 'R 12,450.00', confidence: 99.8 },
        { label: 'VAT', value: 'R 1,619.57', confidence: 99.5 },
        { label: 'Date', value: '15 March 2024', confidence: 98.9 },
        { label: 'Category', value: 'Office Expenses', confidence: 97.3 },
      ]
    }
  },
  {
    id: 3,
    title: 'Review & Confirm',
    description: 'Check the extracted data, make any corrections if needed, and confirm. The system learns from your feedback.',
    icon: CheckCircle,
    demo: {
      type: 'review',
      stats: [
        { label: 'Documents Processed', value: '1,247' },
        { label: 'Accuracy Rate', value: '99.2%' },
        { label: 'Time Saved', value: '32 hrs' },
        { label: 'Tax Deductions Found', value: 'R 45,320' },
      ]
    }
  },
  {
    id: 4,
    title: 'Generate SARS Reports',
    description: 'Export profit & loss, tax computation, VAT reports, and deduction summaries ready for SARS eFiling.',
    icon: FileCheck,
    demo: {
      type: 'reports',
      reports: [
        { name: 'Profit & Loss Statement', status: 'Ready' },
        { name: 'Tax Computation Report', status: 'Ready' },
        { name: 'VAT Report', status: 'Ready' },
        { name: 'Deduction Summary', status: 'Ready' },
      ]
    }
  },
]

const features = [
  { icon: Clock, title: '60 Seconds', description: 'Average processing time per document' },
  { icon: Zap, title: '99% Accuracy', description: 'AI extraction accuracy rate' },
  { icon: Shield, title: 'SARS Compliant', description: 'All reports meet SARS requirements' },
  { icon: BarChart3, title: 'Real-time Insights', description: 'See your finances at a glance' },
]

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentStep = demoSteps.find(s => s.id === activeStep) || demoSteps[0]

  const handlePlay = () => {
    setIsPlaying(true)
    let step = 1
    const interval = setInterval(() => {
      step++
      if (step > 4) {
        clearInterval(interval)
        setIsPlaying(false)
        step = 1
      }
      setActiveStep(step > 4 ? 1 : step)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative bg-[#062C2E] py-20 overflow-hidden">
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
              <Play className="w-4 h-4 text-[#E8FF3F]" />
              <span className="text-[#E8FF3F] text-sm font-medium">Interactive Demo</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              See ProcessX <span className="text-[#E8FF3F]">in Action</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Watch how ProcessX transforms document chaos into organized, SARS-ready records in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#E8FF3F] text-[#062C2E] font-bold rounded-xl hover:bg-[#d4eb39] transition-colors disabled:opacity-50"
              >
                <Play className="mr-2 w-5 h-5" />
                {isPlaying ? 'Playing...' : 'Play Demo'}
              </button>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                Try It Yourself
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Step Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex gap-2 bg-white rounded-full p-2 shadow-lg">
                {demoSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                      activeStep === step.id
                        ? 'bg-[#062C2E] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      activeStep === step.id ? 'bg-[#E8FF3F] text-[#062C2E]' : 'bg-slate-200'
                    }`}>
                      {step.id}
                    </span>
                    <span className="hidden md:inline">{step.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Description */}
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-[#062C2E] rounded-2xl flex items-center justify-center mb-6">
                  <currentStep.icon className="w-8 h-8 text-[#E8FF3F]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Step {currentStep.id}: {currentStep.title}
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  {currentStep.description}
                </p>

                {activeStep < 4 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="inline-flex items-center gap-2 text-[#062C2E] font-semibold hover:underline"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-[#062C2E] text-white font-bold rounded-xl hover:bg-[#0a3d40] transition-colors"
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                )}
              </motion.div>

              {/* Right: Demo Visual */}
              <motion.div
                key={`demo-${activeStep}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8"
              >
                {currentStep.demo.type === 'upload' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Drop documents here or click to upload</p>
                    </div>
                    <div className="space-y-3">
                      {currentStep.demo.documents?.map((doc, i) => (
                        <motion.div
                          key={doc.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-4 bg-slate-50 rounded-xl p-4"
                        >
                          <div className="w-10 h-10 bg-[#062C2E] rounded-lg flex items-center justify-center">
                            <doc.icon className="w-5 h-5 text-[#E8FF3F]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <p className="text-sm text-slate-500">{doc.type}</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep.demo.type === 'extraction' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#E8FF3F] rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-[#062C2E]" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">AI Processing Complete</p>
                        <p className="text-sm text-slate-500">invoice_march_2024.pdf</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {currentStep.demo.fields?.map((field, i) => (
                        <motion.div
                          key={field.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                        >
                          <div>
                            <p className="text-sm text-slate-500">{field.label}</p>
                            <p className="font-semibold text-slate-900">{field.value}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600 font-medium">{field.confidence}%</span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep.demo.type === 'review' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
                      <p className="text-slate-500">Your documents are processed and organized</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {currentStep.demo.stats?.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-slate-50 rounded-xl p-4 text-center"
                        >
                          <p className="text-2xl font-bold text-[#062C2E]">{stat.value}</p>
                          <p className="text-sm text-slate-500">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep.demo.type === 'reports' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#062C2E] rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#E8FF3F]" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">SARS Reports Ready</p>
                        <p className="text-sm text-slate-500">Tax Year 2024/2025</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {currentStep.demo.reports?.map((report, i) => (
                        <motion.div
                          key={report.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileCheck className="w-5 h-5 text-[#062C2E]" />
                            <span className="font-medium text-slate-900">{report.name}</span>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            {report.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-3 bg-[#062C2E] text-white font-semibold rounded-xl hover:bg-[#0a3d40] transition-colors">
                      Download All Reports
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Businesses Choose ProcessX
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 bg-[#062C2E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-[#E8FF3F]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
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
              Ready to Experience It Yourself?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start your free trial today. No credit card required.
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
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
