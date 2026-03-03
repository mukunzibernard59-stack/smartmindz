import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SubjectNotes from '@/components/SubjectNotes';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Brain, Lightbulb, Target, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Learn: React.FC = () => {
  const { t } = useLanguage();
  const [subjectSearch, setSubjectSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const tips = [
    { icon: Lightbulb, text: "Ask questions in any language you prefer" },
    { icon: Target, text: "Be specific for better answers" },
    { icon: Brain, text: "Request step-by-step explanations" },
    { icon: BookOpen, text: "Ask for practice problems" },
  ];

  const suggestedSubjects = [
    "Website Development",
    "Machine Learning",
    "Mathematics",
    "Physics",
    "Biology",
    "Chemistry",
    "History",
    "Literature",
  ];

  const handleSubjectSearch = () => {
    if (subjectSearch.trim()) {
      setSelectedSubject(subjectSearch.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                {t('nav.learn')}
              </h1>
              <p className="text-muted-foreground">
                Ask any question and get instant explanations from your AI tutor
              </p>
            </div>

            {/* Subject Search Section */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Explore Subject Notes
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Search for any subject to get 5 pages of detailed study notes
              </p>
              
              {/* Search Input */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubjectSearch()}
                    placeholder="Search any subject (e.g., Quantum Physics, World History...)"
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <Button 
                  onClick={handleSubjectSearch} 
                  variant="hero"
                  disabled={!subjectSearch.trim()}
                  className="gap-2"
                >
                  Get Notes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Suggested Subjects */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Popular subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className="px-3 py-1.5 text-sm bg-secondary hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <tip.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip.text}</span>
                </div>
              ))}
            </div>

            {/* Chat Interface */}
            <ChatInterface />
          </div>
        </div>
      </main>

      {/* Subject Notes Modal */}
      {selectedSubject && (
        <SubjectNotes
          subject={selectedSubject}
          onClose={() => {
            setSelectedSubject(null);
            setSubjectSearch('');
          }}
        />
      )}
    </div>
  );
};

export default Learn;
