import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: return standings by group (teams in group + their stats, or defaults)
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        t.id as "teamId",
        t.name as "teamName",
        t.logo,
        t.flag,
        t."group",
        COALESCE(gs.points, 0) as points,
        COALESCE(gs.goals_for, 0) as "goalsFor",
        COALESCE(gs.goals_against, 0) as "goalsAgainst",
        COALESCE(gs.matches_played, 0) as "matchesPlayed"
      FROM teams t
      LEFT JOIN group_standings gs ON gs.team_id = t.id AND gs."group" = t."group"
      WHERE t."group" IS NOT NULL
      ORDER BY t."group", COALESCE(gs.points, 0) DESC, (COALESCE(gs.goals_for, 0) - COALESCE(gs.goals_against, 0)) DESC
    `);

    const byGroup: Record<string, Array<{
      teamId: string;
      teamName: string;
      logo?: string;
      flag?: string;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      matchesPlayed: number;
      goalDiff: number;
    }>> = { A: [], B: [], C: [], D: [] };

    result.rows.forEach((row: {
      teamId: string;
      teamName: string;
      logo?: string;
      flag?: string;
      group: string;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      matchesPlayed: number;
    }) => {
      const group = row.group as 'A' | 'B' | 'C' | 'D';
      if (byGroup[group]) {
        byGroup[group].push({
          teamId: row.teamId,
          teamName: row.teamName,
          logo: row.logo,
          flag: row.flag,
          points: Number(row.points),
          goalsFor: Number(row.goalsFor),
          goalsAgainst: Number(row.goalsAgainst),
          matchesPlayed: Number(row.matchesPlayed),
          goalDiff: Number(row.goalsFor) - Number(row.goalsAgainst),
        });
      }
    });

    return NextResponse.json(byGroup);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: admin update one team's standing (upsert)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to perform this action' },
        { status: 401 }
      );
    }
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { teamId, group, points, goalsFor, goalsAgainst, matchesPlayed } = body;

    if (!teamId || !group || !['A', 'B', 'C', 'D'].includes(group)) {
      return NextResponse.json(
        { error: 'teamId and group (A/B/C/D) are required' },
        { status: 400 }
      );
    }

    const p = typeof points === 'number' ? points : null;
    const gf = typeof goalsFor === 'number' ? goalsFor : null;
    const ga = typeof goalsAgainst === 'number' ? goalsAgainst : null;
    const mp = typeof matchesPlayed === 'number' ? matchesPlayed : null;

    await pool.query(`
      INSERT INTO group_standings (team_id, "group", points, goals_for, goals_against, matches_played)
      VALUES ($1, $2, COALESCE($3, 0), COALESCE($4, 0), COALESCE($5, 0), COALESCE($6, 0))
      ON CONFLICT (team_id, "group")
      DO UPDATE SET
        points = COALESCE($3, group_standings.points),
        goals_for = COALESCE($4, group_standings.goals_for),
        goals_against = COALESCE($5, group_standings.goals_against),
        matches_played = COALESCE($6, group_standings.matches_played),
        updated_at = NOW()
    `, [teamId, group, p, gf, ga, mp]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating standings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
