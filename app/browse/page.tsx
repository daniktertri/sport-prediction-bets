// Browse page - View all teams and players (read-only)
'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import TeamLogo from '@/components/TeamLogo';
import { Team, Player } from '@/types';

export default function BrowsePage() {
  const { teams, refreshData } = useApp();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  // Filter teams
  const filteredTeams = teams.filter(team => {
    const matchesSearch = !searchQuery || 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.players.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || team.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });
  
  // Get all players from filtered teams
  const allPlayers = filteredTeams.flatMap(team => 
    team.players.map(player => ({ ...player, teamName: team.name, teamId: team.id }))
  );
  
  const groups = ['A', 'B', 'C', 'D'] as const;
  
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary mb-2">Browse Teams & Players</h1>
          <p className="text-sm text-text-secondary">
            Explore all teams and players in the competition
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search teams or players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-border rounded-lg bg-bg-secondary text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Group Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedGroup === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
              }`}
            >
              All Groups
            </button>
            {groups.map((group) => {
              const count = teams.filter(t => t.group === group).length;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    selectedGroup === group
                      ? 'bg-accent text-white'
                      : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
                  }`}
                >
                  Group {group} ({count})
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Teams Grid */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-text-primary">
            Teams ({filteredTeams.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeams.map((team) => (
              <Card
                key={team.id}
                className="p-4 sm:p-6 hover:bg-bg-tertiary transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">
                    <TeamLogo logo={team.logo} flag={team.flag} name={team.name} size="xl" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-text-primary mb-1">
                    {team.name}
                  </h3>
                  {team.group && (
                    <span className="text-xs sm:text-sm text-text-secondary mb-2">
                      Group {team.group}
                    </span>
                  )}
                  <div className="text-xs sm:text-sm text-text-secondary mt-2">
                    {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Selected Team Details */}
        {selectedTeam && (
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <TeamLogo logo={selectedTeam.logo} flag={selectedTeam.flag} name={selectedTeam.name} size="xl" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">
                      {selectedTeam.name}
                    </h2>
                    {selectedTeam.group && (
                      <span className="text-sm text-text-secondary">Group {selectedTeam.group}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedTeam.players.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-text-primary">
                    Players ({selectedTeam.players.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedTeam.players.map((player) => (
                      <Card key={player.id} className="p-4">
                        <div className="flex items-center gap-4">
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
                            <h4 className="font-semibold text-text-primary truncate">
                              {player.name}
                            </h4>
                            {player.position && (
                              <p className="text-sm text-text-secondary">{player.position}</p>
                            )}
                            {player.number && (
                              <p className="text-xs text-text-secondary">#{player.number}</p>
                            )}
                            {player.instagram && (
                              <a
                                href={`https://instagram.com/${player.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:text-accent-hover mt-1 inline-block"
                              >
                                @{player.instagram.replace('@', '')}
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-text-secondary text-center py-8">
                  No players added to this team yet.
                </p>
              )}
            </Card>
          </div>
        )}
        
        {/* All Players View */}
        {!selectedTeam && allPlayers.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-text-primary">
              All Players ({allPlayers.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allPlayers.map((player) => (
                <Card key={`${player.teamId}-${player.id}`} className="p-4">
                  <div className="flex items-center gap-3">
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
                      <h4 className="font-semibold text-sm text-text-primary truncate">
                        {player.name}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">{player.teamName}</p>
                      {player.position && (
                        <p className="text-xs text-text-secondary">{player.position}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {filteredTeams.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No teams found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
