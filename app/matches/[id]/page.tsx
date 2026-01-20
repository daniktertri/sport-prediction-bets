// Match detail page - Show match details and prediction form
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
import { calculatePotentialPoints } from '@/utils/scoring';
export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;
  
  const { matches, teams, getUserPredictionForMatch, addPrediction, currentUser, refreshData } = useApp();
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
  const [team1Players, setTeam1Players] = useState<any[]>([]);
  const [team2Players, setTeam2Players] = useState<any[]>([]);
  
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
  
  if (!match) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">Match not found</h1>
          <Button onClick={() => router.push('/matches')}>Back to Matches</Button>
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
    
    if (new Date(match.date) < new Date()) {
      alert('This match has already started. Predictions are closed.');
      return;
    }
    
    if (predictionType === 'exact_score') {
      if (!score1 || !score2) {
        alert('Please enter both scores');
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
      if (!winnerId) {
        alert('Please select a winner');
        return;
      }
      await addPrediction({
        userId: currentUser?.id || '',
        matchId: match.id,
        type: 'winner_only',
        winnerId,
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
              {match.phase === 'group' ? `Group ${match.group}` : match.phase}
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
            
            <div className="text-xl sm:text-2xl text-text-secondary">vs</div>
            
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
                <span className="text-text-secondary">MOTM: </span>
                <span className="font-medium text-text-primary">
                  {allPlayers.find(p => p.id === match.manOfTheMatch)?.name || match.manOfTheMatch}
                </span>
              </div>
            )}
          </div>
        </Card>
        
        {/* Prediction Form */}
        {!isFinished && (
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-text-primary">Make Your Prediction</h2>
            
            {submitted ? (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 sm:p-6 text-center">
                <p className="text-success font-medium text-base sm:text-lg">
                  ✓ Prediction submitted successfully!
                </p>
                <p className="text-text-secondary text-xs sm:text-sm mt-2">Redirecting to matches...</p>
              </div>
            ) : existingPrediction ? (
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 sm:p-6">
                <p className="text-accent font-medium mb-3 text-sm sm:text-base">
                  You already have a prediction for this match
                </p>
                {existingPrediction.type === 'exact_score' && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    Score: <span className="text-accent font-medium">{existingPrediction.score1} - {existingPrediction.score2}</span>
                  </p>
                )}
                {existingPrediction.winnerId && (
                  <p className="text-xs sm:text-sm text-text-secondary mb-1">
                    Winner: <span className="text-accent font-medium">{teams.find(t => t.id === existingPrediction.winnerId)?.name}</span>
                  </p>
                )}
                {existingPrediction.manOfTheMatch && (
                  <p className="text-xs sm:text-sm text-text-secondary">
                    MOTM: <span className="text-accent font-medium">{allPlayers.find(p => p.id === existingPrediction.manOfTheMatch)?.name}</span>
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Prediction Type Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-text-primary">
                    Prediction Type
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
                      <div className="font-medium text-text-primary text-sm sm:text-base">Exact Score</div>
                      <div className={`text-xs sm:text-sm mt-1 font-medium ${predictionType === 'exact_score' ? 'text-accent' : 'text-text-secondary'}`}>
                        +10 points
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
                      <div className="font-medium text-text-primary text-sm sm:text-base">Winner Only</div>
                      <div className={`text-xs sm:text-sm mt-1 font-medium ${predictionType === 'winner_only' ? 'text-accent' : 'text-text-secondary'}`}>
                        +3 points
                      </div>
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
                        className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
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
                      Predicted Winner
                    </label>
                    <select
                      value={winnerId}
                      onChange={(e) => setWinnerId(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
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
                    className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm sm:text-base transition-colors duration-200"
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
                    <span>Potential Points:</span> <span className="text-lg">{potentialPoints}</span> points
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
