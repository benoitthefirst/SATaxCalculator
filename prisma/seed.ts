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

  // Seed subscription plans
  const subscriptionPlans = [
    {
      id: 'plan-starter',
      name: 'Starter',
      tier: 'STARTER' as const,
      description: 'Perfect for freelancers and solo entrepreneurs just getting started.',
      price_monthly: 0,
      price_yearly: 0,
      features: [
        'Up to 50 transactions/month',
        'Basic expense tracking',
        'Income management',
        'Tax calculator access',
        'Single user',
        'Email support',
      ],
      limits: {
        transactions_per_month: 50,
        team_members: 1,
        companies: 1,
        documents_per_month: 0, // No document analyzer access
        vehicle_logbook: false,
        asset_management: false,
        advanced_reports: false,
        csv_exports: false,
        multi_company: false,
        document_analyzer: false,
        api_access: false,
        priority_support: false,
      },
      display_order: 1,
    },
    {
      id: 'plan-professional',
      name: 'Professional',
      tier: 'PROFESSIONAL' as const,
      description: 'For growing businesses that need more power and flexibility.',
      price_monthly: 299,
      price_yearly: 2990,
      features: [
        'Unlimited transactions',
        'Advanced expense tracking',
        'Income & invoicing',
        'Vehicle logbook',
        'Asset management',
        'AI Document Analyzer (100 docs/month)',
        'Financial reports & analytics',
        'CSV exports',
        'Up to 5 team members',
        'Priority email support',
      ],
      limits: {
        transactions_per_month: -1, // unlimited
        team_members: 5,
        companies: -1, // unlimited - user-level subscription
        documents_per_month: 100, // 100 documents per month
        vehicle_logbook: true,
        asset_management: true,
        advanced_reports: true,
        csv_exports: true,
        multi_company: true,
        document_analyzer: true,
        api_access: false,
        priority_support: true,
      },
      display_order: 2,
    },
    {
      id: 'plan-business',
      name: 'Business',
      tier: 'BUSINESS' as const,
      description: 'For established businesses with advanced needs.',
      price_monthly: 599,
      price_yearly: 5990,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Multi-company management',
        'Unlimited AI Document Analyzer',
        'Advanced reporting',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Phone support',
      ],
      limits: {
        transactions_per_month: -1, // unlimited
        team_members: -1, // unlimited
        companies: -1, // unlimited
        documents_per_month: -1, // unlimited
        vehicle_logbook: true,
        asset_management: true,
        advanced_reports: true,
        csv_exports: true,
        multi_company: true,
        document_analyzer: true,
        api_access: true,
        priority_support: true,
      },
      display_order: 3,
    },
  ]

  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        description: plan.description,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        features: plan.features,
        limits: plan.limits,
        display_order: plan.display_order,
      },
      create: {
        id: plan.id,
        name: plan.name,
        tier: plan.tier,
        description: plan.description,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        features: plan.features,
        limits: plan.limits,
        display_order: plan.display_order,
        is_active: true,
      },
    })
  }

  console.log('✅ Subscription plans seeded')

  // Seed default system settings for subscriptions
  const defaultSettings = [
    {
      key: 'billing.subscriptions_enabled',
      value: false, // Start disabled so admin can test
      category: 'billing',
    },
    {
      key: 'billing.sandbox_mode',
      value: true,
      category: 'billing',
    },
    {
      key: 'billing.grace_period_days',
      value: 3,
      category: 'billing',
    },
  ]

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        category: setting.category,
      },
    })
  }

  console.log('✅ System settings seeded')
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
