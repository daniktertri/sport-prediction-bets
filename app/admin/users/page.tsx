// Admin Users page - View all users with emails
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { User } from '@/types';

export default function AdminUsersPage() {
  const { currentUser } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-semibold mb-4 text-text-primary">Access Denied</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-semibold text-text-primary">Users Management</h1>
            <p className="text-text-secondary mt-1">View all users and their contact information</p>
          </div>
        </div>
        
        {loading ? (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">Loading users...</p>
          </Card>
        ) : (
          <Card className="overflow-hidden" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-tertiary border-b border-border">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Bets
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Admin
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg-secondary divide-y divide-border">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-bg-tertiary transition-colors duration-200"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-primary">
                          {user.username || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-primary">
                          {user.name}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {user.email ? (
                          <a
                            href={`mailto:${user.email}`}
                            className="text-sm text-accent hover:text-accent-hover transition-colors"
                          >
                            {user.email}
                          </a>
                        ) : (
                          <span className="text-sm text-text-secondary">No email</span>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-text-primary">
                          {user.totalPoints}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm text-text-secondary">
                          {user.totalBets}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
                        {user.isAdmin ? (
                          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent border border-accent/20">
                            Admin
                          </span>
                        ) : (
                          <span className="text-xs text-text-secondary">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        
        {!loading && users.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-text-secondary">No users found.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
