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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8FAFC; padding: 20px;">
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background: #062C2E; padding: 24px 32px;">
              <img src="https://www.processx.co.za/Px_Logo_white.webp" alt="ProcessX" style="height: 28px; width: auto; margin-bottom: 16px;" />
              <h1 style="color: #E8FF3F; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; width: 100px;">
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
                    <a href="mailto:${email}" style="color: #062C2E; font-weight: 500;">${email}</a>
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
                <div style="margin-top: 12px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; color: #111827; white-space: pre-wrap;">
${message}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 24px 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              This email was sent from the ProcessX contact form at www.processx.co.za
            </p>
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
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8FAFC; padding: 20px;">
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background: #062C2E; padding: 24px 32px; text-align: center;">
              <img src="https://www.processx.co.za/Px_Logo_white.webp" alt="ProcessX" style="height: 32px; width: auto;" />
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <h2 style="margin: 0 0 24px 0; color: #111; font-size: 24px; text-align: center;">Thank you for contacting us!</h2>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi ${name},
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                We've received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you within 24 hours.
              </p>

              <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0; border: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;"><strong>Your message:</strong></p>
                <p style="color: #374151; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to explore our <a href="https://www.processx.co.za/help" style="color: #062C2E; font-weight: 500;">Help Centre</a> for quick answers to common questions.
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 24px;">
                Best regards,<br>
                <strong>The ProcessX Team</strong>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 24px 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
              Bookkeeping Made Simple, Business Made Easy
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              <a href="https://www.processx.co.za" style="color: #062C2E; font-weight: 500;">www.processx.co.za</a>
            </p>
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
