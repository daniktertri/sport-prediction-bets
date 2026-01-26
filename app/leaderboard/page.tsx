// Leaderboard page - Rank users by total points
'use client';

import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import { useEffect } from 'react';

const formatInstagramUrl = (instagram: string | undefined) => {
  if (!instagram) return null;
  // Remove @ if present, add https://instagram.com/
  const handle = instagram.replace('@', '').trim();
  if (!handle) return null;
  return `https://instagram.com/${handle}`;
};

export default function LeaderboardPage() {
  const { users, currentUser, refreshData } = useApp();
  const { t } = useLanguage();
  
  // Always refresh leaderboard data when visiting this page
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getShameEmoji = (rank: number) => {
    if (rank === 1) return '🤡';
    if (rank === 2) return '💀';
    if (rank === 3) return '😭';
    return `#${rank}`;
  };

  // Hall of Shame: users who made bets but have low points (minimum 1 bet)
  const shameUsers = [...users]
    .filter(u => (u.totalBets || 0) >= 1) // Only users who have made at least 1 bet
    .sort((a, b) => {
      // Sort by points per bet ratio (ascending) - lower is worse
      const ratioA = a.totalPoints / Math.max(1, a.totalBets || 1);
      const ratioB = b.totalPoints / Math.max(1, b.totalBets || 1);
      if (ratioA !== ratioB) return ratioA - ratioB;
      // If same ratio, more bets = more shame
      return (b.totalBets || 0) - (a.totalBets || 0);
    })
    .slice(0, 5); // Top 5 worst
  
  // Separate top 3 for podium
  const top3 = users.slice(0, 3);
  const restOfUsers = users.slice(3);
  
  // Podium order: 2nd, 1st, 3rd (for visual display)
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  
  const getPodiumHeight = (originalRank: number) => {
    if (originalRank === 1) return 'h-32 sm:h-40';
    if (originalRank === 2) return 'h-24 sm:h-32';
    if (originalRank === 3) return 'h-16 sm:h-24';
    return 'h-16';
  };
  
  const getPodiumColor = (originalRank: number) => {
    if (originalRank === 1) return 'from-yellow-500/30 to-yellow-600/10 border-yellow-500/50';
    if (originalRank === 2) return 'from-gray-400/30 to-gray-500/10 border-gray-400/50';
    if (originalRank === 3) return 'from-amber-700/30 to-amber-800/10 border-amber-700/50';
    return 'from-bg-tertiary to-bg-secondary border-border';
  };
  
  const getAvatarSize = (originalRank: number) => {
    if (originalRank === 1) return 'w-20 h-20 sm:w-24 sm:h-24';
    return 'w-14 h-14 sm:w-18 sm:h-18';
  };
  
  const getTextSize = (originalRank: number) => {
    if (originalRank === 1) return 'text-lg sm:text-xl';
    return 'text-sm sm:text-base';
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 bg-bg-primary pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 text-text-primary">{t('leaderboard.title')}</h1>
          <p className="text-sm sm:text-base text-text-secondary">
            {t('leaderboard.rankings')}
          </p>
        </div>
        
        {/* Podium for Top 3 */}
        {top3.length >= 3 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-end justify-center gap-2 sm:gap-4">
              {podiumOrder.map((user, displayIndex) => {
                const originalRank = displayIndex === 0 ? 2 : displayIndex === 1 ? 1 : 3;
                const isCurrentUser = user.id === currentUser?.id;
                
                return (
                  <div key={user.id} className="flex flex-col items-center">
                    {/* User Info */}
                    <div className="flex flex-col items-center mb-2 sm:mb-3">
                      <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{getRankEmoji(originalRank)}</span>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`${getAvatarSize(originalRank)} rounded-full object-cover border-2 ${
                            originalRank === 1 ? 'border-yellow-500' : originalRank === 2 ? 'border-gray-400' : 'border-amber-700'
                          } shadow-lg`}
                        />
                      ) : (
                        <div className={`${getAvatarSize(originalRank)} rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold border-2 ${
                          originalRank === 1 ? 'border-yellow-500 text-xl sm:text-2xl' : originalRank === 2 ? 'border-gray-400 text-lg' : 'border-amber-700 text-lg'
                        } shadow-lg`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="mt-2 text-center">
                        <div className={`font-semibold ${getTextSize(originalRank)} ${isCurrentUser ? 'text-accent' : 'text-text-primary'} flex items-center gap-1 justify-center`}>
                          {user.name}
                          {user.instagram && (
                            <a
                              href={formatInstagramUrl(user.instagram) || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent-hover transition-colors"
                              onClick={(e) => e.stopPropagation()}
                              title={`@${user.instagram.replace('@', '')}`}
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                        {isCurrentUser && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20 mt-1 inline-block">
                            {t('common.you')}
                          </span>
                        )}
                        <div className={`${originalRank === 1 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'} font-bold ${isCurrentUser ? 'text-accent' : 'text-text-primary'} mt-1`}>
                          {user.totalPoints} pts
                        </div>
                      </div>
                    </div>
                    {/* Podium Block */}
                    <div className={`${getPodiumHeight(originalRank)} w-24 sm:w-32 bg-gradient-to-t ${getPodiumColor(originalRank)} rounded-t-lg border-t border-l border-r flex items-center justify-center`}>
                      <span className="text-2xl sm:text-4xl font-bold text-text-primary/50">{originalRank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Mobile Card View - For users rank 4+ or all if less than 3 users */}
        <div className="sm:hidden space-y-3">
          {(top3.length < 3 ? users : restOfUsers).map((user, index) => {
            const rank = top3.length < 3 ? index + 1 : index + 4;
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
        
        {/* Desktop Table View - For users rank 4+ or all if less than 3 users */}
        {(top3.length < 3 ? users.length > 0 : restOfUsers.length > 0) && (
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
                {(top3.length < 3 ? users : restOfUsers).map((user, index) => {
                  const rank = top3.length < 3 ? index + 1 : index + 4;
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
        )}
        
        {/* Hall of Shame */}
        {shameUsers.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-text-primary flex items-center gap-2">
                <span>🏚️</span> {t('leaderboard.hallOfShame')}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                {t('leaderboard.shameDescription')}
              </p>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3">
              {shameUsers.map((user, index) => {
                const rank = index + 1;
                const isCurrentUser = user.id === currentUser?.id;
                const ratio = user.totalPoints / Math.max(1, user.totalBets || 1);
                
                return (
                  <Card 
                    key={user.id} 
                    className={`${isCurrentUser ? 'border-danger' : 'border-danger/20'} bg-danger/5`}
                    hover
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-lg font-medium text-text-primary flex-shrink-0">
                          {getShameEmoji(rank)}
                        </span>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0 grayscale"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger font-semibold text-sm border border-danger/30 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium ${isCurrentUser ? 'text-danger' : 'text-text-primary'}`}>
                              {user.name}
                            </span>
                            {isCurrentUser && (
                              <span className="text-xs bg-danger/10 text-danger px-2 py-0.5 rounded border border-danger/20 flex-shrink-0">
                                {t('common.you')}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {user.totalBets || 0} {t('leaderboard.bets')} • {ratio.toFixed(1)} {t('leaderboard.ptsPerBet')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className={`text-lg font-semibold ${isCurrentUser ? 'text-danger' : 'text-text-primary'}`}>
                          {user.totalPoints}
                        </div>
                        <div className="text-xs text-text-secondary">{t('common.points')}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <Card className="hidden sm:block overflow-hidden border-danger/20 bg-danger/5" padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-danger/10 border-b border-danger/20">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-danger uppercase tracking-wider">
                        {t('leaderboard.rank')}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-danger uppercase tracking-wider">
                        {t('leaderboard.player')}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-danger uppercase tracking-wider">
                        {t('leaderboard.bets')}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-danger uppercase tracking-wider">
                        {t('leaderboard.ptsPerBet')}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-danger uppercase tracking-wider">
                        {t('common.points')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-danger/10">
                    {shameUsers.map((user, index) => {
                      const rank = index + 1;
                      const isCurrentUser = user.id === currentUser?.id;
                      const ratio = user.totalPoints / Math.max(1, user.totalBets || 1);
                      
                      return (
                        <tr
                          key={user.id}
                          className={`transition-colors duration-200 ${
                            isCurrentUser 
                              ? 'bg-danger/10 hover:bg-danger/15' 
                              : 'hover:bg-danger/5'
                          }`}
                        >
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-text-primary">
                              {getShameEmoji(rank)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full object-cover border border-border grayscale"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger font-semibold text-sm border border-danger/30">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isCurrentUser ? 'text-danger' : 'text-text-primary'}`}>
                                  {user.name}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded border border-danger/20">
                                    {t('common.you')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-text-secondary">
                              {user.totalBets || 0}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-sm text-danger font-medium">
                              {ratio.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
                            <span className={`text-sm font-semibold ${isCurrentUser ? 'text-danger' : 'text-text-primary'}`}>
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
          </div>
        )}

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
