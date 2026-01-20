// Matches page - List all matches grouped by phase
'use client';

import { useState } from 'react';
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
  const { matches } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  
  const matchesByPhase = phaseOrder.map((phase) => ({
    phase,
    label: phaseLabels[phase],
    matches: matches.filter((m) => m.phase === phase),
  }));
  
  const filteredMatches = selectedPhase === 'all' 
    ? matches 
    : matches.filter(m => m.phase === selectedPhase);
  
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Matches</h1>
              <p className="text-sm text-text-secondary mt-1">
                Browse and predict match results
              </p>
            </div>
            
            {/* View Toggle - Mobile Hidden */}
            <div className="hidden sm:flex items-center gap-2 bg-bg-secondary rounded-lg p-1 border border-neon-cyan/20">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-neon-cyan-sm' 
                    : 'text-text-secondary hover:text-neon-cyan'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-neon-cyan-sm' 
                    : 'text-text-secondary hover:text-neon-cyan'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
          
          {/* Phase Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedPhase('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedPhase === 'all'
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-neon-cyan-sm'
                  : 'bg-bg-secondary text-text-secondary hover:text-neon-cyan border border-neon-cyan/20 hover:border-neon-cyan/40 hover:glow-cyan-sm'
              }`}
            >
              All
            </button>
            {matchesByPhase.map(({ phase, label }) => {
              const count = matches.filter(m => m.phase === phase).length;
              if (count === 0) return null;
              return (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedPhase === phase
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-green text-bg-primary shadow-neon-cyan-sm'
                      : 'bg-bg-secondary text-text-secondary hover:text-neon-cyan border border-neon-cyan/20 hover:border-neon-cyan/40 hover:glow-cyan-sm'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Matches Display */}
        {viewMode === 'list' ? (
          <Card padding="none" className="overflow-hidden">
            <div className="divide-y divide-bg-tertiary">
              {filteredMatches
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((match) => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
