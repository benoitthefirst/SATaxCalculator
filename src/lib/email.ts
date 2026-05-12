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

// Base email template wrapper
function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF9500; margin: 0; font-size: 28px;">ProcessX</h1>
      <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Smart Bookkeeping for South African Businesses</p>
    </div>
    ${content}
  </div>
  <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
    <p>&copy; ${new Date().getFullYear()} ProcessX. All rights reserved.</p>
    <p>
      <a href="https://www.processx.co.za/privacy" style="color: #999;">Privacy Policy</a> ·
      <a href="https://www.processx.co.za/terms" style="color: #999;">Terms of Service</a>
    </p>
  </div>
</body>
</html>
  `
}

// Welcome email for new users
export function welcomeEmail(params: { firstName: string; loginUrl: string }) {
  const { firstName, loginUrl } = params

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #111;">Welcome to ProcessX, ${firstName}!</h2>
    <p>Thank you for joining ProcessX. We're excited to help you manage your business finances more efficiently.</p>

    <p>With ProcessX, you can:</p>
    <ul style="color: #555;">
      <li>Track income and expenses effortlessly</li>
      <li>Manage your vehicle logbook for tax deductions</li>
      <li>Calculate depreciation on business assets</li>
      <li>Generate tax-ready reports for SARS</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">If you have any questions, our support team is here to help.</p>
  `)

  return {
    subject: 'Welcome to ProcessX - Let\'s get started!',
    html,
    text: `
Welcome to ProcessX, ${firstName}!

Thank you for joining ProcessX. We're excited to help you manage your business finances more efficiently.

With ProcessX, you can:
- Track income and expenses effortlessly
- Manage your vehicle logbook for tax deductions
- Calculate depreciation on business assets
- Generate tax-ready reports for SARS

Get started: ${loginUrl}

If you have any questions, our support team is here to help.
    `.trim(),
  }
}

// Password reset email
export function passwordResetEmail(params: { firstName: string; resetUrl: string }) {
  const { firstName, resetUrl } = params

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #111;">Reset Your Password</h2>
    <p>Hi ${firstName},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">This link will expire in 1 hour for security reasons.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
  `)

  return {
    subject: 'Reset your ProcessX password',
    html,
    text: `
Reset Your Password

Hi ${firstName},

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    `.trim(),
  }
}

// Subscription created/activated email
export function subscriptionCreatedEmail(params: {
  firstName: string
  planName: string
  amount: string
  billingCycle: string
  nextBillingDate: string
  dashboardUrl: string
}) {
  const { firstName, planName, amount, billingCycle, nextBillingDate, dashboardUrl } = params

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #111;">Welcome to ${planName}!</h2>
    <p>Hi ${firstName},</p>
    <p>Thank you for subscribing to ProcessX ${planName}. Your subscription is now active!</p>

    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Subscription Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Plan</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${amount}/${billingCycle}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Next billing date</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${nextBillingDate}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">You can manage your subscription anytime from your account settings.</p>
  `)

  return {
    subject: `Welcome to ProcessX ${planName}!`,
    html,
    text: `
Welcome to ${planName}!

Hi ${firstName},

Thank you for subscribing to ProcessX ${planName}. Your subscription is now active!

Subscription Details:
- Plan: ${planName}
- Amount: ${amount}/${billingCycle}
- Next billing date: ${nextBillingDate}

Go to your dashboard: ${dashboardUrl}

You can manage your subscription anytime from your account settings.
    `.trim(),
  }
}

// Payment successful email
export function paymentSuccessEmail(params: {
  firstName: string
  planName: string
  amount: string
  paymentDate: string
  invoiceUrl?: string
}) {
  const { firstName, planName, amount, paymentDate, invoiceUrl } = params

  const invoiceButton = invoiceUrl
    ? `<div style="text-align: center; margin: 30px 0;">
        <a href="${invoiceUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
          View Invoice
        </a>
      </div>`
    : ''

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #111;">Payment Received</h2>
    <p>Hi ${firstName},</p>
    <p>We've successfully processed your payment for ProcessX ${planName}.</p>

    <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Plan</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Date</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${paymentDate}</td>
        </tr>
      </table>
    </div>

    ${invoiceButton}

    <p style="font-size: 14px; color: #666;">Thank you for your continued support!</p>
  `)

  return {
    subject: 'Payment received - ProcessX',
    html,
    text: `
Payment Received

Hi ${firstName},

We've successfully processed your payment for ProcessX ${planName}.

Payment Details:
- Plan: ${planName}
- Amount: ${amount}
- Date: ${paymentDate}

Thank you for your continued support!
    `.trim(),
  }
}

// Payment failed email
export function paymentFailedEmail(params: {
  firstName: string
  planName: string
  amount: string
  retryDate: string
  updatePaymentUrl: string
}) {
  const { firstName, planName, amount, retryDate, updatePaymentUrl } = params

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #dc2626;">Payment Failed</h2>
    <p>Hi ${firstName},</p>
    <p>We were unable to process your payment for ProcessX ${planName}.</p>

    <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Plan</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${amount}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Next retry</td>
          <td style="padding: 8px 0; text-align: right; font-weight: 600;">${retryDate}</td>
        </tr>
      </table>
    </div>

    <p>Please update your payment method to avoid service interruption.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${updatePaymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Update Payment Method
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">If you need assistance, please contact our support team.</p>
  `)

  return {
    subject: 'Payment failed - Action required',
    html,
    text: `
Payment Failed

Hi ${firstName},

We were unable to process your payment for ProcessX ${planName}.

Payment Details:
- Plan: ${planName}
- Amount: ${amount}
- Next retry: ${retryDate}

Please update your payment method to avoid service interruption: ${updatePaymentUrl}

If you need assistance, please contact our support team.
    `.trim(),
  }
}

// Subscription cancelled email
export function subscriptionCancelledEmail(params: {
  firstName: string
  planName: string
  accessUntil: string
  resubscribeUrl: string
}) {
  const { firstName, planName, accessUntil, resubscribeUrl } = params

  const html = emailWrapper(`
    <h2 style="margin-top: 0; color: #111;">Subscription Cancelled</h2>
    <p>Hi ${firstName},</p>
    <p>Your ProcessX ${planName} subscription has been cancelled.</p>

    <div style="background: #fef3c7; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0; color: #92400e;">
        <strong>You'll continue to have access to ${planName} features until ${accessUntil}.</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">
        After this date, your account will be downgraded to the free Starter plan.
      </p>
    </div>

    <p>We're sorry to see you go. If you change your mind, you can resubscribe anytime.</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resubscribeUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF9500, #FF6B00); color: white; text-decoration: none; padding: 14px 30px; border-radius: 10px; font-weight: 600;">
        Resubscribe
      </a>
    </div>

    <p style="font-size: 14px; color: #666;">If you have any feedback about why you cancelled, we'd love to hear it.</p>
  `)

  return {
    subject: 'Your ProcessX subscription has been cancelled',
    html,
    text: `
Subscription Cancelled

Hi ${firstName},

Your ProcessX ${planName} subscription has been cancelled.

You'll continue to have access to ${planName} features until ${accessUntil}. After this date, your account will be downgraded to the free Starter plan.

We're sorry to see you go. If you change your mind, you can resubscribe anytime: ${resubscribeUrl}

If you have any feedback about why you cancelled, we'd love to hear it.
    `.trim(),
  }
}
