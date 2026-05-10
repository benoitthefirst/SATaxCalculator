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

// Type for ticket with user
type TicketWithUser = {
  id: string
  ticket_number: string
  subject: string
  status: string
  priority: string
  category: string | null
  contact_name: string | null
  contact_email: string | null
  contact_company: string | null
  created_at: Date
  updated_at: Date
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  assigned_to: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
  _count: {
    replies: number
  }
}

// GET /api/admin/support - List all support tickets with filters and pagination
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
  const priority = searchParams.get('priority') || ''
  const category = searchParams.get('category') || ''
  const assignedTo = searchParams.get('assignedTo') || ''

  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { ticket_number: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } },
      { contact_name: { contains: search, mode: 'insensitive' } },
      { contact_email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status) {
    where.status = status
  }

  if (priority) {
    where.priority = priority
  }

  if (category) {
    where.category = category
  }

  if (assignedTo === 'unassigned') {
    where.assigned_to_id = null
  } else if (assignedTo === 'me') {
    where.assigned_to_id = session.user.id
  } else if (assignedTo) {
    where.assigned_to_id = assignedTo
  }

  const [ticketsResult, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { priority: 'desc' }, // URGENT first
        { created_at: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        assigned_to: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
    }),
    prisma.supportTicket.count({ where }),
  ])

  // Cast due to Prisma Accelerate extension type issues
  const tickets = ticketsResult as unknown as TicketWithUser[]

  return NextResponse.json({
    tickets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
