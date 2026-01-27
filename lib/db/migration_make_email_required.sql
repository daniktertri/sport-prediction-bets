-- Migration: Make email required (NOT NULL) for new users
-- Run this in your Neon database SQL editor
-- 
-- WARNING: This migration will fail if there are existing users without emails.
-- If you have existing users without emails, you'll need to update them first:
-- UPDATE users SET email = 'placeholder@example.com' WHERE email IS NULL;
-- Then run this migration.

-- First, ensure all existing users have an email (set a placeholder if needed)
-- Uncomment the line below if you need to set placeholder emails for existing users:
-- UPDATE users SET email = 'no-email-' || id::text || '@placeholder.com' WHERE email IS NULL;

-- Then make email NOT NULL
ALTER TABLE users 
ALTER COLUMN email SET NOT NULL;
