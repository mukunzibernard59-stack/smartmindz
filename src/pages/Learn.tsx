import React from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import LearnTabs from '@/components/learn/LearnTabs';
import BannerAd from '@/components/ads/BannerAd';
import { getAdConfig } from '@/lib/adManager';

const Learn: React.FC = () => {
  const adConfig = getAdConfig();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <BackButton />
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Learn
              </h1>
              <p className="text-muted-foreground">
                AI Assistant, Tutor, and Video Generation — all in one place
              </p>
            </div>
            <LearnTabs />
            {/* Banner Ad at bottom of Learn page */}
            <div className="mt-6">
              <BannerAd slot={adConfig.web.bannerLearn} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
