'use client';

// App Context for state management
// TODO: Replace with Supabase real-time subscriptions and mutations

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Team, Match, User, Prediction, Competition } from '@/types';
import { teams as initialTeams } from '@/mocks/teams';
import { matches as initialMatches } from '@/mocks/matches';
import { users as initialUsers, CURRENT_USER_ID } from '@/mocks/users';
import { predictions as initialPredictions } from '@/mocks/predictions';
import { competition as initialCompetition } from '@/mocks/competition';
import { calculatePoints } from '@/utils/scoring';

interface AppContextType {
  // Data
  teams: Team[];
  matches: Match[];
  users: User[];
  predictions: Prediction[];
  competition: Competition;
  currentUser: User | undefined;
  
  // Actions
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  createTeam: (team: Omit<Team, 'id'>) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  createMatch: (match: Omit<Match, 'id'>) => void;
  addPrediction: (prediction: Omit<Prediction, 'id' | 'points' | 'createdAt'>) => void;
  recalculatePoints: () => void;
  getUserPredictionForMatch: (matchId: string) => Prediction | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initialize with calculated points
const initializePredictions = (preds: Prediction[], matches: Match[]): Prediction[] => {
  return preds.map((pred) => {
    const match = matches.find((m) => m.id === pred.matchId);
    if (match && match.status === 'finished') {
      const points = calculatePoints(pred, match);
      return { ...pred, points };
    }
    return pred;
  });
};

const initializeUsers = (preds: Prediction[], users: User[]): User[] => {
  return users.map((user) => {
    const userPreds = preds.filter((p) => p.userId === user.id);
    const totalPoints = userPreds.reduce((sum, p) => sum + (p.points || 0), 0);
    const exactScores = userPreds.filter((p) => p.type === 'exact_score' && (p.points || 0) >= 10).length;
    const winnerOnly = userPreds.filter((p) => p.type === 'winner_only' && (p.points || 0) >= 3).length;
    return { ...user, totalPoints, exactScores, winnerOnly };
  }).sort((a, b) => b.totalPoints - a.totalPoints);
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [predictions, setPredictions] = useState<Prediction[]>(() => 
    initializePredictions(initialPredictions, initialMatches)
  );
  const [competition] = useState<Competition>(initialCompetition);
  
  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  
  // Recalculate points when matches or predictions change
  const recalculatePoints = useCallback(() => {
    setPredictions((prevPreds) => {
      const updated = prevPreds.map((pred) => {
        const match = matches.find((m) => m.id === pred.matchId);
        if (!match || match.status !== 'finished') {
          return pred;
        }
        const points = calculatePoints(pred, match);
        return { ...pred, points };
      });
      
      // Update user stats
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          const userPreds = updated.filter((p) => p.userId === user.id);
          const totalPoints = userPreds.reduce((sum, p) => sum + (p.points || 0), 0);
          const exactScores = userPreds.filter((p) => p.type === 'exact_score' && (p.points || 0) >= 10).length;
          const winnerOnly = userPreds.filter((p) => p.type === 'winner_only' && (p.points || 0) >= 3).length;
          return { ...user, totalPoints, exactScores, winnerOnly };
        }).sort((a, b) => b.totalPoints - a.totalPoints);
      });
      
      return updated;
    });
  }, [matches]);
  
  useEffect(() => {
    recalculatePoints();
  }, [recalculatePoints]);
  
  const updateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
    setTeams((prev) => prev.map((team) => (team.id === teamId ? { ...team, ...updates } : team)));
  }, []);
  
  const createTeam = useCallback((team: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...team,
      id: `team-${Date.now()}`,
    };
    setTeams((prev) => [...prev, newTeam]);
  }, []);
  
  const updateMatch = useCallback((matchId: string, updates: Partial<Match>) => {
    setMatches((prev) => prev.map((match) => (match.id === matchId ? { ...match, ...updates } : match)));
    // Recalculate points after match update
    setTimeout(() => recalculatePoints(), 100);
  }, [recalculatePoints]);
  
  const createMatch = useCallback((match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: `match-${Date.now()}`,
    };
    setMatches((prev) => [...prev, newMatch]);
  }, []);
  
  const addPrediction = useCallback((prediction: Omit<Prediction, 'id' | 'points' | 'createdAt'>) => {
    const newPrediction: Prediction = {
      ...prediction,
      id: `pred-${Date.now()}`,
      points: 0,
      createdAt: new Date().toISOString(),
    };
    setPredictions((prev) => [...prev, newPrediction]);
  }, []);
  
  const getUserPredictionForMatch = useCallback((matchId: string) => {
    return predictions.find((p) => p.userId === CURRENT_USER_ID && p.matchId === matchId);
  }, [predictions]);
  
  return (
    <AppContext.Provider
      value={{
        teams,
        matches,
        users,
        predictions,
        competition,
        currentUser,
        updateTeam,
        createTeam,
        updateMatch,
        createMatch,
        addPrediction,
        recalculatePoints,
        getUserPredictionForMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
