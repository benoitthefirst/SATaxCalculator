import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Admin check helper
async function checkAdminAccess() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }
  return session
}

// Schema for updating a ticket
const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigned_to_id: z.string().nullable().optional(),
})

// Schema for adding a reply
const addReplySchema = z.object({
  message: z.string().min(1, 'Message is required'),
  is_internal: z.boolean().default(false),
})

// Type for ticket reply
type TicketReplyWithUser = {
  id: string
  message: string
  is_internal: boolean
  created_at: Date
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    role: string
  }
}

// GET /api/admin/support/[id] - Get a single ticket with replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const [ticket, repliesResult] = await Promise.all([
    prisma.supportTicket.findUnique({
      where: { id },
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
      },
    }),
    prisma.ticketReply.findMany({
      where: { ticket_id: id },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { created_at: 'asc' },
    }),
  ])

  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }

  // Cast due to Prisma Accelerate extension type issues
  const replies = repliesResult as unknown as TicketReplyWithUser[]

  return NextResponse.json({
    ...ticket,
    replies,
  })
}

// PUT /api/admin/support/[id] - Update ticket status/priority/assignment
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
    const validated = updateTicketSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validated.status) updateData.status = validated.status
    if (validated.priority) updateData.priority = validated.priority
    if (validated.assigned_to_id !== undefined) updateData.assigned_to_id = validated.assigned_to_id

    // Add resolved/closed timestamps
    if (validated.status === 'RESOLVED') {
      updateData.resolved_at = new Date()
    }
    if (validated.status === 'CLOSED') {
      updateData.closed_at = new Date()
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
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
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        user_id: session.user.id,
        action: 'ticket.updated',
        entity_type: 'SupportTicket',
        entity_id: id,
        metadata: { updated_fields: Object.keys(updateData) },
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        user_agent: request.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json(ticket)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> }
      return NextResponse.json({ error: zodError.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Failed to update ticket:', error)
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 })
  }
}

// POST /api/admin/support/[id] - Add a reply to the ticket
export async function POST(
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
    const validated = addReplySchema.parse(body)

    // Check if ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Create the reply
    const reply = await prisma.ticketReply.create({
      data: {
        ticket_id: id,
        user_id: session.user.id,
        message: validated.message,
        is_internal: validated.is_internal,
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // Update ticket status to IN_PROGRESS if it was OPEN
    if (ticket.status === 'OPEN') {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
      })
    }

    return NextResponse.json(reply, { status: 201 })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> }
      return NextResponse.json({ error: zodError.errors[0]?.message || 'Validation error' }, { status: 400 })
    }
    console.error('Failed to add reply:', error)
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
}
