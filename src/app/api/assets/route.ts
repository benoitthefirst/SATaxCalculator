import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

// SARS Depreciation Rates (Interpretation Note 47)
const DEPRECIATION_RATES: Record<string, { years: number; rate: number }> = {
  computer: { years: 3, rate: 33.33 },
  phone: { years: 2, rate: 50 },
  camera: { years: 6, rate: 16.67 },
  vehicle: { years: 5, rate: 20 },
  furniture: { years: 6, rate: 16.67 },
  equipment: { years: 5, rate: 20 },
  other: { years: 5, rate: 20 },
}

const assetCreateSchema = z.object({
  company_id: z.string(),
  name: z.string().min(1, 'Asset name is required'),
  description: z.string().optional(),
  asset_type: z.enum(['vehicle', 'computer', 'phone', 'camera', 'furniture', 'equipment', 'other']),
  purchase_date: z.string(),
  purchase_cost: z.number().positive(),
  useful_life_years: z.number().positive().optional(),
  residual_value: z.number().min(0).default(0),
  business_use_percent: z.number().min(0).max(100).default(100),
  serial_number: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = assetCreateSchema.parse(body)

    // Verify user has access to this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: validatedData.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this company' },
        { status: 403 }
      )
    }

    // Get depreciation rate based on asset type
    const depreciationInfo = DEPRECIATION_RATES[validatedData.asset_type] || DEPRECIATION_RATES.other
    const usefulLife = validatedData.useful_life_years || depreciationInfo.years
    const depreciationRate = 100 / usefulLife

    // Create asset
    const asset = await prisma.asset.create({
      data: {
        company_id: validatedData.company_id,
        name: validatedData.name,
        description: validatedData.description,
        asset_type: validatedData.asset_type,
        purchase_date: new Date(validatedData.purchase_date),
        purchase_cost: validatedData.purchase_cost,
        useful_life_years: usefulLife,
        depreciation_rate: depreciationRate,
        residual_value: validatedData.residual_value,
        business_use_percent: validatedData.business_use_percent,
        serial_number: validatedData.serial_number,
        notes: validatedData.notes,
      },
    })

    return NextResponse.json(
      {
        message: 'Asset created successfully',
        asset,
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

    console.error('Asset creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create asset. Please try again.' },
      { status: 500 }
    )
  }
}

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

    const { searchParams } = new URL(request.url)
    const assetType = searchParams.get('type') || ''

    const where: any = {
      company_id: membership.company_id,
      is_deleted: false,
    }

    if (assetType) {
      where.asset_type = assetType
    }

    const assets = await prisma.asset.findMany({
      where,
      orderBy: { purchase_date: 'desc' },
    })

    // Calculate current book value and annual depreciation for each asset
    const assetsWithDepreciation = assets.map((asset) => {
      const purchaseCost = Number(asset.purchase_cost)
      const residualValue = Number(asset.residual_value || 0)
      const usefulLife = asset.useful_life_years
      const businessUsePercent = asset.business_use_percent || 100

      const annualDepreciation = ((purchaseCost - residualValue) / usefulLife) * (businessUsePercent / 100)

      // Calculate years elapsed
      const purchaseDate = new Date(asset.purchase_date)
      const now = new Date()
      const yearsElapsed = Math.min(
        (now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
        usefulLife
      )

      const accumulatedDepreciation = annualDepreciation * yearsElapsed
      const bookValue = Math.max(purchaseCost - accumulatedDepreciation, residualValue)

      return {
        ...asset,
        annualDepreciation,
        accumulatedDepreciation,
        bookValue,
      }
    })

    return NextResponse.json({
      assets: assetsWithDepreciation,
    })
  } catch (error) {
    console.error('Asset fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}
