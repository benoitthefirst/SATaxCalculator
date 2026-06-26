import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateSignature } from '@/lib/payfast/signature'
import { PAYFAST_CONFIG, PAYFAST_IPS } from '@/lib/payfast'
import { addMonths, addYears, format } from 'date-fns'
import { SubscriptionStatus } from '@prisma/client'
import {
  sendEmail,
  subscriptionCreatedEmail,
  paymentSuccessEmail,
  paymentFailedEmail,
} from '@/lib/email'

type BillingCycle = 'MONTHLY' | 'YEARLY'

// PayFast ITN payment status values
type PayFastPaymentStatus = 'COMPLETE' | 'FAILED' | 'PENDING' | 'CANCELLED'

interface ITNPayload {
  m_payment_id: string
  pf_payment_id: string
  payment_status: PayFastPaymentStatus
  item_name: string
  item_description?: string
  amount_gross: string
  amount_fee: string
  amount_net: string
  custom_str1: string // user_id (changed from company_id for user-level subscriptions)
  custom_str2: string // plan_id
  custom_str3: string // billing_cycle
  custom_str4?: string
  custom_str5?: string
  custom_int1?: string
  custom_int2?: string
  custom_int3?: string
  custom_int4?: string
  custom_int5?: string
  name_first?: string
  name_last?: string
  email_address?: string
  merchant_id: string
  token?: string // subscription token
  billing_date?: string
  signature: string
  [key: string]: string | undefined
}

