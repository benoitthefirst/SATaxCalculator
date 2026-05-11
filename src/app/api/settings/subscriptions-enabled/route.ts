import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/settings/subscriptions-enabled - Check if subscriptions are enabled (public)
export async function GET() {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: 'billing.subscriptions_enabled' },
  })

  return NextResponse.json({
    enabled: setting?.value === true,
  })
}
