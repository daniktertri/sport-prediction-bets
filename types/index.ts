// Types for the sports prediction game
// TODO: These types will be replaced by Supabase database schema

export type Player = {
  id: string;
  name: string;
  position?: string;
  number?: number;
  image?: string; // base64 or URL
  instagram?: string;
};

export type Team = {
  id: string;
  name: string;
  logo?: string; // URL or emoji
  group: 'A' | 'B' | 'C' | 'D' | null;
  players: Player[];
  flag?: string; // emoji flag for display
};

export type MatchStatus = 'upcoming' | 'finished' | 'live';

export type MatchPhase = 'group' | 'round16' | 'quarter' | 'semi' | 'final';

export type PredictionOutcome = 'team1' | 'team2' | 'draw';

export type Match = {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string; // ISO date string
  status: MatchStatus;
  phase: MatchPhase;
  group?: 'A' | 'B' | 'C' | 'D'; // only for group stage
  score1?: number; // final score for team1 (only when finished)
  score2?: number; // final score for team2 (only when finished)
  manOfTheMatch?: string; // player id (only when finished)
};

export type PredictionType = 'exact_score' | 'winner_only';

export type Prediction = {
  id: string;
  userId: string;
  matchId: string;
  type: PredictionType;
  score1?: number; // predicted score for team1
  score2?: number; // predicted score for team2
  winnerId?: string; // predicted winner team id (legacy, for winner_only type)
  outcome?: PredictionOutcome; // predicted outcome for 1X2 bets
  manOfTheMatch?: string; // predicted man of the match (player id)
  points?: number; // calculated points for this prediction
  createdAt?: string;
};

export type User = {
  id: string;
  username?: string;
  name: string;
  email?: string;
  avatar?: string;
  instagram?: string;
  language?: 'fr' | 'en'; // User's preferred language, default is 'fr'
  totalPoints: number;
  totalBets: number; // count of all bets made
  exactScores: number; // count of correct exact scores
  winnerOnly: number; // count of correct winner-only predictions
  isAdmin?: boolean;
};

export type Competition = {
  id: string;
  name: string;
  logo?: string;
  startDate: string;
  endDate: string;
};

export type GroupStanding = {
  teamId: string;
  group: 'A' | 'B' | 'C' | 'D';
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
  goalDiff: number; // goalsFor - goalsAgainst, computed
};

export type StandingsByGroup = Record<'A' | 'B' | 'C' | 'D', Array<{
  teamId: string;
  teamName: string;
  logo?: string;
  flag?: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  matchesPlayed: number;
  goalDiff: number;
}>>;
