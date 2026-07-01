import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatInterface from '@/components/ChatInterface';
import SubjectNotes from '@/components/SubjectNotes';
import QuickQuiz from '@/components/learn/QuickQuiz';
import { BookOpen, Brain, Lightbulb, Target, Search, ArrowRight, HelpCircle, Library as LibraryIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AITutorTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [subjectSearch, setSubjectSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizSubject, setQuizSubject] = useState<string | null>(null);

  const tips = [
    { icon: Lightbulb, text: "Ask questions in any language" },
    { icon: Target, text: "Be specific for better answers" },
    { icon: Brain, text: "Request step-by-step explanations" },
    { icon: BookOpen, text: "Ask for practice problems" },
  ];

  const suggestedSubjects = [
    "Website Development", "Machine Learning", "Mathematics", "Physics",
    "Biology", "Chemistry", "History", "Literature",
  ];

  const handleSubjectSearch = () => {
    if (subjectSearch.trim()) setSelectedSubject(subjectSearch.trim());
  };

  const handleStartQuiz = (subject: string) => {
    setQuizSubject(subject);
  };

  return (
    <div className="space-y-6">
      {/* Rwanda TVET Library CTA */}
      <button
        onClick={() => navigate('/library')}
        className="group relative w-full text-left rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 overflow-hidden hover:border-primary/60 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.5)] transition-all"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold uppercase tracking-wider mb-2">
               New
            </div>
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <LibraryIcon className="h-5 w-5 text-primary" />
              
            </h2>
            <p className="text-sm text-muted-foreground">
              Official sectors • L3/L4/L5 levels • Modules, notes and PDFs — all inside the app.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>

      {/* Subject Notes Search */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Explore Subject Notes
        </h2>
        <p className="text-sm text-muted-foreground mb-3">Search any subject for detailed study notes</p>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubjectSearch()}
              placeholder="Search any subject..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          </div>
          <Button onClick={handleSubjectSearch} variant="hero" disabled={!subjectSearch.trim()} className="gap-2">
            Get Notes <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedSubjects.map(s => (
            <button key={s} onClick={() => setSelectedSubject(s)}
              className="px-3 py-1.5 text-xs bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>
      {selectedSubject && (
        <SubjectNotes
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {quizSubject && (
        <QuickQuiz
          subject={quizSubject}
          onClose={() => setQuizSubject(null)}
        />
      )}

      <ChatInterface />
    </div>
  );
};

export default AITutorTab;
