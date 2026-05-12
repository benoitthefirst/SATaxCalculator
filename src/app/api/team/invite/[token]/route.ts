import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/team/invite/[token] - Get invite details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const invite = await prisma.teamInvite.findUnique({
    where: { token },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      inviter: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  })

  if (!invite) {
    return NextResponse.json(
      { error: 'Invitation not found' },
      { status: 404 }
    )
  }

  if (invite.accepted_at) {
    return NextResponse.json(
      { error: 'Invitation has already been accepted' },
      { status: 400 }
    )
  }

  if (invite.expires_at < new Date()) {
    return NextResponse.json(
      { error: 'Invitation has expired' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    invite: {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expires_at,
      company: invite.company,
      invitedBy: `${invite.inviter.first_name} ${invite.inviter.last_name}`,
    },
  })
}

// POST /api/team/invite/[token] - Accept invitation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await params

  try {
    const invite = await prisma.teamInvite.findUnique({
      where: { token },
      include: {
        company: true,
      },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    if (invite.accepted_at) {
      return NextResponse.json(
        { error: 'Invitation has already been accepted' },
        { status: 400 }
      )
    }

    if (invite.expires_at < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      )
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify email matches (case insensitive)
    if (user.email.toLowerCase() !== invite.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.companyMember.findFirst({
      where: {
        company_id: invite.company_id,
        user_id: session.user.id,
      },
    })

    if (existingMember) {
      if (existingMember.is_active) {
        return NextResponse.json(
          { error: 'You are already a member of this company' },
          { status: 400 }
        )
      }

      // Reactivate membership
      await prisma.$transaction([
        prisma.companyMember.update({
          where: { id: existingMember.id },
          data: { is_active: true, role: invite.role },
        }),
        prisma.teamInvite.update({
          where: { id: invite.id },
          data: { accepted_at: new Date() },
        }),
      ])
    } else {
      // Create new membership
      await prisma.$transaction([
        prisma.companyMember.create({
          data: {
            company_id: invite.company_id,
            user_id: session.user.id,
            role: invite.role,
          },
        }),
        prisma.teamInvite.update({
          where: { id: invite.id },
          data: { accepted_at: new Date() },
        }),
      ])
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'team.invite_accepted',
        entity_type: 'CompanyMember',
        metadata: {
          company_id: invite.company_id,
          company_name: invite.company.name,
          role: invite.role,
          invite_id: invite.id,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `You have joined ${invite.company.name}`,
      company: {
        id: invite.company.id,
        name: invite.company.name,
      },
      role: invite.role,
    })
  } catch (error) {
    console.error('Accept invite error:', error)
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}
