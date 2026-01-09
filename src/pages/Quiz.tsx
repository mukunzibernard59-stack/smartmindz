import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import QuizCard from '@/components/QuizCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  FlaskConical, 
  BookText, 
  Globe2, 
  Monitor, 
  History,
  Brain,
  Sparkles,
  Search,
  Music,
  Palette,
  Languages,
  Scale,
  Heart,
  Dumbbell,
  Atom,
  Building,
  Landmark
} from 'lucide-react';

const Quiz: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [numQuestions, setNumQuestions] = useState<number>(10);

  const allSubjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'science', name: 'Science', icon: FlaskConical, color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    { id: 'english', name: 'English', icon: BookText, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { id: 'geography', name: 'Geography', icon: Globe2, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { id: 'ict', name: 'ICT', icon: Monitor, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
    { id: 'history', name: 'History', icon: History, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { id: 'physics', name: 'Physics', icon: Atom, color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
    { id: 'biology', name: 'Biology', icon: Heart, color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    { id: 'art', name: 'Art & Design', icon: Palette, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-violet-500/10 text-violet-600 border-violet-500/20' },
    { id: 'languages', name: 'Languages', icon: Languages, color: 'bg-teal-500/10 text-teal-600 border-teal-500/20' },
    { id: 'law', name: 'Law', icon: Scale, color: 'bg-slate-500/10 text-slate-600 border-slate-500/20' },
    { id: 'pe', name: 'Physical Education', icon: Dumbbell, color: 'bg-lime-500/10 text-lime-600 border-lime-500/20' },
    { id: 'economics', name: 'Economics', icon: Building, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    { id: 'civics', name: 'Civics', icon: Landmark, color: 'bg-sky-500/10 text-sky-600 border-sky-500/20' },
  ];

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return allSubjects;
    return allSubjects.filter(subject => 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const startQuiz = () => {
    if (selectedSubject) {
      setQuizStarted(true);
    }
  };

  const selectedSubjectData = allSubjects.find(s => s.id === selectedSubject);

  if (quizStarted && selectedSubjectData) {
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
              <QuizCard 
                subject={selectedSubjectData.name}
                difficulty={difficulty}
                numQuestions={numQuestions}
              />
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
          <div className="max-w-4xl mx-auto">
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

            {/* Search Bar */}
            <div className="relative mb-8 max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for any subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl border-2 focus:border-primary"
              />
            </div>

            {/* Subject Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {searchQuery ? `Results for "${searchQuery}"` : 'Choose a Subject'}
              </h2>
              {filteredSubjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No subjects found for "{searchQuery}"</p>
                  <p className="text-sm text-muted-foreground">Try a different search term or select from popular subjects below</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredSubjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubject(subject.id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                        selectedSubject === subject.id
                          ? 'border-primary bg-primary/5 shadow-primary'
                          : 'border-border hover:border-primary/50 bg-card'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center mx-auto mb-3 border`}>
                        <subject.icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-sm">{subject.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Difficulty Selection */}
            {selectedSubject && (
              <div className="bg-card rounded-2xl border border-border p-6 mb-8 animate-fade-in max-w-xl mx-auto">
                <h3 className="font-semibold mb-4">Quiz Settings</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {['Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-3 rounded-xl border transition-colors text-sm font-medium ${
                        difficulty === level 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
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
                        onClick={() => setNumQuestions(num)}
                        className={`w-10 h-10 rounded-lg border transition-colors text-sm font-medium ${
                          numQuestions === num 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:border-primary hover:bg-primary/5'
                        }`}
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
            <div className="grid grid-cols-3 gap-4 text-center max-w-xl mx-auto">
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
