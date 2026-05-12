import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

// POST /api/companies/switch - Switch active company
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { companyId } = body

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      )
    }

    // Verify user has active membership in this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: companyId,
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
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this company' },
        { status: 403 }
      )
    }

    // Set the active company cookie
    const cookieStore = await cookies()
    cookieStore.set('active_company_id', companyId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'company.switched',
        entity_type: 'Company',
        entity_id: companyId,
        metadata: {
          company_name: membership.company.name,
        },
      },
    })

    return NextResponse.json({
      success: true,
      company: {
        id: membership.company.id,
        name: membership.company.name,
        role: membership.role,
      },
    })
  } catch (error) {
    console.error('Switch company error:', error)
    return NextResponse.json(
      { error: 'Failed to switch company' },
      { status: 500 }
    )
  }
}
