import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';
import { calculatePoints } from '@/utils/scoring';

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

    // Get all finished matches with teams and MOTM
    const matchesResult = await pool.query(
      `SELECT 
         id,
         team1_id as "team1Id",
         team2_id as "team2Id",
         score1,
         score2,
         status,
         man_of_the_match as "manOfTheMatch"
       FROM matches
       WHERE status = $1`,
      ['finished']
    );

    // Get all predictions including outcome
    const predictionsResult = await pool.query(`
      SELECT 
        id,
        match_id,
        type,
        score1,
        score2,
        winner_id,
        man_of_the_match,
        outcome
      FROM predictions
    `);

    // Recalculate points for each prediction
    for (const prediction of predictionsResult.rows) {
      const match = matchesResult.rows.find(m => m.id === prediction.match_id);
      if (match && match.status === 'finished') {
        const points = calculatePoints(
          {
            id: prediction.id,
            userId: '', // not needed for scoring
            matchId: prediction.match_id,
            type: prediction.type,
            score1: prediction.score1,
            score2: prediction.score2,
            winnerId: prediction.winner_id,
            manOfTheMatch: prediction.man_of_the_match,
            outcome: prediction.outcome,
          } as any,
          match as any
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
