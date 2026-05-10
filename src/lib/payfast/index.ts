// PayFast configuration and utilities
// Documentation: https://developers.payfast.co.za/

export const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandbox: process.env.PAYFAST_SANDBOX === 'true',
  urls: {
    sandbox: 'https://sandbox.payfast.co.za',
    production: 'https://www.payfast.co.za',
  },
  api: {
    sandbox: 'https://api.payfast.co.za/subscriptions',
    production: 'https://api.payfast.co.za/subscriptions',
  },
}

// PayFast valid IP addresses for ITN validation
export const PAYFAST_IPS = [
  '197.97.145.144',
  '197.97.145.145',
  '197.97.145.146',
  '197.97.145.147',
  '197.97.145.148',
  '41.74.179.194',
  '41.74.179.195',
  '41.74.179.196',
  '41.74.179.197',
]

export function getPayFastUrl(): string {
  return PAYFAST_CONFIG.sandbox
    ? PAYFAST_CONFIG.urls.sandbox
    : PAYFAST_CONFIG.urls.production
}

export function getApiUrl(): string {
  return PAYFAST_CONFIG.sandbox
    ? PAYFAST_CONFIG.api.sandbox
    : PAYFAST_CONFIG.api.production
}

export function isPayFastConfigured(): boolean {
  return !!(
    PAYFAST_CONFIG.merchantId &&
    PAYFAST_CONFIG.merchantKey
  )
}

// Subscription frequencies (PayFast values)
export const PAYFAST_FREQUENCIES = {
  WEEKLY: 2,
  MONTHLY: 3,
  QUARTERLY: 4,
  BIANNUALLY: 5,
  ANNUALLY: 6,
} as const

// Map our billing cycles to PayFast frequencies
export const BILLING_CYCLE_TO_FREQUENCY = {
  MONTHLY: PAYFAST_FREQUENCIES.MONTHLY,
  YEARLY: PAYFAST_FREQUENCIES.ANNUALLY,
} as const
