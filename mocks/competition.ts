// Mock competition data
// TODO: Replace with Supabase query: SELECT * FROM competitions WHERE id = $1

import { Competition } from '@/types';

export const competition: Competition = {
  id: 'comp-1',
  name: 'World Cup 2024',
  logo: '🏆',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
};
