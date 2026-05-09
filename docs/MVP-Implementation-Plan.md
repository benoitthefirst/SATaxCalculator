# ProcessX MVP Implementation Plan for SARS Tax Filing

## Executive Summary

ProcessX is currently ~35% complete for SARS tax filing MVP. The system has solid expense tracking but lacks critical features for proper tax computation and SARS compliance.

**Current Status:**
- Expense tracking: Full CRUD with categories and receipts
- Income tracking: Database ready, NO UI/API
- Asset Register: NOT IMPLEMENTED
- Vehicle Logbook: NOT IMPLEMENTED
- Tax Computation: Public calculator only (not using actual data)

---

## Gap Analysis: SARS Tax Tracking Requirements

Based on analysis of the SARS Tax Tracking 2025-2026 spreadsheet, here's what the system needs:

| # | SARS Feature | Current Status | MVP Ready? |
|---|--------------|----------------|------------|
| 1 | Dashboard (Tax Year Summary) | Basic dashboard exists | Partial |
| 2 | Income Register | Database schema exists, NO UI/API | **NO** |
| 3 | Expense Register | Exists but missing key fields | Partial |
| 4 | Category Summary (Deduction Worksheet) | Basic analytics only | Partial |
| 5 | Vehicle Logbook | NOT IMPLEMENTED | **NO** |
| 6 | Asset Register (Depreciation) | NOT IMPLEMENTED | **NO** |
| 7 | Trips & Travel Register | NOT IMPLEMENTED | **NO** |
| 8 | Missing Receipts Log | NOT IMPLEMENTED | **NO** |
| 9 | Tax Computation (CIT Calculation) | Public calculator only | Partial |
| 10 | SARS Compliance Checklist | NOT IMPLEMENTED | **NO** |

---

## Priority Implementation Phases

### Phase 1: Income Register (HIGH PRIORITY)
**Estimated: 2-3 days**

Without income tracking, users cannot calculate taxable income. Database models exist - need UI/API only.

**Files to Create:**

1. **API Routes:**
   - `/src/app/api/income/route.ts` - GET (list), POST (create)
   - `/src/app/api/income/[id]/route.ts` - GET, PUT, DELETE
   - `/src/app/api/income-categories/route.ts` - GET, POST

2. **Pages:**
   - `/src/app/(dashboard)/income/page.tsx` - List view
   - `/src/app/(dashboard)/income/new/page.tsx` - Add income form
   - `/src/app/(dashboard)/income/[id]/page.tsx` - Detail/Edit view

3. **Components:**
   - `/src/components/forms/IncomeForm.tsx`
   - `/src/components/income/IncomeDetail.tsx`

4. **Navigation Update:**
   - `/src/components/layout/DashboardNav.tsx` - Add Income link

**Pattern:** Copy expense implementation patterns exactly.

---

### Phase 2: Enhanced Expense Fields (MEDIUM PRIORITY)
**Estimated: 1 day**

SARS requires more than a simple "deductible: yes/no". Need:
- Deductible percentage (0-100%)
- Charges/fees field
- Receipt status (Y/N/Affidavit/Bank statement only)

**Files to Modify:**

1. **Database Schema:**
   - `/prisma/schema.prisma` - Add fields to Expense model:
     ```prisma
     deductible_percentage  Int       @default(100)    // 0-100
     charges                Decimal   @db.Decimal(12, 2) @default(0)
     receipt_status         String?   // 'yes' | 'no' | 'affidavit' | 'bank_statement'
     ```

2. **API Routes:**
   - `/src/app/api/expenses/route.ts` - Update validation schema
   - `/src/app/api/expenses/[id]/route.ts` - Update validation schema

3. **Form Components:**
   - `/src/components/forms/ExpenseForm.tsx` - Add new fields

4. **Run migration:**
   ```bash
   npx prisma migrate dev --name add_expense_tax_fields
   ```

