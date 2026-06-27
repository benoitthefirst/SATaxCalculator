import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const assignSubscriptionSchema = z.object({
  userId: z.string().min(1),
  planId: z.string().min(1),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  durationMonths: z.number().min(1).max(36).default(12),
  notes: z.string().optional(),
})

async function checkAdminAccess() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return null
  }
  return session
}

// POST /api/admin/subscriptions/assign - Manually assign a subscription to a user
export async function POST(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = assignSubscriptionSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if plan exists
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: data.planId },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Check for existing active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: data.userId,
        status: { in: ['ACTIVE', 'TRIALING'] },
      },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription. Cancel it first before assigning a new one.' },
        { status: 400 }
      )
    }

    // Calculate period dates
    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + data.durationMonths)

    // Calculate amount (for Enterprise, amount is 0 or custom)
    const amount = data.billingCycle === 'YEARLY'
      ? Number(plan.price_yearly)
      : Number(plan.price_monthly)

    // Create the subscription (manually assigned, no PayFast)
    const subscription = await prisma.subscription.create({
      data: {
        user_id: data.userId,
        plan_id: data.planId,
        status: 'ACTIVE',
        billing_cycle: data.billingCycle,
        amount: amount,
        current_period_start: now,
        current_period_end: periodEnd,
        // No payfast_token since this is manually assigned
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            name: true,
            tier: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'subscription.manual_assignment',
        entity_type: 'Subscription',
        entity_id: subscription.id,
        new_values: {
          assigned_to_user: data.userId,
          plan_id: data.planId,
          plan_name: plan.name,
          plan_tier: plan.tier,
          billing_cycle: data.billingCycle,
          duration_months: data.durationMonths,
          amount: amount,
          notes: data.notes,
        },
      },
    })

    return NextResponse.json({
      success: true,
      subscription: {
        ...subscription,
        amount: Number(subscription.amount),
      },
      message: `Successfully assigned ${plan.name} plan to ${user.first_name} ${user.last_name}`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Failed to assign subscription:', error)
    return NextResponse.json(
      { error: 'Failed to assign subscription' },
      { status: 500 }
    )
  }
}
