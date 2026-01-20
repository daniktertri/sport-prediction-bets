import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const teamId = request.nextUrl.searchParams.get('teamId');

    let query = 'SELECT id, team_id as "teamId", name, position, number FROM players';
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
