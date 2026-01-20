// Match detail page - Show match details and prediction form
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { calculatePotentialPoints } from '@/utils/scoring';
import { getPlayersByTeam } from '@/mocks/teams';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  
  const { matches, teams, getUserPredictionForMatch, addPrediction, currentUser } = useApp();
  const match = matches.find((m) => m.id === matchId);
  const existingPrediction = getUserPredictionForMatch(matchId);
  
  const [predictionType, setPredictionType] = useState<'exact_score' | 'winner_only'>(
    existingPrediction?.type || 'exact_score'
  );
  const [score1, setScore1] = useState<string>(existingPrediction?.score1?.toString() || '');
  const [score2, setScore2] = useState<string>(existingPrediction?.score2?.toString() || '');
  const [winnerId, setWinnerId] = useState<string>(existingPrediction?.winnerId || '');
  const [manOfTheMatch, setManOfTheMatch] = useState<string>(existingPrediction?.manOfTheMatch || '');
  const [submitted, setSubmitted] = useState(false);
  
  if (!match) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-text-primary">Match not found</h1>
          <Button onClick={() => router.push('/matches')}>Back to Matches</Button>
        </div>
      </div>
    );
  }
  
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);
  
  if (!team1 || !team2) return null;
  
  const isFinished = match.status === 'finished';
  const matchDate = new Date(match.date);
  const hasManOfTheMatch = manOfTheMatch.trim().length > 0;
  const potentialPoints = calculatePotentialPoints(predictionType, hasManOfTheMatch);
  
  const team1Players = getPlayersByTeam(team1.id);
  const team2Players = getPlayersByTeam(team2.id);
  const allPlayers = [...team1Players, ...team2Players];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (new Date(match.date) < new Date()) {
      alert('This match has already started. Predictions are closed.');
      return;
    }
    
    if (predictionType === 'exact_score') {
      if (!score1 || !score2) {
        alert('Please enter both scores');
        return;
      }
      addPrediction({
        userId: currentUser?.id || '',
        matchId: match.id,
        type: 'exact_score',
        score1: parseInt(score1),
        score2: parseInt(score2),
        manOfTheMatch: manOfTheMatch || undefined,
      });
    } else {
      if (!winnerId) {
        alert('Please select a winner');
        return;
      }
      addPrediction({
        userId: currentUser?.id || '',
        matchId: match.id,
        type: 'winner_only',
        winnerId,
        manOfTheMatch: manOfTheMatch || undefined,
      });
    }
    
    setSubmitted(true);
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
              {match.phase === 'group' ? `Group ${match.group}` : match.phase}
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-6">
            {/* Team 1 */}
            <div className="text-center flex-1">
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">{team1.logo || team1.flag}</div>
              <div className="text-lg sm:text-xl font-bold text-text-primary">{team1.name}</div>
              {isFinished && match.score1 !== undefined && (
                <div className="text-3xl sm:text-4xl font-bold mt-2 text-text-primary">{match.score1}</div>
              )}
            </div>
            
            <div className="text-xl sm:text-2xl text-text-secondary">vs</div>
            
            {/* Team 2 */}
            <div className="text-center flex-1">
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">{team2.logo || team2.flag}</div>
              <div className="text-lg sm:text-xl font-bold text-text-primary">{team2.name}</div>
              {isFinished && match.score2 !== undefined && (
                <div className="text-3xl sm:text-4xl font-bold mt-2 text-text-primary">{match.score2}</div>
              )}
            </div>
          </div>
          
          <div className="text-center border-t border-bg-tertiary pt-3 sm:pt-4">
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
                <span className="text-text-secondary">MOTM: </span>
                <span className="font-semibold text-text-primary">
                  {allPlayers.find(p => p.id === match.manOfTheMatch)?.name || match.manOfTheMatch}
                </span>
              </div>
            )}
          </div>
        </Card>
        
        {/* Prediction Form */}
        {!isFinished && (
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-text-primary">Make Your Prediction</h2>
            
            {submitted ? (
              <div className="bg-success/20 border border-success/50 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-success font-semibold text-base sm:text-lg">
                  ✅ Prediction submitted successfully!
                </p>
                <p className="text-success/80 text-xs sm:text-sm mt-2">Redirecting to matches...</p>
              </div>
            ) : existingPrediction ? (
              <div className="bg-accent/20 border border-accent/50 rounded-lg p-4 sm:p-6">
                <p className="text-accent font-semibold mb-3 text-sm sm:text-base">
                  You already have a prediction for this match
                </p>
                {existingPrediction.type === 'exact_score' && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    Score: {existingPrediction.score1} - {existingPrediction.score2}
                  </p>
                )}
                {existingPrediction.winnerId && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    Winner: {teams.find(t => t.id === existingPrediction.winnerId)?.name}
                  </p>
                )}
                {existingPrediction.manOfTheMatch && (
                  <p className="text-xs sm:text-sm text-text-secondary">
                    MOTM: {allPlayers.find(p => p.id === existingPrediction.manOfTheMatch)?.name}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Prediction Type Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-text-primary">
                    Prediction Type
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => setPredictionType('exact_score')}
                      className={`
                        p-3 sm:p-4 rounded-lg border-2 transition-all text-left
                        ${predictionType === 'exact_score'
                          ? 'border-accent bg-accent/10'
                          : 'border-bg-tertiary hover:border-accent/50'
                        }
                      `}
                    >
                      <div className="font-semibold text-text-primary text-sm sm:text-base">Exact Score</div>
                      <div className="text-xs sm:text-sm text-accent mt-1">+10 points</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPredictionType('winner_only')}
                      className={`
                        p-3 sm:p-4 rounded-lg border-2 transition-all text-left
                        ${predictionType === 'winner_only'
                          ? 'border-accent bg-accent/10'
                          : 'border-bg-tertiary hover:border-accent/50'
                        }
                      `}
                    >
                      <div className="font-semibold text-text-primary text-sm sm:text-base">Winner Only</div>
                      <div className="text-xs sm:text-sm text-accent mt-1">+3 points</div>
                    </button>
                  </div>
                </div>
                
                {/* Exact Score Form */}
                {predictionType === 'exact_score' && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                        {team1.name} Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score1}
                        onChange={(e) => setScore1(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-bg-tertiary rounded-lg bg-bg-secondary text-text-primary focus:border-accent focus:outline-none text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                        {team2.name} Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={score2}
                        onChange={(e) => setScore2(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 border border-bg-tertiary rounded-lg bg-bg-secondary text-text-primary focus:border-accent focus:outline-none text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Winner Only Form */}
                {predictionType === 'winner_only' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                      Predicted Winner
                    </label>
                    <select
                      value={winnerId}
                      onChange={(e) => setWinnerId(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-bg-tertiary rounded-lg bg-bg-secondary text-text-primary focus:border-accent focus:outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">Select winner</option>
                      <option value={team1.id}>{team1.name}</option>
                      <option value={team2.id}>{team2.name}</option>
                    </select>
                  </div>
                )}
                
                {/* Man of the Match */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-text-primary">
                    Man of the Match <span className="text-text-secondary">(Optional, +3 pts)</span>
                  </label>
                  <select
                    value={manOfTheMatch}
                    onChange={(e) => setManOfTheMatch(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-bg-tertiary rounded-lg bg-bg-secondary text-text-primary focus:border-accent focus:outline-none text-sm sm:text-base"
                  >
                    <option value="">Select player</option>
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
                <div className="bg-warning/20 border border-warning/50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-warning">
                    <span className="font-semibold">Potential Points:</span> {potentialPoints} points
                  </p>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Submit Prediction
                </Button>
              </form>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
