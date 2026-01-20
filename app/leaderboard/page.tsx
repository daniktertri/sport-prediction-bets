// Leaderboard page - Rank users by total points
'use client';

import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';

export default function LeaderboardPage() {
  const { users, currentUser } = useApp();
  
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };
  
  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-text-primary">Leaderboard</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Rankings based on total points earned
          </p>
        </div>
        
        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {users.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUser?.id;
            
            return (
              <Card 
                key={user.id} 
                className={isCurrentUser ? 'border-neon-cyan/50 glow-cyan-sm' : ''}
                hover
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-text-primary">
                      {getRankEmoji(rank)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isCurrentUser ? 'text-neon-cyan' : 'text-text-primary'}`}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full border border-neon-cyan/40 shadow-neon-cyan-sm">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {user.exactScores || 0} exact • {user.winnerOnly || 0} winner
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold bg-gradient-to-r ${isCurrentUser ? 'from-neon-cyan to-neon-green bg-clip-text text-transparent' : 'text-text-primary'}`}>
                      {user.totalPoints}
                    </div>
                    <div className="text-xs text-text-secondary">points</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Desktop Table View */}
        <Card className="hidden sm:block overflow-hidden" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-tertiary border-b border-neon-cyan/20">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                    Exact
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-neon-cyan uppercase tracking-wider">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg-secondary divide-y divide-neon-cyan/10">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <tr
                      key={user.id}
                      className={`transition-all duration-300 ${
                        isCurrentUser 
                          ? 'bg-neon-cyan/10 hover:bg-neon-cyan/15 border-l-2 border-neon-cyan' 
                          : 'hover:bg-bg-tertiary/50 hover:border-l-2 hover:border-neon-cyan/30'
                      }`}
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-text-primary">
                          {getRankEmoji(rank)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-semibold ${isCurrentUser ? 'text-neon-cyan' : 'text-text-primary'}`}>
                            {user.name}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded-full border border-neon-cyan/40 shadow-neon-cyan-sm">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold ${isCurrentUser ? 'bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent' : 'text-text-primary'}`}>
                          {user.totalPoints}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-text-secondary">
                          {user.exactScores || 0}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-text-secondary">
                          {user.winnerOnly || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Scoring Rules */}
        <Card className="mt-6 sm:mt-8">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-text-primary">Scoring Rules</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="text-neon-green">✅</span>
              <span>Exact score: <span className="font-semibold text-neon-green">+10 pts</span></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-neon-cyan">✅</span>
              <span>Winner only: <span className="font-semibold text-neon-cyan">+3 pts</span></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-neon-green">✅</span>
              <span>Man of match: <span className="font-semibold text-neon-green">+3 pts</span> (bonus)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-danger">❌</span>
              <span>Wrong: <span className="font-semibold text-text-primary">0 pts</span></span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
