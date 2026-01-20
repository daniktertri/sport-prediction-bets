-- Migration: Add image column to players table
-- Run this in your Neon SQL editor if the column doesn't exist

ALTER TABLE players 
ADD COLUMN IF NOT EXISTS image TEXT;
