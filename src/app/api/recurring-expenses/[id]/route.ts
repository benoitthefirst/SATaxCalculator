import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

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

    const recurringExpense = await prisma.recurringExpense.findUnique({
      where: { id },
      include: {
        category: true,
        created_by: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    })

    if (!recurringExpense) {
      return NextResponse.json(
        { error: 'Recurring expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: recurringExpense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this recurring expense' },
        { status: 403 }
      )
    }

    return NextResponse.json({ recurringExpense })
  } catch (error) {
    console.error('Fetch recurring expense error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recurring expense' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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

    const recurringExpense = await prisma.recurringExpense.findUnique({
      where: { id },
    })

    if (!recurringExpense) {
      return NextResponse.json(
        { error: 'Recurring expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: recurringExpense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this recurring expense' },
        { status: 403 }
      )
    }

    const updated = await prisma.recurringExpense.update({
      where: { id },
      data: {
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.vendor_name !== undefined && {
          vendor_name: body.vendor_name,
        }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.payment_method !== undefined && {
          payment_method: body.payment_method,
        }),
        ...(body.is_tax_deductible !== undefined && {
          is_tax_deductible: body.is_tax_deductible,
        }),
        ...(body.is_active !== undefined && { is_active: body.is_active }),
        ...(body.end_date !== undefined && {
          end_date: body.end_date ? new Date(body.end_date) : null,
        }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ recurringExpense: updated })
  } catch (error) {
    console.error('Update recurring expense error:', error)
    return NextResponse.json(
      { error: 'Failed to update recurring expense' },
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

    const recurringExpense = await prisma.recurringExpense.findUnique({
      where: { id },
    })

    if (!recurringExpense) {
      return NextResponse.json(
        { error: 'Recurring expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: recurringExpense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this recurring expense' },
        { status: 403 }
      )
    }

    await prisma.recurringExpense.delete({
      where: { id },
    })

    return NextResponse.json({
      message: 'Recurring expense deleted successfully',
    })
  } catch (error) {
    console.error('Delete recurring expense error:', error)
    return NextResponse.json(
      { error: 'Failed to delete recurring expense' },
      { status: 500 }
    )
  }
}
