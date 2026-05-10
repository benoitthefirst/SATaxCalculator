import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Admin check helper
async function checkAdminAccess() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }
  return session
}

// Type for company with counts
type CompanyWithCounts = {
  id: string
  name: string
  registration_number: string | null
  tax_number: string | null
  business_type: string | null
  is_active: boolean
  created_at: Date
  created_by: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  _count: {
    members: number
    expenses: number
    income: number
  }
}

// GET /api/admin/companies - List all companies with filters and pagination
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const businessType = searchParams.get('businessType') || ''

  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { registration_number: { contains: search, mode: 'insensitive' } },
      { tax_number: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status === 'active') {
    where.is_active = true
  } else if (status === 'inactive') {
    where.is_active = false
  }

  if (businessType) {
    where.business_type = businessType
  }

  const [companiesResult, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        created_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
            expenses: true,
            income: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ])

  // Cast due to Prisma Accelerate extension type issues
  const companies = companiesResult as unknown as CompanyWithCounts[]

  return NextResponse.json({
    companies,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
