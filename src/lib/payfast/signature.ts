import crypto from 'crypto'

interface PayFastParams {
  [key: string]: string | number | undefined
}

/**
 * Generate a PayFast signature for payment requests
 *
 * The signature is an MD5 hash of the URL-encoded parameter string,
 * sorted alphabetically by key, with the passphrase appended.
 */
export function generateSignature(
  data: PayFastParams,
  passphrase?: string
): string {
  // Filter out undefined and empty values, then sort by key
  const sortedKeys = Object.keys(data).sort()

  const params = sortedKeys
    .filter(key => data[key] !== undefined && data[key] !== '')
    .map(key => {
      const value = String(data[key])
      // URL encode and replace %20 with + (PayFast specific)
      return `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`
    })
    .join('&')

  // Add passphrase if provided
  const stringToHash = passphrase
    ? `${params}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`
    : params

  // Generate MD5 hash
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
