import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { reset_token: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (!user.reset_token_expires || user.reset_token_expires < new Date()) {
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash new password
    const password_hash = await hash(password, 12)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        reset_token: null,
        reset_token_expires: null,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        user_id: user.id,
        action: 'auth.password_reset_completed',
        entity_type: 'User',
        entity_id: user.id,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      },
    })

    return NextResponse.json({
      message: 'Password reset successful. You can now log in with your new password.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to validate token before showing reset form
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { reset_token: token },
      select: {
        reset_token_expires: true,
        first_name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Invalid reset link' },
        { status: 400 }
      )
    }

    if (!user.reset_token_expires || user.reset_token_expires < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Reset link has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      firstName: user.first_name,
    })
  } catch (error) {
    console.error('Validate reset token error:', error)
    return NextResponse.json(
      { valid: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
