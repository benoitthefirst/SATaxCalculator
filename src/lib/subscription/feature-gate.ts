import { prisma } from '@/lib/db'
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client'

// Feature limits interface
export interface FeatureLimits {
  transactions_per_month: number // -1 = unlimited
  team_members: number // -1 = unlimited
  companies: number // -1 = unlimited
  api_access: boolean
  vehicle_logbook: boolean
  asset_management: boolean
  advanced_reports: boolean
  csv_exports: boolean
  multi_company: boolean
  priority_support: boolean
}

// Default limits by tier
export const TIER_LIMITS: Record<SubscriptionTier, FeatureLimits> = {
  STARTER: {
    transactions_per_month: 50,
    team_members: 1,
    companies: 1,
    api_access: false,
    vehicle_logbook: false,
    asset_management: false,
    advanced_reports: false,
    csv_exports: false,
    multi_company: false,
    priority_support: false,
  },
  PROFESSIONAL: {
    transactions_per_month: -1, // Unlimited
    team_members: 5,
    companies: 1,
    api_access: false,
    vehicle_logbook: true,
    asset_management: true,
    advanced_reports: true,
    csv_exports: true,
    multi_company: false,
    priority_support: true,
  },
  BUSINESS: {
    transactions_per_month: -1, // Unlimited
    team_members: -1, // Unlimited
    companies: -1, // Unlimited
    api_access: true,
    vehicle_logbook: true,
    asset_management: true,
    advanced_reports: true,
    csv_exports: true,
    multi_company: true,
    priority_support: true,
  },
}

// Feature names for display
export const FEATURE_NAMES: Record<keyof FeatureLimits, string> = {
  transactions_per_month: 'Transactions per month',
  team_members: 'Team members',
  companies: 'Companies',
  api_access: 'API access',
  vehicle_logbook: 'Vehicle logbook',
  asset_management: 'Asset management',
  advanced_reports: 'Advanced reports & analytics',
  csv_exports: 'CSV exports',
  multi_company: 'Multi-company support',
  priority_support: 'Priority support',
}

export interface CompanySubscriptionInfo {
  tier: SubscriptionTier
  limits: FeatureLimits
  isActive: boolean
  isPaidPlan: boolean
  subscription: {
    id: string
    status: SubscriptionStatus
    current_period_end: Date
    cancel_at_period_end: boolean
    plan: {
      id: string
      name: string
      tier: SubscriptionTier
    }
  } | null
}

/**
 * Get subscription information for a company
 */
export async function getCompanySubscription(
  companyId: string
): Promise<CompanySubscriptionInfo> {
  const subscription = await prisma.subscription.findUnique({
    where: { company_id: companyId },
    include: {
      plan: {
        select: {
          id: true,
          name: true,
          tier: true,
          limits: true,
        },
      },
    },
  })

  // Default to STARTER tier if no subscription
  if (!subscription) {
    return {
      tier: 'STARTER',
      limits: TIER_LIMITS.STARTER,
      isActive: true, // Free tier is always "active"
      isPaidPlan: false,
      subscription: null,
    }
  }

  // Check if subscription is effectively active
  const now = new Date()
  const isWithinPeriod = subscription.current_period_end > now
  const isActiveStatus = ['ACTIVE', 'TRIALING'].includes(subscription.status)
  const isActive = isActiveStatus || (subscription.cancel_at_period_end && isWithinPeriod)

  // Get limits from plan or fallback to tier defaults
  const planLimits = subscription.plan.limits as FeatureLimits | null
  const limits = planLimits || TIER_LIMITS[subscription.plan.tier]

  return {
    tier: subscription.plan.tier,
    limits,
    isActive,
    isPaidPlan: subscription.plan.tier !== 'STARTER',
    subscription: {
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      plan: subscription.plan,
    },
  }
}

/**
 * Check if a company has access to a specific feature
 */
export async function checkFeatureAccess(
  companyId: string,
  feature: keyof FeatureLimits
): Promise<boolean> {
  const { limits, isActive } = await getCompanySubscription(companyId)

  if (!isActive) {
    // If subscription is not active, use STARTER limits
    const starterValue = TIER_LIMITS.STARTER[feature]
    return typeof starterValue === 'boolean' ? starterValue : starterValue !== 0
  }

  const value = limits[feature]
  return typeof value === 'boolean' ? value : value !== 0
}

export interface UsageLimitResult {
  allowed: boolean
  limit: number
  usage: number
  remaining: number
  isUnlimited: boolean
}