/**
 * PayFast ITN (Instant Transaction Notification) Webhook Handler
 *
 * This endpoint receives payment notifications from PayFast when:
 * - A subscription is created (first payment)
 * - A recurring payment is processed
 * - A payment fails
 * - A subscription is cancelled
 *
 * NOTE: As of the user-level subscription migration, custom_str1 now contains
 * the user_id instead of company_id. Subscriptions are now user-level.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[PayFast ITN] Webhook received')
    console.log('[PayFast ITN] Sandbox mode:', PAYFAST_CONFIG.sandbox)

    // Get client IP for validation
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0].trim() || ''
    console.log('[PayFast ITN] Client IP:', clientIp)

    // Validate source IP in production (skip in sandbox mode)
    if (!PAYFAST_CONFIG.sandbox && !PAYFAST_IPS.includes(clientIp)) {
      console.error('[PayFast ITN] Invalid source IP:', clientIp)
      return new NextResponse('Invalid source', { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const payload: ITNPayload = {} as ITNPayload

    for (const [key, value] of formData.entries()) {
      payload[key] = String(value)
    }

    console.log('[PayFast ITN] Received notification:', {
      payment_status: payload.payment_status,
      m_payment_id: payload.m_payment_id,
      pf_payment_id: payload.pf_payment_id,
      user_id: payload.custom_str1,
      plan_id: payload.custom_str2,
      amount: payload.amount_gross,
    })

    // Validate signature (skip in sandbox mode for easier testing)
    if (!PAYFAST_CONFIG.sandbox) {
      const { signature, ...dataWithoutSignature } = payload
      const isValid = validateSignature(
        dataWithoutSignature,
        signature,
        PAYFAST_CONFIG.passphrase
      )

      if (!isValid) {
        console.error('[PayFast ITN] Invalid signature')
        return new NextResponse('Invalid signature', { status: 400 })
      }
    } else {
      console.log('[PayFast ITN] Sandbox mode - skipping signature validation')
    }

    // Extract custom data - now user_id instead of company_id
    const userId = payload.custom_str1
    const planId = payload.custom_str2
    const billingCycle = payload.custom_str3 as BillingCycle

    if (!userId || !planId) {
      console.error('[PayFast ITN] Missing user_id or plan_id')
      return new NextResponse('Missing required data', { status: 400 })
    }

    // Handle based on payment status
    switch (payload.payment_status) {
      case 'COMPLETE':
        await handleSuccessfulPayment(payload, userId, planId, billingCycle)
        break

      case 'FAILED':
        await handleFailedPayment(payload, userId)
        break

      case 'CANCELLED':
        await handleCancelledSubscription(userId)
        break

      case 'PENDING':
        // Log but don't take action
        console.log('[PayFast ITN] Payment pending:', payload.m_payment_id)
        break

      default:
        console.log('[PayFast ITN] Unknown status:', payload.payment_status)
    }

    // Always return 200 to acknowledge receipt
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[PayFast ITN] Error processing notification:', error)
    // Still return 200 to prevent PayFast from retrying indefinitely
    // Log the error for investigation
    return new NextResponse('OK', { status: 200 })
  }
}

async function handleSuccessfulPayment(
  payload: ITNPayload,
  userId: string,
  planId: string,
  billingCycle: BillingCycle
) {
  const now = new Date()
  const periodEnd =
    billingCycle === 'YEARLY' ? addYears(now, 1) : addMonths(now, 1)

  const amount = parseFloat(payload.amount_gross)
  const fee = payload.amount_fee ? parseFloat(payload.amount_fee) : null
  const netAmount = payload.amount_net ? parseFloat(payload.amount_net) : null

  // Upsert subscription (create if new, update if existing) - NOW USER-LEVEL
  const subscription = await prisma.subscription.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      plan_id: planId,
      status: 'ACTIVE' as SubscriptionStatus,
      billing_cycle: billingCycle,
      payfast_token: payload.token || null,
      current_period_start: now,
      current_period_end: periodEnd,
      next_billing_date: periodEnd,
      amount: amount,
      currency: 'ZAR',
    },
    update: {
      status: 'ACTIVE' as SubscriptionStatus,
      plan_id: planId,
      billing_cycle: billingCycle,
      payfast_token: payload.token || undefined,
      current_period_start: now,
      current_period_end: periodEnd,
      next_billing_date: periodEnd,
      amount: amount,
      cancel_at_period_end: false,
      cancelled_at: null,
    },
  })

  // Record the payment
  await prisma.payment.create({
    data: {
      subscription_id: subscription.id,
      m_payment_id: payload.m_payment_id,
      pf_payment_id: payload.pf_payment_id,
      amount: amount,
      fee: fee,
      net_amount: netAmount,
      status: 'COMPLETED',
      payment_method: 'payfast',
      period_start: now,
      period_end: periodEnd,
      paid_at: now,
      itn_payload: payload as unknown as Record<string, unknown>,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      user_id: userId,
      action: 'subscription.payment_received',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        user_id: userId,
        plan_id: planId,
        amount: payload.amount_gross,
        pf_payment_id: payload.pf_payment_id,
        billing_cycle: billingCycle,
      },
    },
  })

  // Send email notification
  try {
    // Get user's details directly (no need to look up via company)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, first_name: true },
    })

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    })

    if (user && plan) {
      const isNewSubscription = subscription.created_at.getTime() === subscription.updated_at.getTime()
      const formattedAmount = `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
      const dashboardUrl = `${process.env.NEXTAUTH_URL || 'https://www.processx.co.za'}/dashboard`

      if (isNewSubscription) {
        // Send subscription created email
        const emailContent = subscriptionCreatedEmail({
          firstName: user.first_name,
          planName: plan.name,
          amount: formattedAmount,
          billingCycle: billingCycle === 'YEARLY' ? 'year' : 'month',
          nextBillingDate: format(periodEnd, 'd MMMM yyyy'),
          dashboardUrl,
        })

        await sendEmail({ to: user.email, ...emailContent })
      } else {
        // Send payment success email for recurring payments
        const emailContent = paymentSuccessEmail({
          firstName: user.first_name,
          planName: plan.name,
          amount: formattedAmount,
          paymentDate: format(now, 'd MMMM yyyy'),
        })

        await sendEmail({ to: user.email, ...emailContent })
      }
    }
  } catch (emailError) {
    console.error('[PayFast ITN] Failed to send payment email:', emailError)
  }

  console.log('[PayFast ITN] Payment processed successfully:', {
    subscription_id: subscription.id,
    user_id: userId,
    amount: payload.amount_gross,
  })
}

async function handleFailedPayment(payload: ITNPayload, userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId },
  })

  if (!subscription) {
    console.error('[PayFast ITN] No subscription found for failed payment:', userId)
    return
  }

  // Update subscription status to PAST_DUE
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'PAST_DUE' as SubscriptionStatus },
  })

  // Record the failed payment
  await prisma.payment.create({
    data: {
      subscription_id: subscription.id,
      m_payment_id: payload.m_payment_id,
      pf_payment_id: payload.pf_payment_id,
      amount: parseFloat(payload.amount_gross || '0'),
      status: 'FAILED',
      period_start: new Date(),
      period_end: new Date(),
      failed_at: new Date(),
      failure_reason: 'Payment failed at PayFast',
      itn_payload: payload as unknown as Record<string, unknown>,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      user_id: userId,
      action: 'subscription.payment_failed',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        user_id: userId,
        m_payment_id: payload.m_payment_id,
        amount: payload.amount_gross,
      },
    },
  })

  // Send payment failed email
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, first_name: true },
    })

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: subscription.plan_id },
    })

    if (user && plan) {
      const formattedAmount = `R ${parseFloat(payload.amount_gross || '0').toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
      const retryDate = format(addMonths(new Date(), 0), 'd MMMM yyyy') // PayFast will retry
      const updatePaymentUrl = `${process.env.NEXTAUTH_URL || 'https://www.processx.co.za'}/settings/subscription`

      const emailContent = paymentFailedEmail({
        firstName: user.first_name,
        planName: plan.name,
        amount: formattedAmount,
        retryDate,
        updatePaymentUrl,
      })

      await sendEmail({ to: user.email, ...emailContent })
    }
  } catch (emailError) {
    console.error('[PayFast ITN] Failed to send payment failed email:', emailError)
  }

  console.log('[PayFast ITN] Payment failed:', {
    subscription_id: subscription.id,
    user_id: userId,
  })
}

async function handleCancelledSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId },
  })

  if (!subscription) {
    console.error('[PayFast ITN] No subscription found for cancellation:', userId)
    return
  }

  // Mark subscription as cancelled
  // Access continues until current_period_end
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'CANCELLED' as SubscriptionStatus,
      cancelled_at: new Date(),
      cancel_at_period_end: true,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      user_id: userId,
      action: 'subscription.cancelled_by_payfast',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        user_id: userId,
        access_until: subscription.current_period_end,
      },
    },
  })

  console.log('[PayFast ITN] Subscription cancelled:', {
    subscription_id: subscription.id,
    user_id: userId,
    access_until: subscription.current_period_end,
  })
}
