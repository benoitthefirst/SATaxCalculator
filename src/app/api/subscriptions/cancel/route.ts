import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { cancelSubscription } from '@/lib/payfast/subscription'
import { sendEmail, subscriptionCancelledEmail } from '@/lib/email'
import { format } from 'date-fns'

// POST /api/subscriptions/cancel - Cancel the user's subscription (USER-LEVEL)
export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get user's subscription directly (user-level subscription)
    const subscription = await prisma.subscription.findUnique({
      where: { user_id: session.user.id },
      include: { plan: true },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    if (subscription.status === 'CANCELLED' || subscription.cancel_at_period_end) {
      return NextResponse.json(
        { error: 'Subscription is already cancelled' },
        { status: 400 }
      )
    }

    // If free plan, nothing to cancel
    if (subscription.plan.tier === 'STARTER') {
      return NextResponse.json(
        { error: 'Cannot cancel free plan' },
        { status: 400 }
      )
    }

    // Cancel with PayFast if token exists
    if (subscription.payfast_token) {
      try {
        await cancelSubscription(subscription.payfast_token)
      } catch (error) {
        console.error('PayFast cancellation error:', error)
        // Continue anyway - mark as cancelled in our system
      }
    }

    // Mark subscription as cancelled but allow access until period end
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancel_at_period_end: true,
        cancelled_at: new Date(),
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'subscription.cancelled',
        entity_type: 'Subscription',
        entity_id: subscription.id,
        metadata: {
          plan_id: subscription.plan_id,
          plan_name: subscription.plan.name,
          access_until: subscription.current_period_end,
          user_id: session.user.id,
        },
      },
    })

    // Send cancellation confirmation email
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, first_name: true },
      })

      if (user) {
        const resubscribeUrl = `${process.env.NEXTAUTH_URL || 'https://www.processx.co.za'}/settings/subscription`
        const emailContent = subscriptionCancelledEmail({
          firstName: user.first_name,
          planName: subscription.plan.name,
          accessUntil: format(subscription.current_period_end, 'd MMMM yyyy'),
          resubscribeUrl,
        })

        await sendEmail({ to: user.email, ...emailContent })
      }
    } catch (emailError) {
      console.error('Failed to send cancellation email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      access_until: subscription.current_period_end,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
