// Admin Results page - Set match results and man of the match
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getPlayersByTeam } from '@/mocks/teams';

export default function AdminResultsPage() {
  const { matches, teams, updateMatch, currentUser } = useApp();
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [score1, setScore1] = useState<string>('');
  const [score2, setScore2] = useState<string>('');
  const [manOfTheMatch, setManOfTheMatch] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const team1 = selectedMatch ? teams.find(t => t.id === selectedMatch.team1Id) : null;
  const team2 = selectedMatch ? teams.find(t => t.id === selectedMatch.team2Id) : null;
  
  const team1Players = team1 ? getPlayersByTeam(team1.id) : [];
  const team2Players = team2 ? getPlayersByTeam(team2.id) : [];
  const allPlayers = [...team1Players, ...team2Players];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatchId || !score1 || !score2) {
      alert('Please fill in all required fields');
      return;
    }
    
    updateMatch(selectedMatchId, {
      status: 'finished',
      score1: parseInt(score1),
      score2: parseInt(score2),
      manOfTheMatch: manOfTheMatch || undefined,
    });
    
    setSubmitted(true);
    setScore1('');
    setScore2('');
    setManOfTheMatch('');
    setSelectedMatchId('');
    
    setTimeout(() => setSubmitted(false), 2000);
  };
  
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatchId(matchId);
    const match = matches.find(m => m.id === matchId);
    if (match && match.status === 'finished') {
      setScore1(match.score1?.toString() || '');
      setScore2(match.score2?.toString() || '');
      setManOfTheMatch(match.manOfTheMatch || '');
    } else {
      setScore1('');
      setScore2('');
      setManOfTheMatch('');
    }
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold">Match Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set final scores and man of the match. Points will be automatically recalculated.
          </p>
        </div>
        
        {submitted && (
          <Card className="p-4 mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-400 font-semibold">
              ✅ Match result updated! Points have been recalculated.
            </p>
          </Card>
        )}
        
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Match</label>
              <select
                value={selectedMatchId}
                onChange={(e) => handleMatchSelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                required
              >
                <option value="">Choose a match...</option>
                {matches.map((match) => {
                  const t1 = teams.find(t => t.id === match.team1Id);
                  const t2 = teams.find(t => t.id === match.team2Id);
                  return (
                    <option key={match.id} value={match.id}>
                      {t1?.name} vs {t2?.name} ({match.phase}) - {match.status}
                    </option>
                  );
                })}
              </select>
            </div>
            
            {selectedMatch && team1 && team2 && (
              <>
                <Card className="p-4 bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{team1.logo || team1.flag}</div>
                      <div className="font-semibold">{team1.name}</div>
                    </div>
                    <div className="text-2xl text-gray-400">vs</div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{team2.logo || team2.flag}</div>
                      <div className="font-semibold">{team2.name}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-4">
                    {new Date(selectedMatch.date).toLocaleDateString()}
                  </div>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {team1.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={score1}
                      onChange={(e) => setScore1(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {team2.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={score2}
                      onChange={(e) => setScore2(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Man of the Match
                  </label>
                  <select
                    value={manOfTheMatch}
                    onChange={(e) => setManOfTheMatch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
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
                
                <Button type="submit" size="lg" className="w-full">
                  Update Match Result
                </Button>
              </>
            )}
          </form>
        </Card>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Finished Matches</h2>
          <div className="space-y-2">
            {matches
              .filter((m) => m.status === 'finished')
              .slice(0, 5)
              .map((match) => {
                const t1 = teams.find(t => t.id === match.team1Id);
                const t2 = teams.find(t => t.id === match.team2Id);
                const motmPlayer = match.manOfTheMatch 
                  ? allPlayers.find(p => p.id === match.manOfTheMatch)
                  : null;
                
                return (
                  <Card key={match.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xl">{t1?.logo || t1?.flag}</span>
                        <span className="font-semibold">{t1?.name}</span>
                        <span className="font-bold text-lg">{match.score1}</span>
                        <span className="text-gray-400">-</span>
                        <span className="font-bold text-lg">{match.score2}</span>
                        <span className="font-semibold">{t2?.name}</span>
                        <span className="text-xl">{t2?.logo || t2?.flag}</span>
                      </div>
                      {motmPlayer && (
                        <span className="text-sm text-gray-500">
                          MOTM: {motmPlayer.name}
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
