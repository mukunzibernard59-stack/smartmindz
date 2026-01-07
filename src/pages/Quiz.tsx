import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import QuizCard from '@/components/QuizCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  FlaskConical, 
  BookText, 
  Globe2, 
  Monitor, 
  History,
  Brain,
  Sparkles
} from 'lucide-react';

const Quiz: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'science', name: 'Science', icon: FlaskConical, color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    { id: 'english', name: 'English', icon: BookText, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { id: 'geography', name: 'Geography', icon: Globe2, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { id: 'ict', name: 'ICT', icon: Monitor, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
    { id: 'history', name: 'History', icon: History, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  ];

  const startQuiz = () => {
    if (selectedSubject) {
      setQuizStarted(true);
    }
  };

  if (quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => setQuizStarted(false)}
                className="mb-6"
              >
                ← Back to subjects
              </Button>
              <QuizCard />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-medium text-sm mb-6">
                <Brain className="h-4 w-4" />
                AI-Powered Quizzes
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                {t('nav.quiz')}
              </h1>
              <p className="text-muted-foreground text-lg">
                Test your knowledge with AI-generated questions and instant feedback
              </p>
            </div>

            {/* Subject Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">Choose a Subject</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      selectedSubject === subject.id
                        ? 'border-primary bg-primary/5 shadow-primary'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl ${subject.color} flex items-center justify-center mx-auto mb-4 border`}>
                      <subject.icon className="h-7 w-7" />
                    </div>
                    <span className="font-semibold">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            {selectedSubject && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-8 animate-fade-in">
                <h3 className="font-semibold mb-4">Quiz Settings</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      className="p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl mb-6">
                  <span className="text-sm">Number of questions</span>
                  <div className="flex items-center gap-2">
                    {[5, 10, 15].map((num) => (
                      <button
                        key={num}
                        className="w-10 h-10 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={startQuiz} variant="hero" className="w-full" size="lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            )}

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-success">0%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div className="p-4 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-accent">0</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
