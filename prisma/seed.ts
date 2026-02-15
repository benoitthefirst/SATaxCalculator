import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

// Use accelerateUrl for Prisma Accelerate connection
const basePrisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
})
const prisma = basePrisma.$extends(withAccelerate())

async function main() {
  console.log('Seeding database...')

  // Seed expense categories
  const expenseCategories = [
    { name: 'Travel & Transportation', color: '#3b82f6', icon: 'car' },
    { name: 'Office Supplies', color: '#8b5cf6', icon: 'package' },
    { name: 'Utilities', color: '#ef4444', icon: 'zap' },
    { name: 'Rent & Lease', color: '#f59e0b', icon: 'home' },
    { name: 'Salaries & Wages', color: '#10b981', icon: 'users' },
    { name: 'Professional Services', color: '#6366f1', icon: 'briefcase' },
    { name: 'Equipment & Machinery', color: '#ec4899', icon: 'tool' },
    { name: 'Marketing & Advertising', color: '#14b8a6', icon: 'megaphone' },
    { name: 'Insurance', color: '#f97316', icon: 'shield' },
    { name: 'Meals & Entertainment', color: '#84cc16', icon: 'coffee' },
    { name: 'Software & Subscriptions', color: '#06b6d4', icon: 'monitor' },
    { name: 'Training & Development', color: '#a855f7', icon: 'book' },
    { name: 'Legal & Compliance', color: '#64748b', icon: 'scale' },
    { name: 'Bank Fees', color: '#dc2626', icon: 'credit-card' },
    { name: 'Repairs & Maintenance', color: '#ea580c', icon: 'wrench' },
    { name: 'Other', color: '#6b7280', icon: 'more-horizontal' },
  ]

  for (const category of expenseCategories) {
    await prisma.expenseCategory.upsert({
      where: {
        id: `system-${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
      },
      update: {},
      create: {
        id: `system-${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
        name: category.name,
        color: category.color,
        icon: category.icon,
        is_system: true,
        is_active: true,
      },
    })
  }

  console.log('✅ Expense categories seeded')

  // Seed income categories
  const incomeCategories = [
    { name: 'Product Sales', color: '#10b981', icon: 'shopping-cart' },
    { name: 'Service Revenue', color: '#3b82f6', icon: 'briefcase' },
    { name: 'Consulting Fees', color: '#8b5cf6', icon: 'users' },
    { name: 'Interest Income', color: '#f59e0b', icon: 'trending-up' },
    { name: 'Rental Income', color: '#ec4899', icon: 'home' },
    { name: 'Commissions', color: '#14b8a6', icon: 'percent' },
    { name: 'Other Income', color: '#6b7280', icon: 'more-horizontal' },
  ]

  for (const category of incomeCategories) {
    await prisma.incomeCategory.upsert({
      where: {
        id: `system-${category.name.toLowerCase().replace(/\s+/g, '-')}`,
      },
      update: {},
      create: {
        id: `system-${category.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: category.name,
        color: category.color,
        icon: category.icon,
        is_system: true,
        is_active: true,
      },
    })
  }

  console.log('✅ Income categories seeded')
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await basePrisma.$disconnect()
  })
