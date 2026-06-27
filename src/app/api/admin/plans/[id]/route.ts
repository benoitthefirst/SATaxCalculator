import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const limitsSchema = z.object({
  transactions_per_month: z.number(),
  team_members: z.number(),
  companies: z.number(),
  documents_per_month: z.number(),
  api_access: z.boolean(),
  vehicle_logbook: z.boolean(),
  asset_management: z.boolean(),
  advanced_reports: z.boolean(),
  csv_exports: z.boolean(),
  multi_company: z.boolean(),
  document_analyzer: z.boolean(),
  priority_support: z.boolean(),
})

const updatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price_monthly: z.number().min(0).optional(),
  price_yearly: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  limits: limitsSchema.optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().optional(),
})

async function checkAdminAccess() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return null
  }
  return session
}

// GET /api/admin/plans/[id] - Get a specific plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  })

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  }

  // Get subscription statistics
  const [activeCount, cancelledCount, revenueData] = await Promise.all([
    prisma.subscription.count({
      where: { plan_id: id, status: 'ACTIVE' },
    }),
    prisma.subscription.count({
      where: { plan_id: id, status: 'CANCELLED' },
    }),
    prisma.payment.aggregate({
      where: {
        subscription: { plan_id: id },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
      _count: true,
    }),
  ])

  return NextResponse.json({
    ...plan,
    price_monthly: Number(plan.price_monthly),
    price_yearly: Number(plan.price_yearly),
    stats: {
      total_subscriptions: plan._count.subscriptions,
      active_subscriptions: activeCount,
      cancelled_subscriptions: cancelledCount,
      total_revenue: Number(revenueData._sum.amount || 0),
      total_payments: revenueData._count,
    },
  })
}

// PUT /api/admin/plans/[id] - Update a plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const data = updatePlanSchema.parse(body)

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    })

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: data.name,
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
        action: 'subscription_plan.updated',
        entity_type: 'SubscriptionPlan',
        entity_id: plan.id,
        old_values: {
          name: existingPlan.name,
          price_monthly: Number(existingPlan.price_monthly),
          price_yearly: Number(existingPlan.price_yearly),
          is_active: existingPlan.is_active,
        },
        new_values: data,
      },
    })

    return NextResponse.json({
      ...plan,
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Failed to update plan:', error)
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/plans/[id] - Delete a plan (only if no subscriptions)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id },
    include: {
      _count: { select: { subscriptions: true } },
    },
  })

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
  }

  if (plan._count.subscriptions > 0) {
    return NextResponse.json(
      {
        error: 'Cannot delete plan with active subscriptions. Deactivate the plan instead.',
      },
      { status: 400 }
    )
  }

  await prisma.subscriptionPlan.delete({
    where: { id },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      user_id: session.user.id,
      action: 'subscription_plan.deleted',
      entity_type: 'SubscriptionPlan',
      entity_id: id,
      old_values: {
        name: plan.name,
        tier: plan.tier,
      },
    },
  })

  return NextResponse.json({ success: true })
}
