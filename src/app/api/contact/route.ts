import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  sales: 'Sales / Pricing',
  support: 'Technical Support',
  partnership: 'Partnership Opportunity',
  feedback: 'Feedback / Suggestions',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP not configured')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    const subjectLabel = SUBJECT_LABELS[subject] || subject

    // Email to ProcessX team
    await transporter.sendMail({
      from: `"ProcessX Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `[ProcessX] ${subjectLabel} - ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151;">Name:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151;">Email:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
                </td>
              </tr>
              ${company ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151;">Company:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                  ${company}
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong style="color: #374151;">Subject:</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">
                  ${subjectLabel}
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px;">
              <strong style="color: #374151;">Message:</strong>
              <div style="margin-top: 12px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827; white-space: pre-wrap;">
${message}
              </div>
            </div>

            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This email was sent from the ProcessX contact form at www.processx.co.za
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}\n` : ''}Subject: ${subjectLabel}

Message:
${message}

---
This email was sent from the ProcessX contact form at www.processx.co.za
      `.trim(),
    })

    // Auto-reply to the user
    await transporter.sendMail({
      from: `"ProcessX" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `We received your message - ProcessX`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank you for contacting us!</h1>
          </div>

          <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hi ${name},
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We&apos;ve received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you within 24 hours.
            </p>

            <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;"><strong>Your message:</strong></p>
              <p style="color: #374151; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our <a href="https://www.processx.co.za/help" style="color: #2563eb;">Help Centre</a> for quick answers to common questions.
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>The ProcessX Team</strong>
            </p>

            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                ProcessX - Bookkeeping Made Simple, Business Made Easy
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
                <a href="https://www.processx.co.za" style="color: #2563eb;">www.processx.co.za</a>
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
Hi ${name},

Thank you for contacting ProcessX!

We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you within 24 hours.

Your message:
${message}

In the meantime, feel free to explore our Help Centre at https://www.processx.co.za/help for quick answers to common questions.

Best regards,
The ProcessX Team

---
ProcessX - Bookkeeping Made Simple, Business Made Easy
www.processx.co.za
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
