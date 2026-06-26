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
  document_analyzer: boolean
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
    document_analyzer: false,
    priority_support: false,
  },
  PROFESSIONAL: {
    transactions_per_month: -1, // Unlimited
    team_members: 5,
    companies: -1, // Unlimited - subscription covers all companies
    api_access: false,
    vehicle_logbook: true,
    asset_management: true,
    advanced_reports: true,
    csv_exports: true,
    multi_company: true,
    document_analyzer: true,
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
    document_analyzer: true,
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
  multi_company: 'Multi-company management',
  document_analyzer: 'AI Document Analyzer',
  priority_support: 'Priority support',
}

export interface UserSubscriptionInfo {
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
 * Get subscription information for a user (USER-LEVEL SUBSCRIPTION)
 */
export async function getUserSubscription(
  userId: string
): Promise<UserSubscriptionInfo> {
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId },
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
 * Get subscription for a company by looking up the company owner's subscription
 * This is a helper to maintain backward compatibility during migration
 */
export async function getSubscriptionForCompany(
  companyId: string
): Promise<UserSubscriptionInfo> {
  // Find the company owner
  const owner = await prisma.companyMember.findFirst({
    where: {
      company_id: companyId,
      role: 'owner',
      is_active: true,
    },
    select: {
      user_id: true,
    },
  })

  if (!owner) {
    // No owner found, return STARTER
    return {
      tier: 'STARTER',
      limits: TIER_LIMITS.STARTER,
      isActive: true,
      isPaidPlan: false,
      subscription: null,
    }
  }

  return getUserSubscription(owner.user_id)
}

/**
 * Check if a user has access to a specific feature
 * Returns true if subscriptions are disabled globally (all features accessible)
 */
export async function checkUserFeatureAccess(
  userId: string,
  feature: keyof FeatureLimits
): Promise<boolean> {
  // If subscriptions are disabled, all features are accessible
  const subscriptionsEnabled = await isSubscriptionsEnabled()
  if (!subscriptionsEnabled) {
    return true
  }

  const { limits, isActive } = await getUserSubscription(userId)

  if (!isActive) {
    // If subscription is not active, use STARTER limits
    const starterValue = TIER_LIMITS.STARTER[feature]
    return typeof starterValue === 'boolean' ? starterValue : starterValue !== 0
  }

  const value = limits[feature]
  return typeof value === 'boolean' ? value : value !== 0
}

/**
 * Check if a company has access to a specific feature (via owner's subscription)
 * This is a convenience wrapper for company-context operations
 */
export async function checkFeatureAccess(
  companyId: string,
  feature: keyof FeatureLimits
): Promise<boolean> {
  // If subscriptions are disabled, all features are accessible
  const subscriptionsEnabled = await isSubscriptionsEnabled()
  if (!subscriptionsEnabled) {
    return true
  }

  const { limits, isActive } = await getSubscriptionForCompany(companyId)

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
 * Check if a user is within usage limits for a numeric feature
 * Returns unlimited if subscriptions are disabled globally
 */
export async function checkUserUsageLimit(
  userId: string,
  feature: 'transactions_per_month' | 'team_members' | 'companies',
  currentUsage: number
): Promise<UsageLimitResult> {
  // If subscriptions are disabled, no limits apply
  const subscriptionsEnabled = await isSubscriptionsEnabled()
  if (!subscriptionsEnabled) {
    return {
      allowed: true,
      limit: -1,
      usage: currentUsage,
      remaining: -1,
      isUnlimited: true,
    }
  }

  const { limits, isActive } = await getUserSubscription(userId)

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
 * Check if a company is within usage limits for a numeric feature (via owner's subscription)
 * Returns unlimited if subscriptions are disabled globally
 */
export async function checkUsageLimit(
  companyId: string,
  feature: 'transactions_per_month' | 'team_members' | 'companies',
  currentUsage: number
): Promise<UsageLimitResult> {
  // If subscriptions are disabled, no limits apply
  const subscriptionsEnabled = await isSubscriptionsEnabled()
  if (!subscriptionsEnabled) {
    return {
      allowed: true,
      limit: -1,
      usage: currentUsage,
      remaining: -1,
      isUnlimited: true,
    }
  }

  const { limits, isActive } = await getSubscriptionForCompany(companyId)

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
 * Get total transaction count across all user's companies in the current month
 */
export async function getUserMonthlyTransactionCount(userId: string): Promise<number> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Get all companies the user owns
  const memberships = await prisma.companyMember.findMany({
    where: {
      user_id: userId,
      role: 'owner',
      is_active: true,
    },
    select: { company_id: true },
  })

  const companyIds = memberships.map(m => m.company_id)

  if (companyIds.length === 0) return 0

  const [expenseCount, incomeCount] = await Promise.all([
    prisma.expense.count({
      where: {
        company_id: { in: companyIds },
        is_deleted: false,
        created_at: { gte: startOfMonth },
      },
    }),
    prisma.income.count({
      where: {
        company_id: { in: companyIds },
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
 * Get total team member count across all user's companies
 */
export async function getUserTeamMemberCount(userId: string): Promise<number> {
  // Get all companies the user owns
  const memberships = await prisma.companyMember.findMany({
    where: {
      user_id: userId,
      role: 'owner',
      is_active: true,
    },
    select: { company_id: true },
  })

  const companyIds = memberships.map(m => m.company_id)

  if (companyIds.length === 0) return 0

  return prisma.companyMember.count({
    where: {
      company_id: { in: companyIds },
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
 * Check if adding a transaction would exceed the limit (company context)
 */
export async function canAddTransaction(companyId: string): Promise<UsageLimitResult> {
  const currentCount = await getMonthlyTransactionCount(companyId)
  return checkUsageLimit(companyId, 'transactions_per_month', currentCount)
}

/**
 * Check if adding a team member would exceed the limit (company context)
 */
export async function canAddTeamMember(companyId: string): Promise<UsageLimitResult> {
  const currentCount = await getTeamMemberCount(companyId)
  return checkUsageLimit(companyId, 'team_members', currentCount)
}

/**
 * Check if a user can create another company
 * Returns unlimited if subscriptions are disabled globally
 */
export async function canCreateCompany(userId: string): Promise<UsageLimitResult> {
  // If subscriptions are disabled, no limits apply
  const subscriptionsEnabled = await isSubscriptionsEnabled()
  if (!subscriptionsEnabled) {
    const companyCount = await getUserCompanyCount(userId)
    return {
      allowed: true,
      limit: -1,
      usage: companyCount,
      remaining: -1,
      isUnlimited: true,
    }
  }

  // Get the user's subscription directly
  const { limits, isActive } = await getUserSubscription(userId)
  const companyCount = await getUserCompanyCount(userId)

  // If no subscription or not active, use STARTER limits
  const effectiveLimits = isActive ? limits : TIER_LIMITS.STARTER
  const limit = effectiveLimits.companies

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
 * Returns false if setting doesn't exist or if there's an error (subscriptions disabled by default)
 */
export async function isSubscriptionsEnabled(): Promise<boolean> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'billing.subscriptions_enabled' },
    })

    // Default to false if setting doesn't exist (for safety during development)
    if (!setting) {
      return false
    }

    return setting.value === true
  } catch {
    // If SystemSetting table doesn't exist or any error, default to disabled
    return false
  }
}

/**
 * Get the effective tier for a user (considering subscription status)
 */
export async function getEffectiveTier(userId: string): Promise<SubscriptionTier> {
  const { tier, isActive } = await getUserSubscription(userId)
  return isActive ? tier : 'STARTER'
}

/**
 * Get the effective tier for a company (via owner's subscription)
 */
export async function getEffectiveTierForCompany(companyId: string): Promise<SubscriptionTier> {
  const { tier, isActive } = await getSubscriptionForCompany(companyId)
  return isActive ? tier : 'STARTER'
}

// ============================================================
// LEGACY COMPATIBILITY - These functions are deprecated
// They now use user-level subscriptions via company owner lookup
// ============================================================

/**
 * @deprecated Use getUserSubscription instead
 * Get subscription information for a company (via owner's subscription)
 */
export async function getCompanySubscription(
  companyId: string
): Promise<UserSubscriptionInfo> {
  return getSubscriptionForCompany(companyId)
}
