import { useState, useCallback } from 'react';

interface UseRewardedAdReturn {
  showRewardedAd: boolean;
  rewardDescription: string;
  openRewardedAd: (description: string, onReward: () => void) => void;
  closeRewardedAd: () => void;
  handleRewardEarned: () => void;
}

export const useRewardedAd = (): UseRewardedAdReturn => {
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardCallback, setRewardCallback] = useState<(() => void) | null>(null);

  const openRewardedAd = useCallback((description: string, onReward: () => void) => {
    setRewardDescription(description);
    setRewardCallback(() => onReward);
    setShowRewardedAd(true);
  }, []);

  const closeRewardedAd = useCallback(() => {
    setShowRewardedAd(false);
    setRewardCallback(null);
  }, []);

  const handleRewardEarned = useCallback(() => {
    rewardCallback?.();
  }, [rewardCallback]);

  return {
    showRewardedAd,
    rewardDescription,
    openRewardedAd,
    closeRewardedAd,
    handleRewardEarned,
  };
};
