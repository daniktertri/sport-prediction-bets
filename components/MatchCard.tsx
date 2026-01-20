'use client';

import Link from 'next/link';
import { Match } from '@/types';
import { useApp } from '@/context/AppContext';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const { teams } = useApp();
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);
  
  if (!team1 || !team2) return null;
  
  const matchDate = new Date(match.date);
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';
  const isLive = match.status === 'live';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  if (compact) {
    return (
      <Link href={`/matches/${match.id}`}>
        <div 
          className="glass-card border-b border-white/10 hover:border-accent/50 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="px-4 py-4 flex items-center gap-4">
            {/* Status Badge */}
            <div className={`
              text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap
              ${isFinished 
                ? 'bg-success/20 text-success border border-success/30' 
                : isLive
                ? 'bg-danger/20 text-danger border border-danger/30 animate-pulse'
                : 'bg-accent/20 text-accent border border-accent/30'
              }
            `}>
              {isFinished ? 'FT' : isLive ? 'Live' : formatTime(matchDate)}
            </div>
            
            {/* Teams */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{team1.logo || team1.flag}</span>
                <span className="text-sm font-semibold text-text-primary truncate">{team1.name}</span>
                {isFinished && match.score1 !== undefined && (
                  <span className="text-base font-bold text-text-primary ml-auto">{match.score1}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">{team2.logo || team2.flag}</span>
                <span className="text-sm font-semibold text-text-primary truncate">{team2.name}</span>
                {isFinished && match.score2 !== undefined && (
                  <span className="text-base font-bold text-text-primary ml-auto">{match.score2}</span>
                )}
              </div>
            </div>
            
            {/* Action */}
            {isUpcoming && (
              <div className="text-xs text-accent font-semibold whitespace-nowrap flex items-center gap-1">
                Predict <span className="text-lg">→</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link href={`/matches/${match.id}`}>
      <div 
        className="glass-card rounded-2xl p-5 hover:scale-[1.02] hover:border-white/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              {match.phase === 'group' ? `Group ${match.group}` : match.phase}
            </span>
          </div>
          <div className={`
            text-xs px-3 py-1.5 rounded-full font-semibold
            ${isFinished 
              ? 'bg-success/20 text-success border border-success/30' 
              : isLive
              ? 'bg-danger/20 text-danger border border-danger/30 animate-pulse'
              : 'bg-accent/20 text-accent border border-accent/30'
            }
          `}>
            {isFinished ? 'Finished' : isLive ? 'Live' : 'Upcoming'}
          </div>
        </div>
        
        {/* Teams and Score */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{team1.logo || team1.flag}</span>
              <span className="font-bold text-text-primary">{team1.name}</span>
            </div>
            {isFinished && match.score1 !== undefined && (
              <span className="font-black text-2xl text-text-primary">{match.score1}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{team2.logo || team2.flag}</span>
              <span className="font-bold text-text-primary">{team2.name}</span>
            </div>
            {isFinished && match.score2 !== undefined && (
              <span className="font-black text-2xl text-text-primary">{match.score2}</span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-xs text-text-secondary">
            {matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(matchDate)}
          </div>
          {isUpcoming && (
            <span className="text-xs font-semibold text-accent flex items-center gap-1">
              Predict <span>→</span>
            </span>
          )}
        </div>
        </div>
      </div>
    </Link>
  );
}
