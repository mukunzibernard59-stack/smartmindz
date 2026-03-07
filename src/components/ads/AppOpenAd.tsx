import React, { useEffect, useState } from 'react';
import { canShowAppOpen, recordAppOpenShown } from '@/lib/adManager';

const APP_OPEN_DURATION = 4000; // 4 seconds

const AppOpenAd: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    // Only show on initial app load, and respect frequency cap
    if (!canShowAppOpen()) return;

    // Small delay to let the app render first
    const showTimer = setTimeout(() => {
      setVisible(true);
      recordAppOpenShown();
    }, 500);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const autoClose = setTimeout(() => {
      setVisible(false);
    }, APP_OPEN_DURATION);

    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-sm mx-4">
        {/* App branding */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            SmartMind
          </h1>
          <p className="text-sm text-muted-foreground">Learn Faster with AI</p>
        </div>

        {/* Ad placeholder */}
        <div className="w-full h-[250px] bg-card rounded-2xl border border-border flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sponsored</p>
            <p className="text-xs text-muted-foreground/60 mt-1">App open ad</p>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="space-y-2">
          <div className="w-48 mx-auto bg-secondary rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${((4 - countdown) / 4) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Loading SmartMind... {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppOpenAd;
