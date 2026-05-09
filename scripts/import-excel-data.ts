import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import * as XLSX from 'xlsx'
import * as path from 'path'

// Create Prisma client with accelerate for standalone script
const basePrisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
})
const prisma = basePrisma.$extends(withAccelerate())

const EXCEL_DATE_OFFSET = 25569 // Excel epoch is Dec 30, 1899

function excelDateToJS(excelDate: number): Date {
  // Excel dates are number of days since 1899-12-30
  const date = new Date((excelDate - EXCEL_DATE_OFFSET) * 86400 * 1000)
  return date
}

function parseExcelDate(value: any): Date {
  if (typeof value === 'number') {
    return excelDateToJS(value)
  }
  if (typeof value === 'string') {
    // Try to parse as ISO date string
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
  }
  return new Date()
}

async function main() {
  const userEmail = 'info@theprocesse.com'

  // Find user and company
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      company_members: {
        where: { is_active: true },
        include: { company: true }
      }
    }
  })

  if (!user) {
    console.error(`User not found: ${userEmail}`)
    process.exit(1)
  }

  if (user.company_members.length === 0) {
    console.error(`No active company membership for user: ${userEmail}`)
    process.exit(1)
  }

  const company = user.company_members[0].company
  console.log(`Importing data for company: ${company.name} (ID: ${company.id})`)
  console.log(`User: ${user.name} (ID: ${user.id})`)

  // Load Excel file
  const filePath = path.join(__dirname, '../docs/SARS_Tax_Tracking_2025-2026 (1).xlsx')
  const workbook = XLSX.readFile(filePath)

  // === Import Income ===
  console.log('\n--- Importing Income ---')
  const incomeSheet = workbook.Sheets['2. Income Register']
  const incomeData = XLSX.utils.sheet_to_json(incomeSheet, { header: 1 }) as any[][]

  // Find header row
  const incomeHeaderIdx = incomeData.findIndex(row => row && row[0]?.toString().toLowerCase() === 'date')

  // Get or create income categories
  const incomeCategoryMap = new Map<string, string>()
  let incomeImported = 0

  for (let i = incomeHeaderIdx + 1; i < incomeData.length; i++) {
    const row = incomeData[i]
    if (!row || !row[0] || !row[3]) continue // Skip empty rows

    const incomeType = row[4]?.toString() || 'Other Income'

    // Get or create category
    if (!incomeCategoryMap.has(incomeType)) {
      let category = await prisma.incomeCategory.findFirst({
        where: { company_id: company.id, name: incomeType }
      })
      if (!category) {
        category = await prisma.incomeCategory.create({
          data: {
            name: incomeType,
            company: { connect: { id: company.id } }
          }
        })
        console.log(`  Created income category: ${incomeType}`)
      }
      incomeCategoryMap.set(incomeType, category.id)
    }

    // Create income record
    await prisma.income.create({
      data: {
        income_date: parseExcelDate(row[0]),
        amount: parseFloat(row[3]) || 0,
        source_name: row[1]?.toString() || '',
        description: row[2]?.toString() || '',
        notes: row[5]?.toString() || null,
        currency: 'ZAR',
        company: { connect: { id: company.id } },
        user: { connect: { id: user.id } },
        category: { connect: { id: incomeCategoryMap.get(incomeType)! } }
      }
    })
    incomeImported++
  }

  console.log(`  Imported ${incomeImported} income records`)

  // === Import Expenses ===
  console.log('\n--- Importing Expenses ---')
  const expenseSheet = workbook.Sheets['3. Expense Register']
  const expenseData = XLSX.utils.sheet_to_json(expenseSheet, { header: 1 }) as any[][]

  const expenseHeaderIdx = expenseData.findIndex(row => row && row[0]?.toString().toLowerCase() === 'date')
  // Headers: Date, Description, Category, Subcategory, Amount, Charge, Deductible %, Deductible (R), Receipt

  // Get or create expense categories
  const expenseCategoryMap = new Map<string, string>()
  let expenseImported = 0

  for (let i = expenseHeaderIdx + 1; i < expenseData.length; i++) {
    const row = expenseData[i]
    if (!row || !row[0] || row[4] === undefined) continue

    const categoryName = row[2]?.toString() || 'Uncategorized'

    if (!expenseCategoryMap.has(categoryName)) {
      let category = await prisma.expenseCategory.findFirst({
        where: { company_id: company.id, name: categoryName }
      })
      if (!category) {
        category = await prisma.expenseCategory.create({
          data: {
            name: categoryName,
            company: { connect: { id: company.id } }
          }
        })
        console.log(`  Created expense category: ${categoryName}`)
      }
      expenseCategoryMap.set(categoryName, category.id)
    }

    // Parse deductible percentage
    let deductiblePercent = 100
    if (row[6] !== undefined) {
      const val = parseFloat(row[6])
      deductiblePercent = val <= 1 ? Math.round(val * 100) : Math.round(val)
    }

    // Parse receipt status
    let receiptStatus = 'no'
    const receiptVal = row[8]?.toString().toLowerCase() || ''
    if (receiptVal === 'y' || receiptVal === 'yes') receiptStatus = 'yes'
    else if (receiptVal.includes('affidavit')) receiptStatus = 'affidavit'
    else if (receiptVal.includes('bank')) receiptStatus = 'bank_statement'

    await prisma.expense.create({
      data: {
        expense_date: parseExcelDate(row[0]),
        amount: parseFloat(row[4]) || 0,
        charges: parseFloat(row[5]) || 0,
        description: row[1]?.toString() || '',
        vendor_name: null,
        payment_method: 'eft',
        is_tax_deductible: deductiblePercent > 0,
        deductible_percentage: deductiblePercent,
        receipt_status: receiptStatus,
        currency: 'ZAR',
        company: { connect: { id: company.id } },
        user: { connect: { id: user.id } },
        category: { connect: { id: expenseCategoryMap.get(categoryName)! } }
      }
    })
    expenseImported++
  }

  console.log(`  Imported ${expenseImported} expense records`)

  // === Import Assets ===
  console.log('\n--- Importing Assets ---')
  const assetSheet = workbook.Sheets['6. Asset Register']
  const assetData = XLSX.utils.sheet_to_json(assetSheet, { header: 1 }) as any[][]

  const assetHeaderIdx = assetData.findIndex(row => row && row[0] === '#')
  // Headers: #, Asset Description, Date Acquired, Cost, Useful Life, Annual W&T, % Business Use, Deductible W&T

  const assetTypeMap: Record<string, string> = {
    'iphone': 'phone',
    'phone': 'phone',
    'laptop': 'computer',
    'computer': 'computer',
    'camera': 'camera',
    'vehicle': 'vehicle',
    'audi': 'vehicle',
    'car': 'vehicle'
  }

  for (let i = assetHeaderIdx + 1; i < assetData.length; i++) {
    const row = assetData[i]
    if (!row || row[0] === undefined || !row[1]) continue

    const assetName = row[1].toString()
    const nameLower = assetName.toLowerCase()

    // Determine asset type
    let assetType = 'other'
    for (const [keyword, type] of Object.entries(assetTypeMap)) {
      if (nameLower.includes(keyword)) {
        assetType = type
        break
      }
    }

    const usefulLife = parseInt(row[4]) || 5
    const depreciationRate = 100 / usefulLife

    let businessUsePercent = 100
    if (row[6] !== undefined) {
      const val = parseFloat(row[6])
      businessUsePercent = val <= 1 ? Math.round(val * 100) : Math.round(val)
    }

    await prisma.asset.create({
      data: {
        name: assetName,
        asset_type: assetType,
        purchase_date: parseExcelDate(row[2]),
        purchase_cost: parseFloat(row[3]) || 0,
        useful_life_years: usefulLife,
        depreciation_rate: depreciationRate,
        business_use_percent: businessUsePercent,
        residual_value: 0,
        company: { connect: { id: company.id } }
      }
    })
    console.log(`  Created asset: ${assetName} (${assetType})`)
  }

  const assetCount = await prisma.asset.count({ where: { company_id: company.id } })
  console.log(`  Total assets: ${assetCount}`)

  // === Import Vehicle Logbook ===
  console.log('\n--- Importing Vehicle Logbook ---')
  const logSheet = workbook.Sheets['5. Vehicle Logbook']
  const logData = XLSX.utils.sheet_to_json(logSheet, { header: 1 }) as any[][]

  const logHeaderIdx = logData.findIndex(row => row && row[0]?.toString().toLowerCase() === 'date')
  // Headers: Date, From, To, Purpose, Start km, End km, Distance, Business/Private

  // Find the vehicle asset
  const vehicleAsset = await prisma.asset.findFirst({
    where: {
      company_id: company.id,
      asset_type: 'vehicle'
    }
  })

  if (vehicleAsset) {
    let logImported = 0
    for (let i = logHeaderIdx + 1; i < logData.length; i++) {
      const row = logData[i]
      if (!row || !row[0] || !row[1]) continue

      const isBusiness = row[7]?.toString().toLowerCase().includes('business') ?? true

      await prisma.vehicleLogEntry.create({
        data: {
          trip_date: parseExcelDate(row[0]),
          start_location: row[1]?.toString() || '',
          end_location: row[2]?.toString() || '',
          purpose: row[3]?.toString() || '',
          start_odometer: parseInt(row[4]) || 0,
          end_odometer: parseInt(row[5]) || 0,
          distance_km: parseInt(row[6]) || 0,
          is_business: isBusiness,
          company: { connect: { id: company.id } },
          asset: { connect: { id: vehicleAsset.id } }
        }
      })
      logImported++
    }

    console.log(`  Imported ${logImported} vehicle log entries`)
  } else {
    console.log('  No vehicle asset found, skipping logbook import')
  }

  console.log('\n=== Import Complete ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
