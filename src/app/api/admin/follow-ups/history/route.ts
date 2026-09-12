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

// GET /api/admin/follow-ups/history - Get email history
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const emailType = searchParams.get('emailType') || ''
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}

  if (emailType) {
    where.email_type = emailType
  }

  if (search) {
    where.OR = [
      { user: { first_name: { contains: search, mode: 'insensitive' } } },
      { user: { last_name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [emails, total] = await Promise.all([
    prisma.followUpEmail.findMany({
      where,
      skip,
      take: limit,
      orderBy: { sent_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        sender: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    }),
    prisma.followUpEmail.count({ where }),
  ])

  return NextResponse.json({
    emails,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
