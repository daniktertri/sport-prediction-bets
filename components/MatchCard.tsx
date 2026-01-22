'use client';

import Link from 'next/link';
import { Match } from '@/types';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import TeamLogo from '@/components/TeamLogo';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const { teams, getUserPredictionForMatch } = useApp();
  const { t } = useLanguage();
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);
  
  if (!team1 || !team2) return null;
  
  const matchDate = new Date(match.date);
  const isFinished = match.status === 'finished';
  const isUpcoming = match.status === 'upcoming';
  const isLive = match.status === 'live';
  const isPast = matchDate < new Date();
  const hasNoScore = isFinished && (match.score1 === undefined || match.score2 === undefined || match.score1 === null || match.score2 === null);
  const isCalculating = (isPast && isUpcoming) || hasNoScore;
  const hasPrediction = getUserPredictionForMatch(match.id) !== undefined;
  
  // Determine winner
  const getWinner = () => {
    if (!isFinished || match.score1 === undefined || match.score2 === undefined) return null;
    if (match.score1 > match.score2) return team1;
    if (match.score2 > match.score1) return team2;
    return 'draw';
  };
  
  const winner = getWinner();
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  if (compact) {
    return (
      <Link href={`/matches/${match.id}`}>
        <div className={`bg-bg-secondary border-b border-border hover:bg-bg-tertiary transition-all duration-200 ${
          isFinished && winner && winner !== 'draw' ? 'border-l-4 border-l-success' : ''
        } ${isLive ? 'border-l-4 border-l-danger animate-pulse' : ''} ${
          isCalculating ? 'border-l-4 border-l-orange-500 bg-orange-500/5' : ''
        }`}>
          <div className="px-4 py-4 flex items-center gap-4">
            {/* Status Badge */}
            <div className={`
              text-xs px-3 py-1.5 rounded font-medium whitespace-nowrap
              ${isCalculating
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                : isFinished 
                ? 'bg-success/10 text-success border border-success/20' 
                : isLive
                ? 'bg-danger/10 text-danger border border-danger/20 animate-pulse'
                : 'bg-bg-tertiary text-text-secondary border border-border'
              }
            `}>
              {isCalculating ? 'Calculating' : isFinished ? 'FT' : isLive ? `🔴 ${t('common.live')}` : formatTime(matchDate)}
            </div>
            
            {/* Teams */}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center gap-3 mb-2 ${
                isFinished && winner === team1 ? 'text-success font-semibold' : ''
              }`}>
                <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="md" />
                <span className={`text-sm font-medium truncate ${
                  isFinished && winner === team1 ? 'text-success' : 'text-text-primary'
                }`}>
                  {team1.name}
                </span>
                {isFinished && match.score1 !== undefined && (
                  <span className={`text-base font-semibold ml-auto ${
                    winner === team1 ? 'text-success' : 'text-text-primary'
                  }`}>
                    {match.score1}
                  </span>
                )}
                {isFinished && winner === team1 && (
                  <span className="text-success text-xs ml-1">🏆</span>
                )}
              </div>
              <div className={`flex items-center gap-3 ${
                isFinished && winner === team2 ? 'text-success font-semibold' : ''
              }`}>
                <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="md" />
                <span className={`text-sm font-medium truncate ${
                  isFinished && winner === team2 ? 'text-success' : 'text-text-primary'
                }`}>
                  {team2.name}
                </span>
                {isFinished && match.score2 !== undefined && (
                  <span className={`text-base font-semibold ml-auto ${
                    winner === team2 ? 'text-success' : 'text-text-primary'
                  }`}>
                    {match.score2}
                  </span>
                )}
                {isFinished && winner === team2 && (
                  <span className="text-success text-xs ml-1">🏆</span>
                )}
              </div>
            </div>
            
            {/* Action */}
            {isUpcoming && !isPast && (
              <div className={`text-xs font-medium whitespace-nowrap ${
                hasPrediction ? 'text-success' : 'text-accent'
              }`}>
                {hasPrediction ? 'Done' : t('common.predict')}
              </div>
            )}
            {isCalculating && (
              <div className="text-xs text-orange-500 font-medium whitespace-nowrap">
                Calculating
              </div>
            )}
            {isFinished && !isCalculating && winner === 'draw' && (
              <div className="text-xs text-text-secondary font-medium whitespace-nowrap">
                {t('common.draw')}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link href={`/matches/${match.id}`}>
      <div className={`bg-bg-secondary border rounded-lg p-5 hover:bg-bg-tertiary transition-all duration-200 cursor-pointer ${
        isCalculating
          ? 'border-orange-500/30 shadow-lg shadow-orange-500/5 bg-orange-500/5'
          : isFinished && winner && winner !== 'draw' 
          ? 'border-success/30 shadow-lg shadow-success/5' 
          : isLive
          ? 'border-danger/30 shadow-lg shadow-danger/5 animate-pulse'
          : 'border-border'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              {match.phase === 'group' ? `${t('common.group')} ${match.group}` : match.phase}
            </span>
          </div>
          <div className={`
            text-xs px-3 py-1.5 rounded font-medium
            ${isCalculating
              ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
              : isFinished 
              ? 'bg-success/10 text-success border border-success/20' 
              : isLive
              ? 'bg-danger/10 text-danger border border-danger/20 animate-pulse'
              : 'bg-bg-tertiary text-text-secondary border border-border'
            }
          `}>
            {isCalculating ? 'Calculating' : isFinished ? t('common.finished') : isLive ? `🔴 ${t('common.live')}` : t('common.upcoming')}
          </div>
        </div>
        
        {/* Teams and Score */}
        <div className="space-y-4 mb-4">
          <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
            isFinished && winner === team1 ? 'bg-success/10 border border-success/20' : ''
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="lg" />
              <span className={`font-semibold ${
                isFinished && winner === team1 ? 'text-success' : 'text-text-primary'
              }`}>
                {team1.name}
              </span>
            </div>
            {isFinished && match.score1 !== undefined && (
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-xl ${
                  winner === team1 ? 'text-success' : 'text-text-primary'
                }`}>
                  {match.score1}
                </span>
                {winner === team1 && <span className="text-success text-lg">🏆</span>}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-text-secondary text-sm">{t('common.vs')}</span>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
            isFinished && winner === team2 ? 'bg-success/10 border border-success/20' : ''
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="lg" />
              <span className={`font-semibold ${
                isFinished && winner === team2 ? 'text-success' : 'text-text-primary'
              }`}>
                {team2.name}
              </span>
            </div>
            {isFinished && match.score2 !== undefined && (
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-xl ${
                  winner === team2 ? 'text-success' : 'text-text-primary'
                }`}>
                  {match.score2}
                </span>
                {winner === team2 && <span className="text-success text-lg">🏆</span>}
              </div>
            )}
          </div>
          
          {isFinished && winner === 'draw' && (
            <div className="text-center py-2">
              <span className="text-text-secondary text-sm font-medium">{t('common.draw')}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-text-secondary">
            {matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(matchDate)}
          </div>
          {isUpcoming && !isPast && (
            <span className={`text-xs font-medium ${
              hasPrediction ? 'text-success' : 'text-accent'
            }`}>
              {hasPrediction ? 'Done' : t('common.predict')}
            </span>
          )}
          {isCalculating && (
            <span className="text-xs font-medium text-orange-500">
              Calculating
            </span>
          )}
          {isFinished && !isCalculating && match.manOfTheMatch && (
            <span className="text-xs text-text-secondary">
              ⭐ MOTM
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
