import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

// Disable Vercel edge caching - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.team1_id as "team1Id",
        m.team2_id as "team2Id",
        m.date,
        m.status,
        m.phase,
        m."group",
        m.score1,
        m.score2,
        m.man_of_the_match as "manOfTheMatch"
      FROM matches m
      ORDER BY m.date, m.phase
    `);

    const matches = result.rows.map(row => ({
      id: row.id,
      team1Id: row.team1Id,
      team2Id: row.team2Id,
      date: row.date,
      status: row.status,
      phase: row.phase,
      group: row.group,
      score1: row.score1,
      score2: row.score2,
      manOfTheMatch: row.manOfTheMatch,
    }));

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
        { error: 'Admin access required. If you were recently promoted to admin, please log out and log back in to refresh your session.' },
        { status: 403 }
      );
    }

    const { team1Id, team2Id, date, phase, group } = await request.json();

    const result = await pool.query(
      `INSERT INTO matches (team1_id, team2_id, date, phase, "group", status)
       VALUES ($1, $2, $3, $4, $5, 'upcoming')
       RETURNING id, team1_id as "team1Id", team2_id as "team2Id", date, status, phase, "group"`,
      [team1Id, team2Id, date, phase, group || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
