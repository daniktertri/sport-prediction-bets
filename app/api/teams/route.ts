import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.name,
        t.logo,
        t.flag,
        t."group",
        COALESCE(
          json_agg(
            json_build_object(
              'id', p.id,
              'name', p.name,
              'position', p.position,
              'number', p.number,
              'image', p.image
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) as players
      FROM teams t
      LEFT JOIN players p ON p.team_id = t.id
      GROUP BY t.id
      ORDER BY t."group", t.name
    `);

    const teams = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      logo: row.logo,
      flag: row.flag,
      group: row.group,
      players: row.players || [],
    }));

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
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
        { error: 'Admin access required. If you were recently promoted to admin, please log out and log back in to refresh your session.' },
        { status: 403 }
      );
    }

    const { name, logo, flag, group, players } = await request.json();

    const result = await pool.query(
      `INSERT INTO teams (name, logo, flag, "group")
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, logo, flag, "group"`,
      [name, logo || null, flag || null, group || null]
    );

    const team = result.rows[0];

    // Insert players if provided
    if (players && Array.isArray(players) && players.length > 0) {
      for (const player of players) {
        if (player.name) {
          await pool.query(
            `INSERT INTO players (team_id, name, position, number, image)
             VALUES ($1, $2, $3, $4, $5)`,
            [team.id, player.name, player.position || null, player.number || null, player.image || null]
          );
        }
      }
    }

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
