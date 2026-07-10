'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Clock, Shield, HelpCircle, ArrowRight, Check } from 'lucide-react'
import { PricingPlans } from './PricingPlans'

// Static plans data
const staticPlans = [
  {
    id: 'starter',
    name: 'Starter',
    tier: 'STARTER',
    description: 'Perfect for freelancers just getting started.',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Up to 50 transactions/month',
      'Basic expense tracking',
      'Income management',
      'Tax calculator access',
      'Single user',
      'Email support',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    tier: 'BASIC',
    description: 'For solo entrepreneurs ready to grow.',
    price_monthly: 99,
    price_yearly: 990,
    features: [
      'Up to 200 transactions/month',
      'Advanced expense tracking',
      'Income management',
      'Vehicle logbook',
      'AI Document Analyzer (25 docs/month)',
      'CSV exports',
      'Up to 2 team members',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    tier: 'PROFESSIONAL',
    description: 'For growing businesses that need more power.',
    price_monthly: 299,
    price_yearly: 2990,
    features: [
      'Unlimited transactions',
      'Advanced expense tracking',
      'Income & invoicing',
      'Vehicle logbook',
      'Asset management',
      'AI Document Analyzer (100 docs/month)',
      'Financial reports & analytics',
      'CSV exports',
      'Up to 5 team members',
      'Multi-company management',
      'Priority email support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tier: 'BUSINESS',
    description: 'For established businesses with advanced needs.',
    price_monthly: 599,
    price_yearly: 5990,
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'AI Document Analyzer (500 docs/month)',
      'Advanced reporting',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Phone support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    description: 'Custom solutions for large organizations.',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      'Everything in Business',
      'Unlimited AI Document Analyzer',
      'Custom AI training',
      'On-premise deployment option',
      'SSO & advanced security',
      'Custom integrations',
      'SLA guarantee (99.9% uptime)',
      'Dedicated success manager',
      '24/7 phone & email support',
    ],
  },
]

const faqs = [
  {
    question: 'Is there really a free plan?',
    answer: 'Yes! Our Starter plan is completely free with no credit card required. It includes all the basics you need to manage your finances as a solo entrepreneur.',
  },
  {
    question: 'How do subscriptions work with multiple companies?',
    answer: 'Your subscription covers all companies under your account. You pay once and get access to all features across all your companies. This is the industry standard model - no need to pay separately for each company.',
  },
  {
    question: 'What is the AI Document Analyzer?',
    answer: 'The AI Document Analyzer automatically extracts data from invoices, receipts, bank statements, and payslips. It uses advanced AI to identify and categorize transactions, saving you hours of manual data entry. Professional plans get 100 document analyses per month, while Business plans get unlimited.',
  },
  {
    question: 'Can I change plans at any time?',
    answer: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at the end of your billing cycle.",
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use industry-standard encryption and security practices. Your data is stored securely in the cloud with regular backups. We never share your financial data with third parties.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: "Yes! Pay annually and get 2 months free. That's a 17% saving compared to monthly billing.",
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, as well as EFT payments for annual subscriptions. Payments are processed securely through PayFast.',
  },
  {
    question: 'Is ProcessX SARS compliant?',
    answer: 'Yes. ProcessX is built specifically for South African businesses with SARS compliance in mind. Our reports and exports are formatted to meet SARS requirements.',
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#062C2E] py-24">
        {/* Background effects */}
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
              <span className="text-sm font-medium text-[#E8FF3F]">Simple Pricing</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Simple, transparent pricing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Start free and scale as your business grows. No hidden fees, cancel anytime.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingPlans plans={staticPlans} subscriptionsEnabled={false} />

      {/* Annual Billing Banner */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 rounded-2xl bg-[#E8FF3F]/10 border border-[#E8FF3F]/30 px-6 py-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#E8FF3F] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#062C2E]" />
            </div>
            <span className="text-base font-medium text-[#062C2E]">
              Save 17% with annual billing - Get 2 months free!
            </span>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#062C2E]/5 border border-[#062C2E]/10 px-4 py-2 mb-6">
              <HelpCircle className="w-4 h-4 text-[#062C2E]" />
              <span className="text-sm font-medium text-[#062C2E]">FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="rounded-2xl bg-white border border-gray-100 p-6 hover:border-[#E8FF3F]/50 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#062C2E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062C2E] via-[#081F22] to-[#062C2E]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8FF3F]/5 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to simplify your bookkeeping?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Start your free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8FF3F] px-8 py-4 text-base font-semibold text-[#062C2E] hover:bg-[#d4eb38] transition-all shadow-lg shadow-[#E8FF3F]/20"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-600 bg-transparent px-8 py-4 text-base font-semibold text-white hover:bg-white/5 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 flex flex-wrap justify-center gap-6 md:gap-10"
          >
            {[
              { icon: <Clock className="w-5 h-5" />, text: 'Setup in 2 minutes' },
              { icon: <Shield className="w-5 h-5" />, text: 'Bank-level security' },
              { icon: <Check className="w-5 h-5" />, text: 'No credit card required' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-[#E8FF3F]/10 flex items-center justify-center text-[#E8FF3F]">
                  {item.icon}
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
