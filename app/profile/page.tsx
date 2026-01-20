'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, refreshCurrentUser, users } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    avatar: null as string | null,
    instagram: '',
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setFormData({
      name: currentUser.name || '',
      avatar: currentUser.avatar || null,
      instagram: currentUser.instagram || '',
    });
  }, [currentUser, router]);

  // Get user stats from users list
  const userStats = users.find(u => u.id === currentUser?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          avatar: formData.avatar,
          instagram: formData.instagram,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      await refreshCurrentUser();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen py-12 bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-accent hover:text-accent-hover mb-2 inline-block transition-colors duration-200">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-text-primary">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-text-primary">Edit Profile</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                    required
                  />
                </div>

                <ImageUpload
                  currentImage={formData.avatar || undefined}
                  onImageChange={(base64) => setFormData({ ...formData, avatar: base64 })}
                  label="Profile Picture"
                  maxSizeMB={10}
                />

                <div>
                  <label className="block text-sm font-medium mb-1 text-text-primary">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Enter your Instagram username (with or without @)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-semibold text-accent mb-1">
                    {userStats?.totalPoints || 0}
                  </div>
                  <div className="text-sm text-text-secondary">Total Points</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xl font-semibold text-text-primary">
                      {userStats?.exactScores || 0}
                    </div>
                    <div className="text-xs text-text-secondary">Exact Scores</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-text-primary">
                      {userStats?.winnerOnly || 0}
                    </div>
                    <div className="text-xs text-text-secondary">Winner Only</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">Account Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-text-secondary mb-1">Username</div>
                  <div className="text-text-primary font-medium">{(currentUser as any).username || 'N/A'}</div>
                </div>
                {currentUser.email && (
                  <div>
                    <div className="text-text-secondary mb-1">Email</div>
                    <div className="text-text-primary font-medium">{currentUser.email}</div>
                  </div>
                )}
                {currentUser.isAdmin && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                      Admin
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-6">
              <Button variant="danger" className="w-full" onClick={handleLogout}>
                Logout
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
