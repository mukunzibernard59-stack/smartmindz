import { useState, useEffect, useCallback } from 'react';
import { UserProgress, TerminalHistory, Project, Badge, UserRank } from '@/types/devMode';
import { rankXpThresholds } from '@/data/curriculum';

const STORAGE_KEYS = {
  PROGRESS: 'devmode_progress',
  HISTORY: 'devmode_history',
  PROJECTS: 'devmode_projects',
};

export const useDevMode = () => {
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);

    if (savedProgress) setProgress(JSON.parse(savedProgress));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  const getRankFromXp = (xp: number): UserRank => {
    if (xp >= rankXpThresholds.master) return 'master';
    if (xp >= rankXpThresholds.expert) return 'expert';
    if (xp >= rankXpThresholds.advanced) return 'advanced';
    if (xp >= rankXpThresholds.intermediate) return 'intermediate';
    if (xp >= rankXpThresholds.junior) return 'junior';
    return 'beginner';
  };

  const initializeLanguageProgress = useCallback((languageId: string) => {
    if (!progress[languageId]) {
      setProgress(prev => ({
        ...prev,
        [languageId]: {
          languageId,
          completedLessons: [],
          currentTopic: 'basics',
          currentLesson: 'intro',
          xp: 0,
          rank: 'beginner',
          badges: [],
          streakDays: 0,
          lastActivity: new Date(),
        },
      }));
    }
  }, [progress]);

  const completeLesson = useCallback((languageId: string, lessonId: string, xpEarned: number = 100) => {
    setProgress(prev => {
      const current = prev[languageId] || {
        languageId,
        completedLessons: [],
        currentTopic: 'basics',
        currentLesson: 'intro',
        xp: 0,
        rank: 'beginner' as UserRank,
        badges: [],
        streakDays: 0,
        lastActivity: new Date(),
      };

      const newXp = current.xp + xpEarned;
      const newRank = getRankFromXp(newXp);

      return {
        ...prev,
        [languageId]: {
          ...current,
          completedLessons: [...new Set([...current.completedLessons, lessonId])],
          xp: newXp,
          rank: newRank,
          lastActivity: new Date(),
        },
      };
    });
  }, []);

  const addToHistory = useCallback((entry: Omit<TerminalHistory, 'id' | 'timestamp'>) => {
    const newEntry: TerminalHistory = {
      ...entry,
      id: `history_${Date.now()}`,
      timestamp: new Date(),
    };

    setHistory(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      )
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  const earnBadge = useCallback((languageId: string, badge: Omit<Badge, 'earnedAt'>) => {
    setProgress(prev => {
      const current = prev[languageId];
      if (!current) return prev;

      const alreadyHas = current.badges.some(b => b.id === badge.id);
      if (alreadyHas) return prev;

      return {
        ...prev,
        [languageId]: {
          ...current,
          badges: [...current.badges, { ...badge, earnedAt: new Date() }],
        },
      };
    });
  }, []);

  const getTotalXp = useCallback(() => {
    return Object.values(progress).reduce((sum, p) => sum + p.xp, 0);
  }, [progress]);

  const getOverallRank = useCallback(() => {
    return getRankFromXp(getTotalXp());
  }, [getTotalXp]);

  return {
    progress,
    history,
    projects,
    initializeLanguageProgress,
    completeLesson,
    addToHistory,
    clearHistory,
    addProject,
    updateProject,
    deleteProject,
    earnBadge,
    getTotalXp,
    getOverallRank,
    getRankFromXp,
  };
};
