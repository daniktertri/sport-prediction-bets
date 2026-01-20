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
    <nav className="bg-bg-secondary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <span className="text-xl sm:text-2xl">⚽</span>
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
          </div>
        </div>
      </div>
    </nav>
  );
}
