import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, Loader2, X, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Page {
  pageNumber: number;
  title: string;
  content: string;
  keyPoints: string[];
}

interface NotesData {
  title: string;
  pages: Page[];
}

interface SubjectNotesProps {
  subject: string;
  onClose: () => void;
}

const NOTES_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-notes`;

const SubjectNotes: React.FC<SubjectNotesProps> = ({ subject, onClose }) => {
  const { language } = useLanguage();
  const [notes, setNotes] = useState<NotesData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const speakContent = () => {
    if (!notes || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const page = notes.pages[currentPage];
    const textToSpeak = `${page.title}. ${page.content}. Key points: ${page.keyPoints.join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : language === 'rw' ? 'rw-RW' : 'en-US';
    utterance.rate = 0.9;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const nextPage = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (notes && currentPage < notes.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-bold mb-2">Generating Study Notes</h3>
          <p className="text-muted-foreground">
            Creating 5 pages of detailed notes about <strong>{subject}</strong>...
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
          <h3 className="text-xl font-bold mb-2">Failed to Load Notes</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onClose} variant="outline">Go Back</Button>
            <Button onClick={() => window.location.reload()} variant="hero">Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  const page = notes.pages[currentPage];

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
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {notes.pages.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={speakContent}
              title={isSpeaking ? 'Stop reading' : 'Read aloud'}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentPage + 1) / notes.pages.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-6">
          <h3 className="text-2xl font-bold mb-4">{page.title}</h3>
          
          <div className="prose prose-sm sm:prose max-w-none mb-6">
            {page.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Points */}
          <div className="bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h4 className="font-semibold">Key Points</h4>
            </div>
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

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevPage}
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
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                  setCurrentPage(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentPage ? 'bg-primary w-6' : 'bg-secondary hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          <Button
            variant={currentPage === notes.pages.length - 1 ? 'hero' : 'outline'}
            onClick={currentPage === notes.pages.length - 1 ? onClose : nextPage}
            className="gap-2"
          >
            {currentPage === notes.pages.length - 1 ? (
              'Finish'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubjectNotes;
