import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Loader2, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuickQuizProps {
  subject: string;
  onClose: () => void;
}

const QUIZ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`;

const QuickQuiz: React.FC<QuickQuizProps> = ({ subject, onClose }) => {
  const { getAccessToken } = useAuth();
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Please sign in first');

      const res = await fetch(QUIZ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          difficulty: 'medium',
          numQuestions: 5,
          language,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate quiz');
      }

      const data = await res.json();
      setQuestions(data.questions || []);
      setStarted(true);
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setShowResult(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === questions[currentIndex].correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const isComplete = started && questions.length > 0 && currentIndex === questions.length - 1 && showResult;

  if (!started) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2">Quick Quiz: {subject}</h3>
        <p className="text-sm text-muted-foreground mb-4">Test your knowledge with 5 quick questions</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="hero" onClick={generateQuiz} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {isLoading ? 'Generating...' : 'Start Quiz'}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Generating quiz about <strong>{subject}</strong>...</p>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-lg text-muted-foreground mb-1">
          Score: <span className="text-primary font-bold">{score}/{questions.length}</span> ({percentage}%)
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {percentage >= 80 ? '🎉 Excellent!' : percentage >= 60 ? '👍 Good job!' : '📚 Keep studying!'}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onClose}>Done</Button>
          <Button variant="hero" onClick={generateQuiz} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </h3>
        <span className="text-sm text-primary font-medium">Score: {score}</span>
      </div>

      <div className="w-full bg-secondary rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-base font-medium">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !showResult && setSelected(i)}
            disabled={showResult}
            className={`w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center gap-3 ${
              showResult
                ? i === q.correct
                  ? 'bg-green-500/20 border-green-500'
                  : i === selected
                    ? 'bg-destructive/20 border-destructive'
                    : 'border-border opacity-50'
                : selected === i
                  ? 'bg-primary/20 border-primary'
                  : 'border-border hover:border-primary/50 hover:bg-secondary'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-semibold text-xs flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{opt}</span>
            {showResult && i === q.correct && <CheckCircle className="h-4 w-4 text-green-500" />}
            {showResult && i === selected && i !== q.correct && <XCircle className="h-4 w-4 text-destructive" />}
          </button>
        ))}
      </div>

      {showResult && q.explanation && (
        <div className="p-3 bg-secondary rounded-xl text-sm">
          <p className="font-medium mb-1">{selected === q.correct ? '✅ Correct!' : '❌ Incorrect'}</p>
          <p className="text-muted-foreground">{q.explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {!showResult ? (
          <Button onClick={handleCheck} disabled={selected === null} variant="hero" className="flex-1">
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext} variant="hero" className="flex-1">
            {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>Exit</Button>
      </div>
    </div>
  );
};

export default QuickQuiz;