/**
 * Check if a company is within usage limits for a numeric feature
 */
export async function checkUsageLimit(
  companyId: string,
  feature: 'transactions_per_month' | 'team_members' | 'companies',
  currentUsage: number
): Promise<UsageLimitResult> {
  const { limits, isActive } = await getCompanySubscription(companyId)

  // If not active, use STARTER limits
  const effectiveLimits = isActive ? limits : TIER_LIMITS.STARTER
  const limit = effectiveLimits[feature]

  // -1 means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      limit: -1,
      usage: currentUsage,
      remaining: -1,
      isUnlimited: true,
    }
  }

  const remaining = Math.max(0, limit - currentUsage)
  const allowed = currentUsage < limit

  return {
    allowed,
    limit,
    usage: currentUsage,
    remaining,
    isUnlimited: false,
  }
}

/**
 * Get current transaction count for a company in the current month
 */
export async function getMonthlyTransactionCount(companyId: string): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [expenseCount, incomeCount] = await Promise.all([
    prisma.expense.count({
      where: {
        company_id: companyId,
        is_deleted: false,
        created_at: { gte: startOfMonth },
      },
    }),
    prisma.income.count({
      where: {
        company_id: companyId,
        is_deleted: false,
        created_at: { gte: startOfMonth },
      },
    }),
  ])

  return expenseCount + incomeCount
}

/**
 * Get current team member count for a company
 */
export async function getTeamMemberCount(companyId: string): Promise<number> {
  return prisma.companyMember.count({
    where: {
      company_id: companyId,
      is_active: true,
    },
  })
}

/**
 * Get company count for a user
 */
export async function getUserCompanyCount(userId: string): Promise<number> {
  return prisma.companyMember.count({
    where: {
      user_id: userId,
      is_active: true,
      role: 'owner', // Only count companies they own
    },
  })
}

/**
 * Check if adding a transaction would exceed the limit
 */
export async function canAddTransaction(companyId: string): Promise<UsageLimitResult> {
  const currentCount = await getMonthlyTransactionCount(companyId)
  return checkUsageLimit(companyId, 'transactions_per_month', currentCount)
}

/**
 * Check if adding a team member would exceed the limit
 */
export async function canAddTeamMember(companyId: string): Promise<UsageLimitResult> {
  const currentCount = await getTeamMemberCount(companyId)
  return checkUsageLimit(companyId, 'team_members', currentCount)
}

/**
 * Check if a user can create another company
 */
export async function canCreateCompany(userId: string): Promise<UsageLimitResult> {
  // Get the user's primary company subscription
  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: userId,
      is_active: true,
      role: 'owner',
    },
    include: {
      company: {
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      },
    },
    orderBy: {
      joined_at: 'asc', // First company
    },
  })

  if (!membership) {
    // No company yet, they can create one
    return {
      allowed: true,
      limit: 1,
      usage: 0,
      remaining: 1,
      isUnlimited: false,
    }
  }

  const companyCount = await getUserCompanyCount(userId)
  const membershipWithCompany = membership as typeof membership & {
    company: { subscription: { plan: { tier: SubscriptionTier; limits: unknown } } | null }
  }
  const subscription = membershipWithCompany.company.subscription

  if (!subscription) {
    // No subscription, use STARTER limits
    return {
      allowed: companyCount < 1,
      limit: 1,
      usage: companyCount,
      remaining: Math.max(0, 1 - companyCount),
      isUnlimited: false,
    }
  }

  const limits = (subscription.plan.limits as FeatureLimits) || TIER_LIMITS[subscription.plan.tier]
  const limit = limits.companies

  if (limit === -1) {
    return {
      allowed: true,
      limit: -1,
      usage: companyCount,
      remaining: -1,
      isUnlimited: true,
    }
  }

  return {
    allowed: companyCount < limit,
    limit,
    usage: companyCount,
    remaining: Math.max(0, limit - companyCount),
    isUnlimited: false,
  }
}

/**
 * Check if subscriptions are enabled in system settings
 */
export async function isSubscriptionsEnabled(): Promise<boolean> {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: 'billing.subscriptions_enabled' },
  })

  // Default to false if setting doesn't exist (for safety during development)
  if (!setting) {
    return false
  }

  return setting.value === true
}

/**
 * Get the effective tier for a company (considering subscription status)
 */
export async function getEffectiveTier(companyId: string): Promise<SubscriptionTier> {
  const { tier, isActive } = await getCompanySubscription(companyId)
  return isActive ? tier : 'STARTER'
}
