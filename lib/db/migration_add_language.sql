-- Migration: Add language column to users table
-- Default language is French ('fr')

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'fr' CHECK (language IN ('fr', 'en'));

-- Update existing users to have French as default if they don't have a language set
UPDATE users 
SET language = 'fr' 
WHERE language IS NULL;
