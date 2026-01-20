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
          className="glass-card border-b border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 hover:glow-cyan-sm"
          style={{
            background: 'rgba(18, 19, 26, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="px-4 py-4 flex items-center gap-4">
            {/* Status Badge */}
            <div className={`
              text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap
              ${isFinished 
                ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 shadow-neon-green-sm' 
                : isLive
                ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse shadow-[0_0_10px_rgba(255,77,77,0.5)]'
                : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan-sm'
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
                  <span className="text-base font-bold text-neon-cyan ml-auto">{match.score1}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">{team2.logo || team2.flag}</span>
                <span className="text-sm font-semibold text-text-primary truncate">{team2.name}</span>
                {isFinished && match.score2 !== undefined && (
                  <span className="text-base font-bold text-neon-cyan ml-auto">{match.score2}</span>
                )}
              </div>
            </div>
            
            {/* Action */}
            {isUpcoming && (
              <div className="text-xs text-neon-cyan font-semibold whitespace-nowrap flex items-center gap-1 group-hover:text-neon-green transition-colors">
                Predict <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
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
        className="glass-card rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden group"
        style={{
          background: 'rgba(18, 19, 26, 0.7)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-green/5 pointer-events-none group-hover:from-neon-cyan/10 group-hover:to-neon-green/10 transition-opacity" />
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
              ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 shadow-neon-green-sm' 
              : isLive
              ? 'bg-danger/20 text-danger border border-danger/40 animate-pulse shadow-[0_0_10px_rgba(255,77,77,0.5)]'
              : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-neon-cyan-sm'
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
              <span className="font-black text-2xl text-neon-cyan">{match.score1}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-3xl">{team2.logo || team2.flag}</span>
              <span className="font-bold text-text-primary">{team2.name}</span>
            </div>
            {isFinished && match.score2 !== undefined && (
              <span className="font-black text-2xl text-neon-cyan">{match.score2}</span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
          <div className="text-xs text-text-secondary">
            {matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(matchDate)}
          </div>
          {isUpcoming && (
            <span className="text-xs font-semibold text-neon-cyan flex items-center gap-1 group-hover:text-neon-green transition-colors">
              Predict <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          )}
        </div>
        </div>
      </div>
    </Link>
  );
}
