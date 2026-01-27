// Admin Matches page - Unified match management
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
import { Match } from '@/types';

export default function AdminMatchesPage() {
  const { teams, matches, createMatch, updateMatch, deleteMatch, currentUser, refreshData } = useApp();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [score1, setScore1] = useState<string>('');
  const [score2, setScore2] = useState<string>('');
  const [manOfTheMatch, setManOfTheMatch] = useState<string>('');
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    team1Id: '',
    team2Id: '',
    date: '',
    phase: 'group' as Match['phase'],
    group: '' as 'A' | 'B' | 'C' | 'D' | '',
  });
  
  useEffect(() => {
    fetchAllPlayers();
  }, [teams]);
  
  const fetchAllPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setAllPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };
  
  // Organize matches by status
  const organizedMatches = useMemo(() => {
    const upcoming = matches.filter(m => m.status === 'upcoming');
    const finishedNoScore = matches.filter(m => 
      m.status === 'finished' && (m.score1 === undefined || m.score2 === undefined || m.score1 === null || m.score2 === null)
    );
    const finishedWithScore = matches.filter(m => 
      m.status === 'finished' && m.score1 !== undefined && m.score2 !== undefined && m.score1 !== null && m.score2 !== null
    );
    
    return { upcoming, finishedNoScore, finishedWithScore };
  }, [matches]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const matchData: Omit<Match, 'id'> = {
      team1Id: formData.team1Id,
      team2Id: formData.team2Id,
      date: new Date(formData.date).toISOString(),
      status: 'upcoming',
      phase: formData.phase,
      group: formData.phase === 'group' && formData.group ? formData.group : undefined,
    };
    
    if (editingMatch) {
      await updateMatch(editingMatch.id, matchData);
    } else {
      await createMatch(matchData);
    }
    
    setFormData({ team1Id: '', team2Id: '', date: '', phase: 'group', group: '' });
    setEditingMatch(null);
    setShowForm(false);
    await refreshData();
  };
  
  const handleScoreSubmit = async (matchId: string) => {
    if (!score1 || !score2) {
      alert('Please enter both scores');
      return;
    }
    
    await updateMatch(matchId, {
      status: 'finished',
      score1: parseInt(score1),
      score2: parseInt(score2),
      manOfTheMatch: manOfTheMatch || undefined,
    });
    
    setEditingScore(null);
    setScore1('');
    setScore2('');
    setManOfTheMatch('');
    await refreshData();
  };
  
  const startEdit = (match: Match) => {
    setEditingMatch(match);
    const matchDate = new Date(match.date);
    const localDate = new Date(matchDate.getTime() - matchDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    
    setFormData({
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      date: localDate,
      phase: match.phase,
      group: match.group || '',
    });
    setShowForm(true);
  };
  
  const startScoreEdit = (match: Match) => {
    setEditingScore(match.id);
    setScore1(match.score1?.toString() || '');
    setScore2(match.score2?.toString() || '');
    setManOfTheMatch(match.manOfTheMatch || '');
  };
  
  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match? This will also delete all predictions for this match.')) {
      return;
    }
    
    try {
      await deleteMatch(matchId);
      await refreshData();
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Failed to delete match. Please try again.');
    }
  };
  
  const getMatchPlayers = (match: Match) => {
    const team1 = teams.find(t => t.id === match.team1Id);
    const team2 = teams.find(t => t.id === match.team2Id);
    return allPlayers.filter(p => 
      (p.teamId === team1?.id || p.teamId === team2?.id)
    );
  };
  
  const renderMatchRow = (match: Match) => {
    const team1 = teams.find(t => t.id === match.team1Id);
    const team2 = teams.find(t => t.id === match.team2Id);
    const isEditingScore = editingScore === match.id;
    const matchPlayers = getMatchPlayers(match);
    const isMatchPast = new Date(match.date) < new Date();
    const hasScore = match.score1 !== undefined && match.score1 !== null &&
                     match.score2 !== undefined && match.score2 !== null;
    const canSetScore = (!hasScore && (match.status === 'finished' || (match.status === 'upcoming' && isMatchPast)));
    
    return (
      <tr key={match.id} className="border-b border-border hover:bg-bg-tertiary transition-colors duration-200">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <TeamLogo logo={team1?.logo} flag={team1?.flag} name={team1?.name} size="sm" />
            <span className="font-medium text-text-primary">{team1?.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          {isEditingScore ? (
            <div className="flex items-center gap-2 justify-center">
              <input
                type="number"
                min="0"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                className="w-16 px-2 py-1 border border-border rounded bg-bg-primary text-text-primary text-center"
              />
              <span className="text-text-secondary">-</span>
              <input
                type="number"
                min="0"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                className="w-16 px-2 py-1 border border-border rounded bg-bg-primary text-text-primary text-center"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {match.status === 'finished' && match.score1 !== undefined && match.score2 !== undefined ? (
                <>
                  <span className="font-semibold text-lg text-text-primary">{match.score1}</span>
                  <span className="text-text-secondary">-</span>
                  <span className="font-semibold text-lg text-text-primary">{match.score2}</span>
                </>
              ) : (
                <span className="text-text-secondary">-</span>
              )}
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="font-medium text-text-primary">{team2?.name}</span>
            <TeamLogo logo={team2?.logo} flag={team2?.flag} name={team2?.name} size="sm" />
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-text-secondary">
          {new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </td>
        <td className="px-4 py-3">
          <span className="text-xs px-2 py-1 rounded bg-bg-tertiary text-text-secondary">
            {match.phase}
            {match.group && ` - ${match.group}`}
          </span>
        </td>
        <td className="px-4 py-3">
          {isEditingScore ? (
            <div className="space-y-2">
              <select
                value={manOfTheMatch}
                onChange={(e) => setManOfTheMatch(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-border rounded bg-bg-primary text-text-primary"
              >
                <option value="">Select MOTM</option>
                {matchPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => handleScoreSubmit(match.id)}
                  className="text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingScore(null);
                    setScore1('');
                    setScore2('');
                    setManOfTheMatch('');
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {match.manOfTheMatch && (
                <span className="text-xs text-text-secondary">
                  MOTM: {matchPlayers.find(p => p.id === match.manOfTheMatch)?.name || 'Unknown'}
                </span>
              )}
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            {!isEditingScore && (
              <>
                {canSetScore && (
                  <Button size="sm" onClick={() => startScoreEdit(match)}>
                    Set Score
                  </Button>
                )}
                {match.status === 'upcoming' && !isMatchPast && (
                  <Button size="sm" variant="outline" onClick={() => startEdit(match)}>
                    Edit
                  </Button>
                )}
                {match.status === 'finished' && hasScore && (
                  <Button size="sm" variant="outline" onClick={() => startScoreEdit(match)}>
                    Edit Score
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleDelete(match.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-semibold text-text-primary">Match Management</h1>
          </div>
          <Button onClick={() => { 
            setShowForm(true); 
            setEditingMatch(null); 
            setFormData({ team1Id: '', team2Id: '', date: '', phase: 'group', group: '' }); 
          }}>
            + New Match
          </Button>
        </div>
        
        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              {editingMatch ? 'Edit Match' : 'Create Match'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">Team 1</label>
                  <select
                    value={formData.team1Id}
                    onChange={(e) => setFormData({ ...formData, team1Id: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">Team 2</label>
                  <select
                    value={formData.team2Id}
                    onChange={(e) => setFormData({ ...formData, team2Id: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    required
                  >
                    <option value="">Select team</option>
                    {teams.filter(t => t.id !== formData.team1Id).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">Phase</label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value as Match['phase'] })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  >
                    <option value="group">Group Stage</option>
                    <option value="round16">Round of 16</option>
                    <option value="quarter">Quarter Final</option>
                    <option value="semi">Semi Final</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                {formData.phase === 'group' && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-primary">Group</label>
                    <select
                      value={formData.group}
                      onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    >
                      <option value="">Select group</option>
                      <option value="A">Group A</option>
                      <option value="B">Group B</option>
                      <option value="C">Group C</option>
                      <option value="D">Group D</option>
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">{editingMatch ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingMatch(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {/* Matches Table */}
        <Card className="overflow-hidden" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-tertiary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Team 1</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Team 2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Phase</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Man of Match</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-bg-secondary divide-y divide-border">
                {/* Upcoming Matches */}
                {organizedMatches.upcoming.length > 0 && (
                  <>
                    {organizedMatches.upcoming.map(match => renderMatchRow(match))}
                  </>
                )}
                
                {/* Finished but no score */}
                {organizedMatches.finishedNoScore.length > 0 && (
                  <>
                    {organizedMatches.finishedNoScore.map(match => renderMatchRow(match))}
                  </>
                )}
                
                {/* Finished with score */}
                {organizedMatches.finishedWithScore.length > 0 && (
                  <>
                    {organizedMatches.finishedWithScore.map(match => renderMatchRow(match))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        {organizedMatches.upcoming.length === 0 && 
         organizedMatches.finishedNoScore.length === 0 && 
         organizedMatches.finishedWithScore.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No matches found. Create your first match!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
