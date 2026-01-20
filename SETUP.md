# Database Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Add to your `.env.local` file:

```env
DATABASE_URL=postgresql://neondb_owner:npg_EPI8fzlVoGn0@ep-bold-band-ahztiwn2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

## 3. Create Database Schema

1. Go to your Neon dashboard: https://console.neon.tech
2. Open the SQL Editor
3. Copy and paste the contents of `lib/db/schema.sql`
4. Run the SQL script to create all tables

## 4. Create Initial Admin User

You have **3 options** to create an admin user:

### Option 1: Register a user, then promote to admin (Easiest)

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Register a new account (e.g., username: `admin`, password: `admin123`)
4. Go to your Neon SQL editor and run:

```sql
-- Promote your registered user to admin
-- Replace 'admin' with your actual username
UPDATE users 
SET is_admin = true 
WHERE username = 'admin';
```

5. Log out and log back in - you'll now have admin access!

### Option 2: Create admin user via SQL (Requires password hash)

If you want to create an admin user directly via SQL, you need to hash the password first. You can use Node.js:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

Then use the hash in SQL:

```sql
INSERT INTO users (username, password_hash, name, is_admin)
VALUES (
  'admin',
  '<paste-hash-from-above>',
  'Admin User',
  true
);
```

### Option 3: Use the create-admin script

```bash
npx tsx scripts/create-admin.ts admin admin123 "Admin User"
```

**Note:** Make sure to change the default password after first login!

## 5. Create Initial Competition

```sql
INSERT INTO competitions (name, logo, start_date, end_date)
VALUES (
  'Sports Prediction Championship',
  '🏆',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days'
);
```

## 6. Start the Development Server

```bash
npm run dev
```

## 7. Access the Application

- Visit `http://localhost:3000`
- Click "Login" to sign in
- Register a new account or use the admin account you created

## 8. Access the Admin Panel

Once you have an admin account:

1. **Log in** with your admin credentials
2. You'll see an **"Admin"** link in the navigation bar (only visible to admins)
3. Click **"Admin"** to access the admin panel at `/admin`
4. From there you can:
   - Manage Teams (`/admin/teams`)
   - Assign Groups (`/admin/groups`)
   - Manage Matches (`/admin/matches`)
   - Set Match Results (`/admin/results`)

**Note:** If you don't see the Admin link after logging in, make sure:
- Your user has `is_admin = true` in the database
- You've logged out and logged back in (to refresh your session)
- Clear your browser cache if needed

## Features

- **Authentication**: Username + password login/register
- **Teams Management**: Create teams, assign to groups, add players
- **Matches Management**: Create matches, set results
- **Predictions**: Users can make predictions on upcoming matches
- **Leaderboard**: Automatic ranking based on points
- **Admin Panel**: Full CRUD operations for teams, matches, and results

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team (admin only)
- `PATCH /api/teams/[id]` - Update team (admin only)
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create match (admin only)
- `PATCH /api/matches/[id]` - Update match (admin only)
- `GET /api/predictions` - Get predictions
- `POST /api/predictions` - Create prediction
- `GET /api/users` - Get all users with stats
- `POST /api/recalculate` - Recalculate all points (admin only)

## Notes

- All mock data has been removed
- All data now comes from the Neon PostgreSQL database
- Authentication uses JWT tokens stored in HTTP-only cookies
- Passwords are hashed using bcryptjs
- Points are automatically recalculated when match results are updated
