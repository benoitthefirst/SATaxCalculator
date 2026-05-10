import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hash } from 'bcryptjs'
import { z } from 'zod'

// Schema for updating a user
const updateUserSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  is_active: z.boolean().optional(),
})

// Admin check helper
async function checkAdminAccess() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }
  return session
}

// Type for company member with company details
type CompanyMemberWithCompany = {
  role: string
  company: {
    id: string
    name: string
    registration_number: string | null
    tax_number: string | null
    created_at: Date
  }
}

// Helper to get user with companies
async function getUserWithDetails(id: string) {
  const [user, companyMembersResult, counts] = await Promise.all([
    prisma.user.findUnique({
      where: { id, is_deleted: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        last_login_at: true,
      },
    }),
    prisma.companyMember.findMany({
      where: { user_id: id, company: { is_active: true } },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            registration_number: true,
            tax_number: true,
            created_at: true,
          },
        },
      },
      orderBy: { company: { created_at: 'desc' } },
    }),
    prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            expenses: true,
            income: true,
            support_tickets: true,
          },
        },
      },
    }),
  ])

  if (!user) return null

  // Cast to proper type since Prisma Accelerate extension affects type inference
  const companyMembers = companyMembersResult as unknown as CompanyMemberWithCompany[]

  return {
    ...user,
    companies: companyMembers.map((cm) => cm.company),
    last_login: user.last_login_at,
    _count: counts?._count || { expenses: 0, income: 0, support_tickets: 0 },
  }
}

// GET /api/admin/users/[id] - Get a single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const user = await getUserWithDetails(id)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}

// PUT /api/admin/users/[id] - Update a user
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
    const validated = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id, is_deleted: false },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent demoting yourself if you're the only super admin
    if (
      session.user.id === id &&
      existingUser.role === 'SUPER_ADMIN' &&
      validated.role &&
      validated.role !== 'SUPER_ADMIN'
    ) {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN', is_deleted: false, is_active: true },
      })
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot demote the last super admin' },
          { status: 400 }
        )
      }
    }

    // Check email uniqueness if changing email
    if (validated.email && validated.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validated.email },
      })
      if (emailExists) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = {}
    if (validated.first_name) updateData.first_name = validated.first_name
    if (validated.last_name) updateData.last_name = validated.last_name
    if (validated.email) updateData.email = validated.email
    if (validated.phone !== undefined) updateData.phone = validated.phone
    if (validated.role) updateData.role = validated.role
    if (validated.is_active !== undefined) updateData.is_active = validated.is_active
    if (validated.password) {
      updateData.password_hash = await hash(validated.password, 12)
    }

    // Update user
    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'user.updated',
        entity_type: 'User',
        entity_id: id,
        metadata: { updated_fields: Object.keys(updateData) },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        user_agent: request.headers.get('user-agent') || null,
      },
    })

    // Return updated user with details
    const user = await getUserWithDetails(id)
    return NextResponse.json(user)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> }
      return NextResponse.json({ error: zodError.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Failed to update user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Soft delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id, is_deleted: false },
  })

  if (!existingUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Prevent deleting yourself
  if (session.user.id === id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }

  // Prevent deleting the last super admin
  if (existingUser.role === 'SUPER_ADMIN') {
    const superAdminCount = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', is_deleted: false, is_active: true },
    })
    if (superAdminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last super admin' },
        { status: 400 }
      )
    }
  }

  // Soft delete
  await prisma.user.update({
    where: { id },
    data: {
      is_deleted: true,
      deleted_at: new Date(),
      is_active: false,
    },
  })

  // Log the action
  await prisma.auditLog.create({
    data: {
      user_id: session.user.id,
      action: 'user.deleted',
      entity_type: 'User',
      entity_id: id,
      metadata: { deleted_user_email: existingUser.email },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    },
  })

  return NextResponse.json({ success: true })
}
