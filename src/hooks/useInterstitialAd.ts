import { useState, useCallback } from 'react';

interface UseInterstitialAdReturn {
  showInterstitial: boolean;
  openInterstitial: (onComplete?: () => void) => void;
  closeInterstitial: () => void;
  handleAdComplete: () => void;
}

export const useInterstitialAd = (): UseInterstitialAdReturn => {
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [completeCallback, setCompleteCallback] = useState<(() => void) | null>(null);

  const openInterstitial = useCallback((onComplete?: () => void) => {
    setCompleteCallback(() => onComplete || null);
    setShowInterstitial(true);
  }, []);

  const closeInterstitial = useCallback(() => {
    setShowInterstitial(false);
    setCompleteCallback(null);
  }, []);

  const handleAdComplete = useCallback(() => {
    completeCallback?.();
    setShowInterstitial(false);
    setCompleteCallback(null);
  }, [completeCallback]);

  return {
    showInterstitial,
    openInterstitial,
    closeInterstitial,
    handleAdComplete,
  };
};
