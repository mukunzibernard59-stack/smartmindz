import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SEOContent from '@/components/SEOContent';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import BannerAd from '@/components/ads/BannerAd';
import { getAdConfig } from '@/lib/adManager';

const Index: React.FC = () => {
  const adConfig = getAdConfig();

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <SEOContent />
      </main>
      {/* Banner Ad above footer */}
      <div className="container mx-auto px-4 py-4 relative z-10">
        <BannerAd slot={adConfig.web.bannerHome} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
