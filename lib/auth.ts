import bcrypt from 'bcryptjs';
import pool from './db';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(username: string, password: string, name: string, email: string, firstName?: string, lastName?: string) {
  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    `INSERT INTO users (username, password_hash, name, email, first_name, last_name) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING id, username, name, email, avatar, is_admin, created_at, first_name, last_name`,
    [username, passwordHash, name, email, firstName || null, lastName || null]
  );
  return result.rows[0];
}

export async function getUserByUsername(username: string) {
  const result = await pool.query(
    'SELECT id, username, password_hash, name, email, avatar, is_admin, language FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function getUserById(id: string) {
  const result = await pool.query(
    'SELECT id, username, name, email, avatar, instagram, is_admin, language FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}
