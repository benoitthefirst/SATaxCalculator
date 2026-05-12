import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/team - Get all team members for the user's company
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's company membership
  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  if (!membership) {
    return NextResponse.json({ error: 'No company found' }, { status: 404 })
  }

  // Get all team members with user information
  const membersData = await prisma.companyMember.findMany({
    where: {
      company_id: membership.company_id,
      is_active: true,
    },
    orderBy: [
      { role: 'asc' }, // owner first
      { joined_at: 'asc' },
    ],
  })

  // Get user details for all members
  const userIds = membersData.map((m) => m.user_id)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      last_login_at: true,
    },
  })

  const userMap = new Map(users.map((u) => [u.id, u]))

  // Get pending invites
  const invitesData = await prisma.teamInvite.findMany({
    where: {
      company_id: membership.company_id,
      accepted_at: null,
      expires_at: { gt: new Date() },
    },
    orderBy: { created_at: 'desc' },
  })

  // Get inviter details
  const inviterIds = [...new Set(invitesData.map((i) => i.invited_by))]
  const inviters = await prisma.user.findMany({
    where: { id: { in: inviterIds } },
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  })
  const inviterMap = new Map(inviters.map((u) => [u.id, u]))

  return NextResponse.json({
    members: membersData.map((m) => {
      const user = userMap.get(m.user_id)
      return {
        id: m.id,
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        user: user
          ? {
              email: user.email,
              firstName: user.first_name,
              lastName: user.last_name,
              lastLoginAt: user.last_login_at,
            }
          : null,
      }
    }),
    pendingInvites: invitesData.map((i) => {
      const inviter = inviterMap.get(i.invited_by)
      return {
        id: i.id,
        email: i.email,
        role: i.role,
        expiresAt: i.expires_at,
        createdAt: i.created_at,
        invitedBy: inviter ? `${inviter.first_name} ${inviter.last_name}` : 'Unknown',
      }
    }),
    currentUserRole: membership.role,
    companyId: membership.company_id,
    companyName: membership.company.name,
  })
}
