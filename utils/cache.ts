import { User } from '@/types';

// Cache keys
const USER_CACHE_KEY = 'sports-bets-user-cache';
const CACHE_TIMESTAMP_KEY = 'sports-bets-cache-timestamp';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Get cached user from localStorage
 * Returns null if cache is expired or doesn't exist
 */
export function getUserFromCache(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    // Check if cache is still valid (1 hour)
    const cacheAge = Date.now() - parseInt(timestamp, 10);
    if (cacheAge > CACHE_DURATION) {
      clearUserCache();
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading user cache:', error);
    clearUserCache();
    return null;
  }
}

/**
 * Save user to localStorage cache
 */
export function setUserCache(user: User | null): void {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } else {
      clearUserCache();
    }
  } catch (error) {
    console.error('Error setting user cache:', error);
  }
}

/**
 * Clear user cache from localStorage
 */
export function clearUserCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing user cache:', error);
  }
}
