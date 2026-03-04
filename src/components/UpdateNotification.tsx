import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const APP_VERSION = '3.0.0';
const VERSION_KEY = 'smartmind_last_seen_version';

const UPDATES = [
  'Navigation simplified: Home, Learn, Quizzes, Dev Mode',
  'AI Assistant & AI Tutor merged into Learn workspace',
  'New Generate Video feature with full script production',
  'Intelligent retry logic for stable AI responses',
  'Enhanced Dev Mode with improved IDE experience',
];

const UpdateNotification: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem(VERSION_KEY);
    if (lastSeen !== APP_VERSION) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

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
          className="fixed bottom-6 right-6 z-50 max-w-xs w-full"
        >
          <div className="glass-strong rounded-2xl p-4 border border-primary/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  What's New — v{APP_VERSION}
                </span>
              </div>
              <button
                onClick={dismiss}
                className="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-1.5">
              {UPDATES.map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;
