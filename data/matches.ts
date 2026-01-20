// Mock matches data
// TODO: Replace with Supabase query: SELECT * FROM matches ORDER BY date, phase

import { Match } from '@/types';

// Generate dates: group stage in first week, knockout stages after
const today = new Date();
const groupStageStart = new Date(today);
groupStageStart.setDate(today.getDate() + 1);

export const matches: Match[] = [
  // Group Stage - Group A
  {
    id: 'match-1',
    team1Id: 'team-1',
    team2Id: 'team-2',
    date: new Date(groupStageStart).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-2',
    team1Id: 'team-3',
    team2Id: 'team-4',
    date: new Date(groupStageStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-3',
    team1Id: 'team-1',
    team2Id: 'team-3',
    date: new Date(groupStageStart.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-4',
    team1Id: 'team-2',
    team2Id: 'team-4',
    date: new Date(groupStageStart.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-5',
    team1Id: 'team-1',
    team2Id: 'team-4',
    date: new Date(groupStageStart.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-6',
    team1Id: 'team-2',
    team2Id: 'team-3',
    date: new Date(groupStageStart.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'finished',
    phase: 'group',
    score1: 2,
    score2: 1,
    manOfTheMatch: 'Player A',
  },
  
  // Group Stage - Group B
  {
    id: 'match-7',
    team1Id: 'team-5',
    team2Id: 'team-6',
    date: new Date(groupStageStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-8',
    team1Id: 'team-7',
    team2Id: 'team-8',
    date: new Date(groupStageStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  
  // Group Stage - Group C
  {
    id: 'match-9',
    team1Id: 'team-9',
    team2Id: 'team-10',
    date: new Date(groupStageStart.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-10',
    team1Id: 'team-11',
    team2Id: 'team-12',
    date: new Date(groupStageStart.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  
  // Group Stage - Group D
  {
    id: 'match-11',
    team1Id: 'team-13',
    team2Id: 'team-14',
    date: new Date(groupStageStart.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  {
    id: 'match-12',
    team1Id: 'team-15',
    team2Id: 'team-16',
    date: new Date(groupStageStart.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'group',
  },
  
  // Knockout stages (future matches)
  {
    id: 'match-13',
    team1Id: 'team-1', // placeholder - will be determined by group results
    team2Id: 'team-5',
    date: new Date(groupStageStart.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'round16',
  },
  {
    id: 'match-14',
    team1Id: 'team-9',
    team2Id: 'team-13',
    date: new Date(groupStageStart.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'round16',
  },
  {
    id: 'match-15',
    team1Id: 'team-1',
    team2Id: 'team-9',
    date: new Date(groupStageStart.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'quarter',
  },
  {
    id: 'match-16',
    team1Id: 'team-1',
    team2Id: 'team-9',
    date: new Date(groupStageStart.getTime() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'semi',
  },
  {
    id: 'match-17',
    team1Id: 'team-1',
    team2Id: 'team-9',
    date: new Date(groupStageStart.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'upcoming',
    phase: 'final',
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return matches.find(match => match.id === id);
};

export const getMatchesByPhase = (phase: Match['phase']): Match[] => {
  return matches.filter(match => match.phase === phase);
};

export const getMatchesByStatus = (status: Match['status']): Match[] => {
  return matches.filter(match => match.status === status);
};
