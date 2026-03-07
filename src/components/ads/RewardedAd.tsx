import React, { useEffect, useState, useCallback } from 'react';
import { Gift, Play, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RewardedAdProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
  rewardDescription?: string;
}

const RewardedAd: React.FC<RewardedAdProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
  rewardDescription = 'extra AI generations',
}) => {
  const [phase, setPhase] = useState<'prompt' | 'watching' | 'complete'>('prompt');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase('prompt');
      setProgress(0);
    }
  }, [isOpen]);

  const handleWatch = useCallback(() => {
    setPhase('watching');
    setProgress(0);

    // Simulate watching an ad (15 seconds)
    const duration = 15;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += 0.5;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        clearInterval(timer);
        setPhase('complete');
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = useCallback(() => {
    onRewardEarned();
    onClose();
  }, [onRewardEarned, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            {phase === 'complete' ? 'Reward Earned!' : 'Watch to Unlock'}
          </DialogTitle>
        </DialogHeader>

        {phase === 'prompt' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Watch a short ad to unlock <strong>{rewardDescription}</strong>
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                No thanks
              </Button>
              <Button onClick={handleWatch} className="flex-1 gap-2">
                <Play className="h-4 w-4" />
                Watch Ad
              </Button>
            </div>
          </div>
        )}

        {phase === 'watching' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-full h-[200px] bg-secondary/50 rounded-xl flex items-center justify-center border border-border">
              <p className="text-sm text-muted-foreground">Ad playing...</p>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please watch the full ad to earn your reward
            </p>
          </div>
        )}

        {phase === 'complete' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">
              You've earned <strong>{rewardDescription}</strong>!
            </p>
            <Button onClick={handleClaim} className="w-full gap-2">
              <Gift className="h-4 w-4" />
              Claim Reward
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RewardedAd;
