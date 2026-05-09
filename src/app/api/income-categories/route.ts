import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().optional(),
  icon: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's active company membership
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 404 }
      )
    }

    // Get system categories and company-specific categories
    const categories = await prisma.incomeCategory.findMany({
      where: {
        OR: [
          { is_system: true },
          { company_id: membership.company_id },
        ],
        is_active: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Income categories fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch income categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categoryCreateSchema.parse(body)

    // Get user's active company membership
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 404 }
      )
    }

    // Check if category with same name exists
    const existingCategory = await prisma.incomeCategory.findFirst({
      where: {
        name: validatedData.name,
        OR: [
          { is_system: true },
          { company_id: membership.company_id },
        ],
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.incomeCategory.create({
      data: {
        company_id: membership.company_id,
        name: validatedData.name,
        color: validatedData.color,
        icon: validatedData.icon,
        is_system: false,
      },
    })

    return NextResponse.json(
      {
        message: 'Category created successfully',
        category,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Income category creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create category. Please try again.' },
      { status: 500 }
    )
  }
}
