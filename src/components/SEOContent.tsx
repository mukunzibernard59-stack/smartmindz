import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Target, 
  Users, 
  GraduationCap, 
  Briefcase,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  BookOpen
} from 'lucide-react';

const SEOContent: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Section 1: What is Smart Mind */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              What is the <span className="text-primary">Smart Mind App</span>?
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed mb-6">
                <strong>Smart Mind</strong> is an innovative <strong>AI learning app</strong> designed to help you 
                <strong> learn faster online</strong> than ever before. Whether you're a student preparing for exams, 
                a professional looking to upskill, or a lifelong learner exploring new topics, our 
                <strong> fast learning platform</strong> adapts to your unique learning style and pace.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Unlike traditional learning apps, the Smart Mind app uses advanced artificial intelligence to 
                create a truly <strong>personalized learning app</strong> experience. Our AI tutor understands 
                how you learn best and adjusts content delivery in real-time, ensuring maximum retention and 
                faster skill acquisition.
              </p>
              <p className="text-lg leading-relaxed">
                Join thousands of learners who have discovered the power of AI-powered education. With Smart Mind, 
                you're not just studying—you're training your brain to <strong>improve memory and focus</strong> while 
                mastering new skills efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How AI Helps You Learn Faster */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How Our AI Helps You <span className="text-primary">Learn Faster</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The Smart Mind app leverages cutting-edge AI technology to transform how you learn
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Adaptive Learning Engine</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your learning patterns, strengths, and areas for improvement to create 
                a personalized curriculum that evolves with you.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant AI Tutoring</h3>
              <p className="text-muted-foreground">
                Get immediate answers to any question. Our <strong>AI powered learning platform</strong> provides 
                step-by-step explanations in seconds, not hours.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Quizzes</h3>
              <p className="text-muted-foreground">
                AI-generated quizzes test your knowledge at optimal intervals, using spaced repetition 
                to maximize long-term retention.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time-Optimized Sessions</h3>
              <p className="text-muted-foreground">
                Learn more in less time. Our <strong>cognitive learning platform</strong> identifies the most 
                efficient path to mastery for every topic.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Analytics</h3>
              <p className="text-muted-foreground">
                Track your improvement with detailed insights. See exactly how your memory and focus 
                improve over time with data-driven metrics.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Subject Coverage</h3>
              <p className="text-muted-foreground">
                From mathematics to languages, science to history—our <strong>skill learning app</strong> covers 
                every subject you need to master.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Who Benefits from Smart Mind */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Who Benefits from <span className="text-primary">Smart Mind</span>?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our fast learning app for students, professionals, and adults of all ages
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Students</h3>
              <p className="text-muted-foreground mb-4">
                The perfect <strong>fast learning app for students</strong> preparing for exams, 
                completing homework, or exploring new subjects. Get instant help and improve grades.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Exam preparation support</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Homework help with explanations</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>All subjects covered</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Professionals</h3>
              <p className="text-muted-foreground mb-4">
                Upskill efficiently with our <strong>online education platform</strong>. 
                Learn new skills faster to advance your career without sacrificing work-life balance.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Career skill development</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Flexible learning schedule</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Industry-relevant content</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-success/5 to-success/10 border border-success/20">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Lifelong Learners</h3>
              <p className="text-muted-foreground mb-4">
                The ideal <strong>smart learning app for adults</strong> who never stop growing. 
                Explore any topic with AI-powered guidance and personalized recommendations.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Explore any interest</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Learn at your own pace</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Brain training benefits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Why Choose Smart Mind */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Why Choose Smart Mind as Your <span className="text-primary">Best Learning App</span>?
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personalized AI Education</h3>
                  <p className="text-muted-foreground">
                    Unlike one-size-fits-all learning platforms, Smart Mind delivers a truly 
                    <strong> personalized AI education app</strong> experience. Every lesson, quiz, and 
                    recommendation is tailored specifically to your learning goals and current level.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Learn New Skills Faster</h3>
                  <p className="text-muted-foreground">
                    Our <strong>learn new skills faster app</strong> uses scientifically-proven techniques 
                    combined with AI optimization. Users report learning up to 3x faster compared to 
                    traditional study methods.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Brain Training Benefits</h3>
                  <p className="text-muted-foreground">
                    Smart Mind isn't just about learning content—it's a complete <strong>brain training app</strong> that 
                    strengthens your cognitive abilities. Regular use helps improve memory, focus, and 
                    problem-solving skills.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
                  <p className="text-muted-foreground">
                    Get unlimited access to our AI tutor, voice learning mode, smart quizzes, and 
                    downloadable study materials. No hidden limits—just pure, effective learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your <span className="text-primary">Fast Learning Journey</span> Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students, professionals, and lifelong learners who are already 
              using the Smart Mind app to learn faster online. Experience the power of AI-powered 
              personalized learning—completely free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button variant="hero-secondary" size="xl" className="gap-2 w-full sm:w-auto">
                  <Brain className="h-5 w-5" />
                  Try Smart Quizzes
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              ✓ No credit card required &nbsp; ✓ Instant access &nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SEOContent;
