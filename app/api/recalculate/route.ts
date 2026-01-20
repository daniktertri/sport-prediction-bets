import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';
import { calculatePoints } from '@/utils/scoring';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all finished matches
    const matchesResult = await pool.query(
      'SELECT id, score1, score2, status FROM matches WHERE status = $1',
      ['finished']
    );

    // Get all predictions
    const predictionsResult = await pool.query(`
      SELECT id, match_id, type, score1, score2, winner_id, man_of_the_match
      FROM predictions
    `);

    // Recalculate points for each prediction
    for (const prediction of predictionsResult.rows) {
      const match = matchesResult.rows.find(m => m.id === prediction.match_id);
      if (match && match.status === 'finished') {
        const points = calculatePoints(
          {
            type: prediction.type,
            score1: prediction.score1,
            score2: prediction.score2,
            winnerId: prediction.winner_id,
            manOfTheMatch: prediction.man_of_the_match,
          } as any,
          match
        );

        await pool.query(
          'UPDATE predictions SET points = $1 WHERE id = $2',
          [points, prediction.id]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recalculating points:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
