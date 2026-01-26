import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

// Disable Vercel edge caching - always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const teamId = request.nextUrl.searchParams.get('teamId');

    let query = `
      SELECT 
        id, 
        team_id as "teamId", 
        name, 
        position, 
        number,
        image,
        instagram
      FROM players
    `;
    const params: any[] = [];

    if (teamId) {
      query += ' WHERE team_id = $1';
      params.push(teamId);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
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
    
    // Verify admin status from database (in case JWT is outdated)
    const userCheck = await pool.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [user.userId]
    );
    
    if (userCheck.rows.length === 0 || !userCheck.rows[0].is_admin) {
      return NextResponse.json(
        { error: 'Admin access required. If you were recently promoted to admin, please log out and log back in to refresh your session.' },
        { status: 403 }
      );
    }

    const { name, position, number, image, instagram, teamId } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }

    // Handle team_id - if not provided, we need to check if the schema allows NULL
    // If schema requires NOT NULL, we'll need to make teamId optional in the schema
    const result = await pool.query(
      `INSERT INTO players (name, position, number, image, instagram, team_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, team_id as "teamId", name, position, number, image, instagram`,
      [
        name.trim(), 
        position || null, 
        number || null, 
        image || null, 
        instagram || null, 
        teamId && teamId.trim() ? teamId : null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
