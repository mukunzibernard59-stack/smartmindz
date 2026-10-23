import { useState, useEffect, useCallback } from 'react';

const APP_VERSION = '2.0';
const APP_VERSION_KEY = 'smartmind_app_version';

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Version-based cache invalidation
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);
    if (storedVersion !== APP_VERSION) {
      // Clear stale caches but preserve chat history
      const chatHistory = localStorage.getItem('smartmind_chat_history');
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key !== 'smartmind_chat_history') {
          localStorage.removeItem(key);
        }
      });
      if (chatHistory) {
        localStorage.setItem('smartmind_chat_history', chatHistory);
      }
      localStorage.setItem(APP_VERSION_KEY, APP_VERSION);

      // Clear Cache Storage
      if ('caches' in window) {
        caches.keys().then(names => names.forEach(name => caches.delete(name)));
      }
    }
  }, []);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return { isOnline, appVersion: APP_VERSION };
}
