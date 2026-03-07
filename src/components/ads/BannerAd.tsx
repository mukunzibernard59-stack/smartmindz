import React, { useEffect, useRef, useState } from 'react';
import { loadAdSense, pushAd, isNativeApp, getAdConfig } from '@/lib/adManager';
import { cn } from '@/lib/utils';

interface BannerAdProps {
  slot?: string;
  className?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

const BannerAd: React.FC<BannerAdProps> = ({ 
  slot, 
  className,
  format = 'auto' 
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const config = getAdConfig();

  useEffect(() => {
    if (isNativeApp()) return; // Native ads handled by Capacitor plugin

    const initAd = async () => {
      try {
        await loadAdSense();
        pushAd();
        setAdLoaded(true);
      } catch {
        setAdError(true);
      }
    };

    initAd();
  }, []);

  if (isNativeApp() || adError) return null;

  return (
    <div 
      ref={adRef}
      className={cn(
        'w-full flex items-center justify-center overflow-hidden',
        'min-h-[50px] md:min-h-[90px]',
        className
      )}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={config.publisherId}
        data-ad-slot={slot || config.web.bannerHome}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {!adLoaded && !adError && (
        <div className="w-full h-[50px] md:h-[90px] bg-secondary/30 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Ad</span>
        </div>
      )}
    </div>
  );
};

export default BannerAd;
