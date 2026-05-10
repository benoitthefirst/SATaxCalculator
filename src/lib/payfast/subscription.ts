import { PAYFAST_CONFIG, getPayFastUrl, getApiUrl, BILLING_CYCLE_TO_FREQUENCY } from './index'
import { generateSignature, generateApiSignature } from './signature'

// Define BillingCycle type locally to match Prisma enum
type BillingCycle = 'MONTHLY' | 'YEARLY'

export interface SubscriptionFormData {
  planId: string
  companyId: string
  billingCycle: BillingCycle
  amount: number
  itemName: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
}

export interface PayFastFormData {
  [key: string]: string
}

/**
 * Build form data for PayFast subscription checkout
 *
 * This data will be POSTed to PayFast's payment page
 * The signature is generated based on the exact fields we send, in the order
 * specified by PayFast's official documentation
 */
export function buildSubscriptionForm(data: SubscriptionFormData): PayFastFormData {
  const merchantPaymentId = `SUB-${data.companyId}-${Date.now()}`
  const today = new Date().toISOString().split('T')[0]

  // Build params object with all the fields we'll send
  const params: Record<string, string | number> = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: process.env.PAYFAST_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
    cancel_url: process.env.PAYFAST_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancelled`,
    notify_url: process.env.PAYFAST_NOTIFY_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payfast`,
    name_first: data.customerFirstName,
    name_last: data.customerLastName,
    email_address: data.customerEmail,
    m_payment_id: merchantPaymentId,
    amount: data.amount.toFixed(2),
    item_name: data.itemName,
    item_description: `ProcessX ${data.billingCycle === 'YEARLY' ? 'Annual' : 'Monthly'} Subscription`,
    custom_str1: data.companyId,
    custom_str2: data.planId,
    custom_str3: data.billingCycle,
    subscription_type: 1,
    billing_date: today,
    recurring_amount: data.amount.toFixed(2),
    frequency: BILLING_CYCLE_TO_FREQUENCY[data.billingCycle],
    cycles: 0,
  }

  // Generate signature
  const signature = generateSignature(params, PAYFAST_CONFIG.passphrase)

  // Return form data with signature - the order in the object doesn't matter
  // for JavaScript objects, but the signature was generated with correct order
  return {
    merchant_id: String(params.merchant_id),
    merchant_key: String(params.merchant_key),
    return_url: String(params.return_url),
    cancel_url: String(params.cancel_url),
    notify_url: String(params.notify_url),
    name_first: String(params.name_first),
    name_last: String(params.name_last),
    email_address: String(params.email_address),
    m_payment_id: String(params.m_payment_id),
    amount: String(params.amount),
    item_name: String(params.item_name),
    item_description: String(params.item_description),
    custom_str1: String(params.custom_str1),
    custom_str2: String(params.custom_str2),
    custom_str3: String(params.custom_str3),
    subscription_type: String(params.subscription_type),
    billing_date: String(params.billing_date),
    recurring_amount: String(params.recurring_amount),
    frequency: String(params.frequency),
    cycles: String(params.cycles),
    signature,
  }
}

/**
 * Get the PayFast checkout URL
 */
export function getCheckoutUrl(): string {
  return `${getPayFastUrl()}/eng/process`
}

// ============================================
// PayFast Subscription API Methods
// ============================================

interface ApiHeaders {
  'merchant-id': string
  version: string
  timestamp: string
  signature: string
}

/**
 * Generate headers for PayFast API calls
 * Note: API calls use alphabetical signature ordering (different from form submissions)
 */
function getApiHeaders(): ApiHeaders {
  const timestamp = new Date().toISOString()

  // Generate signature for API authentication (uses alphabetical ordering)
  const signatureData = {
    'merchant-id': PAYFAST_CONFIG.merchantId,
    timestamp,
    version: 'v1',
  }
  const signature = generateApiSignature(signatureData, PAYFAST_CONFIG.passphrase)

  return {
    'merchant-id': PAYFAST_CONFIG.merchantId,
    version: 'v1',
    timestamp,
    signature,
  }
}

/**
 * Fetch subscription details from PayFast
 */
export async function fetchSubscription(token: string): Promise<unknown> {
  const response = await fetch(`${getApiUrl()}/${token}/fetch`, {
    method: 'GET',
    headers: {
      ...getApiHeaders(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`PayFast API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Pause a subscription for a number of cycles
 */
export async function pauseSubscription(
  token: string,
  cycles: number = 1
): Promise<unknown> {
  const response = await fetch(`${getApiUrl()}/${token}/pause`, {
    method: 'PUT',
    headers: {
      ...getApiHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cycles }),
  })

  if (!response.ok) {
    throw new Error(`PayFast API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Resume a paused subscription
 */
export async function unpauseSubscription(token: string): Promise<unknown> {
  const response = await fetch(`${getApiUrl()}/${token}/unpause`, {
    method: 'PUT',
    headers: {
      ...getApiHeaders(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`PayFast API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(token: string): Promise<unknown> {
  const response = await fetch(`${getApiUrl()}/${token}/cancel`, {
    method: 'PUT',
    headers: {
      ...getApiHeaders(),
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`PayFast API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Update subscription amount (for upgrades/downgrades)
 */
export async function updateSubscriptionAmount(
  token: string,
  newAmount: number,
  newCycles?: number
): Promise<unknown> {
  const body: Record<string, number> = {
    amount: newAmount,
  }
  if (newCycles !== undefined) {
    body.cycles = newCycles
  }

  const response = await fetch(`${getApiUrl()}/${token}/update`, {
    method: 'PATCH',
    headers: {
      ...getApiHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`PayFast API error: ${response.status}`)
  }

  return response.json()
}
