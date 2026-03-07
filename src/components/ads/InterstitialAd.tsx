import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { canShowInterstitial, recordInterstitialShown } from '@/lib/adManager';
import { cn } from '@/lib/utils';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  onAdComplete?: () => void;
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({
  isOpen,
  onClose,
  onAdComplete,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    if (!canShowInterstitial()) {
      onAdComplete?.();
      onClose();
      return;
    }

    recordInterstitialShown();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose, onAdComplete]);

  const handleSkip = useCallback(() => {
    onAdComplete?.();
    onClose();
  }, [onAdComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="text-xs text-muted-foreground">Sponsored</span>
          {canSkip ? (
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Skip <X className="h-3 w-3" />
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Skip in {countdown}s
            </span>
          )}
        </div>

        {/* Ad Content Placeholder */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-secondary/20">
          <div className="w-full h-[250px] bg-secondary/50 rounded-xl flex items-center justify-center border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Advertisement</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Ad content loads here</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border text-center">
          <p className="text-[10px] text-muted-foreground">
            Ads help keep SmartMind free
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;
