import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Brain, Zap, Target, Users, GraduationCap, Briefcase,
  TrendingUp, CheckCircle, ArrowRight, Sparkles, Clock, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const SEOContent: React.FC = () => {
  return (
    <div className="relative">
      {/* Section 1 */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What is the <span className="text-gradient-primary">Smart Mind App</span>?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                <strong className="text-foreground">Smart Mind</strong> is an innovative <strong className="text-foreground">AI learning app</strong> designed to help you 
                <strong className="text-foreground"> learn faster online</strong> than ever before. Whether you're a student preparing for exams, 
                a professional looking to upskill, or a lifelong learner exploring new topics, our 
                <strong className="text-foreground"> fast learning platform</strong> adapts to your unique learning style and pace.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Unlike traditional learning apps, the Smart Mind app uses advanced artificial intelligence to 
                create a truly <strong className="text-foreground">personalized learning app</strong> experience. Our AI tutor understands 
                how you learn best and adjusts content delivery in real-time.
              </p>
              <p className="text-lg leading-relaxed">
                Join thousands of learners who have discovered the power of AI-powered education with Smart Mind.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              How Our AI Helps You <span className="text-gradient-primary">Learn Faster</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Cutting-edge AI technology transforms how you learn
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: 'Adaptive Learning Engine', desc: 'Our AI analyzes your learning patterns to create a personalized curriculum that evolves with you.' },
              { icon: Zap, title: 'Instant AI Tutoring', desc: 'Get immediate answers to any question with step-by-step explanations in seconds.' },
              { icon: Target, title: 'Smart Quizzes', desc: 'AI-generated quizzes using spaced repetition to maximize long-term retention.' },
              { icon: Clock, title: 'Time-Optimized Sessions', desc: 'Learn more in less time with AI-identified most efficient paths to mastery.' },
              { icon: TrendingUp, title: 'Progress Analytics', desc: 'Track improvement with detailed insights and data-driven metrics.' },
              { icon: BookOpen, title: 'Multi-Subject Coverage', desc: 'From mathematics to languages, science to history—every subject covered.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass p-6 rounded-2xl group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Who Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Who Benefits from <span className="text-gradient-primary">Smart Mind</span>?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our fast learning app for students, professionals, and adults of all ages
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: GraduationCap, title: 'Students', color: 'primary',
                desc: 'The perfect fast learning app for students preparing for exams.',
                items: ['Exam preparation support', 'Homework help with explanations', 'All subjects covered'],
              },
              {
                icon: Briefcase, title: 'Professionals', color: 'accent',
                desc: 'Upskill efficiently with our online education platform.',
                items: ['Career skill development', 'Flexible learning schedule', 'Industry-relevant content'],
              },
              {
                icon: Users, title: 'Lifelong Learners', color: 'primary',
                desc: 'The ideal smart learning app for adults who never stop growing.',
                items: ['Explore any interest', 'Learn at your own pace', 'Brain training benefits'],
              },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass p-8 rounded-2xl text-center group hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{card.title}</h3>
                <p className="text-muted-foreground mb-4">{card.desc}</p>
                <ul className="text-left space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Why Choose */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Why Choose Smart Mind as Your <span className="text-gradient-primary">Best Learning App</span>?
            </h2>
            
            <div className="space-y-4">
              {[
                { icon: Sparkles, title: 'Personalized AI Education', desc: 'Every lesson, quiz, and recommendation is tailored specifically to your learning goals.' },
                { icon: Zap, title: 'Learn New Skills Faster', desc: 'Users report learning up to 3x faster compared to traditional study methods.' },
                { icon: Brain, title: 'Brain Training Benefits', desc: 'Regular use helps improve memory, focus, and problem-solving skills.' },
                { icon: Target, title: 'Unlimited Access', desc: 'AI tutor, voice learning, smart quizzes, and downloadable study materials.' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-6 glass rounded-2xl hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default SEOContent;
