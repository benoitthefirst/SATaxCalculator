-- Migration: User-Level Subscriptions
-- This migration converts from company-level to user-level subscriptions
-- All existing subscription data is preserved by migrating to the company owner's user_id

-- Step 1: Add user_id column (nullable initially to allow data migration)
ALTER TABLE "subscriptions" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Step 2: Migrate existing data - set user_id to the company owner
-- For each subscription, find the company owner (role = 'owner') and use their user_id
UPDATE "subscriptions" s
SET "user_id" = (
  SELECT cm.user_id
  FROM "company_members" cm
  WHERE cm.company_id = s.company_id
    AND cm.role = 'owner'
  LIMIT 1
)
WHERE s.company_id IS NOT NULL AND s.user_id IS NULL;

-- Step 3: For any subscriptions without an owner found, use created_by_id from company
UPDATE "subscriptions" s
SET "user_id" = (
  SELECT c.created_by_id
  FROM "companies" c
  WHERE c.id = s.company_id
  LIMIT 1
)
WHERE s.company_id IS NOT NULL AND s.user_id IS NULL;

-- Step 4: Make user_id NOT NULL (only after data is migrated)
-- First check if there are any null user_ids remaining
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "subscriptions" WHERE "user_id" IS NULL) THEN
    RAISE EXCEPTION 'Cannot complete migration: some subscriptions have NULL user_id';
  END IF;
END $$;

ALTER TABLE "subscriptions" ALTER COLUMN "user_id" SET NOT NULL;

-- Step 5: Add unique constraint on user_id (one subscription per user)
-- Drop existing unique constraint on company_id if it exists
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_company_id_key";

-- Add unique constraint on user_id
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_key" UNIQUE ("user_id");

-- Step 6: Add foreign key to users table
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 7: Create index on user_id for performance
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- Step 8: Drop company_id column and its index (after data is safely migrated)
DROP INDEX IF EXISTS "subscriptions_company_id_idx";
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_company_id_fkey";
ALTER TABLE "subscriptions" DROP COLUMN IF EXISTS "company_id";

-- Log the migration
DO $$
DECLARE
  subscription_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO subscription_count FROM "subscriptions";
  RAISE NOTICE 'Migration complete: % subscriptions migrated to user-level', subscription_count;
END $$;
