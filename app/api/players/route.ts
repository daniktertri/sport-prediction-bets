import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

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
    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
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

    const result = await pool.query(
      `INSERT INTO players (name, position, number, image, instagram, team_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, team_id as "teamId", name, position, number, image, instagram`,
      [name.trim(), position || null, number || null, image || null, instagram || null, teamId || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
