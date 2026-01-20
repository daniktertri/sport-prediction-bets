import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthUser } from '@/lib/middleware';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to update your profile' },
        { status: 401 }
      );
    }

    const { name, avatar, instagram, language } = await request.json();

    // Build update query dynamically based on what's provided
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name is required' },
          { status: 400 }
        );
      }
      updates.push(`name = $${paramIndex++}`);
      values.push(name.trim());
    }

    if (avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`);
      values.push(avatar || null);
    }

    if (instagram !== undefined) {
      updates.push(`instagram = $${paramIndex++}`);
      values.push(instagram || null);
    }

    if (language !== undefined) {
      if (language !== 'fr' && language !== 'en') {
        return NextResponse.json(
          { error: 'Language must be "fr" or "en"' },
          { status: 400 }
        );
      }
      updates.push(`language = $${paramIndex++}`);
      values.push(language);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(user.userId);
    const result = await pool.query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, username, name, email, avatar, instagram, is_admin, language`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = result.rows[0];
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        instagram: updatedUser.instagram,
        isAdmin: updatedUser.is_admin,
        language: updatedUser.language || 'fr',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
