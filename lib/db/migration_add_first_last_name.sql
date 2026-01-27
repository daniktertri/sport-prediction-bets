-- Migration: Add first_name and last_name columns to users table
-- Run this in your Neon database SQL editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- For existing users, try to split the name field
-- This will set first_name to the full name and last_name to NULL for existing users
-- You can manually update these later if needed
UPDATE users 
SET first_name = name, last_name = NULL 
WHERE first_name IS NULL;
