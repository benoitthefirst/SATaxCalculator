import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import nodemailer from 'nodemailer'
import { z } from 'zod'

// Generate unique ticket number
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `TKT-${timestamp}-${random}`
}

const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['general', 'billing', 'technical', 'feature', 'bug']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
})

// Email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// GET - Fetch user's tickets
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const tickets = await prisma.supportTicket.findMany({
      where: {
        user_id: session.user.id,
        ...(status && status !== 'all' ? { status: status as 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED' } : {}),
      },
      orderBy: { created_at: 'desc' },
      include: {
        replies: {
          where: { is_internal: false },
          orderBy: { created_at: 'desc' },
          take: 1,
        },
      },
    })

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

// POST - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createTicketSchema.parse(body)

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { first_name: true, last_name: true, email: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userName = `${user.first_name} ${user.last_name}`.trim() || 'Unknown'

    // Create the ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticket_number: generateTicketNumber(),
        user_id: session.user.id,
        subject: validatedData.subject,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        contact_name: userName,
        contact_email: user.email || '',
      },
    })

    // Send email notification to admin
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || process.env.SMTP_USER

      const priorityColors: Record<string, string> = {
        LOW: '#22c55e',
        MEDIUM: '#f59e0b',
        HIGH: '#ef4444',
      }

      const categoryLabels: Record<string, string> = {
        general: 'General Inquiry',
        billing: 'Billing & Subscription',
        technical: 'Technical Issue',
        feature: 'Feature Request',
        bug: 'Bug Report',
      }

      try {
        // Email to admin
        await transporter.sendMail({
          from: `"ProcessX Support" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `[${ticket.ticket_number}] New Support Ticket: ${validatedData.subject}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #062C2E; padding: 32px; border-radius: 16px 16px 0 0;">
                <h1 style="color: #E8FF3F; margin: 0; font-size: 24px;">New Support Ticket</h1>
                <p style="color: white; margin: 8px 0 0; opacity: 0.8;">${ticket.ticket_number}</p>
              </div>

              <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
                <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                  <span style="padding: 6px 12px; background: ${priorityColors[validatedData.priority]}; color: white; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${validatedData.priority} PRIORITY
                  </span>
                  <span style="padding: 6px 12px; background: #e5e7eb; color: #374151; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${categoryLabels[validatedData.category]}
                  </span>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 120px;">
                      <strong style="color: #374151;">From:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                      ${userName} (${user.email})
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                      <strong style="color: #374151;">Subject:</strong>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                      ${validatedData.subject}
                    </td>
                  </tr>
                </table>

                <div style="margin-top: 24px;">
                  <strong style="color: #374151;">Description:</strong>
                  <div style="margin-top: 12px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827; white-space: pre-wrap;">
${validatedData.description}
                  </div>
                </div>

                <div style="margin-top: 24px;">
                  <a href="${process.env.NEXTAUTH_URL}/admin/support/${ticket.id}"
                     style="display: inline-block; padding: 12px 24px; background: #062C2E; color: #E8FF3F; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    View Ticket in Admin
                  </a>
                </div>

                <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    This is an automated notification from ProcessX Support System
                  </p>
                </div>
              </div>
            </div>
          `,
          text: `
New Support Ticket: ${ticket.ticket_number}

From: ${userName} (${user.email})
Subject: ${validatedData.subject}
Priority: ${validatedData.priority}
Category: ${categoryLabels[validatedData.category]}

Description:
${validatedData.description}

View ticket: ${process.env.NEXTAUTH_URL}/admin/support/${ticket.id}
          `.trim(),
        })

        // Confirmation email to user
        await transporter.sendMail({
          from: `"ProcessX Support" <${process.env.SMTP_USER}>`,
          to: user.email!,
          subject: `[${ticket.ticket_number}] We received your support request`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #062C2E; padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: #E8FF3F; margin: 0; font-size: 24px;">Support Request Received</h1>
              </div>

              <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Hi ${userName},
                </p>

                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  We've received your support request and our team will review it shortly. You can track the status of your ticket in your dashboard.
                </p>

                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                    <strong>Ticket Number:</strong> ${ticket.ticket_number}
                  </p>
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                    <strong>Subject:</strong> ${validatedData.subject}
                  </p>
                  <p style="color: #6b7280; font-size: 14px; margin: 0;">
                    <strong>Priority:</strong> ${validatedData.priority}
                  </p>
                </div>

                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  We typically respond within 24 hours during business hours.
                </p>

                <div style="margin-top: 24px;">
                  <a href="${process.env.NEXTAUTH_URL}/dashboard/support"
                     style="display: inline-block; padding: 12px 24px; background: #062C2E; color: #E8FF3F; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    View My Tickets
                  </a>
                </div>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 24px;">
                  Best regards,<br>
                  <strong>The ProcessX Team</strong>
                </p>

                <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    ProcessX - Bookkeeping Made Simple, Business Made Easy
                  </p>
                </div>
              </div>
            </div>
          `,
          text: `
Hi ${userName},

We've received your support request and our team will review it shortly.

Ticket Number: ${ticket.ticket_number}
Subject: ${validatedData.subject}
Priority: ${validatedData.priority}

We typically respond within 24 hours during business hours.

View your tickets: ${process.env.NEXTAUTH_URL}/dashboard/support

Best regards,
The ProcessX Team
          `.trim(),
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
