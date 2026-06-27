import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { SubscriptionStatus } from '@prisma/client'

const updateSubscriptionSchema = z.object({
  status: z.enum(['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED']).optional(),
  cancel_at_period_end: z.boolean().optional(),
  current_period_end: z.string().datetime().optional(),
  amount: z.number().min(0).optional(),
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

// GET /api/admin/subscriptions/[id] - Get a specific subscription
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const subscription = await prisma.subscription.findUnique({
    where: { id },
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
      payments: {
        orderBy: { created_at: 'desc' },
        take: 10,
      },
    },
  })

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  // Type assertion for the include
  const subWithPayments = subscription as typeof subscription & {
    payments: Array<{ amount: unknown; [key: string]: unknown }>
  }

  return NextResponse.json({
    ...subscription,
    amount: Number(subscription.amount),
    payments: subWithPayments.payments.map(p => ({
      ...p,
      amount: Number(p.amount),
    })),
  })
}

// PUT /api/admin/subscriptions/[id] - Update a subscription (admin actions)
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
    const data = updateSubscriptionSchema.parse(body)

    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: { select: { first_name: true, last_name: true, email: true } },
        plan: { select: { name: true, tier: true } },
      },
    })

    if (!existingSubscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // Build update data
    const updateData: {
      status?: SubscriptionStatus
      cancel_at_period_end?: boolean
      current_period_end?: Date
      amount?: number
    } = {}

    if (data.status !== undefined) {
      updateData.status = data.status as SubscriptionStatus
    }

    if (data.cancel_at_period_end !== undefined) {
      updateData.cancel_at_period_end = data.cancel_at_period_end
    }

    if (data.current_period_end !== undefined) {
      updateData.current_period_end = new Date(data.current_period_end)
    }

    if (data.amount !== undefined) {
      updateData.amount = data.amount
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
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
        action: 'subscription.admin_update',
        entity_type: 'Subscription',
        entity_id: subscription.id,
        old_values: {
          status: existingSubscription.status,
          cancel_at_period_end: existingSubscription.cancel_at_period_end,
          current_period_end: existingSubscription.current_period_end,
          amount: Number(existingSubscription.amount),
        },
        new_values: {
          ...data,
          user: `${existingSubscription.user.first_name} ${existingSubscription.user.last_name}`,
          plan: existingSubscription.plan.name,
        },
      },
    })

    return NextResponse.json({
      success: true,
      subscription: {
        ...subscription,
        amount: Number(subscription.amount),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Failed to update subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/subscriptions/[id] - Cancel a subscription immediately
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const existingSubscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: { select: { first_name: true, last_name: true, email: true } },
      plan: { select: { name: true, tier: true } },
    },
  })

  if (!existingSubscription) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
  }

  // Immediately cancel the subscription
  const subscription = await prisma.subscription.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancel_at_period_end: false,
      cancelled_at: new Date(),
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      user_id: session.user.id,
      action: 'subscription.admin_cancelled',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      old_values: {
        status: existingSubscription.status,
        user: `${existingSubscription.user.first_name} ${existingSubscription.user.last_name}`,
        email: existingSubscription.user.email,
        plan: existingSubscription.plan.name,
      },
      new_values: {
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString(),
      },
    },
  })

  return NextResponse.json({
    success: true,
    message: `Subscription for ${existingSubscription.user.first_name} ${existingSubscription.user.last_name} has been cancelled`,
  })
}
