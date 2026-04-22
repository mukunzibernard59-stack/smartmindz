import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, BookOpen, MessageCircle, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Space background effects */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Animated glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
        
        {/* Light streaks */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-accent/8 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Learn Smarter.{' '}
            <span className="text-gradient-primary text-glow">Think Faster.</span>{' '}
            <span className="inline-block">🚀</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Get instant answers for <strong className="text-foreground">Math, Science, English</strong>, and more 
            with the power of AI. Your personal tutor that never sleeps.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: Brain, label: 'AI Learning' },
              { icon: MessageCircle, label: 'Personalized' },
              { icon: Mic, label: 'Voice Study' },
              { icon: BookOpen, label: 'All Subjects' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm"
              >
                <item.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* SEO Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-muted-foreground font-medium"
        >
          🚀 The smart learning app trusted by thousands to learn new skills faster
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
