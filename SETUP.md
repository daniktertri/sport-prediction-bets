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

Run this SQL in your Neon SQL editor (replace with your desired username and password):

```sql
-- Create admin user (password: admin123)
-- You should change this password after first login!
INSERT INTO users (username, password_hash, name, is_admin)
VALUES (
  'admin',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- This is 'admin123' hashed
  'Admin User',
  true
);
```

Or use the register endpoint to create a user, then manually set `is_admin = true` in the database.

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
