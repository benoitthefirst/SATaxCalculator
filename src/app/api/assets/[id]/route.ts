import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const assetUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  asset_type: z.enum(['vehicle', 'computer', 'phone', 'camera', 'furniture', 'equipment', 'other']).optional(),
  purchase_date: z.string().optional(),
  purchase_cost: z.number().positive().optional(),
  useful_life_years: z.number().positive().optional(),
  residual_value: z.number().min(0).optional(),
  business_use_percent: z.number().min(0).max(100).optional(),
  serial_number: z.string().optional(),
  disposal_date: z.string().optional(),
  disposal_proceeds: z.number().min(0).optional(),
  notes: z.string().optional(),
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

    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicle_log_entries: {
          orderBy: { trip_date: 'desc' },
          take: 10,
        },
      },
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this asset's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: asset.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this asset' },
        { status: 403 }
      )
    }

    // Calculate depreciation details
    const purchaseCost = Number(asset.purchase_cost)
    const residualValue = Number(asset.residual_value || 0)
    const usefulLife = asset.useful_life_years
    const businessUsePercent = asset.business_use_percent || 100

    const annualDepreciation = ((purchaseCost - residualValue) / usefulLife) * (businessUsePercent / 100)

    const purchaseDate = new Date(asset.purchase_date)
    const now = new Date()
    const yearsElapsed = Math.min(
      (now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      usefulLife
    )

    const accumulatedDepreciation = annualDepreciation * yearsElapsed
    const bookValue = Math.max(purchaseCost - accumulatedDepreciation, residualValue)

    return NextResponse.json({
      asset: {
        ...asset,
        annualDepreciation,
        accumulatedDepreciation,
        bookValue,
        yearsElapsed: Math.floor(yearsElapsed),
        yearsRemaining: Math.max(0, usefulLife - Math.floor(yearsElapsed)),
      },
    })
  } catch (error) {
    console.error('Asset fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
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
    const body = await request.json()
    const validatedData = assetUpdateSchema.parse(body)

    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingAsset.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this asset' },
        { status: 403 }
      )
    }

    // Calculate new depreciation rate if useful life changed
    let depreciationRate = Number(existingAsset.depreciation_rate)
    if (validatedData.useful_life_years) {
      depreciationRate = 100 / validatedData.useful_life_years
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.asset_type && { asset_type: validatedData.asset_type }),
        ...(validatedData.purchase_date && { purchase_date: new Date(validatedData.purchase_date) }),
        ...(validatedData.purchase_cost !== undefined && { purchase_cost: validatedData.purchase_cost }),
        ...(validatedData.useful_life_years && {
          useful_life_years: validatedData.useful_life_years,
          depreciation_rate: depreciationRate,
        }),
        ...(validatedData.residual_value !== undefined && { residual_value: validatedData.residual_value }),
        ...(validatedData.business_use_percent !== undefined && { business_use_percent: validatedData.business_use_percent }),
        ...(validatedData.serial_number !== undefined && { serial_number: validatedData.serial_number }),
        ...(validatedData.disposal_date && { disposal_date: new Date(validatedData.disposal_date) }),
        ...(validatedData.disposal_proceeds !== undefined && { disposal_proceeds: validatedData.disposal_proceeds }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      },
    })

    return NextResponse.json({
      message: 'Asset updated successfully',
      asset,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Asset update error:', error)
    return NextResponse.json(
      { error: 'Failed to update asset. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingAsset = await prisma.asset.findUnique({
      where: { id },
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: existingAsset.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this asset' },
        { status: 403 }
      )
    }

    // Soft delete
    await prisma.asset.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    })

    return NextResponse.json({
      message: 'Asset deleted successfully',
    })
  } catch (error) {
    console.error('Asset delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete asset. Please try again.' },
      { status: 500 }
    )
  }
}
