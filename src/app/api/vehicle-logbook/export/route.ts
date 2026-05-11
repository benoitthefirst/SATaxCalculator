import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkFeatureAccess } from '@/lib/subscription/feature-gate'
import { Prisma } from '@prisma/client'

type VehicleLogEntryWithAsset = Prisma.VehicleLogEntryGetPayload<{ include: { asset: true } }>

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

    // Check feature access - vehicle logbook AND CSV exports require Professional plan
    const [hasLogbookAccess, hasExportAccess] = await Promise.all([
      checkFeatureAccess(membership.company_id, 'vehicle_logbook'),
      checkFeatureAccess(membership.company_id, 'csv_exports'),
    ])

    if (!hasLogbookAccess || !hasExportAccess) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: 'Vehicle logbook export is available on Professional and Business plans.',
          feature: 'csv_exports',
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const tripType = searchParams.get('tripType') || '' // 'business' | 'personal' | ''

    const where: any = {
      company_id: membership.company_id,
    }

    if (assetId) {
      where.asset_id = assetId
    }

    if (startDate) {
      where.trip_date = {
        ...where.trip_date,
        gte: new Date(startDate),
      }
    }

    if (endDate) {
      where.trip_date = {
        ...where.trip_date,
        lte: new Date(endDate),
      }
    }

    if (tripType === 'business') {
      where.is_business = true
    } else if (tripType === 'personal') {
      where.is_business = false
    }

    const entriesRaw = await prisma.vehicleLogEntry.findMany({
      where,
      orderBy: { trip_date: 'desc' },
      include: {
        asset: true,
      },
    })

    const entries = entriesRaw as VehicleLogEntryWithAsset[]

    // Generate CSV
    const headers = [
      'Trip Date',
      'Vehicle',
      'Start Location',
      'End Location',
      'Start Odometer (km)',
      'End Odometer (km)',
      'Distance (km)',
      'Trip Type',
      'Purpose',
      'Client Name',
      'Notes',
    ]

    const rows = entries.map((entry) => [
      new Date(entry.trip_date).toLocaleDateString('en-ZA'),
      entry.asset.name,
      entry.start_location,
      entry.end_location,
      entry.start_odometer.toString(),
      entry.end_odometer.toString(),
      entry.distance_km.toString(),
      entry.is_business ? 'Business' : 'Personal',
      entry.purpose,
      entry.client_name || '',
      entry.notes || '',
    ])

    // Calculate summary statistics
    const totalDistance = entries.reduce((sum, e) => sum + e.distance_km, 0)
    const businessEntries = entries.filter((e) => e.is_business)
    const personalEntries = entries.filter((e) => !e.is_business)
    const businessDistance = businessEntries.reduce((sum, e) => sum + e.distance_km, 0)
    const personalDistance = personalEntries.reduce((sum, e) => sum + e.distance_km, 0)
    const businessPercentage = totalDistance > 0 ? (businessDistance / totalDistance) * 100 : 0

    // Add summary rows
    rows.push([]) // Empty row
    rows.push(['SUMMARY', '', '', '', '', '', '', '', '', '', ''])
    rows.push(['Total Trips', entries.length.toString(), '', '', '', '', totalDistance.toString(), '', '', '', ''])
    rows.push(['Business Trips', businessEntries.length.toString(), '', '', '', '', businessDistance.toString(), 'Business', '', '', ''])
    rows.push(['Personal Trips', personalEntries.length.toString(), '', '', '', '', personalDistance.toString(), 'Personal', '', '', ''])
    rows.push(['Business Use %', '', '', '', '', '', businessPercentage.toFixed(2) + '%', '', '', '', ''])

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

    const filename = `vehicle_logbook_${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Vehicle logbook export error:', error)
    return NextResponse.json(
      { error: 'Failed to export vehicle logbook' },
      { status: 500 }
    )
  }
}
