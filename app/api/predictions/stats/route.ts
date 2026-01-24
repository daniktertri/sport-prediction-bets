import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE outcome = 'team1')::int AS team1,
        COUNT(*) FILTER (WHERE outcome = 'team2')::int AS team2,
        COUNT(*) FILTER (WHERE outcome = 'draw')::int AS draw
      FROM predictions
      WHERE match_id = $1
        AND type = 'winner_only'
      `,
      [matchId]
    );

    const row = result.rows[0] || {
      total: 0,
      team1: 0,
      team2: 0,
      draw: 0,
    };

    return NextResponse.json({
      total: row.total,
      team1: row.team1,
      team2: row.team2,
      draw: row.draw,
    });
  } catch (error) {
    console.error('Error fetching prediction stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

