import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { prisma } from '@/lib/db'
import { z } from 'zod'

const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  registrationNumber: z.string().optional(),
  taxNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  businessType: z.enum(['small_business_corporation', 'standard_company', 'sole_proprietor']),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  userId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = createCompanySchema.parse(body)

    // Check if user already has a company
    const existingMembership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User already belongs to a company' },
        { status: 400 }
      )
    }

    // Create company and add user as owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the company
      const company = await tx.company.create({
        data: {
          name: data.name,
          registration_number: data.registrationNumber || null,
          tax_number: data.taxNumber || null,
          vat_number: data.vatNumber || null,
          business_type: data.businessType,
          phone: data.phone || null,
          email: data.email || null,
          address_line1: data.address || null,
          city: data.city || null,
          province: data.province || null,
          postal_code: data.postalCode || null,
          created_by_id: session.user.id,
        },
      })

      // Add user as company owner
      await tx.companyMember.create({
        data: {
          company_id: company.id,
          user_id: session.user.id,
          role: 'owner',
          is_active: true,
        },
      })

      return company
    })

    return NextResponse.json(
      {
        message: 'Company created successfully',
        company: result,
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

    console.error('Company creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create company. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's companies
    const memberships = await prisma.companyMember.findMany({
      where: {
        user_id: session.user.id,
        is_active: true,
      },
      include: {
        company: true,
      },
    })

    return NextResponse.json({
      companies: memberships.map((m) => m.company),
    })
  } catch (error) {
    console.error('Fetch companies error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}
