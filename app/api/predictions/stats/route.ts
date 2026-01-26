import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Disable Vercel edge caching - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const matchId = request.nextUrl.searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId is required' },
        { status: 400 }
      );
    }

    // Get match info to know team IDs for legacy winnerId mapping
    const matchResult = await pool.query(
      'SELECT team1_id, team2_id FROM matches WHERE id = $1',
      [matchId]
    );
    
    if (matchResult.rows.length === 0) {
      return NextResponse.json({ total: 0, team1: 0, team2: 0, draw: 0 });
    }
    
    const { team1_id, team2_id } = matchResult.rows[0];

    // Count all predictions and derive outcome from:
    // 1. explicit outcome field
    // 2. legacy winnerId field (for winner_only)
    // 3. score1 vs score2 (for exact_score)
    const result = await pool.query(
      `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE 
          outcome = 'team1' 
          OR (outcome IS NULL AND winner_id = $2)
          OR (type = 'exact_score' AND score1 > score2)
        )::int AS team1,
        COUNT(*) FILTER (WHERE 
          outcome = 'team2' 
          OR (outcome IS NULL AND winner_id = $3)
          OR (type = 'exact_score' AND score2 > score1)
        )::int AS team2,
        COUNT(*) FILTER (WHERE 
          outcome = 'draw'
          OR (type = 'exact_score' AND score1 = score2 AND score1 IS NOT NULL)
        )::int AS draw
      FROM predictions
      WHERE match_id = $1
      `,
      [matchId, team1_id, team2_id]
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