---

### Phase 3: Category Summary / Tax Deduction Report (HIGH PRIORITY)
**Estimated: 2 days**

Users need to see expenses aggregated by category with deductible amounts calculated.

**Files to Create:**

1. **API Route:**
   - `/src/app/api/expenses/deduction-summary/route.ts`

   Returns:
   ```typescript
   {
     categories: [{
       name: string
       grossAmount: number
       charges: number
       totalDeductible: number
       count: number
       taxTreatment: string
     }]
     totals: {
       grossExpenses: number
       totalCharges: number
       totalDeductible: number
     }
   }
   ```

2. **Page:**
   - `/src/app/(dashboard)/reports/deduction-summary/page.tsx`

   Features:
   - Table showing category, gross, charges, deductible amount
   - Date range selector (fiscal year)
   - CSV export button
   - Summary totals at bottom

3. **Update Reports Page:**
   - `/src/app/(dashboard)/reports/page.tsx` - Replace "Coming Soon" with links

---

### Phase 4: Tax Computation Dashboard (HIGH PRIORITY)
**Estimated: 2-3 days**

Calculate actual tax liability from user's recorded income and expenses.

**Files to Create:**

1. **API Route:**
   - `/src/app/api/tax-computation/route.ts`

   Calculation:
   ```typescript
   grossIncome = sum(income records)
   totalDeductible = sum(expense.amount * deductible_percentage)
   depreciation = sum(asset wear-and-tear) // Phase 5
   taxableIncome = grossIncome - totalDeductible - depreciation
   corporateTax = taxableIncome * 0.27 // or SBC rates
   ```

2. **Page:**
   - `/src/app/(dashboard)/reports/tax-computation/page.tsx`

   Display:
   - Income section (from Income Register)
   - Deductible expenses (from Category Summary)
   - Depreciation (Phase 5, show 0 for now)
   - Taxable income calculation
   - Tax at 27% CIT rate
   - SBC comparison if eligible

---

### Phase 5: Asset Register & Depreciation (CRITICAL for full MVP)
**Estimated: 3-4 days**

Users lose ~R75K in tax savings without depreciation claims.

**Files to Create:**

1. **Database Schema - Add to `/prisma/schema.prisma`:**
   ```prisma
   model Asset {
     id                    String    @id @default(cuid())
     company_id            String
     name                  String
     description           String?
     asset_type            String    // 'vehicle' | 'computer' | 'camera' | 'furniture' | 'other'
     purchase_date         DateTime
     purchase_cost         Decimal   @db.Decimal(12, 2)
     useful_life_years     Int
     depreciation_rate     Decimal   @db.Decimal(5, 2)  // Calculated from useful_life
     residual_value        Decimal   @db.Decimal(12, 2) @default(0)
     business_use_percent  Int       @default(100)      // 0-100
     disposal_date         DateTime?
     disposal_proceeds     Decimal?  @db.Decimal(12, 2)
     notes                 String?   @db.Text
     is_deleted            Boolean   @default(false)
     deleted_at            DateTime?
     created_at            DateTime  @default(now())
     updated_at            DateTime  @updatedAt

     company               Company   @relation(fields: [company_id], references: [id])

     @@index([company_id])
     @@index([asset_type])
     @@index([is_deleted])
     @@map("assets")
   }
   ```

2. **API Routes:**
   - `/src/app/api/assets/route.ts` - GET, POST
   - `/src/app/api/assets/[id]/route.ts` - GET, PUT, DELETE
   - `/src/app/api/assets/depreciation/route.ts` - Calculate annual depreciation

3. **Pages:**
   - `/src/app/(dashboard)/assets/page.tsx` - Asset list
   - `/src/app/(dashboard)/assets/new/page.tsx` - Add asset
   - `/src/app/(dashboard)/assets/[id]/page.tsx` - Asset detail

