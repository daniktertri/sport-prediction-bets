// Home page - Competition overview
'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MatchCard from '@/components/MatchCard';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { teams, matches, competition } = useApp();
  const [tropheeAnimation, setTropheeAnimation] = useState(null);
  
  useEffect(() => {
    fetch('/lottie/trophee.json')
      .then(response => response.json())
      .then(data => setTropheeAnimation(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32">
              {tropheeAnimation ? (
                <Lottie animationData={tropheeAnimation} loop={true} />
              ) : (
                <div className="text-5xl sm:text-6xl">🏆</div>
              )}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-text-primary tracking-tight">
            {competition.name}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary mb-8 px-4 max-w-2xl mx-auto">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8 sm:mb-12">
          <Card className="text-center py-6">
            <div className="text-3xl sm:text-4xl font-semibold text-text-primary mb-2">{totalMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Total</div>
          </Card>
          <Card className="text-center py-6">
            <div className="text-3xl sm:text-4xl font-semibold text-text-primary mb-2">{finishedMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Finished</div>
          </Card>
          <Card className="text-center py-6">
            <div className="text-3xl sm:text-4xl font-semibold text-text-primary mb-2">{upcomingMatches}</div>
            <div className="text-sm text-text-secondary font-medium">Upcoming</div>
          </Card>
        </div>
        
        {/* Next Matches */}
        {nextMatches.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-text-primary">Upcoming Matches</h2>
              <Link href="/matches" className="text-sm text-accent font-medium hover:text-accent-hover transition-colors duration-200">
                View all →
              </Link>
            </div>
            <Card padding="none" className="overflow-hidden">
              <div className="divide-y divide-border">
                {nextMatches.map((match) => (
                  <MatchCard key={match.id} match={match} compact />
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {/* Groups */}
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-text-primary">Groups</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((group) => {
              const groupTeams = teams.filter(t => t.group === group);
              return (
                <Card key={group}>
                  <div className="font-semibold text-base sm:text-lg mb-4 text-text-primary">
                    Group {group}
                  </div>
                  <div className="space-y-3">
                    {groupTeams.map((team) => (
                      <div key={team.id} className="flex items-center gap-3 hover:text-accent transition-colors duration-200">
                        <span className="text-2xl">{team.logo || team.flag}</span>
                        <span className="font-medium text-text-primary text-sm truncate">{team.name}</span>
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
