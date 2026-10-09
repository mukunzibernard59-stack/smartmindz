import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const Hero: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
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
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Learn Smarter.{' '}
            <span className="text-gradient-primary text-glow">Get Help Faster.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-foreground/85 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Get instant answers/help for <strong className="text-foreground">Tvet notes,letter writing,language translation</strong>, and more 
            with the power of smart technology. Your personal tutor that never sleeps.
          </motion.p>

        </div>

        {/* SEO Tagline */}
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center text-sm text-foreground/75 font-medium"
        >
          A free smart learning app built for Rwandan students
        </motion.p>

      </div>
    </section>
  );
};

export default Hero;