4. **Components:**
   - `/src/components/forms/AssetForm.tsx`
   - `/src/components/assets/AssetDetail.tsx`
   - `/src/components/assets/DepreciationSchedule.tsx`

**SARS Depreciation Rates (Interpretation Note 47):**
| Asset Type | Useful Life | Annual Rate |
|------------|-------------|-------------|
| Computers/Laptops | 3 years | 33.33% |
| Cell phones | 2-3 years | 33-50% |
| Cameras | 6 years | 16.67% |
| Motor vehicles | 5 years | 20% |
| Furniture | 6 years | 16.67% |

---

### Phase 6: Vehicle Logbook (CRITICAL for vehicle deductions)
**Estimated: 2-3 days**

Without logbook, SARS can disallow ALL vehicle expenses (~R154K at risk).

**Files to Create:**

1. **Database Schema - Add to `/prisma/schema.prisma`:**
   ```prisma
   model VehicleLogEntry {
     id                String    @id @default(cuid())
     company_id        String
     asset_id          String    // Links to Asset (vehicle)
     trip_date         DateTime
     start_location    String
     end_location      String
     start_odometer    Int
     end_odometer      Int
     distance_km       Int       // Calculated: end - start
     purpose           String
     client_name       String?
     is_business       Boolean   @default(true)
     notes             String?
     created_at        DateTime  @default(now())
     updated_at        DateTime  @updatedAt

     company           Company   @relation(fields: [company_id], references: [id])
     asset             Asset     @relation(fields: [asset_id], references: [id])

     @@index([company_id])
     @@index([asset_id])
     @@index([trip_date])
     @@map("vehicle_log_entries")
   }
   ```

2. **API Routes:**
   - `/src/app/api/vehicle-logbook/route.ts` - GET, POST
   - `/src/app/api/vehicle-logbook/[id]/route.ts` - GET, PUT, DELETE
   - `/src/app/api/vehicle-logbook/summary/route.ts` - Business use % calculation

3. **Pages:**
   - `/src/app/(dashboard)/vehicle-logbook/page.tsx` - Logbook entries
   - `/src/app/(dashboard)/vehicle-logbook/new/page.tsx` - Add trip
   - `/src/app/(dashboard)/vehicle-logbook/summary/page.tsx` - Usage summary

4. **Components:**
   - `/src/components/forms/VehicleLogForm.tsx`
   - `/src/components/vehicle/LogbookSummary.tsx`

---

### Phase 7: Missing Receipts & Compliance (LOWER PRIORITY)
**Estimated: 1-2 days**

Track missing documentation and SARS compliance checklist.

**Files to Create:**

1. **Page:**
   - `/src/app/(dashboard)/reports/missing-receipts/page.tsx`

   Query expenses where `receipt_status IN ('no', 'affidavit', 'bank_statement')`

2. **Page:**
   - `/src/app/(dashboard)/reports/compliance-checklist/page.tsx`

   Static checklist with deadlines:
   - Provisional tax dates (31 Aug, 28 Feb, 30 Sep)
   - ITR14 due date (12 months after year-end)
   - EMP501 dates (31 Oct, 31 May)
   - Document retention reminders (5 years)

---

## File Summary

### New Database Models (schema.prisma):
- Asset (with depreciation fields)
- VehicleLogEntry

### New Fields on Existing Models:
- Expense: `deductible_percentage`, `charges`, `receipt_status`

### New API Routes (12 total):
| Route | Methods |
|-------|---------|
| `/api/income/route.ts` | GET, POST |
| `/api/income/[id]/route.ts` | GET, PUT, DELETE |
| `/api/income-categories/route.ts` | GET, POST |
| `/api/expenses/deduction-summary/route.ts` | GET |
| `/api/tax-computation/route.ts` | GET |
| `/api/assets/route.ts` | GET, POST |
| `/api/assets/[id]/route.ts` | GET, PUT, DELETE |
| `/api/assets/depreciation/route.ts` | GET |
| `/api/vehicle-logbook/route.ts` | GET, POST |
| `/api/vehicle-logbook/[id]/route.ts` | GET, PUT, DELETE |
| `/api/vehicle-logbook/summary/route.ts` | GET |

