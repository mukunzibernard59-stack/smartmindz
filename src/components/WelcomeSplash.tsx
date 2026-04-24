import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';

const SESSION_KEY = 'welcome_shown_this_session';

const WelcomeSplash: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (loading || !user) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, '1');
    setShow(true);
    const timer = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(timer);
  }, [loading, user]);

  const displayName =
    profile?.full_name?.trim() ||
    (user?.user_metadata as any)?.full_name ||
    user?.email?.split('@')[0] ||
    'there';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center px-6"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl font-extrabold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Welcome <span className="text-gradient-primary">{displayName}</span> 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm sm:text-base"
            >
              Great to see you back. Let's keep learning!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeSplash;
