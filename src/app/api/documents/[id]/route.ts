import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getActiveCompanyForUser } from '@/lib/company-context'
import { FileService } from '@/lib/fileService'
import { PendingDocumentStatus } from '@prisma/client'

const fileService = new FileService()

// GET - Get single document details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    const document = await prisma.pendingDocument.findFirst({
      where: {
        id,
        company_id: companyId,
      },
      include: {
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
        analysis_log: true,
        expense: {
          select: {
            id: true,
            description: true,
            amount: true,
            expense_date: true,
          },
        },
        income: {
          select: {
            id: true,
            description: true,
            amount: true,
            income_date: true,
          },
        },
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document,
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

// PATCH - Approve or reject document
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { action, linkedExpenseId, linkedIncomeId, rejectionReason, notes, editedData } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Verify document belongs to company
    const document = await prisma.pendingDocument.findFirst({
      where: {
        id,
        company_id: companyId,
        status: PendingDocumentStatus.PENDING,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or already processed' },
        { status: 404 }
      )
    }

    if (action === 'approve') {
      // Get the data to use (edited data if provided, otherwise original)
      const dataToUse = editedData || document.extracted_data
      const extractedData = dataToUse as {
        transactions?: Array<{
          date: string
          description: string
          debit: number
          credit: number
          type: 'INCOME' | 'EXPENSE'
          category: string
        }>
        date?: string
        vendor?: string
        amount?: number
        description?: string
        category?: string
        items?: Array<{ description: string; amount: number }>
      }
      const transactions = extractedData?.transactions || []

      // Track created records
      const createdExpenses: string[] = []
      const createdIncomes: string[] = []

      // Get expense categories for lookups
      const expenseCategories = await prisma.expenseCategory.findMany({
        where: {
          OR: [
            { company_id: companyId },
            { is_system: true }
          ]
        }
      })

      // Helper to find or create expense category
      const findExpenseCategory = async (categoryName: string): Promise<string> => {
        const existing = expenseCategories.find(
          c => c.name.toLowerCase() === categoryName.toLowerCase()
        )
        if (existing) return existing.id

        // Create new category for this company
        const newCategory = await prisma.expenseCategory.create({
          data: {
            name: categoryName,
            company_id: companyId,
            is_system: false,
          }
        })
        expenseCategories.push(newCategory)
        return newCategory.id
      }

      // Handle INVOICE and RECEIPT documents - create expense record
      if ((document.document_type === 'INVOICE' || document.document_type === 'RECEIPT') && extractedData) {
        const expenseDate = extractedData.date ? new Date(extractedData.date) : new Date()
        const amount = typeof extractedData.amount === 'number'
          ? extractedData.amount
          : parseFloat(String(extractedData.amount)) || 0

        if (amount > 0) {
          const categoryId = await findExpenseCategory(extractedData.category || 'Other')

          const expense = await prisma.expense.create({
            data: {
              company_id: companyId,
              category_id: categoryId,
              user_id: session.user.id,
              amount: amount,
              expense_date: expenseDate,
              description: extractedData.description || extractedData.vendor || document.original_filename,
              vendor_name: extractedData.vendor || '',
              status: 'approved',
              approved_by_id: session.user.id,
              approved_at: new Date(),
              notes: `Imported from ${document.document_type.toLowerCase()}: ${document.original_filename}`,
              source_document_id: document.id,
            }
          })
          createdExpenses.push(expense.id)

          // Link the expense to this document
          await prisma.pendingDocument.update({
            where: { id },
            data: { linked_expense_id: expense.id }
          })
        }
      }

      // If this is a bank statement with transactions, create expense/income records
      if (document.document_type === 'BANK_STATEMENT' && transactions.length > 0) {
        // Get income categories for lookups
        const incomeCategories = await prisma.incomeCategory.findMany({
          where: {
            OR: [
              { company_id: companyId },
              { is_system: true }
            ]
          }
        })

        // Helper to find or create income category
        const findIncomeCategory = async (categoryName: string): Promise<string> => {
          const existing = incomeCategories.find(
            c => c.name.toLowerCase() === categoryName.toLowerCase()
          )
          if (existing) return existing.id

          // Create new category for this company
          const newCategory = await prisma.incomeCategory.create({
            data: {
              name: categoryName,
              company_id: companyId,
              is_system: false,
            }
          })
          incomeCategories.push(newCategory)
          return newCategory.id
        }

        // Process each transaction
        for (const tx of transactions) {
          const txDate = new Date(tx.date)

          if (tx.type === 'EXPENSE' && tx.debit > 0) {
            const categoryId = await findExpenseCategory(tx.category || 'Other')
            // Ensure amount is a proper number
            const amount = typeof tx.debit === 'number' ? tx.debit : parseFloat(String(tx.debit)) || 0

            const expense = await prisma.expense.create({
              data: {
                company_id: companyId,
                category_id: categoryId,
                user_id: session.user.id,
                amount: amount,
                expense_date: txDate,
                description: tx.description,
                vendor_name: tx.description.split(' - ')[0] || tx.description,
                status: 'approved',
                approved_by_id: session.user.id,
                approved_at: new Date(),
                notes: `Imported from bank statement: ${document.original_filename}`,
                source_document_id: document.id,
              }
            })
            createdExpenses.push(expense.id)
          } else if (tx.type === 'INCOME' && tx.credit > 0) {
            const categoryId = await findIncomeCategory(tx.category || 'Other Income')
            // Ensure amount is a proper number
            const amount = typeof tx.credit === 'number' ? tx.credit : parseFloat(String(tx.credit)) || 0

            const income = await prisma.income.create({
              data: {
                company_id: companyId,
                category_id: categoryId,
                user_id: session.user.id,
                amount: amount,
                income_date: txDate,
                description: tx.description,
                source_name: tx.description.split(' - ')[0] || tx.description,
                notes: `Imported from bank statement: ${document.original_filename}`,
                source_document_id: document.id,
              }
            })
            createdIncomes.push(income.id)
          }
        }
      }

      const updatedDocument = await prisma.pendingDocument.update({
        where: { id },
        data: {
          status: PendingDocumentStatus.APPROVED,
          approved_at: new Date(),
          approved_by: session.user.id,
          linked_expense_id: linkedExpenseId || null,
          linked_income_id: linkedIncomeId || null,
          notes: notes || null,
          // Save edited data if provided (user corrections to AI extraction)
          ...(editedData && { extracted_data: editedData }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Document approved',
        document: updatedDocument,
        imported: {
          expenses: createdExpenses.length,
          income: createdIncomes.length,
        }
      })
    } else {
      const updatedDocument = await prisma.pendingDocument.update({
        where: { id },
        data: {
          status: PendingDocumentStatus.REJECTED,
          approved_at: new Date(),
          approved_by: session.user.id,
          rejection_reason: rejectionReason || null,
          notes: notes || null,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Document rejected',
        document: updatedDocument,
      })
    }
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update document' },
      { status: 500 }
    )
  }
}

// DELETE - Delete pending document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Verify document belongs to company
    const document = await prisma.pendingDocument.findFirst({
      where: {
        id,
        company_id: companyId,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Delete file from storage
    if (document.file_url) {
      await fileService.deleteFile(document.file_url)
    }

    // Delete from database (cascade will delete analysis_log)
    await prisma.pendingDocument.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted',
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete document' },
      { status: 500 }
    )
  }
}

// POST - Create record from an already-approved document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Verify document belongs to company and is approved
    const document = await prisma.pendingDocument.findFirst({
      where: {
        id,
        company_id: companyId,
        status: PendingDocumentStatus.APPROVED,
      },
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found or not approved' },
        { status: 404 }
      )
    }

    // Check if record already exists
    if (document.linked_expense_id || document.linked_income_id) {
      return NextResponse.json(
        { error: 'Record already exists for this document' },
        { status: 400 }
      )
    }

    const extractedData = document.extracted_data as {
      date?: string
      vendor?: string
      amount?: number
      description?: string
      category?: string
    }

    // Only handle INVOICE and RECEIPT for now
    if (document.document_type !== 'INVOICE' && document.document_type !== 'RECEIPT') {
      return NextResponse.json(
        { error: 'Can only create records for invoice or receipt documents' },
        { status: 400 }
      )
    }

    // Get expense categories
    const expenseCategories = await prisma.expenseCategory.findMany({
      where: {
        OR: [
          { company_id: companyId },
          { is_system: true }
        ]
      }
    })

    // Find or create category
    let categoryId: string
    const categoryName = extractedData.category || 'Other'
    const existingCategory = expenseCategories.find(
      c => c.name.toLowerCase() === categoryName.toLowerCase()
    )

    if (existingCategory) {
      categoryId = existingCategory.id
    } else {
      const newCategory = await prisma.expenseCategory.create({
        data: {
          name: categoryName,
          company_id: companyId,
          is_system: false,
        }
      })
      categoryId = newCategory.id
    }

    // Create expense record
    const expenseDate = extractedData.date ? new Date(extractedData.date) : new Date()
    const amount = typeof extractedData.amount === 'number'
      ? extractedData.amount
      : parseFloat(String(extractedData.amount)) || 0

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount in document' },
        { status: 400 }
      )
    }

    const expense = await prisma.expense.create({
      data: {
        company_id: companyId,
        category_id: categoryId,
        user_id: session.user.id,
        amount: amount,
        expense_date: expenseDate,
        description: extractedData.description || extractedData.vendor || document.original_filename,
        vendor_name: extractedData.vendor || '',
        status: 'approved',
        approved_by_id: session.user.id,
        approved_at: new Date(),
        notes: `Imported from ${document.document_type.toLowerCase()}: ${document.original_filename}`,
        source_document_id: document.id,
      }
    })

    // Link the expense to this document
    await prisma.pendingDocument.update({
      where: { id },
      data: { linked_expense_id: expense.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Expense record created',
      expense: {
        id: expense.id,
        amount: Number(expense.amount),
        description: expense.description,
      }
    })
  } catch (error) {
    console.error('Error creating record from document:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create record' },
      { status: 500 }
    )
  }
}
