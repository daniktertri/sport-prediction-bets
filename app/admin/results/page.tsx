// Admin Results page - Set match results and man of the match
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
export default function AdminResultsPage() {
  const { matches, teams, updateMatch, currentUser, refreshData } = useApp();
  
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [score1, setScore1] = useState<string>('');
  const [score2, setScore2] = useState<string>('');
  const [manOfTheMatch, setManOfTheMatch] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [team1Players, setTeam1Players] = useState<any[]>([]);
  const [team2Players, setTeam2Players] = useState<any[]>([]);
  
  const selectedMatch = matches.find((m) => m.id === selectedMatchId);
  const team1 = selectedMatch ? teams.find(t => t.id === selectedMatch.team1Id) : null;
  const team2 = selectedMatch ? teams.find(t => t.id === selectedMatch.team2Id) : null;
  
  useEffect(() => {
    if (team1?.id) {
      fetch(`/api/players?teamId=${team1.id}`)
        .then(res => res.json())
        .then(data => setTeam1Players(data || []));
    } else {
      setTeam1Players([]);
    }
    if (team2?.id) {
      fetch(`/api/players?teamId=${team2.id}`)
        .then(res => res.json())
        .then(data => setTeam2Players(data || []));
    } else {
      setTeam2Players([]);
    }
  }, [team1?.id, team2?.id]);
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">Access Denied</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const allPlayers = [...team1Players, ...team2Players];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatchId || !score1 || !score2) {
      alert('Please fill in all required fields');
      return;
    }
    
    await updateMatch(selectedMatchId, {
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
    
    // Refresh data after update
    await refreshData();
    
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
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-semibold text-text-primary">Match Results</h1>
          <p className="text-text-secondary mt-2">
            Set final scores and man of the match. Points will be automatically recalculated.
          </p>
        </div>
        
        {submitted && (
          <Card className="p-4 mb-6 bg-success/10 border-success/20">
            <p className="text-success font-medium">
              ✓ Match result updated! Points have been recalculated.
            </p>
          </Card>
        )}
        
        <Card className="p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">Select Match</label>
              <select
                value={selectedMatchId}
                onChange={(e) => handleMatchSelect(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
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
                <Card className="p-4 bg-bg-tertiary">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <TeamLogo logo={team1.logo} flag={team1.flag} name={team1.name} size="lg" />
                      </div>
                      <div className="font-medium text-text-primary">{team1.name}</div>
                    </div>
                    <div className="text-2xl text-text-secondary">vs</div>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <TeamLogo logo={team2.logo} flag={team2.flag} name={team2.name} size="lg" />
                      </div>
                      <div className="font-medium text-text-primary">{team2.name}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-text-secondary mt-4">
                    {new Date(selectedMatch.date).toLocaleDateString()}
                  </div>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">
                      {team1.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={score1}
                      onChange={(e) => setScore1(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">
                      {team2.name} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={score2}
                      onChange={(e) => setScore2(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">
                    Man of the Match
                  </label>
                  <select
                    value={manOfTheMatch}
                    onChange={(e) => setManOfTheMatch(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
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
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Recent Finished Matches</h2>
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
                        <TeamLogo logo={t1?.logo} flag={t1?.flag} name={t1?.name} size="md" />
                        <span className="font-medium text-text-primary">{t1?.name}</span>
                        <span className="font-semibold text-lg text-text-primary">{match.score1}</span>
                        <span className="text-text-secondary">-</span>
                        <span className="font-semibold text-lg text-text-primary">{match.score2}</span>
                        <span className="font-medium text-text-primary">{t2?.name}</span>
                        <TeamLogo logo={t2?.logo} flag={t2?.flag} name={t2?.name} size="md" />
                      </div>
                      {motmPlayer && (
                        <span className="text-sm text-text-secondary">
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
