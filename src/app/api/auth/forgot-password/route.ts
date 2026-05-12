import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import crypto from 'crypto'
import { sendEmail, passwordResetEmail } from '@/lib/email'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user || user.is_deleted || !user.is_active) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires: resetTokenExpires,
      },
    })

    // Send reset email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://www.processx.co.za'}/reset-password?token=${resetToken}`
    const emailContent = passwordResetEmail({
      firstName: user.first_name,
      resetUrl,
    })

    await sendEmail({
      to: user.email,
      ...emailContent,
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        user_id: user.id,
        action: 'auth.password_reset_requested',
        entity_type: 'User',
        entity_id: user.id,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      },
    })

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
