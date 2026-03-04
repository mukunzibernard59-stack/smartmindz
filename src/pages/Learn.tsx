import React from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import LearnTabs from '@/components/learn/LearnTabs';

const Learn: React.FC = () => {
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
