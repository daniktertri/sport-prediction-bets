// Admin page - Main admin dashboard
'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const { currentUser } = useApp();
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-text-primary">Access Denied</h1>
          <p className="text-text-secondary mb-6">
            You need admin privileges to access this page.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const adminSections = [
    {
      title: 'Team Management',
      description: 'Create and edit teams, add players',
      href: '/admin/teams',
      icon: '👥',
    },
    {
      title: 'Group Assignment',
      description: 'Assign teams to groups',
      href: '/admin/groups',
      icon: '📊',
    },
    {
      title: 'Match Management',
      description: 'Create and edit matches',
      href: '/admin/matches',
      icon: '⚽',
    },
    {
      title: 'Match Results',
      description: 'Set final scores and man of the match',
      href: '/admin/results',
      icon: '📝',
    },
  ];
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-text-primary">Admin Panel</h1>
          <p className="text-text-secondary">
            Manage teams, groups, matches, and results
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href} className="group">
              <Card hover className="p-6" glow="cyan">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{section.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 text-text-primary">
                      {section.title}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {section.description}
                    </p>
                  </div>
                  <div className="text-neon-cyan group-hover:text-neon-green transition-colors">→</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
