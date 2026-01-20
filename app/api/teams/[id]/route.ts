import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
              'number', p.number
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) as players
      FROM teams t
      LEFT JOIN players p ON p.team_id = t.id
      WHERE t.id = $1
      GROUP BY t.id
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const team = result.rows[0];
    return NextResponse.json({
      id: team.id,
      name: team.name,
      logo: team.logo,
      flag: team.flag,
      group: team.group,
      players: team.players || [],
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update team
    const result = await pool.query(
      `UPDATE teams 
       SET name = COALESCE($1, name),
           logo = COALESCE($2, logo),
           flag = COALESCE($3, flag),
           "group" = $4
       WHERE id = $5
       RETURNING id, name, logo, flag, "group"`,
      [name, logo, flag, group, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    // Update players if provided
    if (players && Array.isArray(players)) {
      // Delete existing players
      await pool.query('DELETE FROM players WHERE team_id = $1', [params.id]);

      // Insert new players
      for (const player of players) {
        if (player.name) {
          await pool.query(
            `INSERT INTO players (team_id, name, position, number)
             VALUES ($1, $2, $3, $4)`,
            [params.id, player.name, player.position || null, player.number || null]
          );
        }
      }
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
