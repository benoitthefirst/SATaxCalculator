import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  getCompanySubscription,
  getMonthlyTransactionCount,
  getTeamMemberCount,
} from '@/lib/subscription/feature-gate'
import { buildSubscriptionForm, getCheckoutUrl } from '@/lib/payfast/subscription'

type BillingCycle = 'MONTHLY' | 'YEARLY'

// GET /api/subscriptions - Get current subscription for user's company
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's company
  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  if (!membership) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 })
  }

  const companyId = membership.company.id
  const subscriptionInfo = await getCompanySubscription(companyId)

  // Get usage stats
  const [transactionsCount, teamMembersCount] = await Promise.all([
    getMonthlyTransactionCount(companyId),
    getTeamMemberCount(companyId),
  ])

  return NextResponse.json({
    subscription: subscriptionInfo.subscription
      ? {
          id: subscriptionInfo.subscription.id,
          status: subscriptionInfo.subscription.status,
          billing_cycle: subscriptionInfo.subscription.cancel_at_period_end
            ? null
            : 'MONTHLY', // We'd need to store this
          current_period_start: subscriptionInfo.subscription.current_period_end, // simplified
          current_period_end: subscriptionInfo.subscription.current_period_end,
          next_billing_date: subscriptionInfo.subscription.current_period_end,
          cancel_at_period_end: subscriptionInfo.subscription.cancel_at_period_end,
          cancelled_at: null,
          amount: 0, // We'd need to store this
          plan: subscriptionInfo.subscription.plan,
        }
      : null,
    company: {
      id: membership.company.id,
      name: membership.company.name,
    },
    tier: subscriptionInfo.tier,
    limits: subscriptionInfo.limits,
    isActive: subscriptionInfo.isActive,
    isPaidPlan: subscriptionInfo.isPaidPlan,
    usage: {
      transactions_this_month: transactionsCount,
      team_members: teamMembersCount,
    },
  })
}

// POST /api/subscriptions - Create checkout session for subscription
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { planId, billingCycle } = body

    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: 'planId and billingCycle are required' },
        { status: 400 }
      )
    }

    // Check if subscriptions are enabled
    const subscriptionsEnabled = await prisma.systemSetting.findUnique({
      where: { key: 'billing.subscriptions_enabled' },
    })

    if (!subscriptionsEnabled?.value) {
      return NextResponse.json(
        { error: 'Subscriptions are currently disabled' },
        { status: 400 }
      )
    }

    // Get plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (!plan || !plan.is_active) {
      return NextResponse.json({ error: 'Plan not found or inactive' }, { status: 404 })
    }

    if (plan.tier === 'STARTER') {
      return NextResponse.json(
        { error: 'Cannot subscribe to free plan via checkout' },
        { status: 400 }
      )
    }

    // Get user's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
      include: { company: true },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 })
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate amount
    const amount =
      billingCycle === 'YEARLY'
        ? Number(plan.price_yearly)
        : Number(plan.price_monthly)

    // Build PayFast form data
    const formData = buildSubscriptionForm({
      planId: plan.id,
      companyId: membership.company.id,
      billingCycle: billingCycle as BillingCycle,
      amount,
      itemName: `ProcessX ${plan.name} Plan`,
      customerEmail: user.email,
      customerFirstName: user.first_name,
      customerLastName: user.last_name,
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'subscription.checkout_initiated',
        entity_type: 'Subscription',
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name,
          billing_cycle: billingCycle,
          amount,
          company_id: membership.company.id,
        },
      },
    })

    return NextResponse.json({
      checkoutUrl: getCheckoutUrl(),
      formData,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
