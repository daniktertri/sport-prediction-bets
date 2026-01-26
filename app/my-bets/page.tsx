// My Bets page - Show all user predictions
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import TeamLogo from '@/components/TeamLogo';

export default function MyBetsPage() {
  const router = useRouter();
  const { predictions, matches, teams, currentUser, loading, refreshData } = useApp();
  const { t } = useLanguage();

  // Refresh data when page loads
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [loading, currentUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-secondary">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Sort predictions by match date (most recent first)
  const sortedPredictions = [...predictions].sort((a, b) => {
    const matchA = matches.find(m => m.id === a.matchId);
    const matchB = matches.find(m => m.id === b.matchId);
    if (!matchA || !matchB) return 0;
    return new Date(matchB.date).getTime() - new Date(matchA.date).getTime();
  });

  const getOutcomeLabel = (prediction: any, match: any, team1: any, team2: any) => {
    if (prediction.type === 'exact_score') {
      return `${prediction.score1} - ${prediction.score2}`;
    }
    if (prediction.outcome === 'team1') return team1?.name;
    if (prediction.outcome === 'team2') return team2?.name;
    if (prediction.outcome === 'draw') return t('common.draw');
    // Legacy: use winnerId
    if (prediction.winnerId === team1?.id) return team1?.name;
    if (prediction.winnerId === team2?.id) return team2?.name;
    return '-';
  };

  const getActualResult = (match: any) => {
    if (match.status !== 'finished' || match.score1 === undefined || match.score1 === null) {
      return null;
    }
    return `${match.score1} - ${match.score2}`;
  };

  const getResultStatus = (prediction: any, match: any) => {
    if (match.status !== 'finished' || match.score1 === undefined || match.score1 === null) {
      return 'pending';
    }
    if (prediction.points > 0) {
      return 'won';
    }
    return 'lost';
  };

  // Stats
  const totalBets = predictions.length;
  const finishedBets = predictions.filter(p => {
    const match = matches.find(m => m.id === p.matchId);
    return match?.status === 'finished';
  }).length;
  const totalPoints = predictions.reduce((sum, p) => sum + (p.points || 0), 0);
  const wonBets = predictions.filter(p => (p.points || 0) > 0).length;

  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-text-primary">
            {t('myBets.title')}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            {t('myBets.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-semibold text-text-primary">{totalBets}</div>
            <div className="text-xs sm:text-sm text-text-secondary">{t('myBets.totalBets')}</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-semibold text-success">{wonBets}</div>
            <div className="text-xs sm:text-sm text-text-secondary">{t('myBets.won')}</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-semibold text-text-primary">{finishedBets - wonBets}</div>
            <div className="text-xs sm:text-sm text-text-secondary">{t('myBets.lost')}</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl sm:text-3xl font-semibold text-accent">{totalPoints}</div>
            <div className="text-xs sm:text-sm text-text-secondary">{t('common.points')}</div>
          </Card>
        </div>

        {/* Bets List */}
        {sortedPredictions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-text-secondary mb-4">{t('myBets.noBets')}</p>
            <Link href="/matches">
              <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                {t('myBets.browsMatches')}
              </button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedPredictions.map((prediction) => {
              const match = matches.find(m => m.id === prediction.matchId);
              if (!match) return null;

              const team1 = teams.find(t => t.id === match.team1Id);
              const team2 = teams.find(t => t.id === match.team2Id);
              if (!team1 || !team2) return null;

              const resultStatus = getResultStatus(prediction, match);
              const actualResult = getActualResult(match);
              const matchDate = new Date(match.date);

              return (
                <Link key={prediction.id} href={`/matches/${match.id}`}>
                  <Card 
                    className={`hover:bg-bg-tertiary transition-colors cursor-pointer ${
                      resultStatus === 'won' 
                        ? 'border-success/30' 
                        : resultStatus === 'lost' 
                        ? 'border-danger/30' 
                        : ''
                    }`}
                    hover
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={`
                            w-1.5 h-10 rounded-full flex-shrink-0
                            ${resultStatus === 'won' ? 'bg-success' : ''}
                            ${resultStatus === 'lost' ? 'bg-danger' : ''}
                            ${resultStatus === 'pending' ? 'bg-text-secondary/30' : ''}
                          `} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="sm" />
                              <span className="text-sm font-medium text-text-primary truncate">{team1.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="sm" />
                              <span className="text-sm font-medium text-text-primary truncate">{team2.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`
                          text-right flex-shrink-0
                          ${resultStatus === 'won' ? 'text-success' : ''}
                          ${resultStatus === 'lost' ? 'text-danger' : ''}
                          ${resultStatus === 'pending' ? 'text-text-secondary' : ''}
                        `}>
                          <div className="text-xl font-semibold">
                            {resultStatus === 'pending' ? '-' : `+${prediction.points || 0}`}
                          </div>
                          <div className="text-[10px]">{t('common.points')}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-border/50 pt-2 mt-2">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <span>{matchDate.toLocaleDateString()}</span>
                          <span className={`
                            px-1.5 py-0.5 rounded
                            ${match.status === 'finished' ? 'bg-success/10 text-success' : ''}
                            ${match.status === 'upcoming' ? 'bg-bg-tertiary text-text-secondary' : ''}
                            ${match.status === 'live' ? 'bg-danger/10 text-danger' : ''}
                          `}>
                            {match.status === 'finished' ? t('common.finished') : 
                             match.status === 'live' ? t('common.live') : t('common.upcoming')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-text-secondary">
                            {prediction.type === 'exact_score' ? t('matchDetail.exactScore') : t('matchDetail.winnerOnly')}:
                          </span>{' '}
                          <span className="font-medium text-text-primary">
                            {getOutcomeLabel(prediction, match, team1, team2)}
                          </span>
                          {actualResult && (
                            <span className="text-text-secondary ml-2">
                              ({actualResult})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center gap-4">
                      {/* Status indicator */}
                      <div className={`
                        w-2 h-12 rounded-full flex-shrink-0
                        ${resultStatus === 'won' ? 'bg-success' : ''}
                        ${resultStatus === 'lost' ? 'bg-danger' : ''}
                        ${resultStatus === 'pending' ? 'bg-text-secondary/30' : ''}
                      `} />

                      {/* Teams */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="sm" />
                          <span className="text-sm font-medium text-text-primary truncate">{team1.name}</span>
                          <span className="text-text-secondary text-xs">vs</span>
                          <span className="text-sm font-medium text-text-primary truncate">{team2.name}</span>
                          <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="sm" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <span>{matchDate.toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={`
                            px-1.5 py-0.5 rounded text-xs
                            ${match.status === 'finished' ? 'bg-success/10 text-success' : ''}
                            ${match.status === 'upcoming' ? 'bg-bg-tertiary text-text-secondary' : ''}
                            ${match.status === 'live' ? 'bg-danger/10 text-danger' : ''}
                          `}>
                            {match.status === 'finished' ? t('common.finished') : 
                             match.status === 'live' ? t('common.live') : t('common.upcoming')}
                          </span>
                        </div>
                      </div>

                      {/* Prediction & Result */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-text-secondary mb-0.5">
                          {prediction.type === 'exact_score' ? t('matchDetail.exactScore') : t('matchDetail.winnerOnly')}
                        </div>
                        <div className="text-sm font-medium text-text-primary">
                          {getOutcomeLabel(prediction, match, team1, team2)}
                        </div>
                        {actualResult && (
                          <div className="text-xs text-text-secondary mt-0.5">
                            {t('myBets.result')}: {actualResult}
                          </div>
                        )}
                      </div>

                      {/* Points */}
                      <div className={`
                        text-right flex-shrink-0 min-w-[50px]
                        ${resultStatus === 'won' ? 'text-success' : ''}
                        ${resultStatus === 'lost' ? 'text-danger' : ''}
                        ${resultStatus === 'pending' ? 'text-text-secondary' : ''}
                      `}>
                        <div className="text-lg font-semibold">
                          {resultStatus === 'pending' ? '-' : `+${prediction.points || 0}`}
                        </div>
                        <div className="text-xs">{t('common.points')}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
