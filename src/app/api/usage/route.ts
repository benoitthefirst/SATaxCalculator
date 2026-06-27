import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getUserUsageStats } from '@/lib/subscription/feature-gate'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usageStats = await getUserUsageStats(session.user.id)

    return NextResponse.json({
      success: true,
      ...usageStats,
    })
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    )
  }
}
