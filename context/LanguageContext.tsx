'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, getTranslation, TranslationKey } from '@/lib/translations';
import { useApp } from './AppContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, refreshCurrentUser } = useApp();
  // Default to French, but can be overridden by user preference
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('language') as Language;
      if (stored && (stored === 'fr' || stored === 'en')) {
        return stored;
      }
    }
    return 'fr'; // Default to French
  });

  // Update language when user changes
  useEffect(() => {
    if (currentUser?.language) {
      setLanguageState(currentUser.language);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', currentUser.language);
      }
    }
  }, [currentUser?.language]);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }

    // Update user's language preference in database if logged in
    if (currentUser) {
      try {
        await fetch('/api/users/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang }),
        });
        await refreshCurrentUser();
      } catch (error) {
        console.error('Error updating language:', error);
      }
    }
  }, [currentUser, refreshCurrentUser]);

  const t = useCallback((key: TranslationKey) => {
    return getTranslation(language, key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
