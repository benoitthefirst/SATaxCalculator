import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { SubscriptionTier } from '@prisma/client'

const limitsSchema = z.object({
  transactions_per_month: z.number(),
  team_members: z.number(),
  companies: z.number(),
  api_access: z.boolean(),
  vehicle_logbook: z.boolean(),
  asset_management: z.boolean(),
  advanced_reports: z.boolean(),
  csv_exports: z.boolean(),
  multi_company: z.boolean(),
  priority_support: z.boolean(),
})

const createPlanSchema = z.object({
  name: z.string().min(1),
  tier: z.enum(['STARTER', 'PROFESSIONAL', 'BUSINESS']),
  description: z.string().optional(),
  price_monthly: z.number().min(0),
  price_yearly: z.number().min(0),
  features: z.array(z.string()),
  limits: limitsSchema,
  is_active: z.boolean().default(true),
  display_order: z.number().default(0),
})

async function checkAdminAccess() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return null
  }
  return session
}

// GET /api/admin/plans - List all subscription plans
export async function GET() {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { display_order: 'asc' },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  })

  // Get active subscription counts by plan
  const activeCounts = await prisma.subscription.groupBy({
    by: ['plan_id'],
    where: {
      status: 'ACTIVE',
    },
    _count: true,
  }) as Array<{ plan_id: string; _count: number }>

  const activeCountMap: Record<string, number> = Object.fromEntries(
    activeCounts.map(c => [c.plan_id, c._count])
  )

  const plansWithStats = plans.map(plan => {
    const planWithCount = plan as typeof plan & { _count: { subscriptions: number } }
    return {
      ...plan,
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly),
      total_subscriptions: planWithCount._count.subscriptions,
      active_subscriptions: activeCountMap[plan.id] || 0,
    }
  })

  return NextResponse.json({ plans: plansWithStats })
}

// POST /api/admin/plans - Create a new plan
export async function POST(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = createPlanSchema.parse(body)

    // Check if tier already exists
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { tier: data.tier as SubscriptionTier },
    })

    if (existing) {
      return NextResponse.json(
        { error: `Plan with tier ${data.tier} already exists` },
        { status: 400 }
      )
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        tier: data.tier as SubscriptionTier,
        description: data.description,
        price_monthly: data.price_monthly,
        price_yearly: data.price_yearly,
        features: data.features,
        limits: data.limits,
        is_active: data.is_active,
        display_order: data.display_order,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'subscription_plan.created',
        entity_type: 'SubscriptionPlan',
        entity_id: plan.id,
        new_values: data,
      },
    })

    return NextResponse.json(
      {
        ...plan,
        price_monthly: Number(plan.price_monthly),
        price_yearly: Number(plan.price_yearly),
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Failed to create plan:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}
