import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatInterface from '@/components/ChatInterface';
import SubjectNotes from '@/components/SubjectNotes';
import QuickQuiz from '@/components/learn/QuickQuiz';
import { BookOpen, Brain, Lightbulb, Target, Search, ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AITutorTab: React.FC = () => {
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

      {/* Quick Quiz Section */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Take a Quick Quiz
        </h2>
        <p className="text-sm text-muted-foreground mb-3">Test what you've learned with a short quiz</p>
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter subject to quiz yourself on..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) handleStartQuiz(val);
                }
              }}
            />
          </div>
          <Button
            variant="hero"
            className="gap-2"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('[placeholder="Enter subject to quiz yourself on..."]');
              if (input?.value.trim()) handleStartQuiz(input.value.trim());
            }}
          >
            <HelpCircle className="h-4 w-4" /> Quiz Me
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedSubjects.map(s => (
            <button key={s} onClick={() => handleStartQuiz(s)}
              className="px-3 py-1.5 text-xs bg-secondary hover:bg-accent hover:text-accent-foreground rounded-full transition-colors">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Active Quiz */}
      {quizSubject && (
        <QuickQuiz subject={quizSubject} onClose={() => setQuizSubject(null)} />
      )}

      {/* Tips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-card rounded-xl border border-border">
            <tip.icon className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground">{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <ChatInterface />

      {/* Subject Notes Modal */}
      {selectedSubject && (
        <SubjectNotes subject={selectedSubject} onClose={() => { setSelectedSubject(null); setSubjectSearch(''); }} />
      )}
    </div>
  );
};

export default AITutorTab;
