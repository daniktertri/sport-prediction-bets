// Browse page - View all teams and players (read-only)
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import TeamLogo from '@/components/TeamLogo';
import { Team, Player, Match } from '@/types';

interface TeamStats {
  team: Team;
  playerCount: number;
  goalsScored: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface PlayerStats {
  player: Player;
  teamName: string;
  teamId: string;
  winRate: number;
  goals: number; // Using Man of the Match count as proxy
}

export default function BrowsePage() {
  const { teams, matches, refreshData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'teams' | 'players'>('teams');
  
  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshData]);
  
  // Calculate team statistics
  const teamStats = useMemo((): TeamStats[] => {
    const finishedMatches = matches.filter(m => m.status === 'finished' && m.score1 !== undefined && m.score2 !== undefined);
    
    return teams.map(team => {
      let goalsScored = 0;
      let wins = 0;
      let losses = 0;
      
      finishedMatches.forEach(match => {
        if (match.team1Id === team.id) {
          goalsScored += match.score1 || 0;
          if (match.score1! > match.score2!) wins++;
          else if (match.score1! < match.score2!) losses++;
        } else if (match.team2Id === team.id) {
          goalsScored += match.score2 || 0;
          if (match.score2! > match.score1!) wins++;
          else if (match.score2! < match.score1!) losses++;
        }
      });
      
      const totalMatches = wins + losses;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
      
      return {
        team,
        playerCount: team.players.length,
        goalsScored,
        wins,
        losses,
        winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
      };
    });
  }, [teams, matches]);
  
  // Calculate player statistics
  const playerStats = useMemo((): PlayerStats[] => {
    const finishedMatches = matches.filter(m => m.status === 'finished' && m.score1 !== undefined && m.score2 !== undefined && m.manOfTheMatch);
    
    const statsMap = new Map<string, { wins: number; total: number }>();
    
    finishedMatches.forEach(match => {
      if (!match.manOfTheMatch) return;
      
      const playerId = match.manOfTheMatch;
      const current = statsMap.get(playerId) || { wins: 0, total: 0 };
      current.total++;
      
      // Find which team the player belongs to
      const playerTeam = teams.find(t => t.players.some(p => p.id === playerId));
      if (playerTeam) {
        const isTeam1 = match.team1Id === playerTeam.id;
        const won = isTeam1 
          ? (match.score1! > match.score2!)
          : (match.score2! > match.score1!);
        
        if (won) current.wins++;
      }
      
      statsMap.set(playerId, current);
    });
    
    return teams.flatMap(team =>
      team.players.map(player => {
        const stats = statsMap.get(player.id) || { wins: 0, total: 0 };
        const winRate = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
        
        return {
          player,
          teamName: team.name,
          teamId: team.id,
          winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
          goals: stats.total, // Using Man of the Match count
        };
      })
    );
  }, [teams, matches]);
  
  // Filter teams
  const filteredTeamStats = teamStats.filter(teamStat => {
    const team = teamStat.team;
    const matchesSearch = !searchQuery || 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.players.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = selectedGroup === 'all' || team.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });
  
  // Filter players
  const filteredPlayerStats = playerStats.filter(playerStat => {
    const matchesSearch = !searchQuery || 
      playerStat.player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playerStat.teamName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const team = teams.find(t => t.id === playerStat.teamId);
    const matchesGroup = selectedGroup === 'all' || team?.group === selectedGroup;
    
    return matchesSearch && matchesGroup;
  });
  
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
        
        {/* Section Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setActiveSection('teams')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeSection === 'teams'
                ? 'bg-accent text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
            }`}
          >
            Teams ({filteredTeamStats.length})
          </button>
          <button
            onClick={() => setActiveSection('players')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeSection === 'players'
                ? 'bg-accent text-white'
                : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border hover:border-accent'
            }`}
          >
            Players ({filteredPlayerStats.length})
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={activeSection === 'teams' ? "Search teams..." : "Search players..."}
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
        
        {/* Teams Section */}
        {activeSection === 'teams' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-text-primary">
              Teams ({filteredTeamStats.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeamStats.map((teamStat) => {
                const { team, playerCount, goalsScored, wins, losses, winRate } = teamStat;
                return (
                  <Card key={team.id} className="p-4 sm:p-6 hover:bg-bg-tertiary transition-colors duration-200">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3">
                        <TeamLogo logo={team.logo} flag={team.flag} name={team.name} size="xl" />
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg text-text-primary mb-1">
                        {team.name}
                      </h3>
                      {team.group && (
                        <span className="text-xs sm:text-sm text-text-secondary mb-3">
                          Group {team.group}
                        </span>
                      )}
                      
                      {/* Statistics */}
                      <div className="w-full space-y-2 mt-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">Players:</span>
                          <span className="font-medium text-text-primary">{playerCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">Goals:</span>
                          <span className="font-medium text-text-primary">{goalsScored}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">Record:</span>
                          <span className="font-medium text-text-primary">{wins}W - {losses}L</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary">Win Rate:</span>
                          <span className="font-medium text-text-primary">{winRate}%</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Players Section */}
        {activeSection === 'players' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-text-primary">
              Players ({filteredPlayerStats.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlayerStats.map((playerStat) => {
                const { player, teamName, winRate, goals } = playerStat;
                return (
                  <Card key={`${playerStat.teamId}-${player.id}`} className="p-4 hover:bg-bg-tertiary transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-3">
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
                        <p className="text-xs text-text-secondary truncate">{teamName}</p>
                        {player.position && (
                          <p className="text-xs text-text-secondary">{player.position}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Statistics */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-secondary">Win Rate:</span>
                        <span className="font-medium text-text-primary">{winRate}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-text-secondary">Goals:</span>
                        <span className="font-medium text-text-primary">{goals}</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        {activeSection === 'teams' && filteredTeamStats.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No teams found matching your search.</p>
          </Card>
        )}
        
        {activeSection === 'players' && filteredPlayerStats.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No players found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
