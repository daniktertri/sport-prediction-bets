// Match detail page - Show match details and prediction form
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
import { calculatePotentialPoints } from '@/utils/scoring';
export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  
  const { matches, teams, getUserPredictionForMatch, addPrediction, currentUser, refreshData } = useApp();
  const { t } = useLanguage();
  const match = matches.find((m) => m.id === matchId);
  const existingPrediction = getUserPredictionForMatch(matchId);
  
  const [predictionType, setPredictionType] = useState<'exact_score' | 'winner_only'>(
    existingPrediction?.type || 'exact_score'
  );
  const [score1, setScore1] = useState<string>(existingPrediction?.score1?.toString() || '');
  const [score2, setScore2] = useState<string>(existingPrediction?.score2?.toString() || '');
  const [outcome, setOutcome] = useState<'team1' | 'team2' | 'draw' | ''>(
    existingPrediction?.outcome
      ? existingPrediction.outcome
      : existingPrediction?.winnerId === (teams.find(t => t.id === match?.team1Id)?.id)
      ? 'team1'
      : existingPrediction?.winnerId === (teams.find(t => t.id === match?.team2Id)?.id)
      ? 'team2'
      : ''
  );
  const [manOfTheMatch, setManOfTheMatch] = useState<string>(existingPrediction?.manOfTheMatch || '');
  const [submitted, setSubmitted] = useState(false);
  const [team1Players, setTeam1Players] = useState<any[]>([]);
  const [team2Players, setTeam2Players] = useState<any[]>([]);
  const [outcomeStats, setOutcomeStats] = useState<{
    total: number;
    team1: number;
    team2: number;
    draw: number;
  } | null>(null);
  
  const team1 = teams.find(t => t.id === match?.team1Id);
  const team2 = teams.find(t => t.id === match?.team2Id);
  
  useEffect(() => {
    if (team1?.id) {
      fetch(`/api/players?teamId=${team1.id}`)
        .then(res => res.json())
        .then(data => setTeam1Players(data || []));
    }
    if (team2?.id) {
      fetch(`/api/players?teamId=${team2.id}`)
        .then(res => res.json())
        .then(data => setTeam2Players(data || []));
    }
  }, [team1?.id, team2?.id]);

  useEffect(() => {
    if (!match) return;
    fetch(`/api/predictions/stats?matchId=${match.id}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) {
          setOutcomeStats(data);
        } else {
          setOutcomeStats(null);
        }
      })
      .catch(() => {
        setOutcomeStats(null);
      });
  }, [match?.id]);
  
  if (!match) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">{t('matchDetail.notFound')}</h1>
          <Button onClick={() => router.push('/matches')}>{t('matchDetail.backToMatches')}</Button>
        </div>
      </div>
    );
  }
  
  if (!team1 || !team2) return null;
  
  const isFinished = match.status === 'finished';
  const matchDate = new Date(match.date);
  const hasManOfTheMatch = manOfTheMatch.trim().length > 0;
  const potentialPoints = calculatePotentialPoints(predictionType, hasManOfTheMatch);
  
  const allPlayers = [...team1Players, ...team2Players];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (new Date(match.date) < new Date()) {
      alert(t('matchDetail.matchStarted'));
      return;
    }
    
    if (predictionType === 'exact_score') {
      if (!score1 || !score2) {
        alert(t('matchDetail.enterBothScores'));
        return;
      }
      await addPrediction({
        userId: currentUser?.id || '',
        matchId: match.id,
        type: 'exact_score',
        score1: parseInt(score1),
        score2: parseInt(score2),
        manOfTheMatch: manOfTheMatch || undefined,
      });
    } else {
      if (!outcome) {
        alert(t('matchDetail.selectWinner'));
        return;
      }
      await addPrediction({
        userId: currentUser?.id || '',
        matchId: match.id,
        type: 'winner_only',
        outcome,
        manOfTheMatch: manOfTheMatch || undefined,
      });
    }
    
    setSubmitted(true);
    // Refresh data after prediction
    await refreshData();
    setTimeout(() => {
      router.push('/matches');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Match Header */}
        <Card className="p-6 sm:p-8 mb-6">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wide">
              {match.phase === 'group' ? `${t('common.group')} ${match.group}` : match.phase}
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
            {/* Team 1 */}
            <div className="text-center flex-1">
              <div className="mb-2 sm:mb-3 flex justify-center">
                <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="xl" />
              </div>
              <div className="text-lg sm:text-xl font-semibold text-text-primary">{team1.name}</div>
              {isFinished && match.score1 !== undefined && (
                <div className="text-3xl sm:text-4xl font-semibold mt-2 text-text-primary">{match.score1}</div>
              )}
            </div>
            
            <div className="text-xl sm:text-2xl text-text-secondary">{t('common.vs')}</div>
            
            {/* Team 2 */}
            <div className="text-center flex-1">
              <div className="mb-2 sm:mb-3 flex justify-center">
                <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="xl" />
              </div>
              <div className="text-lg sm:text-xl font-semibold text-text-primary">{team2.name}</div>
              {isFinished && match.score2 !== undefined && (
                <div className="text-3xl sm:text-4xl font-semibold mt-2 text-text-primary">{match.score2}</div>
              )}
            </div>
          </div>
          
          <div className="text-center border-t border-border pt-3 sm:pt-4">
            <div className="text-xs sm:text-sm text-text-secondary">
              {matchDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {isFinished && match.manOfTheMatch && (
              <div className="mt-2 text-xs sm:text-sm">
                <span className="text-text-secondary">{t('matchDetail.motm')}: </span>
                <span className="font-medium text-text-primary">
                  {allPlayers.find(p => p.id === match.manOfTheMatch)?.name || match.manOfTheMatch}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Outcome Distribution (win/draw/lose) */}
        {outcomeStats && (
          <Card className="p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                {t('matchDetail.betDistribution')}
              </h3>
              <span className="text-xs text-text-secondary">
                {t('common.total')}: {outcomeStats.total}
              </span>
            </div>
            {outcomeStats.total === 0 ? (
              <p className="text-xs sm:text-sm text-text-secondary">
                {t('matchDetail.noBetsYet')}
              </p>
            ) : (
              <>
                {(() => {
                  const total = outcomeStats.total || 1;
                  const team1Pct = Math.round((outcomeStats.team1 / total) * 100);
                  const drawPct = Math.round((outcomeStats.draw / total) * 100);
                  const team2Pct = 100 - team1Pct - drawPct;
                  return (
                    <>
                      <div className="h-3 w-full rounded-full bg-bg-secondary overflow-hidden flex">
                        <div
                          className="h-full bg-success"
                          style={{ width: `${team1Pct}%` }}
                        />
                        <div
                          className="h-full bg-text-secondary/40"
                          style={{ width: `${drawPct}%` }}
                        />
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${team2Pct}%` }}
                        />
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm">
                        <div className="text-left">
                          <div className="font-medium text-text-primary truncate">
                            {team1.name}
                          </div>
                          <div className="text-text-secondary">
                            {team1Pct}% ({outcomeStats.team1})
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-text-primary">
                            {t('common.draw')}
                          </div>
                          <div className="text-text-secondary">
                            {drawPct}% ({outcomeStats.draw})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-text-primary truncate">
                            {team2.name}
                          </div>
                          <div className="text-text-secondary">
                            {team2Pct}% ({outcomeStats.team2})
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </Card>
        )}
        
        {/* Prediction Form */}
        {!isFinished && (
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-text-primary">{t('matchDetail.makePrediction')}</h2>
            
            {!currentUser ? (
              <div className="bg-bg-secondary border border-border rounded-lg p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-text-primary">{t('matchDetail.loginRequired')}</h3>
                <p className="text-sm sm:text-base text-text-secondary mb-6">
                  {t('matchDetail.loginToPredict')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/login">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      {t('common.register')}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : submitted ? (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-success font-medium text-base sm:text-lg">
                  ✓ {t('matchDetail.predictionSubmitted')}
                </p>
                <p className="text-text-secondary text-xs sm:text-sm mt-2">{t('matchDetail.redirecting')}</p>
              </div>
            ) : existingPrediction ? (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 sm:p-6 text-center">
                <div className="mb-3">
                  <span className="text-success font-semibold text-base sm:text-lg">
                    ✓ Done
                  </span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm mb-3">
                  {t('matchDetail.existingPrediction')}
                </p>
                {existingPrediction.type === 'exact_score' && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    {t('matchDetail.score')}: <span className="text-accent font-medium">{existingPrediction.score1} - {existingPrediction.score2}</span>
                  </p>
                )}
                {existingPrediction.type === 'winner_only' && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    {t('matchDetail.winner')}:{' '}
                    <span className="text-accent font-medium">
                      {existingPrediction.outcome === 'team1'
                        ? team1.name
                        : existingPrediction.outcome === 'team2'
                        ? team2.name
                        : existingPrediction.outcome === 'draw'
                        ? t('common.draw')
                        : existingPrediction.winnerId
                        ? teams.find(t => t.id === existingPrediction.winnerId)?.name
                        : ''}
                    </span>
                  </p>
                )}
                {existingPrediction.manOfTheMatch && (
                  <p className="text-xs sm:text-sm text-text-secondary">
                    {t('matchDetail.motm')}: <span className="text-accent font-medium">{allPlayers.find(p => p.id === existingPrediction.manOfTheMatch)?.name}</span>
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Prediction Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-text-primary">
                    {t('matchDetail.predictionType')}
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setPredictionType('exact_score')}
                      className={`
                        p-3 sm:p-4 rounded-lg border transition-colors duration-200 text-left
                        ${predictionType === 'exact_score'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent hover:bg-accent/5'
                        }
                      `}
                    >
                      <div className="font-medium text-text-primary text-sm sm:text-base">{t('matchDetail.exactScore')}</div>
                      <div className={`text-xs sm:text-sm mt-1 font-medium ${predictionType === 'exact_score' ? 'text-accent' : 'text-text-secondary'}`}>
                        {t('matchDetail.points10')}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPredictionType('winner_only')}
                      className={`
                        p-3 sm:p-4 rounded-lg border transition-colors duration-200 text-left
                        ${predictionType === 'winner_only'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent hover:bg-accent/5'
                        }
                      `}
                    >
                      <div className="font-medium text-text-primary text-sm sm:text-base">{t('matchDetail.winnerOnly')}</div>
                      <div className={`text-xs sm:text-sm mt-1 font-medium ${predictionType === 'winner_only' ? 'text-accent' : 'text-text-secondary'}`}>
                        {t('matchDetail.points3')}
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Exact Score Form */}
                {predictionType === 'exact_score' && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                        {team1.name} {t('matchDetail.teamScore')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score1}
                        onChange={(e) => setScore1(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                        {team2.name} {t('matchDetail.teamScore')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score2}
                        onChange={(e) => setScore2(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Winner Only Form */}
                {predictionType === 'winner_only' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                      {t('matchDetail.predictedWinner')}
                    </label>
                    <select
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value as any)}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
                      required
                    >
                      <option value="">{t('matchDetail.selectWinner')}</option>
                      <option value="team1">{team1.name}</option>
                      <option value="draw">{t('common.draw')}</option>
                      <option value="team2">{team2.name}</option>
                    </select>
                  </div>
                )}
                
                {/* Man of the Match */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                    {t('matchDetail.manOfTheMatch')} <span className="text-text-secondary">{t('matchDetail.optional3pts')}</span>
                  </label>
                  <select
                    value={manOfTheMatch}
                    onChange={(e) => setManOfTheMatch(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
                  >
                    <option value="">{t('matchDetail.selectPlayer')}</option>
                    {team1Players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({team1.name})
                      </option>
                    ))}
                    {team2Players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} ({team2.name})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Potential Points Display */}
                <div className={`rounded-lg p-3 sm:p-4 border ${
                  potentialPoints >= 13 
                    ? 'bg-success/10 border-success/20' 
                    : potentialPoints >= 6
                    ? 'bg-accent/10 border-accent/20'
                    : 'bg-bg-secondary border-border'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    potentialPoints >= 13 
                      ? 'text-success' 
                      : potentialPoints >= 6
                      ? 'text-accent'
                      : 'text-text-secondary'
                  }`}>
                    <span>{t('matchDetail.potentialPoints')}:</span> <span className="text-lg">{potentialPoints}</span> {t('common.points')}
                  </p>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  {t('matchDetail.submitPrediction')}
                </Button>
              </form>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
