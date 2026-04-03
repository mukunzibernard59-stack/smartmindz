import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const APP_VERSION = '4.0.0';
const VERSION_KEY = 'smartmind_last_seen_version';
const ACCOUNT_CREATED_KEY = 'smartmind_account_created_version';

const UPDATES = [
  'Google Sign-In — sign in faster with your Google account',
  'Enhanced auth with real-time form validation',
  'Improved letter designer with inline editing',
  'Better responsive design across all devices',
  'Smart update notifications for existing users',
];

const UpdateNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // If no user, don't show
    if (!user) return;

    // Mark version when account first seen
    const accountVersion = localStorage.getItem(ACCOUNT_CREATED_KEY);
    if (!accountVersion) {
      // New user or first time tracking — set to current version, don't show
      localStorage.setItem(ACCOUNT_CREATED_KEY, APP_VERSION);
      localStorage.setItem(VERSION_KEY, APP_VERSION);
      return;
    }

    // If user created at this version, don't show
    if (accountVersion === APP_VERSION) return;

    // Existing user — check if they've seen this update
    const lastSeen = localStorage.getItem(VERSION_KEY);
    if (lastSeen === APP_VERSION) return;

    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, [user, loading]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(VERSION_KEY, APP_VERSION);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 sm:max-w-sm w-auto"
        >
          <div className="glass-strong rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">What's New</span>
                  <span className="text-xs text-muted-foreground ml-2">v{APP_VERSION}</span>
                </div>
              </div>
              <button onClick={dismiss} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            {!showDetails ? (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">🎉 New update available! Check what's new.</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="hero" className="flex-1 gap-1" onClick={() => setShowDetails(true)}>
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-border/50" onClick={dismiss}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pb-4">
                <ul className="space-y-2 mb-3">
                  {UPDATES.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="outline" className="w-full border-border/50" onClick={dismiss}>
                  Got it!
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;
