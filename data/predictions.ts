// Mock predictions data
// TODO: Replace with Supabase query: SELECT * FROM predictions WHERE user_id = $1

import { Prediction } from '@/types';
import { CURRENT_USER_ID } from './users';

export const predictions: Prediction[] = [
  {
    id: 'pred-1',
    userId: CURRENT_USER_ID,
    matchId: 'match-6',
    type: 'exact_score',
    score1: 2,
    score2: 1,
    manOfTheMatch: 'Player A',
    points: 13, // 10 for exact score + 3 for man of the match
  },
  {
    id: 'pred-2',
    userId: CURRENT_USER_ID,
    matchId: 'match-1',
    type: 'winner_only',
    winnerId: 'team-1',
    manOfTheMatch: 'Player B',
  },
];

export const getPredictionByMatchId = (userId: string, matchId: string): Prediction | undefined => {
  return predictions.find(pred => pred.userId === userId && pred.matchId === matchId);
};

export const getUserPredictions = (userId: string): Prediction[] => {
  return predictions.filter(pred => pred.userId === userId);
};
