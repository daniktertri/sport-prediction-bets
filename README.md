# Sports Prediction Game

A Next.js web application for a school sports prediction game (pronostics) where users predict match results and compete for points.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)
- **No Database/Backend** - All data is mocked locally

## Features

- 🏆 **Competition Structure**: 16 teams in 4 groups, group stage + knockout stages
- 📊 **Match Predictions**: Users can predict exact scores or just winners
- ⭐ **Man of the Match**: Bonus points for predicting the best player
- 📈 **Leaderboard**: Real-time rankings based on points
- 🎯 **Scoring System**:
  - Exact score correct: +10 points
  - Winner only correct: +3 points
  - Man of the match correct: +3 points (bonus)
- 🔧 **Admin Panel**: Set match results and trigger point calculations

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── matches/           # Matches pages
│   ├── leaderboard/       # Leaderboard page
│   └── admin/             # Admin panel
├── components/            # Reusable UI components
├── data/                  # Mock data files
│   ├── teams.ts
│   ├── matches.ts
│   ├── users.ts
│   └── predictions.ts
├── store/                 # Zustand state management
│   └── useStore.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
└── utils/                 # Utility functions
    └── scoring.ts
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Pages

### Home (`/`)
- Competition overview with statistics
- Group standings
- Navigation to matches and leaderboard

### Matches (`/matches`)
- List all matches grouped by phase (Group, Round of 16, Quarter, Semi, Final)
- Match cards showing teams, date, and status
- Click to view details and make predictions

### Match Detail (`/matches/[id]`)
- Match information
- Prediction form (if match is upcoming):
  - Exact score prediction (+10 pts)
  - Winner only prediction (+3 pts)
  - Man of the match selection (+3 pts bonus)
- Shows potential points before submitting
- Displays results if match is finished

### Leaderboard (`/leaderboard`)
- Ranked list of all users by total points
- Highlights current user
- Scoring rules reference

### Admin (`/admin`)
- Select any match
- Set final scores
- Set man of the match
- Automatically recalculates all user points

## Mock Data

All data is stored in TypeScript files in the `data/` directory:
- **teams.ts**: 16 teams across 4 groups
- **matches.ts**: All competition matches
- **users.ts**: Mock users with points
- **predictions.ts**: User predictions

## Future Integration with Supabase

The codebase includes TODO comments indicating where Supabase will replace mock logic:

- Data fetching: Replace mock data imports with Supabase queries
- State management: Replace Zustand with Supabase real-time subscriptions
- Authentication: Add Supabase Auth for user management
- Database: Create tables for teams, matches, users, predictions
- Edge Functions: Move scoring calculations to Supabase Edge Functions

## Development Notes

- Current user is hardcoded as `user-1` (Alice) in `data/users.ts`
- All state is managed client-side with Zustand
- Point calculations happen automatically when match results are updated
- Mobile-first responsive design

## License

This is a school project for educational purposes.
# sport-prediction-bets
