import { PAYFAST_CONFIG, getPayFastUrl, getApiUrl, BILLING_CYCLE_TO_FREQUENCY } from './index'
import { generateSignature } from './signature'

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
 */
export function buildSubscriptionForm(data: SubscriptionFormData): PayFastFormData {
  const merchantPaymentId = `SUB-${data.companyId}-${Date.now()}`
  const today = new Date().toISOString().split('T')[0]

  const params: Record<string, string | number> = {
    // Merchant details
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,

    // Return URLs
    return_url: process.env.PAYFAST_RETURN_URL || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
    cancel_url: process.env.PAYFAST_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancelled`,
    notify_url: process.env.PAYFAST_NOTIFY_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payfast`,

    // Buyer details
    email_address: data.customerEmail,
    name_first: data.customerFirstName,
    name_last: data.customerLastName,

    // Transaction details
    m_payment_id: merchantPaymentId,
    amount: data.amount.toFixed(2),
    item_name: data.itemName,
    item_description: `ProcessX ${data.billingCycle === 'YEARLY' ? 'Annual' : 'Monthly'} Subscription`,

    // Custom data (passed back in ITN)
    custom_str1: data.companyId,
    custom_str2: data.planId,
    custom_str3: data.billingCycle,

    // Subscription specific
    subscription_type: 1, // 1 = subscription
    billing_date: today,
    recurring_amount: data.amount.toFixed(2),
    frequency: BILLING_CYCLE_TO_FREQUENCY[data.billingCycle],
    cycles: 0, // 0 = indefinite (until cancelled)
  }

  // Generate signature
  const signature = generateSignature(params, PAYFAST_CONFIG.passphrase)

  // Convert all values to strings and add signature
  const formData: PayFastFormData = {}
  for (const [key, value] of Object.entries(params)) {
    formData[key] = String(value)
  }
  formData.signature = signature

  return formData
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
 */
function getApiHeaders(): ApiHeaders {
  const timestamp = new Date().toISOString()

  // Generate signature for API authentication
  const signatureData = {
    'merchant-id': PAYFAST_CONFIG.merchantId,
    timestamp,
    version: 'v1',
  }
  const signature = generateSignature(signatureData, PAYFAST_CONFIG.passphrase)

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
