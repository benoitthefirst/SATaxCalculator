import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as z from 'zod'

const logEntryUpdateSchema = z.object({
  trip_date: z.string().optional(),
  start_location: z.string().optional(),
  end_location: z.string().optional(),
  start_odometer: z.number().min(0).optional(),
  end_odometer: z.number().min(0).optional(),
  purpose: z.string().optional(),
  client_name: z.string().optional().nullable(),
  is_business: z.boolean().optional(),
  notes: z.string().optional().nullable(),
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

    const { id } = await params

    const entry = await prisma.vehicleLogEntry.findFirst({
      where: {
        id,
        company_id: membership.company_id,
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
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ entry })
  } catch (error) {
    console.error('Vehicle log entry fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch log entry' },
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

    const body = await request.json()
    const validatedData = logEntryUpdateSchema.parse(body)

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

    const { id } = await params

    const existingEntry = await prisma.vehicleLogEntry.findFirst({
      where: {
        id,
        company_id: membership.company_id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    // Calculate distance if odometer values changed
    const startOdo = validatedData.start_odometer ?? existingEntry.start_odometer
    const endOdo = validatedData.end_odometer ?? existingEntry.end_odometer

    if (endOdo <= startOdo) {
      return NextResponse.json(
        { error: 'End odometer must be greater than start odometer' },
        { status: 400 }
      )
    }

    const distance_km = endOdo - startOdo

    const entry = await prisma.vehicleLogEntry.update({
      where: { id },
      data: {
        ...(validatedData.trip_date && { trip_date: new Date(validatedData.trip_date) }),
        ...(validatedData.start_location && { start_location: validatedData.start_location }),
        ...(validatedData.end_location && { end_location: validatedData.end_location }),
        ...(validatedData.start_odometer !== undefined && { start_odometer: validatedData.start_odometer }),
        ...(validatedData.end_odometer !== undefined && { end_odometer: validatedData.end_odometer }),
        distance_km,
        ...(validatedData.purpose && { purpose: validatedData.purpose }),
        ...(validatedData.client_name !== undefined && { client_name: validatedData.client_name }),
        ...(validatedData.is_business !== undefined && { is_business: validatedData.is_business }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
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

    return NextResponse.json({
      message: 'Log entry updated successfully',
      entry,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Vehicle log entry update error:', error)
    return NextResponse.json(
      { error: 'Failed to update log entry. Please try again.' },
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

    const { id } = await params

    const existingEntry = await prisma.vehicleLogEntry.findFirst({
      where: {
        id,
        company_id: membership.company_id,
      },
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Log entry not found' },
        { status: 404 }
      )
    }

    await prisma.vehicleLogEntry.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Log entry deleted successfully',
    })
  } catch (error) {
    console.error('Vehicle log entry deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete log entry. Please try again.' },
      { status: 500 }
    )
  }
}
