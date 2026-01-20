// Admin Matches page - Create and edit matches
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TeamLogo from '@/components/TeamLogo';
import { Match } from '@/types';

export default function AdminMatchesPage() {
  const { teams, matches, createMatch, updateMatch, currentUser, refreshData } = useApp();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    team1Id: '',
    team2Id: '',
    date: '',
    phase: 'group' as Match['phase'],
    group: '' as 'A' | 'B' | 'C' | 'D' | '',
  });
  
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
    // Refresh data after update
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
            <h2 className="text-xl font-semibold mb-4 text-text-primary">{editingMatch ? 'Edit Match' : 'Create Match'}</h2>
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
        
        <div className="space-y-4">
          {matches.map((match) => {
            const team1 = teams.find(t => t.id === match.team1Id);
            const team2 = teams.find(t => t.id === match.team2Id);
            
            return (
              <Card key={match.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TeamLogo logo={team1?.logo} flag={team1?.flag} name={team1?.name} size="md" />
                    <span className="font-medium text-text-primary">{team1?.name}</span>
                    <span className="text-text-secondary">vs</span>
                    <span className="font-medium text-text-primary">{team2?.name}</span>
                    <TeamLogo logo={team2?.logo} flag={team2?.flag} name={team2?.name} size="md" />
                    <span className="text-sm text-text-secondary">
                      {new Date(match.date).toLocaleDateString()} • {match.phase}
                    </span>
                  </div>
                  <Button size="sm" onClick={() => startEdit(match)}>Edit</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
