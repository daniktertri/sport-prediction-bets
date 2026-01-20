// Home page - Competition overview
'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MatchCard from '@/components/MatchCard';

export default function Home() {
  const { teams, matches, competition } = useApp();
  
  const totalMatches = matches.length;
  const finishedMatches = matches.filter(m => m.status === 'finished').length;
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').length;
  
  const nextMatches = matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  const groups = ['A', 'B', 'C', 'D'] as const;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-green/5 to-neon-cyan/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="text-6xl sm:text-7xl mb-6">{competition.logo || '🏆'}</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan bg-clip-text text-transparent tracking-tight">
              {competition.name}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-8 px-4 max-w-2xl mx-auto">
              Predict match results and compete for points
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/matches">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  View Matches
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 sm:mb-12">
          <Card className="text-center py-6" glow="cyan">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent mb-2">{totalMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Total</div>
          </Card>
          <Card className="text-center py-6" glow="green">
            <div className="text-3xl sm:text-4xl font-black text-neon-green mb-2">{finishedMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Finished</div>
          </Card>
          <Card className="text-center py-6" glow="cyan">
            <div className="text-3xl sm:text-4xl font-black text-neon-cyan mb-2">{upcomingMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Upcoming</div>
          </Card>
        </div>
        
        {/* Next Matches */}
        {nextMatches.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary">Upcoming Matches</h2>
              <Link href="/matches" className="text-sm text-neon-cyan font-semibold hover:text-neon-green flex items-center gap-1 transition-colors neon-underline">
                View all <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div 
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(18, 19, 26, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
              }}
            >
              <div className="divide-y divide-neon-cyan/10">
                {nextMatches.map((match) => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Groups */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black mb-6 text-text-primary">Groups</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((group) => {
              const groupTeams = teams.filter(t => t.group === group);
              return (
                <Card key={group}>
                  <div className="font-black text-lg sm:text-xl mb-4 text-text-primary">
                    Group {group}
                  </div>
                  <div className="space-y-3">
                    {groupTeams.map((team) => (
                      <div key={team.id} className="flex items-center gap-3 hover:text-neon-cyan transition-colors">
                        <span className="text-2xl">{team.logo || team.flag}</span>
                        <span className="font-semibold text-text-primary text-sm truncate">{team.name}</span>
                      </div>
                    ))}
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
