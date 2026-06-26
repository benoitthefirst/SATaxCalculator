import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveCompanyForUser } from '@/lib/company-context'
import { PendingDocumentStatus, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companyId = await getActiveCompanyForUser(session.user.id)

    if (!companyId) {
      return NextResponse.json(
        { error: 'No active company found' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as PendingDocumentStatus | null
    const search = searchParams.get('search')?.trim()
    const fileType = searchParams.get('fileType')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const sortField = searchParams.get('sortField') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.PendingDocumentWhereInput = {
      company_id: companyId,
      ...(status && { status }),
      ...(fileType && { document_type: fileType }),
    }

    // Add date range filter
    if (dateFrom || dateTo) {
      where.created_at = {}
      if (dateFrom) {
        where.created_at.gte = new Date(dateFrom)
      }
      if (dateTo) {
        // Add 1 day to include the end date fully
        const endDate = new Date(dateTo)
        endDate.setDate(endDate.getDate() + 1)
        where.created_at.lte = endDate
      }
    }

    // Add search filter
    if (search) {
      where.OR = [
        { original_filename: { contains: search, mode: 'insensitive' } },
        { uploader: { first_name: { contains: search, mode: 'insensitive' } } },
        { uploader: { last_name: { contains: search, mode: 'insensitive' } } },
        { uploader: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Build orderBy clause
    type SortableField = 'created_at' | 'approved_at' | 'original_filename' | 'status'
    const validSortFields: SortableField[] = ['created_at', 'approved_at', 'original_filename', 'status']
    const orderByField = validSortFields.includes(sortField as SortableField)
      ? sortField as SortableField
      : 'created_at'
    const orderByDirection = sortOrder === 'asc' ? 'asc' : 'desc'

    const orderBy: Prisma.PendingDocumentOrderByWithRelationInput = {
      [orderByField]: orderByDirection,
    }

    const [documents, total] = await Promise.all([
      prisma.pendingDocument.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          document_type: true,
          confidence: true,
          extracted_data: true,
          original_filename: true,
          file_url: true,
          file_size: true,
          status: true,
          created_at: true,
          approved_at: true,
          rejection_reason: true,
          notes: true,
          linked_expense_id: true,
          linked_income_id: true,
          uploader: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
          approver: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
            },
          },
        },
      }),
      prisma.pendingDocument.count({ where }),
    ])

    // Get stats
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      prisma.pendingDocument.count({
        where: { company_id: companyId, status: PendingDocumentStatus.PENDING },
      }),
      prisma.pendingDocument.count({
        where: { company_id: companyId, status: PendingDocumentStatus.APPROVED },
      }),
      prisma.pendingDocument.count({
        where: { company_id: companyId, status: PendingDocumentStatus.REJECTED },
      }),
    ])

    const statsMap = {
      total,
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
    }

    return NextResponse.json({
      success: true,
      documents,
      stats: statsMap,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching pending documents:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
