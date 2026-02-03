import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, BookOpen, Brain, MessageCircle, Mic } from 'lucide-react';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden gradient-hero">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-8 animate-slide-up">
            <Sparkles className="h-4 w-4" />
            #1 AI-Powered Fast Learning Platform
          </div>

          {/* Main Heading - SEO optimized H1 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Smart Mind App:{' '}
            <span className="text-gradient-primary">Learn Faster with AI</span>
          </h1>

          {/* Subtitle - SEO optimized intro */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            The <strong>Smart Mind app</strong> is your ultimate <strong>fast learning platform</strong> powered by AI. 
            Learn faster online with personalized lessons, boost your memory, improve focus, and master new skills 
            efficiently. Perfect for students, professionals, and lifelong learners.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/learn">
              <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                {t('hero.cta')}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/quiz">
              <Button variant="hero-secondary" size="xl" className="gap-2 w-full sm:w-auto">
                <Brain className="h-5 w-5" />
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Brain, label: 'AI Learning App' },
              { icon: MessageCircle, label: 'Personalized Learning' },
              { icon: Mic, label: 'Voice-Powered Study' },
              { icon: BookOpen, label: 'Skill Mastery' },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
              >
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* SEO Tagline */}
          <p className="mt-8 text-sm text-muted-foreground font-medium animate-slide-up" style={{ animationDelay: '0.5s' }}>
            🚀 The smart learning app trusted by thousands to learn new skills faster
          </p>
        </div>

        {/* Floating Cards Preview */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="relative bg-card rounded-3xl border border-border shadow-lg overflow-hidden">
            {/* Chat Preview Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-secondary/30">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Smart Mind Chat</span>
            </div>

            {/* Chat Preview Content */}
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-md">
                  <p className="text-sm">{t('chat.welcome')}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                  <p className="text-sm">How do I solve quadratic equations?</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3 max-w-lg">
                  <p className="text-sm">Great question! A quadratic equation has the form ax² + bx + c = 0. Let me show you the steps...</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-md">Step-by-step</span>
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-md">Examples included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute -top-6 -right-6 bg-accent/20 w-24 h-24 rounded-2xl rotate-12 animate-float hidden lg:block" />
          <div className="absolute -bottom-6 -left-6 bg-primary/20 w-32 h-32 rounded-2xl -rotate-12 animate-float hidden lg:block" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
