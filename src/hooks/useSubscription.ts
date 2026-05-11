'use client'

import { useQuery } from '@tanstack/react-query'
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client'

type BillingCycle = 'MONTHLY' | 'YEARLY'

export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  price_monthly: number
  price_yearly: number
  features: string[]
  limits: FeatureLimits
}

export interface FeatureLimits {
  transactions_per_month: number
  team_members: number
  companies: number
  api_access: boolean
  vehicle_logbook: boolean
  asset_management: boolean
  advanced_reports: boolean
  csv_exports: boolean
  multi_company: boolean
  priority_support: boolean
}

export interface SubscriptionData {
  subscription: {
    id: string
    status: SubscriptionStatus
    billing_cycle: BillingCycle
    current_period_start: string
    current_period_end: string
    next_billing_date: string | null
    cancel_at_period_end: boolean
    cancelled_at: string | null
    amount: number
    plan: SubscriptionPlan
  } | null
  company: {
    id: string
    name: string
  }
  tier: SubscriptionTier
  limits: FeatureLimits
  isActive: boolean
  isPaidPlan: boolean
  usage: {
    transactions_this_month: number
    team_members: number
  }
}

/**
 * Hook to fetch current subscription data
 */
export function useSubscription() {
  return useQuery<SubscriptionData>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await fetch('/api/subscriptions')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to check if user has access to a specific feature
 */
export function useFeatureAccess(feature: keyof FeatureLimits) {
  const { data, isLoading, error } = useSubscription()

  if (isLoading || error || !data) {
    return {
      hasAccess: false,
      isLoading,
      error,
      tier: 'STARTER' as SubscriptionTier,
    }
  }

  const value = data.limits[feature]
  const hasAccess = typeof value === 'boolean' ? value : value !== 0

  return {
    hasAccess,
    isLoading: false,
    error: null,
    tier: data.tier,
    limit: typeof value === 'number' ? value : undefined,
  }
}

/**
 * Hook to check usage limits
 */
export function useUsageLimit(feature: 'transactions_per_month' | 'team_members') {
  const { data, isLoading, error } = useSubscription()

  if (isLoading || error || !data) {
    return {
      allowed: false,
      isLoading,
      error,
      limit: 0,
      usage: 0,
      remaining: 0,
      isUnlimited: false,
    }
  }

  const limit = data.limits[feature]
  const usage =
    feature === 'transactions_per_month'
      ? data.usage.transactions_this_month
      : data.usage.team_members

  const isUnlimited = limit === -1
  const remaining = isUnlimited ? -1 : Math.max(0, limit - usage)
  const allowed = isUnlimited || usage < limit

  return {
    allowed,
    isLoading: false,
    error: null,
    limit,
    usage,
    remaining,
    isUnlimited,
  }
}

/**
 * Hook to fetch available subscription plans
 */
export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const response = await fetch('/api/plans')
      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }
      const data = await response.json()
      return data.plans
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

/**
 * Check if subscriptions are enabled
 */
export function useSubscriptionsEnabled() {
  return useQuery<boolean>({
    queryKey: ['subscriptions-enabled'],
    queryFn: async () => {
      const response = await fetch('/api/settings/subscriptions-enabled')
      if (!response.ok) {
        return false
      }
      const data = await response.json()
      return data.enabled
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
