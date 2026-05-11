import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/plans - Get all active subscription plans (public)
export async function GET() {
  // Check if subscriptions are enabled
  const subscriptionsEnabled = await prisma.systemSetting.findUnique({
    where: { key: 'billing.subscriptions_enabled' },
  })

  // If subscriptions are disabled, return empty or static plans
  if (!subscriptionsEnabled?.value) {
    return NextResponse.json({
      enabled: false,
      plans: [],
    })
  }

  const plans = await prisma.subscriptionPlan.findMany({
    where: { is_active: true },
    orderBy: { display_order: 'asc' },
    select: {
      id: true,
      name: true,
      tier: true,
      description: true,
      price_monthly: true,
      price_yearly: true,
      features: true,
      limits: true,
      display_order: true,
    },
  })

  return NextResponse.json({
    enabled: true,
    plans: plans.map(plan => ({
      ...plan,
      price_monthly: Number(plan.price_monthly),
      price_yearly: Number(plan.price_yearly),
    })),
  })
}
