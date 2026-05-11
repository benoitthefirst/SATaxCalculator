import crypto from 'crypto'

interface PayFastParams {
  [key: string]: string | number | undefined
}

/**
 * PayFast parameter order for FORM submissions (Custom/Onsite integrations)
 * MUST be in this exact order per PayFast official PHP SDK
 * https://github.com/Payfast/payfast-php-sdk/blob/master/lib/Auth.php
 *
 * IMPORTANT: The passphrase is IN THE LIST, not appended at the end!
 */
const PAYFAST_FORM_PARAM_ORDER = [
  'merchant_id',
  'merchant_key',
  'return_url',
  'cancel_url',
  'notify_url',
  'notify_method',
  'name_first',
  'name_last',
  'email_address',
  'cell_number',
  'm_payment_id',
  'amount',
  'item_name',
  'item_description',
  'custom_int1',
  'custom_int2',
  'custom_int3',
  'custom_int4',
  'custom_int5',
  'custom_str1',
  'custom_str2',
  'custom_str3',
  'custom_str4',
  'custom_str5',
  'email_confirmation',
  'confirmation_address',
  'currency',
  'payment_method',
  'subscription_type',
  'passphrase', // IMPORTANT: passphrase is in the middle, not at the end!
  'billing_date',
  'recurring_amount',
  'frequency',
  'cycles',
  'subscription_notify_email',
  'subscription_notify_webhook',
  'subscription_notify_buyer',
]

/**
 * Generate a PayFast signature for FORM submissions (Custom/Onsite integrations)
 *
 * According to PayFast official PHP SDK:
 * 1. Create a parameter string in the EXACT order specified by PayFast
 * 2. Include the passphrase in its proper position (between subscription_type and billing_date)
 * 3. URL encode all values
 * 4. MD5 hash the resulting string
 *
 * Note: For subscriptions, the passphrase is REQUIRED
 */
export function generateSignature(
  data: PayFastParams,
  passphrase?: string
): string {
  // Merge data with passphrase if provided
  // The passphrase goes in its proper position in the order list
  const dataWithPassphrase: PayFastParams = { ...data }
  if (passphrase && passphrase.trim()) {
    dataWithPassphrase.passphrase = passphrase.trim()
  }

  // Build the parameter string in the EXACT order PayFast expects
  const orderedParams: string[] = []

  for (const key of PAYFAST_FORM_PARAM_ORDER) {
    const value = dataWithPassphrase[key]
    if (value !== undefined && value !== '' && key !== 'signature') {
      const stringValue = String(value).trim()
      // URL encode the value (matching PHP's urlencode behavior)
      const encodedValue = encodeURIComponent(stringValue).replace(/%20/g, '+')
      orderedParams.push(`${key}=${encodedValue}`)
    }
  }

  // Add any remaining params not in the order list (shouldn't exist for standard forms)
  const remainingKeys = Object.keys(dataWithPassphrase)
    .filter(key =>
      !PAYFAST_FORM_PARAM_ORDER.includes(key) &&
      dataWithPassphrase[key] !== undefined &&
      dataWithPassphrase[key] !== '' &&
      key !== 'signature'
    )

  for (const key of remainingKeys) {
    const value = String(dataWithPassphrase[key]!).trim()
    const encodedValue = encodeURIComponent(value).replace(/%20/g, '+')
    orderedParams.push(`${key}=${encodedValue}`)
  }

  const stringToHash = orderedParams.join('&')

  // Debug logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('=== PayFast Signature Debug ===')
    console.log('Passphrase included:', !!passphrase)
    console.log('Subscription type:', data.subscription_type)
    console.log('Number of params:', orderedParams.length)
    console.log('String to hash:', stringToHash)
    const sig = crypto.createHash('md5').update(stringToHash).digest('hex')
    console.log('Generated signature:', sig)
    console.log('===============================')
  }

  // Generate MD5 hash
  return crypto.createHash('md5').update(stringToHash).digest('hex')
}

/**
 * Generate a PayFast signature for API calls
 *
 * API calls use ALPHABETICAL ordering (different from form submissions)
 */
export function generateApiSignature(
  data: PayFastParams,
  passphrase?: string
): string {
  // API calls use alphabetical ordering
  const paramString = Object.keys(data)
    .filter(key => data[key] !== undefined && data[key] !== '' && key !== 'signature')
    .sort()
    .map(key => {
      const value = String(data[key]).trim()
      return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`
    })
    .join('&')

  const stringToHash = passphrase && passphrase.trim()
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
    : paramString

  return crypto.createHash('md5').update(stringToHash).digest('hex')
}

/**
 * Validate a PayFast ITN signature
 *
 * Compares the signature in the payload against a calculated signature
 */
export function validateSignature(
  data: PayFastParams,
  signature: string,
  passphrase?: string
): boolean {
  // Remove the signature from the data before calculating
  const dataWithoutSignature = { ...data }
  delete dataWithoutSignature.signature

  const calculatedSignature = generateSignature(dataWithoutSignature, passphrase)
  return calculatedSignature.toLowerCase() === signature.toLowerCase()
}

/**
 * Build URL-encoded form data string for PayFast redirect
 */
export function buildFormDataString(data: PayFastParams): string {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&')
}
