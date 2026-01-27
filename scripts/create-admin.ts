/**
 * Script to create an admin user
 * Usage: npx tsx scripts/create-admin.ts <username> <password> <name> <email>
 * Example: npx tsx scripts/create-admin.ts admin admin123 "Admin User" admin@example.com
 */

import bcrypt from 'bcryptjs';
import pool from '../lib/db/index';

async function createAdminUser(username: string, password: string, name: string, email: string) {
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user to admin
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET password_hash = $1, name = $2, email = $3, is_admin = true WHERE username = $4',
        [passwordHash, name, email, username]
      );
      console.log(`✅ Updated user "${username}" to admin`);
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (username, password_hash, name, email, is_admin)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, username, name, is_admin`,
        [username, passwordHash, name, email]
      );
      console.log(`✅ Created admin user:`, result.rows[0]);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('Usage: npx tsx scripts/create-admin.ts <username> <password> <name> <email>');
  console.log('Example: npx tsx scripts/create-admin.ts admin admin123 "Admin User" admin@example.com');
  process.exit(1);
}

const [username, password, name, email] = args;

createAdminUser(username, password, name, email);
