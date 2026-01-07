import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Subjects from '@/components/Subjects';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Subjects />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