### New Pages (14 total):
- `/income/` (page.tsx, new/page.tsx, [id]/page.tsx)
- `/reports/deduction-summary/page.tsx`
- `/reports/tax-computation/page.tsx`
- `/reports/missing-receipts/page.tsx`
- `/reports/compliance-checklist/page.tsx`
- `/assets/` (page.tsx, new/page.tsx, [id]/page.tsx)
- `/vehicle-logbook/` (page.tsx, new/page.tsx, summary/page.tsx)

### New Components (8 total):
- `IncomeForm.tsx`, `IncomeDetail.tsx`
- `AssetForm.tsx`, `AssetDetail.tsx`, `DepreciationSchedule.tsx`
- `VehicleLogForm.tsx`, `LogbookSummary.tsx`

### Modified Files:
- `/src/components/layout/DashboardNav.tsx` - Add navigation links
- `/src/components/forms/ExpenseForm.tsx` - Add new fields
- `/src/app/(dashboard)/reports/page.tsx` - Add report links
- `/prisma/schema.prisma` - Add models and fields

---

## Verification Plan

### After Each Phase:
1. Run `npx prisma migrate dev` for schema changes
2. Run `npm run build` to verify no TypeScript errors
3. Test CRUD operations for each new feature
4. Verify authorization (company isolation)

### End-to-End Testing:
1. Create test company with:
   - 5+ income records
   - 10+ expenses across categories
   - 2+ assets with depreciation
   - 10+ vehicle logbook entries
2. Generate Tax Computation report
3. Verify calculations match Excel spreadsheet
4. Export CSV and verify data

---

## MVP Definition

### Minimum Viable for Tax Filing (Phases 1-4):
- Phase 1: Income Register
- Phase 2: Enhanced Expense Fields
- Phase 3: Category Summary Report
- Phase 4: Tax Computation Dashboard

**Estimated: ~8-10 days**

### Enhanced MVP - Full SARS Compliance (Phases 1-6):
- All above PLUS:
- Phase 5: Asset Register & Depreciation
- Phase 6: Vehicle Logbook

**Estimated: ~15-18 days**

### Nice to Have (Phase 7):
- Missing Receipts Log
- SARS Compliance Checklist

---

## Implementation Order Recommendation

| Order | Phase | Feature | Days | Cumulative |
|-------|-------|---------|------|------------|
| 1 | Phase 1 | Income Register | 2-3 | 2-3 |
| 2 | Phase 2 | Expense Field Enhancement | 1 | 3-4 |
| 3 | Phase 3 | Category Summary | 2 | 5-6 |
| 4 | Phase 4 | Tax Computation | 2-3 | 7-9 |
| 5 | Phase 5 | Asset Register | 3-4 | 10-13 |
| 6 | Phase 6 | Vehicle Logbook | 2-3 | 12-16 |
| 7 | Phase 7 | Missing Receipts/Checklist | 1-2 | 13-18 |

---

## Risk Summary

| Risk | Impact | Mitigation |
|------|--------|------------|
| No Income Tracking | Cannot calculate profit/tax | Phase 1 (Priority) |
| No Asset Register | ~R75K tax savings lost | Phase 5 |
| No Vehicle Logbook | ~R154K expenses disallowed | Phase 6 |
| No Business Use % | Mixed-use assets overclaimed | Phase 5-6 |
| No Tax Computation | Users can't see liability | Phase 4 |

---

## Next Steps

1. Decide on MVP scope (Minimum vs Full SARS Compliance)
2. Begin Phase 1: Income Register implementation
3. Review progress after each phase
4. Test with real SARS Tax Tracking data
