import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Disable Vercel edge caching - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get all users with their stats
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.name,
        u.email,
        u.avatar,
        u.instagram,
        u.is_admin as "isAdmin",
        u.language,
        COALESCE(SUM(p.points), 0) as "totalPoints",
        COUNT(p.id) as "totalBets",
        COUNT(CASE WHEN p.type = 'exact_score' AND p.points >= 10 THEN 1 END) as "exactScores",
        COUNT(CASE WHEN p.type = 'winner_only' AND p.points >= 3 THEN 1 END) as "winnerOnly"
      FROM users u
      LEFT JOIN predictions p ON p.user_id = u.id
      GROUP BY u.id, u.username, u.name, u.email, u.avatar, u.instagram, u.is_admin, u.language
      ORDER BY "totalPoints" DESC, u.name
    `);

    const users = result.rows.map(row => ({
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      instagram: row.instagram,
      isAdmin: row.isAdmin,
      language: row.language || 'fr',
      totalPoints: parseInt(row.totalPoints) || 0,
      totalBets: parseInt(row.totalBets) || 0,
      exactScores: parseInt(row.exactScores) || 0,
      winnerOnly: parseInt(row.winnerOnly) || 0,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
