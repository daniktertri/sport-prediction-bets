import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      WHERE m.id = $1
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updates = await request.json();
    const {
      team1Id,
      team2Id,
      date,
      status,
      phase,
      group,
      score1,
      score2,
      manOfTheMatch,
    } = updates;

    const result = await pool.query(
      `UPDATE matches 
       SET team1_id = COALESCE($1, team1_id),
           team2_id = COALESCE($2, team2_id),
           date = COALESCE($3, date),
           status = COALESCE($4, status),
           phase = COALESCE($5, phase),
           "group" = $6,
           score1 = $7,
           score2 = $8,
           man_of_the_match = $9
       WHERE id = $10
       RETURNING id, team1_id as "team1Id", team2_id as "team2Id", date, status, phase, "group", score1, score2, man_of_the_match as "manOfTheMatch"`,
      [
        team1Id,
        team2Id,
        date,
        status,
        phase,
        group,
        score1,
        score2,
        manOfTheMatch,
        params.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
