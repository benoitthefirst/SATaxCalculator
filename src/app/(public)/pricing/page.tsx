import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { PricingPlans } from './PricingPlans'

export const metadata: Metadata = {
  title: 'Pricing & Plans',
  description: 'Simple, transparent pricing for South African businesses. Start free with our Starter plan and scale as you grow. No hidden fees, cancel anytime.',
}

// Static fallback plans when subscriptions are disabled
const staticPlans = [
  {
    id: 'starter',
    name: 'Starter',
    tier: 'STARTER',
    description: 'Perfect for freelancers and solo entrepreneurs just getting started.',
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
    id: 'professional',
    name: 'Professional',
    tier: 'PROFESSIONAL',
    description: 'For growing businesses that need more power and flexibility.',
    price_monthly: 299,
    price_yearly: 2990,
    features: [
      'Unlimited transactions',
      'Advanced expense tracking',
      'Income & invoicing',
      'Vehicle logbook',
      'Asset management',
      'Financial reports & analytics',
      'CSV exports',
      'Up to 5 team members',
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
      'Multi-company management',
      'Advanced reporting',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Phone support',
    ],
  },
]

const faqs = [
  {
    question: 'Is there really a free plan?',
    answer: 'Yes! Our Starter plan is completely free with no credit card required. It includes all the basics you need to manage your finances as a solo entrepreneur.',
  },
  {
    question: 'Can I change plans at any time?',
    answer: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at the end of your billing cycle.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use industry-standard encryption and security practices. Your data is stored securely in the cloud with regular backups. We never share your financial data with third parties.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Pay annually and get 2 months free. That\'s a 17% saving compared to monthly billing.',
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

async function getPlans() {
  // Check if subscriptions are enabled
  const setting = await prisma.systemSetting.findUnique({
    where: { key: 'billing.subscriptions_enabled' },
  })

  const subscriptionsEnabled = setting?.value === true

  if (!subscriptionsEnabled) {
    return { enabled: false, plans: staticPlans }
  }

  // Get dynamic plans from database
  const plans = await prisma.subscriptionPlan.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
    select: {
      id: true,
      name: true,
      tier: true,
      description: true,
      price_monthly: true,
      price_yearly: true,
      features: true,
    },
  })

  if (plans.length === 0) {
    return { enabled: false, plans: staticPlans }
  }

  return {
    enabled: true,
    plans: plans.map(plan => ({
      ...plan,
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly),
      features: plan.features as string[],
    })),
  }
}

export default async function PricingPage() {
  const { enabled, plans } = await getPlans()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Start free and scale as your business grows. No hidden fees.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingPlans plans={plans} subscriptionsEnabled={enabled} />

      {/* Annual Billing Banner */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-800">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Save 17% with annual billing - Get 2 months free!</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-6 hover:border-blue-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to simplify your bookkeeping?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Start your free trial today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border-2 border-white px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
