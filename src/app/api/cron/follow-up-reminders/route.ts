import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendEmail, activationReminderEmail } from '@/lib/email'

// Type for company with relations
interface CompanyWithRelations {
  id: string
  name: string
  created_at: Date
  is_active: boolean
  created_by: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  follow_up_emails: {
    id: string
    email_type: string
    sent_at: Date
  }[]
  _count: {
    expenses: number
    income: number
    pending_documents: number
  }
}

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // If no CRON_SECRET is set, allow in development
  if (!cronSecret) {
    console.warn('CRON_SECRET not set - allowing request in development')
    return process.env.NODE_ENV === 'development'
  }

  return authHeader === `Bearer ${cronSecret}`
}

// Configuration for automated follow-ups
const CONFIG = {
  // Days after company creation with no activity to send first reminder
  FIRST_REMINDER_DAYS: 3,
  // Days after first reminder to send second reminder
  SECOND_REMINDER_DAYS: 7,
  // Maximum reminders to send per company
  MAX_REMINDERS: 2,
  // Batch size to avoid overwhelming the email service
  BATCH_SIZE: 10,
}

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[Cron] Starting automated follow-up reminders...')

  try {
    const now = new Date()
    const firstReminderCutoff = new Date(now.getTime() - CONFIG.FIRST_REMINDER_DAYS * 24 * 60 * 60 * 1000)

    // Find companies that:
    // 1. Have no transactions (expenses or income)
    // 2. Have no documents uploaded
    // 3. Were created at least X days ago
    // 4. Haven't received more than MAX_REMINDERS follow-ups
    const inactiveCompanies = await prisma.company.findMany({
      where: {
        is_active: true,
        created_at: { lte: firstReminderCutoff },
        // No transactions
        expenses: { none: {} },
        income: { none: {} },
        // No documents
        pending_documents: { none: {} },
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
        follow_up_emails: {
          where: {
            email_type: { in: ['ACTIVATION_REMINDER', 'AUTO_REMINDER'] },
          },
          orderBy: { sent_at: 'desc' },
        },
        _count: {
          select: {
            expenses: true,
            income: true,
            pending_documents: true,
          },
        },
      },
      take: CONFIG.BATCH_SIZE * 2, // Get extra to filter
    }) as unknown as CompanyWithRelations[]

    const results = {
      checked: inactiveCompanies.length,
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://app.processx.co.za'

    // Filter and send reminders
    for (const company of inactiveCompanies) {
      // Check if they've already received max reminders
      const reminderCount = company.follow_up_emails.length
      if (reminderCount >= CONFIG.MAX_REMINDERS) {
        results.skipped++
        continue
      }

      // Check timing for second reminder
      if (reminderCount === 1) {
        const lastReminder = company.follow_up_emails[0]
        const daysSinceLastReminder = Math.floor(
          (now.getTime() - new Date(lastReminder.sent_at).getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysSinceLastReminder < CONFIG.SECOND_REMINDER_DAYS) {
          results.skipped++
          continue
        }
      }

      // Stop if we've sent enough for this batch
      if (results.sent >= CONFIG.BATCH_SIZE) {
        break
      }

      try {
        const daysSinceCreation = Math.floor(
          (now.getTime() - new Date(company.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )

        const emailContent = activationReminderEmail({
          firstName: company.created_by.first_name,
          companyName: company.name,
          daysInactive: daysSinceCreation,
          uploadDocUrl: `${baseUrl}/dashboard/${company.id}/documents`,
          senderName: 'The ProcessX Team',
        })

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
              email_type: 'AUTO_REMINDER',
              subject: emailContent.subject,
              message: `Automated reminder #${reminderCount + 1}`,
              sent_by: company.created_by.id, // System-sent, attributed to company owner
            },
          })

          // Create audit log
          await prisma.auditLog.create({
            data: {
              action: 'AUTO_FOLLOW_UP_SENT',
              entity_type: 'Company',
              entity_id: company.id,
              metadata: {
                reminder_number: reminderCount + 1,
                recipient_email: company.created_by.email,
                company_name: company.name,
                days_inactive: daysSinceCreation,
              },
            },
          })

          results.sent++
          console.log(`[Cron] Sent reminder to ${company.created_by.email} for ${company.name}`)
        } else {
          results.failed++
          results.errors.push(`Failed to send to ${company.created_by.email}`)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`Error for ${company.name}: ${error instanceof Error ? error.message : 'Unknown'}`)
      }
    }

    console.log(`[Cron] Follow-up reminders complete:`, results)

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    })
  } catch (error) {
    console.error('[Cron] Failed to run follow-up reminders:', error)
    return NextResponse.json(
      { error: 'Failed to process follow-up reminders' },
      { status: 500 }
    )
  }
}
