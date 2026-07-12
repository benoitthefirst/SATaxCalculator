import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const replySchema = z.object({
  message: z.string().min(1, 'Message is required'),
})

// GET - Fetch single ticket with replies (user's own ticket only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        user_id: session.user.id,
      },
      include: {
        replies: {
          where: { is_internal: false }, // Users can't see internal notes
          orderBy: { created_at: 'asc' },
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
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

// POST - Add a reply to the ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = replySchema.parse(body)

    // Check ticket belongs to user and is not closed
    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        user_id: session.user.id,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    if (ticket.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Cannot reply to a closed ticket' },
        { status: 400 }
      )
    }

    // Create the reply
    const reply = await prisma.ticketReply.create({
      data: {
        ticket_id: id,
        user_id: session.user.id,
        message: validatedData.message,
        is_internal: false,
      },
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
    })

    // Update ticket status if it was waiting for customer
    if (ticket.status === 'WAITING_CUSTOMER') {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'OPEN' },
      })
    }

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error adding reply:', error)
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    )
  }
}
