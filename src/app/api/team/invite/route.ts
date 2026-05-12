import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { canAddTeamMember } from '@/lib/subscription/feature-gate'
import { sendEmail, teamInviteEmail } from '@/lib/email'
import crypto from 'crypto'

// POST /api/team/invite - Send a team member invitation
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['admin', 'accountant', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, accountant, or viewer' },
        { status: 400 }
      )
    }

    // Get user's company membership and check permissions
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
        role: { in: ['owner', 'admin'] }, // Only owner/admin can invite
      },
      include: {
        company: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Not authorized to invite team members' },
        { status: 403 }
      )
    }

    // Check if team member limit reached
    const canAdd = await canAddTeamMember(membership.company_id)
    if (!canAdd.allowed) {
      return NextResponse.json(
        {
          error: 'Team member limit reached',
          message: `You have reached your plan limit of ${canAdd.limit} team members.`,
          upgradeRequired: true,
          limit: canAdd.limit,
          usage: canAdd.usage,
        },
        { status: 403 }
      )
    }

    // Check if user is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      const existingMember = await prisma.companyMember.findFirst({
        where: {
          company_id: membership.company_id,
          user_id: existingUser.id,
        },
      })

      if (existingMember) {
        if (existingMember.is_active) {
          return NextResponse.json(
            { error: 'User is already a team member' },
            { status: 400 }
          )
        }
        // Reactivate inactive member
        await prisma.companyMember.update({
          where: { id: existingMember.id },
          data: { is_active: true, role },
        })

        return NextResponse.json({
          success: true,
          message: 'Team member has been reactivated',
          reactivated: true,
        })
      }
    }

    // Check for existing pending invite
    const existingInvite = await prisma.teamInvite.findFirst({
      where: {
        company_id: membership.company_id,
        email: email.toLowerCase(),
        accepted_at: null,
        expires_at: { gt: new Date() },
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex')

    // Create invite (expires in 7 days)
    const invite = await prisma.teamInvite.create({
      data: {
        company_id: membership.company_id,
        email: email.toLowerCase(),
        role,
        token,
        invited_by: session.user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    // Get inviter's name
    const inviter = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { first_name: true, last_name: true },
    })

    // Send invitation email using template
    const inviteUrl = `${process.env.NEXTAUTH_URL || 'https://www.processx.co.za'}/invite/${token}`
    const inviterName = `${inviter?.first_name || ''} ${inviter?.last_name || ''}`.trim() || 'A team member'

    const emailContent = teamInviteEmail({
      companyName: membership.company.name,
      inviterName,
      role,
      acceptUrl: inviteUrl,
    })

    try {
      await sendEmail({
        to: email,
        ...emailContent,
      })
    } catch (emailError) {
      console.error('Failed to send invite email:', emailError)
      // Don't fail the request if email fails - the invite is still created
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'team.invite_sent',
        entity_type: 'TeamInvite',
        entity_id: invite.id,
        metadata: {
          company_id: membership.company_id,
          email,
          role,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expires_at,
      },
    })
  } catch (error) {
    console.error('Invite error:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    )
  }
}

// DELETE /api/team/invite - Cancel a pending invitation
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const inviteId = searchParams.get('id')

    if (!inviteId) {
      return NextResponse.json(
        { error: 'Invite ID is required' },
        { status: 400 }
      )
    }

    // Get user's company membership and check permissions
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
        role: { in: ['owner', 'admin'] },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Not authorized to manage invitations' },
        { status: 403 }
      )
    }

    // Delete the invite
    const deleted = await prisma.teamInvite.deleteMany({
      where: {
        id: inviteId,
        company_id: membership.company_id,
        accepted_at: null, // Only delete pending invites
      },
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete invite error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel invitation' },
      { status: 500 }
    )
  }
}
