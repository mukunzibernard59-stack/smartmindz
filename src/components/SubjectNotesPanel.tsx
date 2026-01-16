import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Loader2, Volume2, VolumeX, 
  Lightbulb, List, XCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Term {
  term: string;
  definition: string;
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
  pages: { pageNumber: number; title: string; content: string; keyPoints: string[] }[];
}

interface SubjectNotesPanelProps {
  subject: string;
}

const NOTES_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notes`;

const SubjectNotesPanel: React.FC<SubjectNotesPanelProps> = ({ subject }) => {
  const { language } = useLanguage();
  const [notes, setNotes] = useState<NotesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    intro: true,
    terms: false,
    more: false
  });

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

    if (subject) {
      fetchNotes();
    }
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">
          Loading notes about <strong>{subject}</strong>...
        </p>
      </div>
    );
  }

  if (error || !notes) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <p className="text-muted-foreground text-sm mb-3">Failed to load notes</p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Introduction Section */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => toggleSection('intro')}
          className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">Introduction</span>
          </div>
          {expandedSections.intro ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {expandedSections.intro && (
          <div className="p-4 pt-0 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-primary mb-1">What is {subject}?</h4>
              <p className="text-sm text-foreground leading-relaxed">
                {notes.introduction?.what || 'No introduction available.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-1">Why is it Important?</h4>
              <p className="text-sm text-foreground leading-relaxed">{notes.introduction?.why}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-1">Real-World Applications</h4>
              <p className="text-sm text-foreground leading-relaxed">{notes.introduction?.usage}</p>
            </div>
            <Button 
              onClick={() => speakContent(`${notes.introduction?.what}. ${notes.introduction?.why}. ${notes.introduction?.usage}`)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              {isSpeaking ? 'Stop' : 'Read Aloud'}
            </Button>
          </div>
        )}
      </div>

      {/* Key Terms Section */}
      {notes.terms && notes.terms.length > 0 && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection('terms')}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              <span className="font-semibold">Key Terms ({notes.terms.length})</span>
            </div>
            {expandedSections.terms ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.terms && (
            <div className="p-4 pt-0 space-y-2">
              {notes.terms.map((term, idx) => (
                <div key={idx} className="p-3 bg-secondary/30 rounded-xl">
                  <h5 className="font-medium text-sm text-primary">{term.term}</h5>
                  <p className="text-xs text-muted-foreground mt-1">{term.definition}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* More to Know Section */}
      {notes.moreToKnow && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection('more')}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <span className="font-semibold">More to Know</span>
            </div>
            {expandedSections.more ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          {expandedSections.more && (
            <div className="p-4 pt-0 space-y-4">
              {notes.moreToKnow.concepts && notes.moreToKnow.concepts.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Key Concepts</h5>
                  <ul className="space-y-1">
                    {notes.moreToKnow.concepts.slice(0, 5).map((concept, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-foreground">{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notes.moreToKnow.facts && notes.moreToKnow.facts.length > 0 && (
                <div className="p-3 bg-primary/5 rounded-xl">
                  <h5 className="text-sm font-medium mb-2">💡 Interesting Facts</h5>
                  <ul className="space-y-1">
                    {notes.moreToKnow.facts.slice(0, 3).map((fact, idx) => (
                      <li key={idx} className="text-xs text-foreground">{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              {notes.moreToKnow.commonMistakes && notes.moreToKnow.commonMistakes.length > 0 && (
                <div className="p-3 bg-destructive/5 rounded-xl border-l-2 border-l-destructive">
                  <h5 className="text-sm font-medium text-destructive mb-2">Common Mistakes</h5>
                  <ul className="space-y-1">
                    {notes.moreToKnow.commonMistakes.slice(0, 3).map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <XCircle className="h-3 w-3 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectNotesPanel;
