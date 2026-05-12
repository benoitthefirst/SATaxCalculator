import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkFeatureAccess } from '@/lib/subscription/feature-gate'
import * as z from 'zod'

const logEntryCreateSchema = z.object({
  asset_id: z.string().min(1, 'Vehicle is required'),
  trip_date: z.string().min(1, 'Trip date is required'),
  start_location: z.string().min(1, 'Start location is required'),
  end_location: z.string().min(1, 'End location is required'),
  start_odometer: z.number().min(0, 'Start odometer must be positive'),
  end_odometer: z.number().min(0, 'End odometer must be positive'),
  purpose: z.string().min(1, 'Purpose is required'),
  client_name: z.string().optional(),
  is_business: z.boolean().default(true),
  notes: z.string().optional(),
})

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

    // Check feature access - vehicle logbook requires Professional plan or higher
    const hasAccess = await checkFeatureAccess(membership.company_id, 'vehicle_logbook')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: 'Vehicle logbook is available on Professional and Business plans. Upgrade to track your business travel and claim SARS deductions.',
          feature: 'vehicle_logbook',
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('asset')
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    // Build date filter for fiscal year or specific month
    let dateFilter = {}
    if (year) {
      const yearNum = parseInt(year)
      // South African fiscal year: March 1 to Feb 28/29
      const fiscalYearStart = new Date(yearNum, 2, 1) // March 1
      const fiscalYearEnd = new Date(yearNum + 1, 1, 28, 23, 59, 59) // Feb 28
      dateFilter = {
        trip_date: {
          gte: fiscalYearStart,
          lte: fiscalYearEnd,
        },
      }
    }

    if (month && year) {
      const monthNum = parseInt(month) - 1
      const yearNum = parseInt(year)
      const monthStart = new Date(yearNum, monthNum, 1)
      const monthEnd = new Date(yearNum, monthNum + 1, 0, 23, 59, 59)
      dateFilter = {
        trip_date: {
          gte: monthStart,
          lte: monthEnd,
        },
      }
    }

    const entries = await prisma.vehicleLogEntry.findMany({
      where: {
        company_id: membership.company_id,
        ...(assetId && { asset_id: assetId }),
        ...dateFilter,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
            serial_number: true,
          },
        },
      },
      orderBy: { trip_date: 'desc' },
    })

    // Calculate summary statistics
    const totalDistance = entries.reduce((sum, e) => sum + e.distance_km, 0)
    const businessDistance = entries
      .filter((e) => e.is_business)
      .reduce((sum, e) => sum + e.distance_km, 0)
    const personalDistance = totalDistance - businessDistance
    const businessPercentage = totalDistance > 0
      ? Math.round((businessDistance / totalDistance) * 100)
      : 0

    return NextResponse.json({
      entries,
      summary: {
        totalTrips: entries.length,
        businessTrips: entries.filter((e) => e.is_business).length,
        personalTrips: entries.filter((e) => !e.is_business).length,
        totalDistance,
        businessDistance,
        personalDistance,
        businessPercentage,
      },
    })
  } catch (error) {
    console.error('Vehicle logbook fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logbook entries' },
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
    const validatedData = logEntryCreateSchema.parse(body)

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

    // Check feature access
    const hasAccess = await checkFeatureAccess(membership.company_id, 'vehicle_logbook')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Feature not available',
          message: 'Vehicle logbook is available on Professional and Business plans.',
          feature: 'vehicle_logbook',
          upgradeRequired: true,
        },
        { status: 403 }
      )
    }

    // Verify the asset belongs to the company and is a vehicle
    const asset = await prisma.asset.findFirst({
      where: {
        id: validatedData.asset_id,
        company_id: membership.company_id,
        asset_type: 'vehicle',
        is_deleted: false,
      },
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Vehicle not found or not registered' },
        { status: 404 }
      )
    }

    // Validate odometer readings
    if (validatedData.end_odometer <= validatedData.start_odometer) {
      return NextResponse.json(
        { error: 'End odometer must be greater than start odometer' },
        { status: 400 }
      )
    }

    const distance_km = validatedData.end_odometer - validatedData.start_odometer

    const entry = await prisma.vehicleLogEntry.create({
      data: {
        company_id: membership.company_id,
        asset_id: validatedData.asset_id,
        trip_date: new Date(validatedData.trip_date),
        start_location: validatedData.start_location,
        end_location: validatedData.end_location,
        start_odometer: validatedData.start_odometer,
        end_odometer: validatedData.end_odometer,
        distance_km,
        purpose: validatedData.purpose,
        client_name: validatedData.client_name || null,
        is_business: validatedData.is_business,
        notes: validatedData.notes || null,
      },
      include: {
        asset: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Trip logged successfully',
        entry,
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

    console.error('Vehicle logbook creation error:', error)
    return NextResponse.json(
      { error: 'Failed to log trip. Please try again.' },
      { status: 500 }
    )
  }
}
