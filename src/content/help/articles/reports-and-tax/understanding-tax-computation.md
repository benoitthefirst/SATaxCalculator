# Understanding Tax Computation

Learn how ProcessX calculates your estimated tax liability.

## Overview

ProcessX calculates an estimated income tax based on:
- Your recorded income
- Your recorded deductible expenses
- Current SARS tax tables and rates

This helps you plan for tax payments and avoid surprises.

## How Tax is Calculated

### Step 1: Calculate Gross Income

Total of all income recorded in ProcessX for the tax year.

### Step 2: Calculate Deductions

Total of all deductible expenses, including:
- Business expenses
- Home office deductions
- Travel allowance deductions
- Other allowable deductions

### Step 3: Calculate Taxable Income

```
Taxable Income = Gross Income - Deductions
```

### Step 4: Apply Tax Tables

SARS progressive tax rates are applied based on your taxable income bracket.

### Step 5: Apply Rebates

Tax rebates reduce your tax payable:
- Primary rebate (all taxpayers)
- Secondary rebate (65+)
- Tertiary rebate (75+)

## South African Tax Tables (2024/2025)

| Taxable Income | Tax Rate |
|----------------|----------|
| R0 - R237,100 | 18% |
| R237,101 - R370,500 | 26% |
| R370,501 - R512,800 | 31% |
| R512,801 - R673,000 | 36% |
| R673,001 - R857,900 | 39% |
| R857,901 - R1,817,000 | 41% |
| Above R1,817,000 | 45% |

*Rates are progressive: you pay each rate only on income in that bracket.*

## Tax Rebates (2024/2025)

| Rebate Type | Amount |
|-------------|--------|
| Primary (all taxpayers) | R17,235 |
| Secondary (65+) | R9,444 |
| Tertiary (75+) | R3,145 |

## Example Calculation

**Scenario:**
- Gross Income: R 500,000
- Deductible Expenses: R 150,000
- Age: Under 65

**Calculation:**

```
Taxable Income: R500,000 - R150,000 = R350,000

Tax on R350,000:
├── First R237,100 × 18%    = R42,678
├── Next R112,900 × 26%     = R29,354
                             ─────────
Gross Tax                   = R72,032

Less: Primary Rebate        = R17,235
                             ─────────
Tax Payable                 = R54,797
```

## Viewing Your Tax Estimate

1. Go to **Reports** > **Tax Computation**
2. Select the tax year
3. View the detailed breakdown

ProcessX shows:
- Your gross income
- Deductions by category
- Taxable income
- Tax calculation steps
- Final estimated tax

## Tax Year in South Africa

The tax year runs from **1 March to 28/29 February**.

| Tax Year | Period |
|----------|--------|
| 2024/2025 | 1 Mar 2024 - 28 Feb 2025 |
| 2025/2026 | 1 Mar 2025 - 28 Feb 2026 |

Ensure you're viewing the correct tax year in ProcessX.

## Provisional Tax

If you earn income not from a regular salary, you likely need to pay provisional tax:

### First Payment
Due: End of August
Based on: Estimated annual taxable income

### Second Payment
Due: End of February
Based on: Updated estimate

### Third Payment (Top-up)
Due: 6 months after year-end
Optional: Pay any shortfall

ProcessX helps estimate these payments based on your year-to-date data.

## Limitations

ProcessX provides **estimates** only. It may not account for:
- Medical tax credits
- Retirement fund contributions
- Capital gains
- Foreign income
- Other complex tax situations

Always consult a tax professional for final calculations.

## Reducing Your Tax

Legal ways to reduce tax:
1. **Claim all deductions**: Record every business expense
2. **Retirement contributions**: Tax-deductible up to limits
3. **Medical aid**: Credits for medical scheme fees
4. **Home office**: Claim if you qualify
5. **Travel allowance**: Proper logbook records

## Related Articles

- [Generating profit & loss reports](/help/reports-and-tax/generating-profit-and-loss-reports)
- [Deduction summary reports](/help/reports-and-tax/deduction-summary-reports)
- [Tax year settings](/help/reports-and-tax/tax-year-settings)
- [Calculating deductions (Vehicle)](/help/vehicle-logbook/calculating-deductions)

---

*Last updated: March 2025*
