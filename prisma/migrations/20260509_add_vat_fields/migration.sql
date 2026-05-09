-- Add VAT fields to Income table
ALTER TABLE "income" ADD COLUMN "amount_excl_vat" DECIMAL(12, 2);
ALTER TABLE "income" ADD COLUMN "vat_amount" DECIMAL(12, 2);
ALTER TABLE "income" ADD COLUMN "is_vat_inclusive" BOOLEAN NOT NULL DEFAULT false;

-- Add VAT fields to Expense table
ALTER TABLE "expenses" ADD COLUMN "amount_excl_vat" DECIMAL(12, 2);
ALTER TABLE "expenses" ADD COLUMN "vat_amount" DECIMAL(12, 2);
ALTER TABLE "expenses" ADD COLUMN "is_vat_inclusive" BOOLEAN NOT NULL DEFAULT false;
