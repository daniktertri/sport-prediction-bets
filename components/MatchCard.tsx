'use client';

import Link from 'next/link';
import { Match } from '@/types';
import { useApp } from '@/context/AppContext';
import TeamLogo from '@/components/TeamLogo';

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
        <div className="bg-bg-secondary border-b border-border hover:bg-bg-tertiary transition-colors duration-200">
          <div className="px-4 py-4 flex items-center gap-4">
            {/* Status Badge */}
            <div className={`
              text-xs px-3 py-1.5 rounded font-medium whitespace-nowrap
              ${isFinished 
                ? 'bg-success/10 text-success border border-success/20' 
                : isLive
                ? 'bg-danger/10 text-danger border border-danger/20'
                : 'bg-bg-tertiary text-text-secondary border border-border'
              }
            `}>
              {isFinished ? 'FT' : isLive ? 'Live' : formatTime(matchDate)}
            </div>
            
            {/* Teams */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="md" />
                <span className="text-sm font-medium text-text-primary truncate">{team1.name}</span>
                {isFinished && match.score1 !== undefined && (
                  <span className="text-base font-semibold text-text-primary ml-auto">{match.score1}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="md" />
                <span className="text-sm font-medium text-text-primary truncate">{team2.name}</span>
                {isFinished && match.score2 !== undefined && (
                  <span className="text-base font-semibold text-text-primary ml-auto">{match.score2}</span>
                )}
              </div>
            </div>
            
            {/* Action */}
            {isUpcoming && (
              <div className="text-xs text-accent font-medium whitespace-nowrap">
                Predict →
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link href={`/matches/${match.id}`}>
      <div className="bg-bg-secondary border border-border rounded-lg p-5 hover:bg-bg-tertiary transition-colors duration-200 cursor-pointer">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              {match.phase === 'group' ? `Group ${match.group}` : match.phase}
            </span>
          </div>
          <div className={`
            text-xs px-3 py-1.5 rounded font-medium
            ${isFinished 
              ? 'bg-success/10 text-success border border-success/20' 
              : isLive
              ? 'bg-danger/10 text-danger border border-danger/20'
              : 'bg-bg-tertiary text-text-secondary border border-border'
            }
          `}>
            {isFinished ? 'Finished' : isLive ? 'Live' : 'Upcoming'}
          </div>
        </div>
        
        {/* Teams and Score */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="lg" />
              <span className="font-semibold text-text-primary">{team1.name}</span>
            </div>
            {isFinished && match.score1 !== undefined && (
              <span className="font-semibold text-xl text-text-primary">{match.score1}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="lg" />
              <span className="font-semibold text-text-primary">{team2.name}</span>
            </div>
            {isFinished && match.score2 !== undefined && (
              <span className="font-semibold text-xl text-text-primary">{match.score2}</span>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-text-secondary">
            {matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(matchDate)}
          </div>
          {isUpcoming && (
            <span className="text-xs font-medium text-accent">
              Predict →
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
