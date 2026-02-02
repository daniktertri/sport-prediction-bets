'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';
import { clearUserCache } from '@/utils/cache';

// Icon components for bottom navigation
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const MatchesIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BrowseIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LeaderboardIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const AdminIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ProfileIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BetsIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#3B82F6' : '#FFFFFF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const { t } = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);
  
  const isActive = (path: string) => pathname === path;
  
  // Desktop navigation items
  const navItems = [
    { href: '/', label: t('common.home'), icon: HomeIcon },
    { href: '/matches', label: t('common.matches'), icon: MatchesIcon },
    { href: '/classification', label: t('common.classification'), icon: LeaderboardIcon },
    { href: '/browse', label: t('common.browse'), icon: BrowseIcon },
    { href: '/leaderboard', label: t('common.leaderboard'), icon: LeaderboardIcon },
  ];
  
  // Add My Bets for logged-in users
  if (currentUser) {
    navItems.push({ href: '/my-bets', label: t('common.myBets'), icon: BetsIcon });
  }
  
  if (currentUser?.isAdmin) {
    navItems.push({ href: '/admin', label: t('common.admin'), icon: AdminIcon });
  }
  
  // Mobile bottom nav - limited to 5 items for better UX
  const mobileNavItems = currentUser
    ? [
        { href: '/', label: t('common.home'), icon: HomeIcon },
        { href: '/matches', label: t('common.matches'), icon: MatchesIcon },
        { href: '/my-bets', label: t('common.myBets'), icon: BetsIcon },
        { href: '/leaderboard', label: t('common.leaderboard'), icon: LeaderboardIcon },
        { href: '/profile', label: t('common.profile'), icon: ProfileIcon },
      ]
    : [
        { href: '/', label: t('common.home'), icon: HomeIcon },
        { href: '/matches', label: t('common.matches'), icon: MatchesIcon },
        { href: '/browse', label: t('common.browse'), icon: BrowseIcon },
        { href: '/leaderboard', label: t('common.leaderboard'), icon: LeaderboardIcon },
        { href: '/login', label: t('common.login'), icon: ProfileIcon },
      ];
  
  // Desktop bottom nav (not used anymore, keeping for reference)
  const bottomNavItems = currentUser
    ? [...navItems, { href: '/profile', label: t('common.profile'), icon: ProfileIcon }]
    : [...navItems, { href: '/login', label: t('common.login'), icon: ProfileIcon }];
  
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear user cache
      clearUserCache();
      
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };
  
  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden md:block bg-bg-secondary border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link 
              href="/" 
              className="flex items-center space-x-2 sm:space-x-3"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg overflow-hidden bg-white shadow-sm border border-border">
                <img 
                  src="/images/logo.png" 
                  alt={"Dans L'respect"} 
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <span className="font-semibold text-lg sm:text-xl text-text-primary hidden sm:inline">
                {"Dans L'respect"}
              </span>
              <span className="font-semibold text-lg text-text-primary sm:hidden">
                {"Dans L'respect"}
              </span>
            </Link>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium 
                    transition-colors duration-200
                    ${isActive(item.href)
                      ? 'text-accent bg-accent/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
              
              {currentUser ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-bg-tertiary transition-colors duration-200"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-text-secondary hidden sm:inline">
                      {currentUser.name}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-200 disabled:opacity-50"
                  >
                    {loggingOut ? t('common.loggingOut') : t('common.logout')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-accent hover:text-accent-hover hover:bg-accent/10 transition-colors duration-200 ml-2"
                >
                  {t('common.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Bar (iOS Style - Floating) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <div className="px-4">
          <div className="max-w-md mx-auto bg-bg-secondary/80 backdrop-blur-2xl rounded-3xl border border-border/50 shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-around px-2 py-3">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-2xl
                      transition-all duration-200 min-w-[52px] relative
                      ${active
                        ? 'bg-bg-tertiary/70 text-accent'
                        : 'text-text-primary active:opacity-70'
                      }
                    `}
                  >
                    {active && (
                      <div className="absolute inset-0 rounded-2xl bg-accent/15" />
                    )}
                    <div className={`relative z-10 ${active ? 'text-accent' : 'text-text-primary'}`}>
                      <Icon isActive={active} />
                    </div>
                    <span className={`relative z-10 text-[10px] font-medium leading-tight ${active ? 'text-accent' : 'text-text-primary'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
