'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { setUserCache } from '@/utils/cache';

export default function LoginPage() {
  const router = useRouter();
  const { refreshCurrentUser } = useApp();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { username, password }
        : { username, password, name, email, firstName, lastName };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('login.error'));
        setLoading(false);
        return;
      }

      // Cache user data immediately for instant UI
      if (data.user) {
        setUserCache(data.user);
      }
      
      // Refresh current user in context (will also update cache)
      await refreshCurrentUser();
      
      // Redirect to home
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(t('login.error'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          {/* AS Dauphine Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md border border-border">
              <img 
                src="/images/newlogo.png" 
                alt="Dauphine League" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            {isLogin ? t('login.title') : t('login.registerTitle')}
          </h1>
          <p className="text-text-secondary">
            {isLogin
              ? t('login.signIn')
              : t('login.createAccount')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">
                  {t('login.firstName')}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">
                  {t('login.lastName')}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required={!isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-text-primary">
                  {t('login.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                  required={!isLogin}
                  placeholder="Display name"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              {t('login.username')}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-text-primary">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-text-primary">
              {t('login.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-bg-primary text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors duration-200"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? t('common.loading') : isLogin ? t('login.submit') : t('login.register')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-accent hover:text-accent-hover text-sm font-medium transition-colors duration-200"
          >
            {isLogin
              ? t('login.noAccount')
              : t('login.haveAccount')}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors duration-200"
          >
            {t('common.backToHome')}
          </Link>
        </div>
      </Card>
    </div>
  );
}
