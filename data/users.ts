// Mock users data
// TODO: Replace with Supabase query: SELECT * FROM users ORDER BY total_points DESC

import { User } from '@/types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice', totalPoints: 25, totalBets: 10, exactScores: 2, winnerOnly: 5 },
  { id: 'user-2', name: 'Bob', totalPoints: 18, totalBets: 12, exactScores: 1, winnerOnly: 8 },
  { id: 'user-3', name: 'Charlie', totalPoints: 16, totalBets: 8, exactScores: 1, winnerOnly: 6 },
  { id: 'user-4', name: 'Diana', totalPoints: 13, totalBets: 15, exactScores: 0, winnerOnly: 13 },
  { id: 'user-5', name: 'Eve', totalPoints: 10, totalBets: 11, exactScores: 0, winnerOnly: 10 },
  { id: 'user-6', name: 'Frank', totalPoints: 6, totalBets: 9, exactScores: 0, winnerOnly: 6 },
  { id: 'user-7', name: 'Grace', totalPoints: 3, totalBets: 7, exactScores: 0, winnerOnly: 3 },
  { id: 'user-8', name: 'Henry', totalPoints: 0, totalBets: 5, exactScores: 0, winnerOnly: 0 },
];

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Current user (mocked - in real app, this would come from auth)
export const CURRENT_USER_ID = 'user-1';
