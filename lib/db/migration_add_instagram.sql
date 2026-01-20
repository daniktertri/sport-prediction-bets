-- Migration: Add Instagram columns to users and players tables
-- Run this in your Neon SQL editor

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);

ALTER TABLE players 
ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);
