-- Add outcome column to predictions for 1X2 (win/draw/lose) bets

ALTER TABLE predictions
ADD COLUMN IF NOT EXISTS outcome VARCHAR(10)
  CHECK (outcome IN ('team1', 'team2', 'draw'));

-- Backfill outcome for existing winner_only predictions based on winner_id
UPDATE predictions p
SET outcome = CASE
  WHEN p.winner_id = m.team1_id THEN 'team1'
  WHEN p.winner_id = m.team2_id THEN 'team2'
  ELSE outcome
END
FROM matches m
WHERE p.match_id = m.id
  AND p.type = 'winner_only'
  AND p.outcome IS NULL;

