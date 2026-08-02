import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SEOContent from '@/components/SEOContent';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import ContentAd from '@/components/ContentAd';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <SEOContent />
        {/* Ad placed below real written content, never overlaying navigation */}
        <div className="container mx-auto px-4">
          <ContentAd />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
