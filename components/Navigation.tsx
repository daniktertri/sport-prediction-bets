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
      className="glass-strong border-b border-neon-cyan/20 sticky top-0 z-50"
      style={{
        background: 'rgba(18, 19, 26, 0.9)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">⚽</span>
            <span className="font-bold text-lg sm:text-xl text-text-primary hidden sm:inline bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
              Sports Predictions
            </span>
            <span className="font-bold text-lg text-text-primary sm:hidden bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
              Predictions
            </span>
          </Link>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold 
                  transition-all duration-300 neon-underline
                  ${isActive(item.href)
                    ? 'text-neon-cyan'
                    : 'text-text-secondary hover:text-neon-cyan'
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
