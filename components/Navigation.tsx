'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function Navigation() {
  const pathname = usePathname();
  const { currentUser } = useApp();
  
  const isActive = (path: string) => pathname === path;
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/matches', label: 'Matches' },
    { href: '/leaderboard', label: 'Leaderboard' },
  ];
  
  if (currentUser?.isAdmin) {
    navItems.push({ href: '/admin', label: 'Admin' });
  }
  
  return (
    <nav 
      className="glass-strong border-b border-white/10 sticky top-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl">⚽</span>
            <span className="font-bold text-lg sm:text-xl text-text-primary hidden sm:inline">Sports Predictions</span>
            <span className="font-bold text-lg text-text-primary sm:hidden">Predictions</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200
                  ${isActive(item.href)
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
