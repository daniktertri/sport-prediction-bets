import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';
import { calculatePoints } from '@/utils/scoring';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const matchId = request.nextUrl.searchParams.get('matchId');

    let query = `
      SELECT 
        p.id,
        p.user_id as "userId",
        p.match_id as "matchId",
        p.type,
        p.score1,
        p.score2,
        p.winner_id as "winnerId",
        p.man_of_the_match as "manOfTheMatch",
        p.points,
        p.created_at as "createdAt"
      FROM predictions p
      WHERE p.user_id = $1
    `;
    const params: any[] = [user.userId];

    if (matchId) {
      query += ' AND p.match_id = $2';
      params.push(matchId);
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching predictions:', error);
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { matchId, type, score1, score2, winnerId, manOfTheMatch } = await request.json();

    // Check if prediction already exists
    const existing = await pool.query(
      'SELECT id FROM predictions WHERE user_id = $1 AND match_id = $2',
      [user.userId, matchId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Prediction already exists for this match' },
        { status: 400 }
      );
    }

    // Get match to calculate points if finished
    const matchResult = await pool.query(
      'SELECT status, score1, score2 FROM matches WHERE id = $1',
      [matchId]
    );

    const match = matchResult.rows[0];
    let points = 0;

    if (match && match.status === 'finished') {
      const prediction = {
        type,
        score1,
        score2,
        winnerId,
        manOfTheMatch,
      };
      points = calculatePoints(prediction as any, match);
    }

    const result = await pool.query(
      `INSERT INTO predictions (user_id, match_id, type, score1, score2, winner_id, man_of_the_match, points)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id as "userId", match_id as "matchId", type, score1, score2, winner_id as "winnerId", man_of_the_match as "manOfTheMatch", points, created_at as "createdAt"`,
      [user.userId, matchId, type, score1 || null, score2 || null, winnerId || null, manOfTheMatch || null, points]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
