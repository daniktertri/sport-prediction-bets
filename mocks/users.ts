// Mock users data
// TODO: Replace with Supabase query: SELECT * FROM users ORDER BY total_points DESC

import { User } from '@/types';

export const users: User[] = [
  { 
    id: 'user-1', 
    name: 'Alice', 
    email: 'alice@example.com',
    totalPoints: 25,
    totalBets: 10,
    exactScores: 2,
    winnerOnly: 1,
    isAdmin: true, // Admin user
  },
  { 
    id: 'user-2', 
    name: 'Bob', 
    email: 'bob@example.com',
    totalPoints: 18,
    totalBets: 12,
    exactScores: 1,
    winnerOnly: 2,
  },
  { 
    id: 'user-3', 
    name: 'Charlie', 
    email: 'charlie@example.com',
    totalPoints: 16,
    totalBets: 8,
    exactScores: 1,
    winnerOnly: 1,
  },
  { 
    id: 'user-4', 
    name: 'Diana', 
    email: 'diana@example.com',
    totalPoints: 13,
    totalBets: 15,
    exactScores: 1,
    winnerOnly: 0,
  },
  { 
    id: 'user-5', 
    name: 'Eve', 
    email: 'eve@example.com',
    totalPoints: 10,
    totalBets: 11,
    exactScores: 0,
    winnerOnly: 2,
  },
  { 
    id: 'user-6', 
    name: 'Frank', 
    email: 'frank@example.com',
    totalPoints: 6,
    totalBets: 9,
    exactScores: 0,
    winnerOnly: 2,
  },
  { 
    id: 'user-7', 
    name: 'Grace', 
    email: 'grace@example.com',
    totalPoints: 3,
    totalBets: 7,
    exactScores: 0,
    winnerOnly: 1,
  },
  { 
    id: 'user-8', 
    name: 'Henry', 
    email: 'henry@example.com',
    totalPoints: 0,
    totalBets: 5,
    exactScores: 0,
    winnerOnly: 0,
  },
];

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Current user (mocked - in real app, this would come from auth)
export const CURRENT_USER_ID = 'user-1';
