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

// Type for audit log with user
type AuditLogWithUser = {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  old_values: unknown
  new_values: unknown
  ip_address: string | null
  user_agent: string | null
  metadata: unknown
  created_at: Date
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  } | null
}

// GET /api/admin/logs - List audit logs with filters and pagination
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const action = searchParams.get('action') || ''
  const entityType = searchParams.get('entityType') || ''
  const userId = searchParams.get('user') || ''

  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}

  if (action) {
    where.action = { contains: action, mode: 'insensitive' }
  }

  if (entityType) {
    where.entity_type = entityType
  }

  if (userId) {
    where.user_id = userId
  }

  const [logsResult, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  // Cast due to Prisma Accelerate extension type issues
  const logs = logsResult as unknown as AuditLogWithUser[]

  return NextResponse.json({
    logs,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
