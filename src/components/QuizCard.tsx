import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, Trophy, Brain } from 'lucide-react';

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
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the result of 7 × 8?",
    options: ["54", "56", "58", "64"],
    correct: 1,
    explanation: "7 × 8 = 56. You can remember this as 5, 6, 7, 8 → 56 = 7 × 8!"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    explanation: "Mars is called the Red Planet because of iron oxide (rust) on its surface."
  },
  {
    id: 3,
    question: "What is the chemical symbol for water?",
    options: ["O2", "CO2", "H2O", "NaCl"],
    correct: 2,
    explanation: "H2O represents 2 hydrogen atoms and 1 oxygen atom bonded together."
  },
];

const QuizCard: React.FC<QuizCardProps> = ({ subject = 'General', difficulty = 'Medium', numQuestions = 10 }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = sampleQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === question.correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
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

  if (completed) {
    const percentage = Math.round((score / sampleQuestions.length) * 100);
    
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {sampleQuestions.length} ({percentage}%)
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
              <p className="text-xs text-muted-foreground">{difficulty} • {numQuestions} questions</p>
            </div>
          </div>
          <div className="text-sm font-medium">
            {currentQuestion + 1}/{sampleQuestions.length}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
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
            {currentQuestion < sampleQuestions.length - 1 ? (
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
