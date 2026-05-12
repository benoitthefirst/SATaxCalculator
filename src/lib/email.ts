import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  // Skip sending in development if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('📧 Email would be sent (SMTP not configured):')
    console.log(`  To: ${to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Preview: ${text || html.substring(0, 200)}...`)
    return true
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `ProcessX <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    })
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Email template helpers
export function teamInviteEmail(params: {
  companyName: string
  inviterName: string
  role: string
  acceptUrl: string
}) {
  const { companyName, inviterName, role, acceptUrl } = params

  const roleLabel = {
    admin: 'Admin',
    accountant: 'Accountant',
    viewer: 'Viewer',
  }[role] || role

  return {
    subject: `You've been invited to join ${companyName} on ProcessX`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #007AFF; margin: 0;">ProcessX</h1>
  </div>

  <div style="background: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #111;">You're invited!</h2>
    <p><strong>${inviterName}</strong> has invited you to join <strong>${companyName}</strong> on ProcessX as a <strong>${roleLabel}</strong>.</p>
    <p>ProcessX helps businesses manage their finances, track expenses, and prepare for tax season.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${acceptUrl}" style="display: inline-block; background: #007AFF; color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Accept Invitation
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">This invitation will expire in 7 days.</p>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px;">
    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    <p>&copy; ${new Date().getFullYear()} ProcessX. All rights reserved.</p>
  </div>
</body>
</html>
    `,
    text: `
You've been invited to join ${companyName} on ProcessX!

${inviterName} has invited you to join as a ${roleLabel}.

Click the link below to accept the invitation:
${acceptUrl}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
    `.trim(),
  }
}
