import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, ChevronRight, BookOpen, Loader2, X, Volume2, VolumeX, 
  Lightbulb, GraduationCap, List, HelpCircle, Link2, MessageSquare,
  CheckCircle, XCircle, Monitor, Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Term {
  term: string;
  definition: string;
}

interface QuizQuestion {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
  explanation: string;
}

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface Page {
  pageNumber: number;
  title: string;
  content: string;
  keyPoints: string[];
}

interface NotesData {
  title: string;
  introduction?: {
    what: string;
    why: string;
    usage: string;
  };
  terms?: Term[];
  moreToKnow?: {
    concepts: string[];
    examples: string[];
    commonMistakes: string[];
    facts: string[];
  };
  quiz?: QuizQuestion[];
  resources?: Resource[];
  pages: Page[];
}

interface SubjectNotesProps {
  subject: string;
  onClose: () => void;
}

type ViewSection = 'intro' | 'terms' | 'more' | 'quiz' | 'pages' | 'resources';

const NOTES_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notes`;

const SubjectNotes: React.FC<SubjectNotesProps> = ({ subject, onClose }) => {
  const { language } = useLanguage();
  const [notes, setNotes] = useState<NotesData | null>(null);
  const [currentSection, setCurrentSection] = useState<ViewSection>('intro');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(NOTES_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ subject, language }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to generate notes');
        }

        const data = await response.json();
        if (data.pages && data.pages.length > 0) {
          setNotes(data);
        } else {
          throw new Error('No notes generated');
        }
      } catch (err) {
        console.error('Notes generation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load notes');
        toast.error('Failed to generate notes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [subject, language]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speakContent = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !notes?.quiz) return;
    setShowResult(true);
    if (selectedAnswer === notes.quiz[currentQuizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!notes?.quiz) return;
    if (currentQuizIndex < notes.quiz.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
  };

  const sections: { id: ViewSection; label: string; icon: React.ReactNode }[] = [
    { id: 'intro', label: 'Introduction', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'terms', label: 'Key Terms', icon: <List className="h-4 w-4" /> },
    { id: 'more', label: 'More to Know', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'quiz', label: 'Mini Quiz', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'pages', label: 'Study Notes', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'resources', label: 'Resources', icon: <Link2 className="h-4 w-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-bold mb-2">Generating Learning Content</h3>
          <p className="text-muted-foreground">
            Creating comprehensive notes about <strong>{subject}</strong>...
          </p>
        </div>
      </div>
    );
  }

  if (error || !notes) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-bold mb-2">Failed to Load Content</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onClose} variant="outline">Go Back</Button>
            <Button onClick={() => window.location.reload()} variant="hero">Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          What is {subject}?
        </h3>
        <p className="text-foreground leading-relaxed">{notes.introduction?.what || 'No introduction available.'}</p>
      </div>
      
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-xl font-bold mb-4">Why is it Important?</h3>
        <p className="text-foreground leading-relaxed">{notes.introduction?.why}</p>
      </div>
      
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-xl font-bold mb-4">Real-World Applications</h3>
        <p className="text-foreground leading-relaxed">{notes.introduction?.usage}</p>
      </div>

      <Button 
        onClick={() => speakContent(`${notes.introduction?.what}. ${notes.introduction?.why}. ${notes.introduction?.usage}`)}
        variant="outline"
        className="gap-2"
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
      </Button>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-primary" />
        Key Terms & Definitions
      </h3>
      <div className="grid gap-3">
        {notes.terms?.map((term, idx) => (
          <div key={idx} className="bg-card rounded-xl border border-border p-4">
            <h4 className="font-semibold text-primary mb-1">{term.term}</h4>
            <p className="text-sm text-muted-foreground">{term.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMoreToKnow = () => (
    <div className="space-y-6">
      {notes.moreToKnow?.concepts && notes.moreToKnow.concepts.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Key Concepts
          </h3>
          <ul className="space-y-2">
            {notes.moreToKnow.concepts.map((concept, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-foreground">{concept}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes.moreToKnow?.examples && notes.moreToKnow.examples.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold mb-4">Practical Examples</h3>
          <ul className="space-y-2">
            {notes.moreToKnow.examples.map((example, idx) => (
              <li key={idx} className="text-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes.moreToKnow?.commonMistakes && notes.moreToKnow.commonMistakes.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 border-l-4 border-l-destructive">
          <h3 className="text-lg font-bold mb-4 text-destructive">Common Mistakes to Avoid</h3>
          <ul className="space-y-2">
            {notes.moreToKnow.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="text-foreground flex items-start gap-2">
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {notes.moreToKnow?.facts && notes.moreToKnow.facts.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 bg-primary/5">
          <h3 className="text-lg font-bold mb-4">💡 Interesting Facts</h3>
          <ul className="space-y-2">
            {notes.moreToKnow.facts.map((fact, idx) => (
              <li key={idx} className="text-foreground">{fact}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderQuiz = () => {
    if (!notes.quiz || notes.quiz.length === 0) {
      return <p className="text-muted-foreground">No quiz available for this subject.</p>;
    }

    const currentQ = notes.quiz[currentQuizIndex];
    const isComplete = currentQuizIndex === notes.quiz.length - 1 && showResult;

    if (isComplete) {
      return (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
          <p className="text-lg text-muted-foreground mb-6">
            You scored <span className="text-primary font-bold">{quizScore}</span> out of {notes.quiz.length}
          </p>
          <Button onClick={resetQuiz} variant="hero">Try Again</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Question {currentQuizIndex + 1} of {notes.quiz.length}
          </h3>
          <span className="text-sm text-muted-foreground">Score: {quizScore}</span>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-lg font-medium mb-6">{currentQ.question}</p>
          
          <div className="space-y-3">
            {Object.entries(currentQ.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  showResult
                    ? key === currentQ.correct
                      ? 'bg-green-500/20 border-green-500 text-green-700'
                      : key === selectedAnswer
                        ? 'bg-destructive/20 border-destructive'
                        : 'border-border opacity-50'
                    : selectedAnswer === key
                      ? 'bg-primary/20 border-primary'
                      : 'border-border hover:border-primary/50 hover:bg-secondary'
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold">
                  {key}
                </span>
                <span>{value}</span>
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-secondary rounded-xl">
              <p className="text-sm font-medium mb-1">
                {selectedAnswer === currentQ.correct ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {!showResult ? (
            <Button onClick={handleCheckAnswer} disabled={!selectedAnswer} variant="hero" className="flex-1">
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} variant="hero" className="flex-1">
              {currentQuizIndex < notes.quiz.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderPages = () => {
    const page = notes.pages[currentPage];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">
            Page {currentPage + 1} of {notes.pages.length}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => speakContent(`${page.title}. ${page.content}. Key points: ${page.keyPoints.join('. ')}`)}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / notes.pages.length) * 100}%` }}
          />
        </div>

        <div className="bg-card rounded-2xl border border-border p-6">
          <h4 className="text-xl font-bold mb-4">{page.title}</h4>
          <div className="prose prose-sm max-w-none mb-6">
            {page.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-foreground leading-relaxed mb-4">{paragraph}</p>
            ))}
          </div>

          <div className="bg-secondary/50 rounded-xl p-4">
            <h5 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              Key Points
            </h5>
            <ul className="space-y-2">
              {page.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex gap-1">
            {notes.pages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentPage ? 'bg-primary w-6' : 'bg-secondary hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === notes.pages.length - 1}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        🔗 Official Learning Resources
      </h3>
      <div className="grid gap-3">
        {notes.resources?.map((resource, idx) => (
          <a
            key={idx}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-xl border border-border p-4 hover:border-primary transition-colors block"
          >
            <h4 className="font-semibold text-primary mb-1">{resource.name}</h4>
            <p className="text-sm text-muted-foreground">{resource.description}</p>
          </a>
        ))}
      </div>

      {/* App Install & Support Section */}
      <div className="mt-8 space-y-4">
        <div className="bg-secondary/50 rounded-xl p-4 flex items-start gap-3">
          <Monitor className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">🖥️ Add to Desktop</h4>
            <p className="text-sm text-muted-foreground">
              Add Smart Mind to your desktop for quick access. Use browser menu → "Add to Home Screen" or "Create Shortcut"
            </p>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-4 flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">📧 Need Help?</h4>
            <p className="text-sm text-muted-foreground">
              Questions, ideas, or suggestions? Contact us: <a href="mailto:mukunzibernard59@gmail.com" className="text-primary underline">mukunzibernard59@gmail.com</a>
            </p>
          </div>
        </div>
      </div>

      {/* What Next? */}
      <div className="bg-card rounded-2xl border border-border p-6 mt-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          What would you like to do next?
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => { resetQuiz(); setCurrentSection('quiz'); }}>
            Take the Quiz Again
          </Button>
          <Button variant="outline" onClick={() => setCurrentSection('pages')}>
            Read in More Detail
          </Button>
          <Button variant="outline" onClick={onClose}>
            Change Subject
          </Button>
          <Button variant="outline" onClick={() => setCurrentSection('more')}>
            See Examples
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'intro': return renderIntroduction();
      case 'terms': return renderTerms();
      case 'more': return renderMoreToKnow();
      case 'quiz': return renderQuiz();
      case 'pages': return renderPages();
      case 'resources': return renderResources();
      default: return renderIntroduction();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{notes.title}</h2>
              <p className="text-sm text-muted-foreground capitalize">{currentSection}</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                currentSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default SubjectNotes;