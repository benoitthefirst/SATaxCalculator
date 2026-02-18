import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { FileService } from '@/lib/fileService'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
const fileService = new FileService()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: expenseId } = await params

    // Verify expense exists and user has access
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        company: true,
      },
    })

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: expense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this expense' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and PDF files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileName = fileService.generateFileName(file.name, `expense_${expenseId}`)

    // Upload to MinIO
    const uploadResult = await fileService.uploadFile(
      buffer,
      fileName,
      file.type,
      {
        originalName: file.name,
        expenseId,
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
      }
    )

    if (!uploadResult.isSuccess) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    // Create attachment record
    const attachment = await prisma.expenseAttachment.create({
      data: {
        expense_id: expenseId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: uploadResult.url!,
        uploaded_by: session.user.id,
      },
    })

    return NextResponse.json({
      message: 'File uploaded successfully',
      attachment: {
        id: attachment.id,
        file_name: attachment.file_name,
        file_type: attachment.file_type,
        file_size: attachment.file_size,
        created_at: attachment.created_at,
      },
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: expenseId } = await params

    // Verify expense exists and user has access
    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    })

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: expense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this expense' },
        { status: 403 }
      )
    }

    const attachments = await prisma.expenseAttachment.findMany({
      where: {
        expense_id: expenseId,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        file_name: true,
        file_type: true,
        file_size: true,
        created_at: true,
      },
    })

    return NextResponse.json({ attachments })
  } catch (error) {
    console.error('Fetch attachments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attachments' },
      { status: 500 }
    )
  }
}
