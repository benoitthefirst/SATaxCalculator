import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const billingSettingsSchema = z.object({
  subscriptions_enabled: z.boolean().optional(),
  free_trial_days: z.number().min(0).max(90).optional(),
  grace_period_days: z.number().min(0).max(30).optional(),
  payfast_sandbox_mode: z.boolean().optional(),
})

async function checkAdminAccess() {
  const session = await auth()
  if (!session?.user?.id) return null
  if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
    return null
  }
  return session
}

// Billing settings keys
const BILLING_KEYS = {
  SUBSCRIPTIONS_ENABLED: 'billing.subscriptions_enabled',
  FREE_TRIAL_DAYS: 'billing.free_trial_days',
  GRACE_PERIOD_DAYS: 'billing.grace_period_days',
  PAYFAST_SANDBOX_MODE: 'billing.payfast_sandbox_mode',
}

// GET /api/admin/settings/billing - Get billing settings
export async function GET() {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await prisma.systemSetting.findMany({
    where: {
      key: { in: Object.values(BILLING_KEYS) },
    },
  })

  const settingsMap = Object.fromEntries(
    settings.map(s => [s.key.replace('billing.', ''), s.value])
  )

  return NextResponse.json({
    settings: {
      subscriptions_enabled: settingsMap.subscriptions_enabled ?? false,
      free_trial_days: settingsMap.free_trial_days ?? 14,
      grace_period_days: settingsMap.grace_period_days ?? 7,
      payfast_sandbox_mode: settingsMap.payfast_sandbox_mode ?? true,
    },
  })
}

// PUT /api/admin/settings/billing - Update billing settings
export async function PUT(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = billingSettingsSchema.parse(body)

    const updates: Array<{ key: string; value: unknown }> = []

    if (data.subscriptions_enabled !== undefined) {
      updates.push({
        key: BILLING_KEYS.SUBSCRIPTIONS_ENABLED,
        value: data.subscriptions_enabled,
      })
    }

    if (data.free_trial_days !== undefined) {
      updates.push({
        key: BILLING_KEYS.FREE_TRIAL_DAYS,
        value: data.free_trial_days,
      })
    }

    if (data.grace_period_days !== undefined) {
      updates.push({
        key: BILLING_KEYS.GRACE_PERIOD_DAYS,
        value: data.grace_period_days,
      })
    }

    if (data.payfast_sandbox_mode !== undefined) {
      updates.push({
        key: BILLING_KEYS.PAYFAST_SANDBOX_MODE,
        value: data.payfast_sandbox_mode,
      })
    }

    // Upsert each setting
    for (const update of updates) {
      await prisma.systemSetting.upsert({
        where: { key: update.key },
        create: {
          key: update.key,
          value: update.value as Prisma.InputJsonValue,
          category: 'billing',
          is_public: update.key === BILLING_KEYS.SUBSCRIPTIONS_ENABLED,
        },
        update: {
          value: update.value as Prisma.InputJsonValue,
        },
      })
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'settings.billing_updated',
        entity_type: 'SystemSetting',
        new_values: data,
      },
    })

    // Return updated settings
    const allSettings = await prisma.systemSetting.findMany({
      where: {
        key: { in: Object.values(BILLING_KEYS) },
      },
    })

    const settingsMap = Object.fromEntries(
      allSettings.map(s => [s.key.replace('billing.', ''), s.value])
    )

    return NextResponse.json({
      settings: {
        subscriptions_enabled: settingsMap.subscriptions_enabled ?? false,
        free_trial_days: settingsMap.free_trial_days ?? 14,
        grace_period_days: settingsMap.grace_period_days ?? 7,
        payfast_sandbox_mode: settingsMap.payfast_sandbox_mode ?? true,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    console.error('Failed to update billing settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// Need to import Prisma type for InputJsonValue
import { Prisma } from '@prisma/client'
