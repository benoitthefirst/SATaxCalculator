import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// to generate expenses from recurring templates
export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized (add your own auth mechanism)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find all active recurring expenses that need to be generated
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        is_active: true,
        next_occurrence: {
          lte: today,
        },
      },
      include: {
        category: true,
      },
    })

    const generated = []
    const errors = []

    for (const recurring of recurringExpenses) {
      try {
        // Check if end_date has passed
        if (recurring.end_date && recurring.end_date < today) {
          // Deactivate the recurring expense
          await prisma.recurringExpense.update({
            where: { id: recurring.id },
            data: { is_active: false },
          })
          continue
        }

        // Create the expense
        const expense = await prisma.expense.create({
          data: {
            company_id: recurring.company_id,
            category_id: recurring.category_id,
            user_id: recurring.created_by_id,
            amount: recurring.amount,
            currency: recurring.currency,
            expense_date: recurring.next_occurrence,
            vendor_name: recurring.vendor_name,
            description: recurring.description,
            payment_method: recurring.payment_method,
            is_tax_deductible: recurring.is_tax_deductible,
            recurring_expense_id: recurring.id,
            notes: recurring.notes,
            status: 'pending',
          },
        })

        // Calculate next occurrence based on frequency
        let nextOccurrence = new Date(recurring.next_occurrence)

        switch (recurring.frequency) {
          case 'monthly':
            nextOccurrence.setMonth(nextOccurrence.getMonth() + 1)
            break
          case 'quarterly':
            nextOccurrence.setMonth(nextOccurrence.getMonth() + 3)
            break
          case 'annually':
            nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1)
            break
        }

        // Update recurring expense with next occurrence
        await prisma.recurringExpense.update({
          where: { id: recurring.id },
          data: {
            next_occurrence: nextOccurrence,
            last_generated_at: new Date(),
          },
        })

        generated.push({
          recurring_id: recurring.id,
          expense_id: expense.id,
          description: recurring.description,
          amount: Number(recurring.amount),
          next_occurrence: nextOccurrence,
        })
      } catch (error) {
        console.error(
          `Failed to generate expense for recurring ${recurring.id}:`,
          error
        )
        errors.push({
          recurring_id: recurring.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      generated: generated.length,
      errors: errors.length,
      details: {
        generated,
        errors,
      },
    })
  } catch (error) {
    console.error('Generate recurring expenses error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate recurring expenses',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
