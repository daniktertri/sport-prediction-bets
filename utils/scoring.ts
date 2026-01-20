// Scoring calculation logic
// TODO: Move this to a Supabase Edge Function or database trigger

import { Prediction, Match } from '@/types';

export const calculatePoints = (prediction: Prediction, match: Match): number => {
  if (match.status !== 'finished' || !match.score1 || !match.score2) {
    return 0;
  }
  
  let points = 0;
  
  // Check exact score prediction
  if (prediction.type === 'exact_score' && prediction.score1 !== undefined && prediction.score2 !== undefined) {
    const exactScoreMatch = prediction.score1 === match.score1 && prediction.score2 === match.score2;
    if (exactScoreMatch) {
      points += 10;
    } else {
      // If exact score is wrong, check if at least the winner is correct
      const predictedWinner = prediction.score1 > prediction.score2 ? match.team1Id :
                             prediction.score1 < prediction.score2 ? match.team2Id : null;
      const actualWinner = match.score1 > match.score2 ? match.team1Id :
                          match.score1 < match.score2 ? match.team2Id : null;
      if (predictedWinner === actualWinner && actualWinner !== null) {
        // Winner correct but not exact score - award winner points
        points += 3;
      }
    }
  }
  
  // Check winner-only prediction
  if (prediction.type === 'winner_only' && prediction.winnerId) {
    const actualWinner = match.score1 > match.score2 ? match.team1Id : 
                        match.score1 < match.score2 ? match.team2Id : null;
    if (prediction.winnerId === actualWinner && actualWinner !== null) {
      points += 3;
    }
  }
  
  // Check man of the match
  if (prediction.manOfTheMatch && match.manOfTheMatch) {
    if (prediction.manOfTheMatch === match.manOfTheMatch) {
      points += 3;
    }
  }
  
  return points;
};

export const calculatePotentialPoints = (
  predictionType: 'exact_score' | 'winner_only',
  hasManOfTheMatch: boolean
): number => {
  let potential = 0;
  
  if (predictionType === 'exact_score') {
    potential += 10;
  } else {
    potential += 3;
  }
  
  if (hasManOfTheMatch) {
    potential += 3;
  }
  
  return potential;
};
