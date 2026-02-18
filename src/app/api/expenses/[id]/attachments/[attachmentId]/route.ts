import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { FileService } from '@/lib/fileService'

const fileService = new FileService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: expenseId, attachmentId } = await params

    // Get attachment
    const attachment = await prisma.expenseAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        expense: true,
      },
    })

    if (!attachment || attachment.expense_id !== expenseId) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: attachment.expense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this attachment' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      attachment: {
        id: attachment.id,
        file_name: attachment.file_name,
        file_type: attachment.file_type,
        file_size: attachment.file_size,
        file_url: attachment.file_url,
        created_at: attachment.created_at,
      },
    })
  } catch (error) {
    console.error('Fetch attachment error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attachment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: expenseId, attachmentId } = await params

    // Get attachment
    const attachment = await prisma.expenseAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        expense: true,
      },
    })

    if (!attachment || attachment.expense_id !== expenseId) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this expense's company
    const membership = await prisma.companyMember.findFirst({
      where: {
        user_id: session.user.id,
        company_id: attachment.expense.company_id,
        is_active: true,
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'You do not have access to this attachment' },
        { status: 403 }
      )
    }

    // Delete file from MinIO
    const deleteResult = await fileService.deleteFile(attachment.file_url)

    if (!deleteResult.isSuccess) {
      console.error('Failed to delete file from storage:', deleteResult.error)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete attachment record from database
    await prisma.expenseAttachment.delete({
      where: { id: attachmentId },
    })

    return NextResponse.json({
      message: 'Attachment deleted successfully',
    })
  } catch (error) {
    console.error('Delete attachment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete attachment' },
      { status: 500 }
    )
  }
}
