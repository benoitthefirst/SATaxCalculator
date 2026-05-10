import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'
import { z } from 'zod'

// Schema for creating a new user
const createUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().nullable().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).default('USER'),
  is_active: z.boolean().default(true),
})

// Admin check helper
async function checkAdminAccess() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }
  return session
}

// GET /api/admin/users - List all users with filters and pagination
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') || ''
  const status = searchParams.get('status') || ''

  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    is_deleted: false,
  }

  if (search) {
    where.OR = [
      { first_name: { contains: search, mode: 'insensitive' } },
      { last_name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  if (status === 'active') {
    where.is_active = true
  } else if (status === 'inactive') {
    where.is_active = false
  }

  type UserWithCount = {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
    is_active: boolean
    created_at: Date
    last_login_at: Date | null
    _count: {
      company_members: number
    }
  }

  const [usersResult, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
        last_login_at: true,
        _count: {
          select: { company_members: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  // Cast due to Prisma Accelerate extension type issues
  const users = usersResult as unknown as UserWithCount[]

  // Map for client compatibility
  const mappedUsers = users.map((user) => ({
    ...user,
    last_login: user.last_login_at,
    _count: {
      companies: user._count.company_members,
    },
  }))

  return NextResponse.json({
    users: mappedUsers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// POST /api/admin/users - Create a new user
export async function POST(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = createUserSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(validated.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        first_name: validated.first_name,
        last_name: validated.last_name,
        email: validated.email,
        phone: validated.phone || null,
        password_hash: hashedPassword,
        role: validated.role,
        is_active: validated.is_active,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        is_active: true,
        created_at: true,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'user.created',
        entity_type: 'User',
        entity_id: user.id,
        metadata: { created_user_email: user.email, role: user.role },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        user_agent: request.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> }
      return NextResponse.json({ error: zodError.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
