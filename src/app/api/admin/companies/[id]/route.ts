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

// Type for company member
type CompanyMemberWithUser = {
  id: string
  role: string
  is_active: boolean
  joined_at: Date
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    is_active: boolean
  }
}

// GET /api/admin/companies/[id] - Get a single company
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const [company, membersResult, counts] = await Promise.all([
    prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        registration_number: true,
        tax_number: true,
        vat_number: true,
        business_type: true,
        address_line1: true,
        address_line2: true,
        city: true,
        province: true,
        postal_code: true,
        country: true,
        phone: true,
        email: true,
        website: true,
        fiscal_year_end: true,
        currency: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        created_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    }),
    prisma.companyMember.findMany({
      where: { company_id: id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            is_active: true,
          },
        },
      },
      orderBy: { joined_at: 'asc' },
    }),
    prisma.company.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            members: true,
            expenses: true,
            income: true,
            recurring_expenses: true,
            assets: true,
            vehicle_log_entries: true,
          },
        },
      },
    }),
  ])

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  // Cast due to Prisma Accelerate extension type issues
  const members = membersResult as unknown as CompanyMemberWithUser[]

  return NextResponse.json({
    ...company,
    members,
    _count: counts?._count || {
      members: 0,
      expenses: 0,
      income: 0,
      recurring_expenses: 0,
      assets: 0,
      vehicle_log_entries: 0,
    },
  })
}

// PUT /api/admin/companies/[id] - Update company status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    await prisma.company.update({
      where: { id },
      data: { is_active },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: is_active ? 'company.activated' : 'company.deactivated',
        entity_type: 'Company',
        entity_id: id,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        user_agent: request.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}
