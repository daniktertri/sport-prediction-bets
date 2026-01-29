-- Group standings: points, goals for/against, matches played per team per group
-- Admin can fill these manually (pools classification)

CREATE TABLE IF NOT EXISTS group_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  "group" VARCHAR(1) NOT NULL CHECK ("group" IN ('A', 'B', 'C', 'D')),
  points INTEGER NOT NULL DEFAULT 0,
  goals_for INTEGER NOT NULL DEFAULT 0,
  goals_against INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, "group")
);

CREATE INDEX IF NOT EXISTS idx_group_standings_group ON group_standings("group");
CREATE INDEX IF NOT EXISTS idx_group_standings_team_id ON group_standings(team_id);

CREATE TRIGGER update_group_standings_updated_at BEFORE UPDATE ON group_standings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
