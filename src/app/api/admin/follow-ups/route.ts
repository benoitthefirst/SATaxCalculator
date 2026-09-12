import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendEmail, followUpEmail, activationReminderEmail } from '@/lib/email'

// Type for company with follow-up data
interface CompanyWithFollowUps {
  id: string
  name: string
  business_type: string | null
  created_at: Date
  created_by: {
    id: string
    first_name: string
    last_name: string
    email: string
    last_login_at: Date | null
  }
  _count: {
    members: number
    expenses: number
    income: number
    pending_documents: number
  }
  follow_up_emails: {
    id: string
    email_type: string
    sent_at: Date
  }[]
}

// Admin check helper
async function checkAdminAccess() {
  const session = await auth()
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }
  return session
}

// GET /api/admin/follow-ups - List companies/users eligible for follow-up
export async function GET(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const filter = searchParams.get('filter') || 'inactive' // inactive, no_transactions, no_documents
  const search = searchParams.get('search') || ''

  const skip = (page - 1) * limit

  // Build where clause for companies with inactive users
  const where: Record<string, unknown> = {
    is_active: true,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { created_by: { first_name: { contains: search, mode: 'insensitive' } } },
      { created_by: { last_name: { contains: search, mode: 'insensitive' } } },
      { created_by: { email: { contains: search, mode: 'insensitive' } } },
    ]
  }

  // Filter based on activity
  if (filter === 'no_transactions') {
    where.AND = [
      { expenses: { none: {} } },
      { income: { none: {} } },
    ]
  } else if (filter === 'no_documents') {
    where.pending_documents = { none: {} }
  } else if (filter === 'inactive') {
    // Companies with no activity (no expenses, income, or documents)
    where.AND = [
      { expenses: { none: {} } },
      { income: { none: {} } },
      { pending_documents: { none: {} } },
    ]
  }

  const [companiesResult, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        created_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            last_login_at: true,
          },
        },
        _count: {
          select: {
            members: true,
            expenses: true,
            income: true,
            pending_documents: true,
          },
        },
        follow_up_emails: {
          orderBy: { sent_at: 'desc' },
          take: 1,
          select: {
            id: true,
            email_type: true,
            sent_at: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ])

  // Cast to typed result
  const companies = companiesResult as unknown as CompanyWithFollowUps[]

  // Calculate days since creation for each company
  const companiesWithDays = companies.map(company => {
    const createdAt = new Date(company.created_at)
    const now = new Date()
    const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    return {
      ...company,
      days_since_creation: daysSinceCreation,
      last_follow_up: company.follow_up_emails[0] || null,
    }
  })

  return NextResponse.json({
    companies: companiesWithDays,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

// POST /api/admin/follow-ups - Send follow-up email(s)
export async function POST(request: NextRequest) {
  const session = await checkAdminAccess()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      companyIds,
      emailType,
      customMessage,
      senderName = `${session.user.name || 'ProcessX Team'}`,
    } = body

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return NextResponse.json({ error: 'At least one company must be selected' }, { status: 400 })
    }

    if (!emailType || !['WELCOME_FOLLOWUP', 'ACTIVATION_REMINDER', 'CUSTOM'].includes(emailType)) {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    if (emailType === 'CUSTOM' && !customMessage) {
      return NextResponse.json({ error: 'Custom message is required for custom emails' }, { status: 400 })
    }

    // Get companies with owner info
    const companies = await prisma.company.findMany({
      where: {
        id: { in: companyIds },
      },
      include: {
        created_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    })

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://app.processx.co.za'

    // Send emails to each company owner
    for (const company of companies) {
      try {
        let emailContent
        let subject: string

        const daysSinceCreation = Math.floor(
          (new Date().getTime() - new Date(company.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )

        if (emailType === 'ACTIVATION_REMINDER') {
          emailContent = activationReminderEmail({
            firstName: company.created_by.first_name,
            companyName: company.name,
            daysInactive: daysSinceCreation,
            uploadDocUrl: `${baseUrl}/dashboard/${company.id}/documents`,
            senderName,
          })
          subject = emailContent.subject
        } else {
          // WELCOME_FOLLOWUP or CUSTOM
          const message = customMessage ||
            `I'd love to help you get everything set up properly. If you have an invoice, receipt, or bank statement available, upload one and I'll help you get your first document processed.\n\nThis gives us the chance to show you how ProcessX can save you hours of bookkeeping work each month.`

          emailContent = followUpEmail({
            firstName: company.created_by.first_name,
            companyName: company.name,
            customMessage: message,
            dashboardUrl: `${baseUrl}/dashboard/${company.id}`,
            senderName,
          })
          subject = emailContent.subject
        }

        // Send the email
        const sent = await sendEmail({
          to: company.created_by.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        })

        if (sent) {
          // Log the email
          await prisma.followUpEmail.create({
            data: {
              user_id: company.created_by.id,
              company_id: company.id,
              email_type: emailType,
              subject,
              message: customMessage || emailType,
              sent_by: session.user.id,
            },
          })

          // Also log to audit
          await prisma.auditLog.create({
            data: {
              user_id: session.user.id,
              action: 'FOLLOW_UP_EMAIL_SENT',
              entity_type: 'Company',
              entity_id: company.id,
              metadata: {
                email_type: emailType,
                recipient_email: company.created_by.email,
                recipient_name: `${company.created_by.first_name} ${company.created_by.last_name}`,
                company_name: company.name,
              },
            },
          })

          results.sent++
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${company.created_by.email}`)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`Error sending to ${company.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Failed to send follow-up emails:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
