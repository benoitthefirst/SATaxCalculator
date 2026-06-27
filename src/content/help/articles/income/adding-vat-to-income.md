# Adding VAT to Income

Handle VAT calculations and reporting for your income correctly.

## Overview

If your business is registered for [VAT with SARS](https://www.sars.gov.za/types-of-tax/value-added-tax/), you need to:
- Charge VAT on applicable supplies
- Track VAT collected
- Submit VAT returns
- Pay output VAT to SARS

ProcessX helps automate these calculations.

## VAT Registration Requirements

According to [SARS VAT registration rules](https://www.sars.gov.za/types-of-tax/value-added-tax/registration-for-vat/):

You **must** register for VAT if:
- Your taxable turnover exceeds R1 million in any 12-month period

You **may** voluntarily register if:
- Your turnover exceeds R50,000 in a 12-month period

## Setting Up VAT in ProcessX

### Step 1: Configure Your Profile

1. Go to **Settings** > **Company**
2. Toggle **VAT Registered** to Yes
3. Enter your VAT registration number
4. Save your settings

### Step 2: Set Default VAT Behavior

Choose your preference:
- **VAT Inclusive**: Amounts you enter include VAT (recommended)
- **VAT Exclusive**: Amounts you enter exclude VAT

## Recording VAT on Income

When adding income:

### VAT Inclusive (Recommended)

1. Enter the **total amount received** (including VAT)
2. Toggle **VAT Inclusive** to Yes
3. ProcessX calculates the split automatically

**Example:**
- Total received: R 11,500.00
- VAT (15%): R 1,500.00
- Net income: R 10,000.00

### VAT Exclusive

1. Enter the **net amount** (excluding VAT)
2. Toggle **VAT Inclusive** to No
3. VAT is calculated and added

**Example:**
- Net amount: R 10,000.00
- VAT (15%): R 1,500.00
- Total: R 11,500.00

## VAT Rate

The standard [VAT rate in South Africa](https://www.sars.gov.za/types-of-tax/value-added-tax/) is **15%**.

Some supplies are:
- **Zero-rated (0%)**: Basic foodstuffs, exports
- **Exempt**: Financial services, residential rental

ProcessX uses the standard 15% rate. For zero-rated or exempt supplies, consult your accountant. See the [SARS guide on VAT rates](https://www.sars.gov.za/types-of-tax/value-added-tax/vat-rate/).

## VAT Reports

ProcessX helps with your [VAT201 return](https://www.sars.gov.za/types-of-tax/value-added-tax/submit-your-vat-return/):

### Output VAT (What You Owe)
Total VAT collected on income during the period.

### Input VAT (What You Can Claim)
Total VAT paid on business expenses during the period.

### Net VAT Position
Output VAT minus Input VAT = Amount payable to SARS (or refundable).

To view your VAT summary:
1. Go to **Reports**
2. Select **VAT Summary** (if available)
3. Choose the VAT period
4. View output and input VAT totals

## VAT Periods

Depending on your [registration category](https://www.sars.gov.za/types-of-tax/value-added-tax/submit-your-vat-return/), you submit VAT returns:
- **Monthly**: Large businesses (Category A)
- **Bi-monthly**: Most businesses (Category B)
- **6-monthly**: Farmers, small businesses (Category C)

Configure your VAT period in Settings for accurate reporting.

## Invoice Requirements

Your [tax invoices](https://www.sars.gov.za/types-of-tax/value-added-tax/documentation/) must include:
- Your business name and address
- Your VAT registration number
- Customer details (for invoices over R5,000)
- Invoice date and number
- Description of goods/services
- Total amount including VAT
- VAT amount shown separately

## Common Scenarios

### Received Payment Includes VAT

Most common scenario. Customer pays the VAT-inclusive amount.

**Record**: Full amount with VAT Inclusive = Yes

### Customer Pays VAT Separately

Rare, but sometimes VAT is paid as a separate transaction.

**Record**: Net income first, then add VAT portion

### Export Services (Zero-Rated)

If you export services to foreign clients:
- These may be zero-rated
- Consult your accountant for proper treatment
- Record income without VAT

Learn more about [zero-rated supplies on SARS](https://www.sars.gov.za/types-of-tax/value-added-tax/vat-rate/).

### Non-VAT Income

Some income may not attract VAT:
- Interest received
- Dividends
- Certain exempt supplies

Record these without VAT selected.

## Best Practices

1. **Always record VAT correctly**: Incorrect VAT records cause problems
2. **Reconcile monthly**: Check VAT totals against your VAT201
3. **Keep tax invoices**: Required proof for VAT claims
4. **Submit on time**: Avoid [penalties for late VAT returns](https://www.sars.gov.za/types-of-tax/value-added-tax/)

## External Resources

- [SARS VAT Guide](https://www.sars.gov.za/types-of-tax/value-added-tax/) - Official VAT information
- [VAT Registration](https://www.sars.gov.za/types-of-tax/value-added-tax/registration-for-vat/) - How to register
- [VAT Returns](https://www.sars.gov.za/types-of-tax/value-added-tax/submit-your-vat-return/) - Filing your VAT201
- [SARS eFiling](https://www.sarsefiling.co.za/) - Submit returns online

## Related Articles

- [Recording income](/help/income/recording-income)
- [Income categories](/help/income/income-categories)
- [Understanding tax computation](/help/reports-and-tax/understanding-tax-computation)
- [Exporting for your accountant](/help/reports-and-tax/exporting-for-your-accountant)

---

*Last updated: March 2025*
