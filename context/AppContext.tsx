'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Team, Match, User, Prediction, Competition } from '@/types';
import { getUserFromCache, setUserCache, clearUserCache } from '@/utils/cache';

interface AppContextType {
  // Data
  teams: Team[];
  matches: Match[];
  users: User[];
  predictions: Prediction[];
  competition: Competition | null;
  currentUser: User | undefined;
  loading: boolean;
  
  // Actions
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  createTeam: (team: Omit<Team, 'id'>) => Promise<void>;
  updateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>;
  createMatch: (match: Omit<Match, 'id'>) => Promise<void>;
  addPrediction: (prediction: Omit<Prediction, 'id' | 'points' | 'createdAt'>) => Promise<void>;
  recalculatePoints: () => Promise<void>;
  getUserPredictionForMatch: (matchId: string) => Prediction | undefined;
  refreshData: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  // Initialize with cached user for instant UI
  const [currentUser, setCurrentUser] = useState<User | undefined>(() => {
    if (typeof window !== 'undefined') {
      return getUserFromCache() || undefined;
    }
    return undefined;
  });
  const [loading, setLoading] = useState(true);

  // Fetch current user from server and update cache
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setUserCache(data.user); // Update cache
      } else {
        setCurrentUser(undefined);
        clearUserCache(); // Clear cache if no user
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      // On error, keep cached user if available, otherwise clear
      const cachedUser = getUserFromCache();
      if (!cachedUser) {
        setCurrentUser(undefined);
        clearUserCache();
      }
    }
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamsRes, matchesRes, usersRes, competitionRes, predictionsRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/matches'),
        fetch('/api/users'),
        fetch('/api/competition'),
        fetch('/api/predictions'),
      ]);

      const teamsData = await teamsRes.json();
      const matchesData = await matchesRes.json();
      const usersData = await usersRes.json();
      const competitionData = await competitionRes.json();
      const predictionsData = await predictionsRes.json();

      setTeams(teamsData);
      setMatches(matchesData);
      setUsers(usersData);
      setCompetition(competitionData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load cached user immediately for instant UI
    const cachedUser = getUserFromCache();
    if (cachedUser) {
      setCurrentUser(cachedUser);
    }
    
    // Then verify with server in background
    fetchCurrentUser();
    fetchData();
  }, [fetchCurrentUser, fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    try {
      const { players, ...teamUpdates } = updates;
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...teamUpdates, players }),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  }, [fetchData]);

  const createTeam = useCallback(async (team: Omit<Team, 'id'>) => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  }, [fetchData]);

  const updateMatch = useCallback(async (matchId: string, updates: Partial<Match>) => {
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        await fetchData();
        // Recalculate points after match update
        if (updates.status === 'finished') {
          await fetch('/api/recalculate', { method: 'POST' });
          await fetchData();
        }
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  }, [fetchData]);

  const createMatch = useCallback(async (match: Omit<Match, 'id'>) => {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error creating match:', error);
    }
  }, [fetchData]);

  const addPrediction = useCallback(async (prediction: Omit<Prediction, 'id' | 'points' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prediction),
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error adding prediction:', error);
      throw error;
    }
  }, [fetchData]);

  const recalculatePoints = useCallback(async () => {
    try {
      await fetch('/api/recalculate', { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error('Error recalculating points:', error);
    }
  }, [fetchData]);

  const getUserPredictionForMatch = useCallback((matchId: string) => {
    if (!currentUser) return undefined;
    return predictions.find((p) => p.userId === currentUser.id && p.matchId === matchId);
  }, [predictions, currentUser]);

  return (
    <AppContext.Provider
      value={{
        teams,
        matches,
        users,
        predictions,
        competition: competition || {
          id: 'default',
          name: 'Sports Prediction Championship',
          logo: '🏆',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        currentUser,
        loading,
        updateTeam,
        createTeam,
        updateMatch,
        createMatch,
        addPrediction,
        recalculatePoints,
        getUserPredictionForMatch,
        refreshData,
        refreshCurrentUser,
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
