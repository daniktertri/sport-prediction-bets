// Admin Players page - Create and manage players independently
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { Player, Team } from '@/types';

export default function AdminPlayersPage() {
  const { teams, refreshData, currentUser } = useApp();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    image: null as string | null,
    instagram: '',
    teamId: '',
  });
  
  useEffect(() => {
    fetchPlayers();
  }, []);
  
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players');
    } finally {
      setLoading(false);
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
      const playerData = {
        name: formData.name,
        position: formData.position || undefined,
        number: formData.number ? parseInt(formData.number) : undefined,
        image: formData.image || undefined,
        instagram: formData.instagram || undefined,
        teamId: formData.teamId || undefined,
      };
      
      if (editingPlayer) {
        const res = await fetch(`/api/players/${editingPlayer.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(playerData),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update player');
        }
      } else {
        const res = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(playerData),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create player');
        }
      }
      
      setFormData({ name: '', position: '', number: '', image: null, instagram: '', teamId: '' });
      setEditingPlayer(null);
      setShowForm(false);
      await fetchPlayers();
      await refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to save player. Please try again.');
      console.error('Error saving player:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const startEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position || '',
      number: player.number?.toString() || '',
      image: player.image || null,
      instagram: player.instagram || '',
      teamId: (player as any).teamId || '',
    });
    setShowForm(true);
  };
  
  const handleDelete = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;
    
    try {
      const res = await fetch(`/api/players/${playerId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete player');
      }
      
      await fetchPlayers();
      await refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete player');
      console.error('Error deleting player:', err);
    }
  };
  
  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getTeamName = (teamId: string | undefined) => {
    if (!teamId) return 'No Team';
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Unknown Team';
  };
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-semibold text-text-primary">Player Management</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingPlayer(null); setFormData({ name: '', position: '', number: '', image: null, instagram: '', teamId: '' }); }}>
            + New Player
          </Button>
        </div>
        
        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              {editingPlayer ? 'Edit Player' : 'Create Player'}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Player Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    placeholder="e.g., Forward, Midfielder"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">Number</label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    placeholder="Jersey number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Team (Optional)</label>
                <select
                  value={formData.teamId}
                  onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                >
                  <option value="">No Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                <p className="text-xs text-text-secondary mt-1">
                  You can assign the player to a team later or when creating/editing teams
                </p>
              </div>
              
              <ImageUpload
                currentImage={formData.image || undefined}
                onImageChange={(base64) => setFormData({ ...formData, image: base64 || null })}
                label="Player Image"
                maxSizeMB={10}
              />
              
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingPlayer ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingPlayer(null); setError(null); }} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
          />
        </div>
        
        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                {player.image ? (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-16 h-16 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border">
                    <span className="text-2xl">👤</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-text-primary truncate">{player.name}</h3>
                  {player.position && (
                    <p className="text-sm text-text-secondary">{player.position}</p>
                  )}
                  {player.number && (
                    <p className="text-xs text-text-secondary">#{player.number}</p>
                  )}
                  <p className="text-xs text-text-secondary mt-1">
                    {getTeamName((player as any).teamId)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => startEdit(player)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(player.id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredPlayers.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">
              {searchQuery ? 'No players found matching your search.' : 'No players created yet.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
