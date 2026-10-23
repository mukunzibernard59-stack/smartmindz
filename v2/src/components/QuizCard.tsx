import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Trophy, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizCardProps {
  subject?: string;
  difficulty?: string;
  numQuestions?: number;
  language?: string;
}

const QUIZ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`;

const QuizCard: React.FC<QuizCardProps> = ({ 
  subject = 'General', 
  difficulty = 'Medium', 
  numQuestions = 10,
  language = 'en'
}) => {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const fetchQuiz = useCallback(async () => {
    setIsLoadingQuiz(true);
    setLoadError(null);
    
    try {
      // Get user's JWT token for authentication
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Please sign in to generate quizzes');
      }

      const response = await fetch(QUIZ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          subject,
          difficulty,
          numQuestions,
          language,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 401) {
          throw new Error('Please sign in to generate quizzes');
        }
        throw new Error(error.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions generated');
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load quiz');
      toast.error(error instanceof Error ? error.message : 'Failed to generate quiz. Please try again.');
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [subject, difficulty, numQuestions, language, getAccessToken]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoadingQuiz(false);
      setLoadError('Please sign in to generate quizzes');
      return;
    }
    fetchQuiz();
  }, [isAuthenticated, fetchQuiz]);

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !question) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === question.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  // Loading state
  if (isLoadingQuiz) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h3 className="text-xl font-bold mb-2">Generating Your Quiz</h3>
        <p className="text-muted-foreground mb-4">
          Creating {numQuestions} {difficulty.toLowerCase()} questions about {subject}...
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <X className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold mb-2">Failed to Load Quiz</h3>
        <p className="text-muted-foreground mb-6">{loadError}</p>
        <Button onClick={() => fetchQuiz()} variant="hero">
          Try Again
        </Button>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground mb-2">
          {subject} - {difficulty}
        </p>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {questions.length} ({percentage}%)
        </p>
        <div className="w-full bg-secondary rounded-full h-3 mb-6">
          <div 
            className="bg-success h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <Button onClick={restartQuiz} variant="hero" className="w-full">
          Try Again
        </Button>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">{subject} Quiz</h3>
              <p className="text-xs text-muted-foreground">{difficulty} • {questions.length} questions</p>
            </div>
          </div>
          <div className="text-sm font-medium">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <h4 className="text-lg font-semibold mb-6">{question.question}</h4>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${
                  showResult
                    ? isCorrect
                      ? 'border-success bg-success/10'
                      : isSelected
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border opacity-50'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  showResult
                    ? isCorrect
                      ? 'bg-success text-success-foreground'
                      : isSelected
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-secondary'
                    : 'bg-secondary'
                }`}>
                  {showResult ? (
                    isCorrect ? <Check className="h-4 w-4" /> : isSelected ? <X className="h-4 w-4" /> : String.fromCharCode(65 + index)
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 p-4 bg-secondary/50 rounded-xl animate-fade-in">
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {showExplanation && (
          <Button 
            onClick={nextQuestion} 
            variant="hero" 
            className="w-full mt-6"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'See Results'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
