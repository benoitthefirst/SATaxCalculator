import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateSignature } from '@/lib/payfast/signature'
import { PAYFAST_CONFIG, PAYFAST_IPS } from '@/lib/payfast'
import { addMonths, addYears } from 'date-fns'
import { BillingCycle, SubscriptionStatus } from '@prisma/client'

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
  custom_str1: string // company_id
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
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for validation
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0].trim() || ''

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
      company_id: payload.custom_str1,
    })

    // Validate signature
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

    // Extract custom data
    const companyId = payload.custom_str1
    const planId = payload.custom_str2
    const billingCycle = payload.custom_str3 as BillingCycle

    if (!companyId || !planId) {
      console.error('[PayFast ITN] Missing company_id or plan_id')
      return new NextResponse('Missing required data', { status: 400 })
    }

    // Handle based on payment status
    switch (payload.payment_status) {
      case 'COMPLETE':
        await handleSuccessfulPayment(payload, companyId, planId, billingCycle)
        break

      case 'FAILED':
        await handleFailedPayment(payload, companyId)
        break

      case 'CANCELLED':
        await handleCancelledSubscription(companyId)
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
  companyId: string,
  planId: string,
  billingCycle: BillingCycle
) {
  const now = new Date()
  const periodEnd =
    billingCycle === 'YEARLY' ? addYears(now, 1) : addMonths(now, 1)

  const amount = parseFloat(payload.amount_gross)
  const fee = payload.amount_fee ? parseFloat(payload.amount_fee) : null
  const netAmount = payload.amount_net ? parseFloat(payload.amount_net) : null

  // Upsert subscription (create if new, update if existing)
  const subscription = await prisma.subscription.upsert({
    where: { company_id: companyId },
    create: {
      company_id: companyId,
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
      action: 'subscription.payment_received',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        company_id: companyId,
        plan_id: planId,
        amount: payload.amount_gross,
        pf_payment_id: payload.pf_payment_id,
        billing_cycle: billingCycle,
      },
    },
  })

  console.log('[PayFast ITN] Payment processed successfully:', {
    subscription_id: subscription.id,
    company_id: companyId,
    amount: payload.amount_gross,
  })
}

async function handleFailedPayment(payload: ITNPayload, companyId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { company_id: companyId },
  })

  if (!subscription) {
    console.error('[PayFast ITN] No subscription found for failed payment:', companyId)
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
      action: 'subscription.payment_failed',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        company_id: companyId,
        m_payment_id: payload.m_payment_id,
        amount: payload.amount_gross,
      },
    },
  })

  console.log('[PayFast ITN] Payment failed:', {
    subscription_id: subscription.id,
    company_id: companyId,
  })
}

async function handleCancelledSubscription(companyId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { company_id: companyId },
  })

  if (!subscription) {
    console.error('[PayFast ITN] No subscription found for cancellation:', companyId)
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
      action: 'subscription.cancelled_by_payfast',
      entity_type: 'Subscription',
      entity_id: subscription.id,
      metadata: {
        company_id: companyId,
        access_until: subscription.current_period_end,
      },
    },
  })

  console.log('[PayFast ITN] Subscription cancelled:', {
    subscription_id: subscription.id,
    company_id: companyId,
    access_until: subscription.current_period_end,
  })
}
