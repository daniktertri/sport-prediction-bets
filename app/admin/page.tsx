// Admin page - Main admin dashboard
'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const { currentUser } = useApp();
  const { t } = useLanguage();
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">{t('admin.accessDenied')}</h1>
          <p className="text-text-secondary mb-6">
            {t('admin.needPrivileges')}
          </p>
          <Link href="/">
            <Button>{t('admin.goHome')}</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const adminSections = [
    {
      title: t('admin.teamManagement'),
      description: t('admin.teamManagementDesc'),
      href: '/admin/teams',
      icon: '👥',
    },
    {
      title: 'Player Management',
      description: 'Create and manage players independently',
      href: '/admin/players',
      icon: '🏃',
    },
    {
      title: t('admin.groupAssignment'),
      description: t('admin.groupAssignmentDesc'),
      href: '/admin/groups',
      icon: '📊',
    },
    {
      title: t('admin.matchManagement'),
      description: 'Create, edit matches and set results in one place',
      href: '/admin/matches',
      icon: '⚽',
    },
    {
      title: 'Users Management',
      description: 'View all users and their contact information',
      href: '/admin/users',
      icon: '👥',
    },
  ];
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-text-primary">{t('admin.panel')}</h1>
          <p className="text-text-secondary">
            {t('admin.manage')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.href} className="group">
              <Card hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{section.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-text-primary">
                      {section.title}
                    </h2>
                    <p className="text-sm text-text-secondary">
                      {section.description}
                    </p>
                  </div>
                  <div className="text-accent group-hover:text-accent-hover transition-colors duration-200">→</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
