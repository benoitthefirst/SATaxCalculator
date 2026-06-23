/**
 * South African fiscal year utilities
 *
 * The SA fiscal year runs from March 1 to February 28/29
 * For example:
 * - Fiscal year 2025/2026 starts March 1, 2025 and ends February 28, 2026
 * - If today is June 2026, we're in fiscal year 2026/2027
 * - If today is February 2026, we're still in fiscal year 2025/2026
 */

/**
 * Get the current fiscal year based on today's date
 * Returns the starting year of the fiscal year (e.g., 2026 for fiscal year 2026/2027)
 */
export function getCurrentFiscalYear(): number {
  const now = new Date()
  const month = now.getMonth() // 0-indexed (0 = January, 2 = March)
  const year = now.getFullYear()

  // If we're in January (0) or February (1), we're still in the previous fiscal year
  if (month < 2) {
    return year - 1
  }

  // March (2) onwards, we're in the current calendar year's fiscal year
  return year
}

/**
 * Get fiscal year start and end dates
 */
export function getFiscalYearDates(year: number): { start: Date; end: Date } {
  return {
    start: new Date(year, 2, 1), // March 1
    end: new Date(year + 1, 1, 28, 23, 59, 59), // Feb 28 (simplified, doesn't handle leap years for end date)
  }
}

/**
 * Format fiscal year as display string (e.g., "2025/2026")
 */
export function formatFiscalYear(year: number): string {
  return `${year}/${year + 1}`
}
