import React from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Brain, Lightbulb, Target } from 'lucide-react';

const Learn: React.FC = () => {
  const { t } = useLanguage();

  const tips = [
    { icon: Lightbulb, text: "Ask questions in any language you prefer" },
    { icon: Target, text: "Be specific for better answers" },
    { icon: Brain, text: "Request step-by-step explanations" },
    { icon: BookOpen, text: "Ask for practice problems" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                {t('nav.learn')}
              </h1>
              <p className="text-muted-foreground">
                Ask any question and get instant explanations from your AI tutor
              </p>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <tip.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip.text}</span>
                </div>
              ))}
            </div>

            {/* Chat Interface */}
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;
