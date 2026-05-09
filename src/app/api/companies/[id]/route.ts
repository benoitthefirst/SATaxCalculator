import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').optional(),
  registration_number: z.string().nullable().optional(),
  tax_number: z.string().nullable().optional(),
  vat_number: z.string().nullable().optional(),
  business_type: z.enum(['small_business_corporation', 'standard_company', 'sole_proprietor']).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  address_line1: z.string().nullable().optional(),
  address_line2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  province: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if user is a member of this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        company_id: id,
        user_id: session.user.id,
        is_active: true,
      },
      include: {
        company: true,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json({ company: membership.company })
  } catch (error) {
    console.error('Get company error:', error)
    return NextResponse.json(
      { error: 'Failed to get company' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if user is an owner or admin of this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        company_id: id,
        user_id: session.user.id,
        is_active: true,
        role: { in: ['owner', 'admin'] },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Not authorized to update this company' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateCompanySchema.parse(body)

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.registration_number !== undefined && { registration_number: data.registration_number || null }),
        ...(data.tax_number !== undefined && { tax_number: data.tax_number || null }),
        ...(data.vat_number !== undefined && { vat_number: data.vat_number || null }),
        ...(data.business_type !== undefined && { business_type: data.business_type }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.address_line1 !== undefined && { address_line1: data.address_line1 || null }),
        ...(data.address_line2 !== undefined && { address_line2: data.address_line2 || null }),
        ...(data.city !== undefined && { city: data.city || null }),
        ...(data.province !== undefined && { province: data.province || null }),
        ...(data.postal_code !== undefined && { postal_code: data.postal_code || null }),
      },
    })

    return NextResponse.json({
      message: 'Company updated successfully',
      company: updatedCompany,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Update company error:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}
