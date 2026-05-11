import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { config } from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'
import { addMonths, subMonths, subDays, addDays } from 'date-fns'

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') })

const basePrisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
})
const prisma = basePrisma.$extends(withAccelerate())

async function main() {
  console.log('Creating demo account...')

  // Hash password
  const hashedPassword = await bcrypt.hash('demo123', 10)

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@processx.co.za' },
    update: {},
    create: {
      email: 'demo@processx.co.za',
      password_hash: hashedPassword,
      first_name: 'Demo',
      last_name: 'User',
      role: 'USER',
      is_active: true,
      email_verified: true,
    },
  })
  console.log('✅ Demo user created:', demoUser.email)

  // Create demo company
  const demoCompany = await prisma.company.upsert({
    where: { id: 'demo-company' },
    update: {},
    create: {
      id: 'demo-company',
      name: 'Demo Business (Pty) Ltd',
      registration_number: '2024/123456/07',
      tax_number: '9876543210',
      vat_number: '4567890123',
      email: 'info@demobusiness.co.za',
      phone: '+27 11 123 4567',
      address_line1: '123 Main Street',
      city: 'Sandton',
      province: 'Gauteng',
      postal_code: '2196',
      fiscal_year_end: 'February',
      created_by_id: demoUser.id,
    },
  })
  console.log('✅ Demo company created:', demoCompany.name)

  // Link user to company
  await prisma.companyMember.upsert({
    where: {
      company_id_user_id: {
        company_id: demoCompany.id,
        user_id: demoUser.id,
      },
    },
    update: {},
    create: {
      company_id: demoCompany.id,
      user_id: demoUser.id,
      role: 'owner',
      is_active: true,
    },
  })
  console.log('✅ User linked to company')

  // Get Business plan
  const businessPlan = await prisma.subscriptionPlan.findFirst({
    where: { tier: 'BUSINESS' },
  })

  if (businessPlan) {
    // Create subscription
    const now = new Date()
    const periodEnd = addMonths(now, 1)

    await prisma.subscription.upsert({
      where: { company_id: demoCompany.id },
      update: {
        plan_id: businessPlan.id,
        status: 'ACTIVE',
        current_period_end: periodEnd,
      },
      create: {
        company_id: demoCompany.id,
        plan_id: businessPlan.id,
        status: 'ACTIVE',
        billing_cycle: 'MONTHLY',
        amount: Number(businessPlan.price_monthly),
        current_period_start: now,
        current_period_end: periodEnd,
        payfast_token: 'demo-token-12345',
      },
    })
    console.log('✅ Business subscription created')
  }

  // Get categories
  const incomeCategories = await prisma.incomeCategory.findMany({
    where: { is_system: true },
  })
  const expenseCategories = await prisma.expenseCategory.findMany({
    where: { is_system: true },
  })

  // Create income records
  const incomeData = [
    { description: 'Website Development Project - ABC Corp', amount: 45000, category: 'Service Revenue', date: subDays(new Date(), 5) },
    { description: 'Monthly Retainer - XYZ Holdings', amount: 25000, category: 'Service Revenue', date: subDays(new Date(), 12) },
    { description: 'Software License Sale', amount: 15000, category: 'Product Sales', date: subDays(new Date(), 18) },
    { description: 'Consulting - Digital Strategy', amount: 18500, category: 'Consulting Fees', date: subDays(new Date(), 25) },
    { description: 'E-commerce Platform Build', amount: 85000, category: 'Service Revenue', date: subMonths(new Date(), 1) },
    { description: 'Mobile App Development', amount: 120000, category: 'Service Revenue', date: subMonths(new Date(), 1) },
    { description: 'SEO Optimization Package', amount: 12000, category: 'Service Revenue', date: subMonths(new Date(), 1) },
    { description: 'Training Workshop - 20 attendees', amount: 35000, category: 'Service Revenue', date: subMonths(new Date(), 2) },
    { description: 'API Integration Project', amount: 28000, category: 'Service Revenue', date: subMonths(new Date(), 2) },
    { description: 'Software Maintenance Contract', amount: 8500, category: 'Service Revenue', date: subMonths(new Date(), 2) },
    { description: 'Commission - Partner Referral', amount: 7500, category: 'Commissions', date: subMonths(new Date(), 3) },
    { description: 'Cloud Hosting Resale', amount: 4200, category: 'Product Sales', date: subMonths(new Date(), 3) },
  ]

  for (const income of incomeData) {
    const category = incomeCategories.find(c => c.name === income.category)
    if (!category) continue
    await prisma.income.create({
      data: {
        company: { connect: { id: demoCompany.id } },
        user: { connect: { id: demoUser.id } },
        category: { connect: { id: category.id } },
        description: income.description,
        amount: income.amount,
        vat_amount: income.amount * 0.15,
        income_date: income.date,
        is_vat_inclusive: true,
        payment_method: 'BANK_TRANSFER',
      },
    })
  }
  console.log('✅ Income records created:', incomeData.length)

  // Create expense records
  const expenseData = [
    { description: 'Office Rent - January', amount: 15000, category: 'Rent & Lease', date: subDays(new Date(), 3), deductible: 100 },
    { description: 'AWS Cloud Services', amount: 4500, category: 'Software & Subscriptions', date: subDays(new Date(), 7), deductible: 100 },
    { description: 'Adobe Creative Cloud', amount: 1200, category: 'Software & Subscriptions', date: subDays(new Date(), 10), deductible: 100 },
    { description: 'Fibre Internet - Vumatel', amount: 1500, category: 'Utilities', date: subDays(new Date(), 14), deductible: 100 },
    { description: 'Electricity - City Power', amount: 2800, category: 'Utilities', date: subDays(new Date(), 14), deductible: 100 },
    { description: 'Team Lunch - Client Meeting', amount: 1850, category: 'Meals & Entertainment', date: subDays(new Date(), 20), deductible: 50 },
    { description: 'Laptop - MacBook Pro M3', amount: 52000, category: 'Equipment & Machinery', date: subDays(new Date(), 30), deductible: 100 },
    { description: 'Office Supplies - Makro', amount: 3200, category: 'Office Supplies', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Business Insurance Premium', amount: 4500, category: 'Insurance', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Accountant Fees - Monthly', amount: 3500, category: 'Professional Services', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Fuel - Business Travel', amount: 2100, category: 'Travel & Transportation', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Google Workspace', amount: 450, category: 'Software & Subscriptions', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Slack Subscription', amount: 380, category: 'Software & Subscriptions', date: subMonths(new Date(), 1), deductible: 100 },
    { description: 'Staff Training Course', amount: 8500, category: 'Training & Development', date: subMonths(new Date(), 2), deductible: 100 },
    { description: 'Legal Consultation', amount: 12000, category: 'Legal & Compliance', date: subMonths(new Date(), 2), deductible: 100 },
    { description: 'Bank Service Fees', amount: 450, category: 'Bank Fees', date: subMonths(new Date(), 2), deductible: 100 },
    { description: 'Office Printer Repair', amount: 1800, category: 'Repairs & Maintenance', date: subMonths(new Date(), 3), deductible: 100 },
    { description: 'Facebook Ads Campaign', amount: 5500, category: 'Marketing & Advertising', date: subMonths(new Date(), 3), deductible: 100 },
    { description: 'Google Ads - Q4', amount: 8200, category: 'Marketing & Advertising', date: subMonths(new Date(), 3), deductible: 100 },
  ]

  for (const expense of expenseData) {
    const category = expenseCategories.find(c => c.name === expense.category)
    if (!category) continue
    await prisma.expense.create({
      data: {
        company: { connect: { id: demoCompany.id } },
        user: { connect: { id: demoUser.id } },
        category: { connect: { id: category.id } },
        description: expense.description,
        amount: expense.amount,
        vat_amount: expense.amount * 0.15,
        expense_date: expense.date,
        is_vat_inclusive: true,
        payment_method: 'BANK_TRANSFER',
        deductible_percentage: expense.deductible,
      },
    })
  }
  console.log('✅ Expense records created:', expenseData.length)

  // Create assets
  const assetsData = [
    {
      name: 'MacBook Pro 16" M3 Max',
      description: 'Development workstation',
      category: 'Computer Equipment',
      purchase_date: subMonths(new Date(), 6),
      purchase_price: 85000,
      useful_life_years: 3,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
    {
      name: 'Dell UltraSharp 32" Monitor',
      description: '4K Monitor for design work',
      category: 'Computer Equipment',
      purchase_date: subMonths(new Date(), 6),
      purchase_price: 15000,
      useful_life_years: 5,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
    {
      name: 'Toyota Fortuner 2.8 GD-6',
      description: 'Company vehicle for client visits',
      category: 'Motor Vehicles',
      purchase_date: subMonths(new Date(), 12),
      purchase_price: 750000,
      useful_life_years: 5,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
    {
      name: 'Office Furniture Set',
      description: 'Desks, chairs, and meeting table',
      category: 'Furniture & Fixtures',
      purchase_date: subMonths(new Date(), 18),
      purchase_price: 45000,
      useful_life_years: 10,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
    {
      name: 'Canon EOS R5 Camera Kit',
      description: 'For product photography and video',
      category: 'Photography Equipment',
      purchase_date: subMonths(new Date(), 8),
      purchase_price: 95000,
      useful_life_years: 5,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
    {
      name: 'Server Equipment',
      description: 'Dell PowerEdge for local development',
      category: 'Computer Equipment',
      purchase_date: subMonths(new Date(), 24),
      purchase_price: 120000,
      useful_life_years: 4,
      depreciation_method: 'STRAIGHT_LINE' as const,
    },
  ]

  for (const asset of assetsData) {
    // Calculate depreciation rate based on useful life
    const depreciationRate = 100 / asset.useful_life_years
    await prisma.asset.create({
      data: {
        company: { connect: { id: demoCompany.id } },
        name: asset.name,
        description: asset.description,
        asset_type: asset.category,
        purchase_date: asset.purchase_date,
        purchase_cost: asset.purchase_price,
        useful_life_years: asset.useful_life_years,
        depreciation_rate: depreciationRate,
      },
    })
  }
  console.log('✅ Assets created:', assetsData.length)

  // Create vehicle logbook entries
  const vehicle = await prisma.asset.findFirst({
    where: {
      company_id: demoCompany.id,
      asset_type: 'Motor Vehicles',
    },
  })

  if (vehicle) {
    const logbookEntries = [
      { date: subDays(new Date(), 2), start_km: 45230, end_km: 45280, purpose: 'Client meeting - Sandton', is_business: true },
      { date: subDays(new Date(), 5), start_km: 45180, end_km: 45230, purpose: 'Office to home', is_business: false },
      { date: subDays(new Date(), 7), start_km: 45120, end_km: 45180, purpose: 'Site visit - Midrand project', is_business: true },
      { date: subDays(new Date(), 10), start_km: 45050, end_km: 45120, purpose: 'Supplier meeting - Centurion', is_business: true },
      { date: subDays(new Date(), 12), start_km: 45000, end_km: 45050, purpose: 'Personal errands', is_business: false },
      { date: subDays(new Date(), 15), start_km: 44900, end_km: 45000, purpose: 'Conference attendance - JHB CBD', is_business: true },
      { date: subDays(new Date(), 18), start_km: 44850, end_km: 44900, purpose: 'Team building event', is_business: true },
      { date: subDays(new Date(), 22), start_km: 44780, end_km: 44850, purpose: 'Client presentation - Rosebank', is_business: true },
      { date: subDays(new Date(), 25), start_km: 44700, end_km: 44780, purpose: 'Equipment pickup - Randburg', is_business: true },
      { date: subDays(new Date(), 28), start_km: 44650, end_km: 44700, purpose: 'Bank visit', is_business: true },
    ]

    for (const entry of logbookEntries) {
      await prisma.vehicleLogEntry.create({
        data: {
          company: { connect: { id: demoCompany.id } },
          asset: { connect: { id: vehicle.id } },
          trip_date: entry.date,
          start_odometer: entry.start_km,
          end_odometer: entry.end_km,
          distance_km: entry.end_km - entry.start_km,
          start_location: 'Office',
          end_location: entry.purpose.split(' - ')[1] || 'Various',
          purpose: entry.purpose,
          is_business: entry.is_business,
        },
      })
    }
    console.log('✅ Vehicle logbook entries created:', logbookEntries.length)
  }

  console.log('')
  console.log('========================================')
  console.log('Demo account created successfully!')
  console.log('========================================')
  console.log('')
  console.log('Login credentials:')
  console.log('  Email: demo@processx.co.za')
  console.log('  Password: demo123')
  console.log('')
  console.log('Company: Demo Business (Pty) Ltd')
  console.log('Subscription: Business (Active)')
  console.log('')
}

main()
  .catch((e) => {
    console.error('Error creating demo account:', e)
    process.exit(1)
  })
  .finally(async () => {
    await basePrisma.$disconnect()
  })
