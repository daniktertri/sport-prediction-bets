// Leaderboard page - Rank users by total points
'use client';

import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';

const formatInstagramUrl = (instagram: string | undefined) => {
  if (!instagram) return null;
  // Remove @ if present, add https://instagram.com/
  const handle = instagram.replace('@', '').trim();
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
};

export default function LeaderboardPage() {
  const { users, currentUser } = useApp();
  const { t } = useLanguage();
  
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-text-primary">{t('leaderboard.title')}</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            {t('leaderboard.rankings')}
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
                className={isCurrentUser ? 'border-accent' : ''}
                hover
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-medium text-text-primary flex-shrink-0">
                      {getRankEmoji(rank)}
                    </span>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm border border-border flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 flex-shrink-0">
                            {t('common.you')}
                          </span>
                        )}
                        {user.instagram && (
                          <a
                            href={formatInstagramUrl(user.instagram) || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent-hover transition-colors flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                            title={`@${user.instagram.replace('@', '')}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className={`text-lg font-semibold ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
                      {user.totalPoints}
                    </div>
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
              <thead className="bg-bg-tertiary border-b border-border">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {t('leaderboard.rank')}
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {t('leaderboard.player')}
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {t('common.points')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg-secondary divide-y divide-border">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors duration-200 ${
                        isCurrentUser 
                          ? 'bg-accent/5 hover:bg-accent/10' 
                          : 'hover:bg-bg-tertiary'
                      }`}
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-primary">
                          {getRankEmoji(rank)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm border border-border">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
                              {user.name}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded border border-accent/20">
                                {t('common.you')}
                              </span>
                            )}
                            {user.instagram && (
                              <a
                                href={formatInstagramUrl(user.instagram) || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:text-accent-hover transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                title={`@${user.instagram.replace('@', '')}`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${isCurrentUser ? 'text-accent' : 'text-text-primary'}`}>
                          {user.totalPoints}
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
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-text-primary">{t('leaderboard.scoringRules')}</h2>
          <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>{t('leaderboard.exactScore')}: <span className="font-medium text-text-primary">+10 {t('leaderboard.pts')}</span></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <span>{t('leaderboard.winnerOnly')}: <span className="font-medium text-text-primary">+3 {t('leaderboard.pts')}</span></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>{t('leaderboard.manOfMatch')}: <span className="font-medium text-text-primary">+3 {t('leaderboard.pts')}</span> {t('leaderboard.bonus')}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-danger">✗</span>
              <span>{t('leaderboard.wrong')}: <span className="font-medium text-text-primary">0 {t('leaderboard.pts')}</span></span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
