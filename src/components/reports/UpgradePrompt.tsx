'use client'

import Link from 'next/link'
import { Lock, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UpgradePromptProps {
  title: string
  message: string
  backLink?: string
  backLabel?: string
}

const FEATURES = [
  'Detailed Profit & Loss statements with monthly breakdowns',
  'Income & Expense analytics with category insights',
  'Tax computation reports for SARS filing',
  'Deduction summaries by expense category',
  'CSV exports for all your data',
]

export default function UpgradePrompt({
  title,
  message,
  backLink = '/dashboard/reports',
  backLabel = 'Back to Reports',
}: UpgradePromptProps) {
  return (
    <div className="p-4 sm:p-8">
      <Link
        href={backLink}
        className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
      >
        ← {backLabel}
      </Link>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h2>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {message}
          </p>

          <div className="bg-white rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">
              What you get with Professional & Business plans:
            </h3>
            <ul className="space-y-3">
              {FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/settings/subscription">
              <Button className="w-full sm:w-auto">
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" className="w-full sm:w-auto">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
