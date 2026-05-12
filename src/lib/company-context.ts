import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'

export interface CompanyMembership {
  id: string
  companyId: string
  companyName: string
  role: string
}

/**
 * Get all companies a user is a member of
 */
export async function getUserCompanies(userId: string): Promise<CompanyMembership[]> {
  const memberships = await prisma.companyMember.findMany({
    where: {
      user_id: userId,
      is_active: true,
    },
    orderBy: [
      { role: 'asc' }, // owner first
      { joined_at: 'asc' },
    ],
  })

  // Get company details separately to avoid TypeScript issues with Prisma includes
  const companyIds = memberships.map((m) => m.company_id)
  const companies = await prisma.company.findMany({
    where: { id: { in: companyIds } },
    select: { id: true, name: true },
  })
  const companyMap = new Map(companies.map((c) => [c.id, c]))

  return memberships.map((m) => {
    const company = companyMap.get(m.company_id)
    return {
      id: m.id,
      companyId: m.company_id,
      companyName: company?.name || 'Unknown Company',
      role: m.role,
    }
  })
}

/**
 * Get the active company for a user
 * Falls back to first company if no active company is set
 */
export async function getActiveCompany(userId: string): Promise<CompanyMembership | null> {
  const cookieStore = await cookies()
  const activeCompanyId = cookieStore.get('active_company_id')?.value

  const companies = await getUserCompanies(userId)

  if (companies.length === 0) {
    return null
  }

  // If we have a cookie, find that company
  if (activeCompanyId) {
    const activeCompany = companies.find((c) => c.companyId === activeCompanyId)
    if (activeCompany) {
      return activeCompany
    }
  }

  // Fall back to first company
  return companies[0]
}

/**
 * Get active company ID from cookie
 */
export async function getActiveCompanyId(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('active_company_id')?.value
}

/**
 * Get the active company ID for a user, ensuring they have access
 * Returns the company ID or null if user has no companies
 */
export async function getActiveCompanyForUser(userId: string): Promise<string | null> {
  const activeCompany = await getActiveCompany(userId)
  return activeCompany?.companyId ?? null
}
