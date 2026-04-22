import React from 'react';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';

interface ToolPageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const ToolPage: React.FC<ToolPageProps> = ({ title, description, icon, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto px-3 sm:px-4 max-w-5xl">
          <div className="py-3">
            <BackButton />
          </div>
          <header className="mb-5 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              {icon && (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shrink-0">
                  {icon}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{description}</p>
            )}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default ToolPage;
