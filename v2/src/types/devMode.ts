// Dev Mode Types

export interface ProgrammingLanguage {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'web' | 'systems' | 'mobile' | 'data' | 'scripting' | 'functional' | 'other';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  locked: boolean;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  order: number;
}

export interface CodeExecution {
  id: string;
  code: string;
  language: string;
  output: string;
  error?: string;
  timestamp: Date;
}

export interface UserProgress {
  languageId: string;
  completedLessons: string[];
  currentTopic: string;
  currentLesson: string;
  xp: number;
  rank: UserRank;
  badges: Badge[];
  streakDays: number;
  lastActivity: Date;
}

export type UserRank = 'beginner' | 'junior' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  type: 'achievement' | 'skill' | 'streak' | 'challenge';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  xpReward: number;
  timeLimit?: number;
  requirements: string[];
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  languages: string[];
  skills: string[];
  progress: number;
}

export interface AIFeedback {
  type: 'error' | 'warning' | 'suggestion' | 'praise';
  message: string;
  lineNumber?: number;
  code?: string;
  fixSuggestion?: string;
}

export interface TerminalHistory {
  id: string;
  code: string;
  language: string;
  output: string;
  timestamp: Date;
  aiFeedback?: AIFeedback[];
}
