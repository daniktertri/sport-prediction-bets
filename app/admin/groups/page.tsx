// Admin Groups page - Assign teams to groups
'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminGroupsPage() {
  const { teams, updateTeam, currentUser } = useApp();
  
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const groups = ['A', 'B', 'C', 'D'] as const;
  const unassignedTeams = teams.filter(t => !t.group);
  
  const handleGroupChange = (teamId: string, group: 'A' | 'B' | 'C' | 'D' | null) => {
    updateTeam(teamId, { group });
  };
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold">Group Assignment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Assign teams to groups by selecting from the dropdown
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group) => {
            const groupTeams = teams.filter(t => t.group === group);
            
            return (
              <Card key={group} className="p-6">
                <h2 className="text-xl font-bold mb-4">Group {group}</h2>
                <div className="space-y-3 mb-4">
                  {groupTeams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{team.logo || team.flag}</span>
                        <span className="font-medium">{team.name}</span>
                      </div>
                      <select
                        value={group}
                        onChange={(e) => handleGroupChange(team.id, e.target.value as any || null)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value={group}>Group {group}</option>
                        <option value="">Remove</option>
                        {groups.filter(g => g !== group).map(g => (
                          <option key={g} value={g}>Group {g}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                
                {groupTeams.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No teams assigned</p>
                )}
              </Card>
            );
          })}
        </div>
        
        {unassignedTeams.length > 0 && (
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold mb-4">Unassigned Teams</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {unassignedTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{team.logo || team.flag}</span>
                    <span className="font-medium text-sm">{team.name}</span>
                  </div>
                  <select
                    value=""
                    onChange={(e) => handleGroupChange(team.id, e.target.value as any || null)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="">Assign...</option>
                    {groups.map(g => (
                      <option key={g} value={g}>Group {g}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
