// Admin Teams page - Create and edit teams
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import TeamLogo from '@/components/TeamLogo';
import { Team, Player } from '@/types';

export default function AdminTeamsPage() {
  const { teams, createTeam, updateTeam, currentUser, refreshData } = useApp();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    group: '' as 'A' | 'B' | 'C' | 'D' | '',
    players: [] as Player[],
  });
  
  useEffect(() => {
    fetchAllPlayers();
  }, []);
  
  const fetchAllPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setAllPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };
  
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
    setError(null);
    setLoading(true);
    
    try {
      if (editingTeam) {
        await updateTeam(editingTeam.id, {
          name: formData.name,
          logo: formData.logo || undefined,
          group: formData.group || null,
          players: formData.players,
        });
      } else {
        await createTeam({
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
      setShowPlayerSelector(false);
      setPlayerSearchQuery('');
      // Refresh data after update
      await refreshData();
      await fetchAllPlayers();
    } catch (err: any) {
      setError(err.message || 'Failed to save team. Please try again.');
      console.error('Error saving team:', err);
    } finally {
      setLoading(false);
    }
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
    setShowPlayerSelector(false);
    setPlayerSearchQuery('');
  };
  
  const addPlayerToTeam = (player: Player) => {
    // Check if player is already in the team
    if (formData.players.some(p => p.id === player.id)) {
      return;
    }
    setFormData({
      ...formData,
      players: [...formData.players, player],
    });
    setShowPlayerSelector(false);
    setPlayerSearchQuery('');
  };
  
  const removePlayer = (playerId: string) => {
    setFormData({
      ...formData,
      players: formData.players.filter(p => p.id !== playerId),
    });
  };
  
  const availablePlayers = allPlayers.filter(player => {
    const matchesSearch = !playerSearchQuery || 
      player.name.toLowerCase().includes(playerSearchQuery.toLowerCase()) ||
      player.position?.toLowerCase().includes(playerSearchQuery.toLowerCase());
    const notInCurrentTeam = !formData.players.some(p => p.id === player.id);
    // Check if player is already assigned to another team
    const playerTeamId = (player as any).teamId;
    const isAssignedToOtherTeam = playerTeamId && playerTeamId !== editingTeam?.id;
    // Only show players that are not assigned to any team, or assigned to the current team being edited
    const isAvailable = !isAssignedToOtherTeam;
    return matchesSearch && notInCurrentTeam && isAvailable;
  });
  
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
          <Button onClick={() => { 
            setShowForm(true); 
            setEditingTeam(null); 
            setFormData({ name: '', logo: '', group: '', players: [] });
            setShowPlayerSelector(false);
            setPlayerSearchQuery('');
          }}>
            + New Team
          </Button>
        </div>
        
        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">{editingTeam ? 'Edit Team' : 'Create Team'}</h2>
            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}
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
                <ImageUpload
                  currentImage={formData.logo?.startsWith('data:image') ? formData.logo : undefined}
                  onImageChange={(base64) => {
                    setFormData({ ...formData, logo: base64 || '' });
                  }}
                  label="Team Logo"
                  maxSizeMB={10}
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
                  <label className="block text-sm font-medium text-text-primary">
                    Players ({formData.players.length})
                  </label>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={() => setShowPlayerSelector(!showPlayerSelector)}
                  >
                    {showPlayerSelector ? 'Cancel Selection' : '+ Select Players'}
                  </Button>
                </div>
                
                {/* Player Selector */}
                {showPlayerSelector && (
                  <Card className="p-4 mb-4 border-2 border-accent/30">
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Search players..."
                        value={playerSearchQuery}
                        onChange={(e) => setPlayerSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {availablePlayers.length > 0 ? (
                        availablePlayers.map((player) => (
                          <div
                            key={player.id}
                            onClick={() => addPlayerToTeam(player)}
                            className="flex items-center gap-3 p-3 bg-bg-secondary hover:bg-bg-tertiary rounded-lg cursor-pointer transition-colors duration-200 border border-border hover:border-accent"
                          >
                            {player.image ? (
                              <img
                                src={player.image}
                                alt={player.name}
                                className="w-10 h-10 rounded-lg object-cover border border-border"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border">
                                <span className="text-lg">👤</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-text-primary truncate">{player.name}</p>
                              {player.position && (
                                <p className="text-xs text-text-secondary">{player.position}</p>
                              )}
                            </div>
                            <Button size="sm" type="button">Add</Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-text-secondary py-4">
                          {playerSearchQuery ? 'No players found' : 'No available players. Create players first in the Players section.'}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 text-xs text-text-secondary">
                      <Link href="/admin/players" className="text-accent hover:text-accent-hover">
                        → Go to Players Management to create new players
                      </Link>
                    </div>
                  </Card>
                )}
                
                {/* Selected Players */}
                <div className="space-y-3">
                  {formData.players.length > 0 ? (
                    formData.players.map((player) => (
                      <Card key={player.id} className="p-4">
                        <div className="flex items-center gap-4">
                          {player.image ? (
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-12 h-12 rounded-lg object-cover border border-border"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border">
                              <span className="text-xl">👤</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-text-primary truncate">{player.name}</h4>
                            {player.position && (
                              <p className="text-sm text-text-secondary">{player.position}</p>
                            )}
                            {player.number && (
                              <p className="text-xs text-text-secondary">#{player.number}</p>
                            )}
                          </div>
                          <Button 
                            type="button" 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removePlayer(player.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-text-secondary py-4 text-sm">
                      No players selected. Click &quot;Select Players&quot; to add players to this team.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingTeam ? 'Update' : 'Create'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { 
                    setShowForm(false); 
                    setEditingTeam(null); 
                    setError(null);
                    setShowPlayerSelector(false);
                    setPlayerSearchQuery('');
                  }} 
                  disabled={loading}
                >
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
                  <TeamLogo logo={team.logo} flag={team.flag} name={team.name} size="lg" />
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
