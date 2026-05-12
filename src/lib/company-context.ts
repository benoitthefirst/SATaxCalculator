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
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [
      { role: 'asc' }, // owner first
      { joined_at: 'asc' },
    ],
  })

  return memberships.map((m) => ({
    id: m.id,
    companyId: m.company.id,
    companyName: m.company.name,
    role: m.role,
  }))
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
