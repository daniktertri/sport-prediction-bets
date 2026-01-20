'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { clearUserCache } from '@/utils/cache';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const [loggingOut, setLoggingOut] = useState(false);
  const [footballAnimation, setFootballAnimation] = useState(null);
  
  useEffect(() => {
    fetch('/lottie/football.json')
      .then(response => response.json())
      .then(data => setFootballAnimation(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
  }, []);
  
  const isActive = (path: string) => pathname === path;
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/matches', label: 'Matches' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];
  
  if (currentUser?.isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin' });
  }
  
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
    <nav className="bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              {footballAnimation ? (
                <Lottie animationData={footballAnimation} loop={true} />
              ) : (
                <span className="text-xl sm:text-2xl">⚽</span>
              )}
            </div>
            <span className="font-semibold text-lg sm:text-xl text-text-primary hidden sm:inline">
              Sports Predictions
            </span>
            <span className="font-semibold text-lg text-text-primary sm:hidden">
              Predictions
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
                <span className="text-xs sm:text-sm text-text-secondary hidden sm:inline">
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-200 disabled:opacity-50"
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-accent hover:text-accent-hover hover:bg-accent/10 transition-colors duration-200 ml-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
