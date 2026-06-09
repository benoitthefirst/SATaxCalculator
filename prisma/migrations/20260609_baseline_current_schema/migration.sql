-- Baseline migration to sync migration history with current database state
-- This migration represents all changes made to the database since the initial migration

-- Add reset_token fields to users table (only change not yet in production)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expires" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "users_reset_token_key" ON "users"("reset_token");

-- Note: All other tables and columns already exist in production database
-- This baseline migration syncs the migration history with the actual database state
