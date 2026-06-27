'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

interface QuotaInfo {
  used: number
  limit: number
  remaining: number
  isUnlimited: boolean
}

interface UsageStats {
  success: boolean
  subscriptionsEnabled: boolean
  subscription: {
    tier: string
    isActive: boolean
    isPaidPlan: boolean
  }
  usage: {
    documents: QuotaInfo & {
      warningThreshold: boolean
      percentUsed: number
    }
    transactions: QuotaInfo
    teamMembers: QuotaInfo
    companies: QuotaInfo
  }
}

interface QuotaDisplayProps {
  variant?: 'compact' | 'full'
  showUpgrade?: boolean
}

export default function QuotaDisplay({ variant = 'compact', showUpgrade = true }: QuotaDisplayProps) {
  const { data, isLoading, error } = useQuery<UsageStats>({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      const response = await fetch('/api/usage')
      if (!response.ok) throw new Error('Failed to fetch usage')
      return response.json()
    },
    staleTime: 30000, // Cache for 30 seconds
  })

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4 h-20" />
    )
  }

  if (error || !data?.success) {
    return null
  }

  // If subscriptions are disabled, don't show quota
  if (!data.subscriptionsEnabled) {
    return null
  }

  const { documents } = data.usage
  const { tier } = data.subscription

  // Don't show for unlimited plans in compact mode
  if (variant === 'compact' && documents.isUnlimited) {
    return null
  }

  const percentUsed = documents.isUnlimited ? 0 : (documents.used / documents.limit) * 100
  const isWarning = percentUsed >= 80 && percentUsed < 100
  const isExceeded = percentUsed >= 100

  if (variant === 'compact') {
    return (
      <div className={`rounded-lg px-3 py-2 text-sm ${
        isExceeded ? 'bg-red-50 border border-red-200' :
        isWarning ? 'bg-amber-50 border border-amber-200' :
        'bg-blue-50 border border-blue-200'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              isExceeded ? 'text-red-700' :
              isWarning ? 'text-amber-700' :
              'text-blue-700'
            }`}>
              Document Analyses:
            </span>
            <span className={`font-semibold ${
              isExceeded ? 'text-red-900' :
              isWarning ? 'text-amber-900' :
              'text-blue-900'
            }`}>
              {documents.used}/{documents.limit}
            </span>
          </div>
          {showUpgrade && !documents.isUnlimited && (
            <Link
              href="/dashboard/settings/subscription"
              className={`text-xs font-medium underline ${
                isExceeded ? 'text-red-600 hover:text-red-800' :
                isWarning ? 'text-amber-600 hover:text-amber-800' :
                'text-blue-600 hover:text-blue-800'
              }`}
            >
              {isExceeded ? 'Upgrade Now' : 'Upgrade'}
            </Link>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isExceeded ? 'bg-red-500' :
              isWarning ? 'bg-amber-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
      </div>
    )
  }

  // Full variant
  return (
    <div className={`rounded-xl border p-4 ${
      isExceeded ? 'bg-red-50 border-red-200' :
      isWarning ? 'bg-amber-50 border-amber-200' :
      'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">Document Analysis Quota</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {tier} Plan - Resets at end of billing period
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          tier === 'STARTER' ? 'bg-gray-100 text-gray-700' :
          tier === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {tier}
        </span>
      </div>

      {documents.isUnlimited ? (
        <div className="flex items-center gap-2 text-green-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Unlimited document analyses</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Used</p>
              <p className={`text-2xl font-bold ${
                isExceeded ? 'text-red-600' : 'text-gray-900'
              }`}>
                {documents.used}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Remaining</p>
              <p className={`text-2xl font-bold ${
                isExceeded ? 'text-red-600' :
                isWarning ? 'text-amber-600' :
                'text-green-600'
              }`}>
                {documents.remaining}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{percentUsed.toFixed(0)}% used</span>
              <span>{documents.limit} total</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isExceeded ? 'bg-red-500' :
                  isWarning ? 'bg-amber-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${Math.min(100, percentUsed)}%` }}
              />
            </div>
          </div>

          {isExceeded && (
            <div className="flex items-start gap-2 p-2 bg-red-100 rounded-lg mb-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-700">
                Quota exceeded. Upgrade to Business plan for unlimited analyses.
              </p>
            </div>
          )}

          {isWarning && !isExceeded && (
            <div className="flex items-start gap-2 p-2 bg-amber-100 rounded-lg mb-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-700">
                You&apos;ve used {percentUsed.toFixed(0)}% of your monthly quota.
              </p>
            </div>
          )}

          {showUpgrade && (
            <Link
              href="/dashboard/settings/subscription"
              className={`block w-full text-center py-2 px-4 rounded-lg font-medium text-sm transition ${
                isExceeded
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isExceeded ? 'Upgrade to Continue' : 'Upgrade for More'}
            </Link>
          )}
        </>
      )}
    </div>
  )
}
