
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, BookOpen, MessageCircle, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();

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
    <section className="relative min-h-[480px] sm:min-h-[600px] flex items-center pt-24 pb-16 overflow-hidden">
      <img
        src="/smartpc.jpg"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            className="text-base sm:text-lg md:text-xl text-foreground/85 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Get instant answers/help for <strong className="text-foreground">Tvet notes,letter writing,language translation</strong>, and more 
        {/* SEO Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-muted-foreground font-medium"
          className="mt-10 text-center text-sm text-foreground/75 font-medium"
        >
          A free smart learning app built for Rwandan students
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-8 flex justify-center px-4"
        >
          <div className="relative w-full max-w-[1000px] rounded-[2rem] p-1 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
            <img
              src="/smartpc.jpg"
              alt="SmartMindz learning app"
              className="w-full h-auto rounded-[1.75rem] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
