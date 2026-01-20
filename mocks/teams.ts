// This file is kept for reference but should not be used
// All data now comes from the database via API routes

import { Team } from '@/types';

// Helper function to get players by team ID from API
export async function getPlayersByTeam(teamId: string) {
  try {
    const res = await fetch(`/api/players?teamId=${teamId}`);
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
}

export function getAllPlayers() {
  // This should be replaced with API call
  return [];
}
