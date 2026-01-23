-- Migration: Allow team_id to be NULL in players table
-- This allows players to be created independently without being assigned to a team immediately
-- Run this in your Neon SQL editor

ALTER TABLE players 
ALTER COLUMN team_id DROP NOT NULL;
