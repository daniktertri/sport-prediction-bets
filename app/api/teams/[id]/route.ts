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
              'number', p.number,
              'image', p.image,
              'instagram', p.instagram
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
      // Remove all players from this team first
      await pool.query('UPDATE players SET team_id = NULL WHERE team_id = $1', [params.id]);

      // Assign selected players to this team
      for (const player of players) {
        if (player.id) {
          // Update existing player's team_id
          await pool.query(
            `UPDATE players SET team_id = $1 WHERE id = $2`,
            [params.id, player.id]
          );
        } else if (player.name) {
          // Create new player (backward compatibility)
          await pool.query(
            `INSERT INTO players (team_id, name, position, number, image, instagram)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [params.id, player.name, player.position || null, player.number || null, player.image || null, player.instagram || null]
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

export async function DELETE(
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

    // Check if team is used in any matches
    const matchesResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM matches
       WHERE team1_id = $1 OR team2_id = $1`,
      [params.id]
    );

    const matchCount = matchesResult.rows[0]?.count ?? 0;

    if (matchCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete team that is used in matches. Please update or remove those matches first.' },
        { status: 400 }
      );
    }

    // Delete team (players will be detached or removed according to foreign key rules)
    const deleteResult = await pool.query(
      'DELETE FROM teams WHERE id = $1 RETURNING id',
      [params.id]
    );

    if (deleteResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
