import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const search = searchParams.get('search') || ''

    const where: any = {
      company_id: membership.company_id,
      is_deleted: false,
    }

    if (assetType) {
      where.asset_type = assetType
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { serial_number: { contains: search, mode: 'insensitive' } },
      ]
    }

    const assets = await prisma.asset.findMany({
      where,
      orderBy: { purchase_date: 'desc' },
    })

    // Calculate depreciation for each asset
    const currentDate = new Date()
    const assetsWithDepreciation = assets.map((asset) => {
      const purchaseDate = new Date(asset.purchase_date)
      const yearsOwned = Math.max(0, (currentDate.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

      const purchaseCost = Number(asset.purchase_cost)
      const residualValue = Number(asset.residual_value)
      const depreciableAmount = purchaseCost - residualValue
      const annualDepreciation = depreciableAmount / asset.useful_life_years

      const totalDepreciation = Math.min(
        annualDepreciation * yearsOwned,
        depreciableAmount
      )

      const currentBookValue = purchaseCost - totalDepreciation
      const businessUseDepreciation = totalDepreciation * (asset.business_use_percent / 100)

      return {
        ...asset,
        yearsOwned,
        totalDepreciation,
        currentBookValue,
        businessUseDepreciation,
        annualDepreciation,
      }
    })

    // Generate CSV
    const headers = [
      'Asset Name',
      'Type',
      'Description',
      'Serial Number',
      'Purchase Date',
      'Purchase Cost (ZAR)',
      'Useful Life (Years)',
      'Depreciation Rate (%)',
      'Residual Value (ZAR)',
      'Business Use (%)',
      'Current Book Value (ZAR)',
      'Total Depreciation (ZAR)',
      'Business Depreciation (ZAR)',
      'Annual Depreciation (ZAR)',
      'Disposal Date',
      'Disposal Proceeds (ZAR)',
      'Notes',
    ]

    const rows = assetsWithDepreciation.map((asset) => [
      asset.name,
      asset.asset_type.replace('_', ' ').toUpperCase(),
      asset.description || '',
      asset.serial_number || '',
      new Date(asset.purchase_date).toLocaleDateString('en-ZA'),
      Number(asset.purchase_cost).toFixed(2),
      asset.useful_life_years.toString(),
      Number(asset.depreciation_rate).toFixed(2),
      Number(asset.residual_value).toFixed(2),
      asset.business_use_percent.toString(),
      asset.currentBookValue.toFixed(2),
      asset.totalDepreciation.toFixed(2),
      asset.businessUseDepreciation.toFixed(2),
      asset.annualDepreciation.toFixed(2),
      asset.disposal_date ? new Date(asset.disposal_date).toLocaleDateString('en-ZA') : '',
      asset.disposal_proceeds ? Number(asset.disposal_proceeds).toFixed(2) : '',
      asset.notes || '',
    ])

    // Add summary row
    const totalPurchaseCost = assetsWithDepreciation.reduce((sum, a) => sum + Number(a.purchase_cost), 0)
    const totalBookValue = assetsWithDepreciation.reduce((sum, a) => sum + a.currentBookValue, 0)
    const totalBusinessDepreciation = assetsWithDepreciation.reduce((sum, a) => sum + a.businessUseDepreciation, 0)

    rows.push([]) // Empty row
    rows.push([
      'TOTALS',
      '',
      '',
      '',
      '',
      totalPurchaseCost.toFixed(2),
      '',
      '',
      '',
      '',
      totalBookValue.toFixed(2),
      '',
      totalBusinessDepreciation.toFixed(2),
      '',
      '',
      '',
      '',
    ])

    const escapeCsvField = (field: string) => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`
      }
      return field
    }

    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...rows.map((row) => row.map(escapeCsvField).join(',')),
    ].join('\n')

    const filename = `assets_depreciation_${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Asset export error:', error)
    return NextResponse.json(
      { error: 'Failed to export assets' },
      { status: 500 }
    )
  }
}
