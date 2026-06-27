# Calculating Vehicle Deductions

How vehicle logbook deductions are calculated for SARS.

## Overview

If you receive a travel allowance, [SARS](https://www.sars.gov.za/) allows you to claim a deduction based on your business travel. ProcessX calculates this automatically using SARS-approved methods.

## Who Can Claim?

You can claim vehicle deductions if you:
- Receive a travel allowance from your employer
- Use your personal vehicle for business
- Keep a proper logbook

If your company provides a company car, different rules apply ([fringe benefit](https://www.sars.gov.za/types-of-tax/pay-as-you-earn/fringe-benefits/)).

## Calculation Methods

SARS allows two methods. See the official [travel allowance guide](https://www.sars.gov.za/types-of-tax/personal-income-tax/learn-about-your-deductions/) for full details.

### 1. Actual Cost Method

Calculate the actual cost of running your vehicle:

| Cost Type | Annual Amount |
|-----------|---------------|
| Fuel | R 36,000 |
| Insurance | R 12,000 |
| Maintenance | R 8,000 |
| License fees | R 1,200 |
| Finance charges | R 24,000 |
| Depreciation | R 35,000 |
| **Total** | **R 116,200** |

Then multiply by business percentage:
- Total costs: R 116,200
- Business use: 60%
- Deduction: R 69,720

### 2. Deemed Cost Method (SARS Rates)

Use [SARS prescribed rates](https://www.sars.gov.za/tax-rates/employers/travel-allowance/) based on vehicle value:

**2024/2025 SARS Rates**

| Vehicle Value | Fixed Cost/Year | Fuel Cost/km | Maintenance Cost/km |
|---------------|-----------------|--------------|---------------------|
| Up to R95,000 | R30,871 | 120.9c | 43.6c |
| R95,001 - R190,000 | R55,081 | 135.9c | 49.1c |
| R190,001 - R285,000 | R79,291 | 150.9c | 54.6c |
| R285,001 - R380,000 | R103,501 | 165.9c | 60.1c |
| R380,001 - R475,000 | R127,711 | 180.9c | 65.6c |
| R475,001 - R570,000 | R151,921 | 195.9c | 71.1c |
| R570,001 - R665,000 | R172,131 | 210.9c | 76.6c |
| Over R665,000 | R172,131 | 210.9c | 76.6c |

*Note: Rates are updated annually by SARS. Check the [latest rates](https://www.sars.gov.za/tax-rates/employers/travel-allowance/).*

## Deemed Cost Calculation

### Step 1: Determine Vehicle Value

Use the original retail value (including VAT).

### Step 2: Find Applicable Rates

Look up rates based on vehicle value from the [SARS tables](https://www.sars.gov.za/tax-rates/employers/travel-allowance/).

### Step 3: Calculate Total Cost

```
Annual Cost = Fixed Cost + (Fuel Rate × km) + (Maintenance Rate × km)
```

### Step 4: Apply Business Percentage

```
Deduction = Annual Cost × Business Use Percentage
```

### Example Calculation

| Factor | Value |
|--------|-------|
| Vehicle value | R 320,000 |
| Total km driven | 20,000 km |
| Business km | 12,000 km |
| Business percentage | 60% |

Using 2024/2025 rates for R285,001 - R380,000 bracket:

```
Fixed Cost: R 103,501
Fuel: 20,000 km × R1.659 = R 33,180
Maintenance: 20,000 km × R0.601 = R 12,020
Total: R 148,701

Business portion: R 148,701 × 60% = R 89,221
```

Deductible amount: **R 89,221**

## Which Method is Better?

| Method | Best When |
|--------|-----------|
| Actual Cost | Your actual costs exceed deemed costs |
| Deemed Cost | You don't want to track every expense |

ProcessX can calculate both methods so you can compare.

## ProcessX Automation

ProcessX automatically:
1. Tracks your business kilometres
2. Calculates business use percentage
3. Applies current SARS rates
4. Generates the deduction calculation
5. Exports for your tax return

## Limits and Caps

### Vehicle Value Cap

SARS caps the vehicle value used for calculations at R665,000. If your car cost more, use R665,000.

### Travel Allowance Limitation

Your deduction cannot exceed your travel allowance received. If your allowance is R5,000/month (R60,000/year), maximum deduction is R60,000.

### Taxable Portion

```
Taxable Travel Allowance = Allowance Received - Deduction
```

This taxable portion adds to your income.

## Year-End Process

At tax time:

1. Export your vehicle logbook
2. Review business kilometres
3. Check business percentage
4. Calculate deduction (ProcessX does this)
5. Enter on [ITR12](https://www.sars.gov.za/types-of-tax/personal-income-tax/) (code 3702)

File your return on [SARS eFiling](https://www.sarsefiling.co.za/).

## Common Mistakes

1. **Not keeping logbook**: No logbook = no deduction
2. **Claiming too much**: Can't exceed allowance received
3. **Wrong vehicle value**: Use original purchase price
4. **Forgetting all costs**: Include everything for actual method
5. **Incomplete records**: Missing months weaken your claim

## External Resources

- [SARS Travel Allowance Guide](https://www.sars.gov.za/types-of-tax/personal-income-tax/learn-about-your-deductions/) - Official deduction guidance
- [SARS Fixed Cost Tables](https://www.sars.gov.za/tax-rates/employers/travel-allowance/) - Current rates
- [SARS eFiling](https://www.sarsefiling.co.za/) - File your tax return online
- [ITR12 Guide](https://www.sars.gov.za/types-of-tax/personal-income-tax/) - Personal income tax returns

## Related Articles

- [Setting up your vehicle](/help/vehicle-logbook/setting-up-your-vehicle)
- [Recording trips](/help/vehicle-logbook/recording-trips)
- [Business vs personal travel](/help/vehicle-logbook/business-vs-personal-travel)
- [Exporting logbook data](/help/vehicle-logbook/exporting-logbook-data)

---

*Last updated: March 2025*
