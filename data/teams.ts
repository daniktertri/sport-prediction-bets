// Mock teams data
// TODO: Replace with Supabase query: SELECT * FROM teams ORDER BY group, name

import { Team } from '@/types';

export const teams: Team[] = [
  // Group A
  { id: 'team-1', name: 'France', group: 'A', flag: '🇫🇷' },
  { id: 'team-2', name: 'Brazil', group: 'A', flag: '🇧🇷' },
  { id: 'team-3', name: 'Argentina', group: 'A', flag: '🇦🇷' },
  { id: 'team-4', name: 'Spain', group: 'A', flag: '🇪🇸' },
  
  // Group B
  { id: 'team-5', name: 'Germany', group: 'B', flag: '🇩🇪' },
  { id: 'team-6', name: 'Italy', group: 'B', flag: '🇮🇹' },
  { id: 'team-7', name: 'England', group: 'B', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'team-8', name: 'Netherlands', group: 'B', flag: '🇳🇱' },
  
  // Group C
  { id: 'team-9', name: 'Portugal', group: 'C', flag: '🇵🇹' },
  { id: 'team-10', name: 'Belgium', group: 'C', flag: '🇧🇪' },
  { id: 'team-11', name: 'Croatia', group: 'C', flag: '🇭🇷' },
  { id: 'team-12', name: 'Uruguay', group: 'C', flag: '🇺🇾' },
  
  // Group D
  { id: 'team-13', name: 'Mexico', group: 'D', flag: '🇲🇽' },
  { id: 'team-14', name: 'Japan', group: 'D', flag: '🇯🇵' },
  { id: 'team-15', name: 'Morocco', group: 'D', flag: '🇲🇦' },
  { id: 'team-16', name: 'Senegal', group: 'D', flag: '🇸🇳' },
];

export const getTeamById = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};

export const getTeamsByGroup = (group: 'A' | 'B' | 'C' | 'D'): Team[] => {
  return teams.filter(team => team.group === group);
};
