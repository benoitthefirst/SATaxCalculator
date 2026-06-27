import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SubscriptionStatus, Prisma } from '@prisma/client'

async function checkAdminAccess() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return null
  }
  return session
}

// GET /api/admin/subscriptions - List all subscriptions with filters (USER-LEVEL)
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') as SubscriptionStatus | null
  const planId = searchParams.get('plan_id')
  const search = searchParams.get('search')

  const skip = (page - 1) * limit

  // Build where clause - now searching by user, not company
  const where: Prisma.SubscriptionWhereInput = {}

  if (status) {
    where.status = status
  }

  if (planId) {
    where.plan_id = planId
  }

  if (search) {
    where.user = {
      OR: [
        { first_name: { contains: search, mode: 'insensitive' } },
        { last_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  const [subscriptions, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
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
        _count: {
          select: { payments: true },
        },
      },
    }),
    prisma.subscription.count({ where }),
  ])

  // Calculate stats
  const stats = await prisma.subscription.groupBy({
    by: ['status'],
    _count: true,
  }) as Array<{ status: SubscriptionStatus; _count: number }>

  const statusCounts: Record<string, number> = Object.fromEntries(
    stats.map(s => [s.status, s._count])
  )

  // Calculate MRR (Monthly Recurring Revenue)
  const mrrData = await prisma.subscription.aggregate({
    where: {
      status: 'ACTIVE',
      billing_cycle: 'MONTHLY',
    },
    _sum: { amount: true },
  })

  const yearlyMrrData = await prisma.subscription.aggregate({
    where: {
      status: 'ACTIVE',
      billing_cycle: 'YEARLY',
    },
    _sum: { amount: true },
  })

  const monthlyMrr = Number(mrrData._sum.amount || 0)
  const yearlyMrr = Number(yearlyMrrData._sum.amount || 0) / 12 // Convert yearly to monthly
  const totalMrr = monthlyMrr + yearlyMrr

  return NextResponse.json({
    subscriptions: subscriptions.map(sub => ({
      ...sub,
      amount: Number(sub.amount),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    stats: {
      total: total,
      active: statusCounts['ACTIVE'] || 0,
      trialing: statusCounts['TRIALING'] || 0,
      past_due: statusCounts['PAST_DUE'] || 0,
      cancelled: statusCounts['CANCELLED'] || 0,
      expired: statusCounts['EXPIRED'] || 0,
      mrr: totalMrr,
    },
  })
}
