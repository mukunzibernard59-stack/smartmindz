import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'smartmind_chat_history';
const ACTIVE_SESSION_KEY = 'smartmind_active_session';
const MAX_SESSIONS = 100;

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use a ref to always have the latest activeSessionId in callbacks
  const activeSessionIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const hydratedSessions = parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setSessions(hydratedSessions);
      }
      // Always start with a fresh new chat — history stays in sidebar
      setActiveSessionId(null);
      activeSessionIdRef.current = null;
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [sessions, isLoaded]);

  // Persist active session ID
  useEffect(() => {
    if (!isLoaded) return;
    if (activeSessionId) {
      localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  }, [activeSessionId, isLoaded]);

  const createSession = useCallback((initialMessage?: string): ChatSession => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: initialMessage?.substring(0, 50) || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => {
      const updated = [newSession, ...prev];
      if (updated.length > MAX_SESSIONS) {
        return updated.slice(0, MAX_SESSIONS);
      }
      return updated;
    });

    setActiveSessionId(newSession.id);
    activeSessionIdRef.current = newSession.id;
    return newSession;
  }, []);

  const getActiveSession = useCallback((): ChatSession | null => {
    return sessions.find(s => s.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Use the ref to get the latest session ID (avoids stale closure)
    let sessionId = activeSessionIdRef.current;

    if (!sessionId) {
      // Create new session inline
      const newSession: ChatSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: message.content.substring(0, 50) || 'New Chat',
        messages: [newMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      sessionId = newSession.id;
      setActiveSessionId(newSession.id);
      activeSessionIdRef.current = newSession.id;
      setSessions(prev => [newSession, ...prev].slice(0, MAX_SESSIONS));
    } else {
      const currentSessionId = sessionId;
      setSessions(prev => prev.map(session => {
        if (session.id === currentSessionId) {
          const updatedSession = {
            ...session,
            messages: [...session.messages, newMessage],
            updatedAt: new Date(),
          };
          if (session.messages.length === 0 && message.role === 'user') {
            updatedSession.title = message.content.substring(0, 50);
          }
          return updatedSession;
        }
        return session;
      }));
    }

    return newMessage;
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    const sessionId = activeSessionIdRef.current;
    if (!sessionId) return;
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId && session.messages.length > 0) {
        const messages = [...session.messages];
        const lastIdx = messages.length - 1;
        messages[lastIdx] = { ...messages[lastIdx], content };
        return { ...session, messages, updatedAt: new Date() };
      }
      return session;
    }));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
    activeSessionIdRef.current = sessionId;
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      if (sessionId === activeSessionIdRef.current) {
        const newId = filtered[0]?.id || null;
        setActiveSessionId(newId);
        activeSessionIdRef.current = newId;
      }
      return filtered;
    });
  }, []);

  const renameSession = useCallback((sessionId: string, title: string) => {
    setSessions(prev => prev.map(s =>
      s.id === sessionId ? { ...s, title, updatedAt: new Date() } : s
    ));
  }, []);

  const clearAllHistory = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
    activeSessionIdRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startNewChat = useCallback(() => {
    setActiveSessionId(null);
    activeSessionIdRef.current = null;
  }, []);

  // Group sessions by date
  const groupedSessions = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups: { label: string; sessions: ChatSession[] }[] = [
      { label: 'Today', sessions: [] },
      { label: 'Yesterday', sessions: [] },
      { label: 'Last 7 Days', sessions: [] },
      { label: 'Older', sessions: [] },
    ];

    sessions.forEach(session => {
      const sessionDate = new Date(session.updatedAt);
      const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (sessionDay.getTime() >= today.getTime()) {
        groups[0].sessions.push(session);
      } else if (sessionDay.getTime() >= yesterday.getTime()) {
        groups[1].sessions.push(session);
      } else if (sessionDay.getTime() >= lastWeek.getTime()) {
        groups[2].sessions.push(session);
      } else {
        groups[3].sessions.push(session);
      }
    });

    return groups.filter(g => g.sessions.length > 0);
  }, [sessions]);

  return {
    sessions,
    activeSessionId,
    activeSession: getActiveSession(),
    groupedSessions: groupedSessions(),
    isLoaded,
    createSession,
    addMessage,
    updateLastMessage,
    switchSession,
    deleteSession,
    renameSession,
    clearAllHistory,
    startNewChat,
  };
}
