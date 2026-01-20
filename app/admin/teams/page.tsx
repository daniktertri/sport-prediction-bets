// Admin Teams page - Create and edit teams
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Team, Player } from '@/types';

export default function AdminTeamsPage() {
  const { teams, createTeam, updateTeam, currentUser } = useApp();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    group: '' as 'A' | 'B' | 'C' | 'D' | '',
    players: [] as Player[],
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: formData.name,
        logo: formData.logo || undefined,
        group: formData.group || null,
        players: formData.players,
      });
    } else {
      createTeam({
        name: formData.name,
        logo: formData.logo || undefined,
        group: formData.group || null,
        players: formData.players,
        flag: formData.logo || undefined,
      });
    }
    
    setFormData({ name: '', logo: '', group: '', players: [] });
    setEditingTeam(null);
    setShowForm(false);
  };
  
  const startEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      logo: team.logo || '',
      group: team.group || '',
      players: team.players,
    });
    setShowForm(true);
  };
  
  const addPlayer = () => {
    setFormData({
      ...formData,
      players: [...formData.players, { id: `p-${Date.now()}`, name: '' }],
    });
  };
  
  const updatePlayer = (index: number, updates: Partial<Player>) => {
    const newPlayers = [...formData.players];
    newPlayers[index] = { ...newPlayers[index], ...updates };
    setFormData({ ...formData, players: newPlayers });
  };
  
  const removePlayer = (index: number) => {
    setFormData({
      ...formData,
      players: formData.players.filter((_, i) => i !== index),
    });
  };
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-semibold text-text-primary">Team Management</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingTeam(null); setFormData({ name: '', logo: '', group: '', players: [] }); }}>
            + New Team
          </Button>
        </div>
        
        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">{editingTeam ? 'Edit Team' : 'Create Team'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Team Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Logo (emoji or URL)</label>
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                >
                  <option value="">No Group</option>
                  <option value="A">Group A</option>
                  <option value="B">Group B</option>
                  <option value="C">Group C</option>
                  <option value="D">Group D</option>
                </select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-text-primary">Players</label>
                  <Button type="button" size="sm" onClick={addPlayer}>+ Add Player</Button>
                </div>
                <div className="space-y-2">
                  {formData.players.map((player, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Player name"
                        value={player.name}
                        onChange={(e) => updatePlayer(index, { name: e.target.value })}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={player.position || ''}
                        onChange={(e) => updatePlayer(index, { position: e.target.value })}
                        className="w-32 px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      />
                      <input
                        type="number"
                        placeholder="Number"
                        value={player.number || ''}
                        onChange={(e) => updatePlayer(index, { number: parseInt(e.target.value) || undefined })}
                        className="w-24 px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      />
                      <Button type="button" variant="danger" size="sm" onClick={() => removePlayer(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">{editingTeam ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingTeam(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{team.logo || team.flag}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-text-primary">{team.name}</h3>
                    {team.group && <span className="text-sm text-text-secondary">Group {team.group}</span>}
                  </div>
                </div>
                <Button size="sm" onClick={() => startEdit(team)}>Edit</Button>
              </div>
              <div className="text-sm text-text-secondary">
                {team.players.length} players
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
