import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT /api/team/[memberId] - Update team member role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { memberId } = await params

  try {
    const body = await request.json()
    const { role } = body

    // Validate role
    const validRoles = ['admin', 'accountant', 'viewer']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, accountant, or viewer' },
        { status: 400 }
      )
    }

    // Get current user's membership
    const currentUserMembership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
        role: { in: ['owner', 'admin'] }, // Only owner/admin can manage
      },
    })

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: 'Not authorized to manage team members' },
        { status: 403 }
      )
    }

    // Get the member to update
    const memberToUpdate = await prisma.companyMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    })

    if (!memberToUpdate || memberToUpdate.company_id !== currentUserMembership.company_id) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Cannot change owner role
    if (memberToUpdate.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot change the role of the company owner' },
        { status: 403 }
      )
    }

    // Admins cannot change other admins (only owners can)
    if (currentUserMembership.role === 'admin' && memberToUpdate.role === 'admin') {
      return NextResponse.json(
        { error: 'Only the owner can change admin roles' },
        { status: 403 }
      )
    }

    // Update the role
    const updated = await prisma.companyMember.update({
      where: { id: memberId },
      data: { role },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'team.role_changed',
        entity_type: 'CompanyMember',
        entity_id: memberId,
        old_values: { role: memberToUpdate.role },
        new_values: { role },
        metadata: {
          company_id: currentUserMembership.company_id,
          member_email: memberToUpdate.user.email,
        },
      },
    })

    return NextResponse.json({
      success: true,
      member: {
        id: updated.id,
        role: updated.role,
      },
    })
  } catch (error) {
    console.error('Update member error:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE /api/team/[memberId] - Remove team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { memberId } = await params

  try {
    // Get current user's membership
    const currentUserMembership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
        role: { in: ['owner', 'admin'] },
      },
    })

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: 'Not authorized to remove team members' },
        { status: 403 }
      )
    }

    // Get the member to remove
    const memberToRemove = await prisma.companyMember.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    })

    if (!memberToRemove || memberToRemove.company_id !== currentUserMembership.company_id) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Cannot remove owner
    if (memberToRemove.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove the company owner' },
        { status: 403 }
      )
    }

    // Cannot remove yourself
    if (memberToRemove.user_id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself from the team' },
        { status: 403 }
      )
    }

    // Admins cannot remove other admins
    if (currentUserMembership.role === 'admin' && memberToRemove.role === 'admin') {
      return NextResponse.json(
        { error: 'Only the owner can remove admins' },
        { status: 403 }
      )
    }

    // Soft delete (deactivate) the membership
    await prisma.companyMember.update({
      where: { id: memberId },
      data: { is_active: false },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'team.member_removed',
        entity_type: 'CompanyMember',
        entity_id: memberId,
        metadata: {
          company_id: currentUserMembership.company_id,
          member_email: memberToRemove.user.email,
          member_role: memberToRemove.role,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `${memberToRemove.user.first_name} ${memberToRemove.user.last_name} has been removed from the team`,
    })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    )
  }
}
