import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const basePrisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
})
const prisma = basePrisma.$extends(withAccelerate())

async function main() {
  const userEmail = 'info@theprocesse.com'

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      company_members: {
        where: { is_active: true },
        include: { company: true }
      }
    }
  })

  if (!user || user.company_members.length === 0) {
    console.error('User or company not found')
    process.exit(1)
  }

  const company = user.company_members[0].company
  console.log(`Removing duplicates for company: ${company.name}`)

  // Find duplicate income records (same date, amount, description)
  const incomeRecords = await prisma.income.findMany({
    where: { company_id: company.id, is_deleted: false },
    orderBy: { created_at: 'asc' }
  })

  const seenIncome = new Map<string, string>()
  const duplicateIncomeIds: string[] = []

  for (const record of incomeRecords) {
    const key = `${record.income_date.toISOString()}-${record.amount}-${record.description}`
    if (seenIncome.has(key)) {
      duplicateIncomeIds.push(record.id)
    } else {
      seenIncome.set(key, record.id)
    }
  }

  console.log(`Found ${duplicateIncomeIds.length} duplicate income records`)

  if (duplicateIncomeIds.length > 0) {
    await prisma.income.deleteMany({
      where: { id: { in: duplicateIncomeIds } }
    })
    console.log(`Deleted ${duplicateIncomeIds.length} duplicate income records`)
  }

  // Find duplicate expense records
  const expenseRecords = await prisma.expense.findMany({
    where: { company_id: company.id, is_deleted: false },
    orderBy: { created_at: 'asc' }
  })

  const seenExpense = new Map<string, string>()
  const duplicateExpenseIds: string[] = []

  for (const record of expenseRecords) {
    const key = `${record.expense_date.toISOString()}-${record.amount}-${record.description}`
    if (seenExpense.has(key)) {
      duplicateExpenseIds.push(record.id)
    } else {
      seenExpense.set(key, record.id)
    }
  }

  console.log(`Found ${duplicateExpenseIds.length} duplicate expense records`)

  if (duplicateExpenseIds.length > 0) {
    await prisma.expense.deleteMany({
      where: { id: { in: duplicateExpenseIds } }
    })
    console.log(`Deleted ${duplicateExpenseIds.length} duplicate expense records`)
  }

  // Verify counts
  const incomeCount = await prisma.income.count({ where: { company_id: company.id, is_deleted: false } })
  const expenseCount = await prisma.expense.count({ where: { company_id: company.id, is_deleted: false } })

  console.log(`\nFinal counts:`)
  console.log(`  Income records: ${incomeCount}`)
  console.log(`  Expense records: ${expenseCount}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
