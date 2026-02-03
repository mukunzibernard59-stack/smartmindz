import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SEOContent from '@/components/SEOContent';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SEOContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
