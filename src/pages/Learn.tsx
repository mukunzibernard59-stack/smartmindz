import React from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import LearnTabs from '@/components/learn/LearnTabs';
import BannerAd from '@/components/ads/BannerAd';
import { getAdConfig } from '@/lib/adManager';

const Learn: React.FC = () => {
  const adConfig = getAdConfig();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col pt-16 pb-2 overflow-hidden">
        <div className="container mx-auto px-3 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center gap-2 py-2 shrink-0">
            <BackButton />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full">
            <LearnTabs />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
