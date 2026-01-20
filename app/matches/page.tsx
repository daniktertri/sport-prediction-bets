// Matches page - List all matches grouped by phase
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import MatchCard from '@/components/MatchCard';
import Card from '@/components/ui/Card';

const phaseOrder: Array<'group' | 'round16' | 'quarter' | 'semi' | 'final'> = [
  'group',
  'round16',
  'quarter',
  'semi',
  'final',
];

const phaseLabels: Record<string, string> = {
  group: 'Group Stage',
  round16: 'Round of 16',
  quarter: 'Quarter Finals',
  semi: 'Semi Finals',
  final: 'Final',
};

export default function MatchesPage() {
  const { matches, refreshData } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  const matchesByPhase = phaseOrder.map((phase) => ({
    phase,
    label: phaseLabels[phase],
    matches: matches.filter((m) => m.phase === phase),
  }));
  
  // Separate matches by status
  const { upcomingMatches, pastMatches, liveMatches } = useMemo(() => {
    const now = new Date();
    return {
      upcomingMatches: matches.filter(m => m.status === 'upcoming' || (m.status !== 'finished' && new Date(m.date) > now)),
      pastMatches: matches.filter(m => m.status === 'finished'),
      liveMatches: matches.filter(m => m.status === 'live'),
    };
  }, [matches]);
  
  // Filter matches based on time filter
  const timeFilteredMatches = useMemo(() => {
    if (timeFilter === 'upcoming') return upcomingMatches;
    if (timeFilter === 'past') return pastMatches;
    return matches;
  }, [timeFilter, matches, upcomingMatches, pastMatches]);
  
  // Then filter by phase
  const filteredMatches = selectedPhase === 'all' 
    ? timeFilteredMatches 
    : timeFilteredMatches.filter(m => m.phase === selectedPhase);
  
  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">Matches</h1>
              <p className="text-sm text-text-secondary mt-1">
                Browse and predict match results
              </p>
            </div>
            
            {/* View Toggle - Mobile Hidden */}
            <div className="hidden sm:flex items-center gap-2 bg-bg-secondary rounded-lg p-1 border border-border">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-accent text-white' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-accent text-white' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
          
          {/* Time Filter - Upcoming/Past/All */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                timeFilter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
              }`}
            >
              All ({matches.length})
            </button>
            <button
              onClick={() => setTimeFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                timeFilter === 'upcoming'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
              }`}
            >
              Upcoming ({upcomingMatches.length})
            </button>
            <button
              onClick={() => setTimeFilter('past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                timeFilter === 'past'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
              }`}
            >
              Past ({pastMatches.length})
            </button>
            {liveMatches.length > 0 && (
              <button
                onClick={() => setTimeFilter('all')}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 bg-danger/20 text-danger border border-danger/30 animate-pulse"
              >
                🔴 Live ({liveMatches.length})
              </button>
            )}
          </div>
          
          {/* Phase Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedPhase === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
              }`}
            >
              All Phases
            </button>
            {matchesByPhase.map(({ phase, label }) => {
              const count = timeFilteredMatches.filter(m => m.phase === phase).length;
              if (count === 0) return null;
              return (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedPhase === phase
                      ? 'bg-accent text-white'
                      : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Matches Display */}
        {filteredMatches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No matches found for the selected filters.</p>
          </Card>
        ) : viewMode === 'list' ? (
          <Card padding="none" className="overflow-hidden">
            <div className="divide-y divide-border">
              {filteredMatches
                .sort((a, b) => {
                  // Sort: live first, then upcoming by date, then past by date (recent first)
                  if (a.status === 'live' && b.status !== 'live') return -1;
                  if (b.status === 'live' && a.status !== 'live') return 1;
                  if (a.status === 'upcoming' && b.status === 'finished') return -1;
                  if (b.status === 'upcoming' && a.status === 'finished') return 1;
                  const dateA = new Date(a.date).getTime();
                  const dateB = new Date(b.date).getTime();
                  return a.status === 'finished' ? dateB - dateA : dateA - dateB;
                })
                .map((match) => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches
              .sort((a, b) => {
                // Sort: live first, then upcoming by date, then past by date (recent first)
                if (a.status === 'live' && b.status !== 'live') return -1;
                if (b.status === 'live' && a.status !== 'live') return 1;
                if (a.status === 'upcoming' && b.status === 'finished') return -1;
                if (b.status === 'upcoming' && a.status === 'finished') return 1;
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return a.status === 'finished' ? dateB - dateA : dateA - dateB;
              })
              .map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
