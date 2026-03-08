import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Sparkles, BookOpen, MessageCircle, Mic, FlaskConical, Atom, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const subjectCards = [
    { icon: '📐', label: 'Mathematics', color: 'from-cyan-500/20 to-cyan-600/10' },
    { icon: '🔬', label: 'Science', color: 'from-teal-500/20 to-teal-600/10' },
    { icon: '📖', label: 'English', color: 'from-sky-500/20 to-sky-600/10' },
    { icon: '🏛️', label: 'History', color: 'from-indigo-500/20 to-indigo-600/10' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
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

      {/* Floating science icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[15%] text-primary/20"
        >
          <Atom className="h-12 w-12" />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[25%] left-[8%] text-accent/20"
        >
          <FlaskConical className="h-10 w-10" />
        </motion.div>
        <motion.div
          animate={{ y: [-8, 12, -8], rotate: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[30%] right-[8%] text-primary/15"
        >
          <Box className="h-8 w-8" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary font-medium text-sm mb-8"
            >
              <Sparkles className="h-4 w-4" />
              #1 AI-Powered Fast Learning Platform
            </motion.div>

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
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Get instant answers for <strong className="text-foreground">Math, Science, English</strong>, and more 
              with the power of AI. Your personal tutor that never sleeps.
            </motion.p>

            {/* CTA Buttons - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link to="/learn">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto glow-cyan hover:scale-[1.05] transition-all duration-300">
                  {t('hero.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
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

          {/* Right - 3D Brain Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <Spotlight size={400} className="z-10" />
            
            {/* Glowing orb */}
            <div className="relative w-[400px] h-[400px]">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent animate-pulse-soft blur-xl" />
              
              {/* Main orb */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 via-card to-accent/20 border border-primary/20 flex items-center justify-center shadow-[0_0_80px_-10px_hsl(187_85%_53%/0.4)]"
              >
                <Brain className="h-24 w-24 text-primary animate-pulse-soft" />
              </motion.div>

              {/* Orbiting particles */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full bg-primary/60"
                    style={{ top: '5%', left: '50%', boxShadow: '0 0 10px hsl(187 85% 53% / 0.5)' }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Subject Cards - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {subjectCards.map((card, index) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`relative p-6 rounded-2xl glass cursor-pointer group overflow-hidden`}
            >
              {/* Inner glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                <span className="text-3xl mb-3 block">{card.icon}</span>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{card.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">AI-Powered Lessons</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* SEO Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-sm text-muted-foreground font-medium"
        >
          🚀 The smart learning app trusted by thousands to learn new skills faster
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
