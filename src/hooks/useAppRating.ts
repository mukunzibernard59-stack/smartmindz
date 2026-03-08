import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'app_rating_state';
const ACTIVE_TIME_KEY = 'app_active_time';
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

interface RatingState {
  rated: boolean;
  dismissed: boolean;
  dismissedAt: number | null;
  feedbackSent: boolean;
}

function getState(): RatingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { rated: false, dismissed: false, dismissedAt: null, feedbackSent: false };
}

function saveState(state: RatingState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getActiveTime(): number {
  return parseInt(localStorage.getItem(ACTIVE_TIME_KEY) || '0', 10);
}

function saveActiveTime(ms: number) {
  localStorage.setItem(ACTIVE_TIME_KEY, String(ms));
}

export function useAppRating() {
  const [shouldShow, setShouldShow] = useState(false);
  const activeTimeRef = useRef(getActiveTime());
  const lastTickRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkIfShouldShow = useCallback(() => {
    const state = getState();
    if (state.rated || state.feedbackSent) return false;
    if (state.dismissed && state.dismissedAt) {
      if (Date.now() - state.dismissedAt < SEVEN_DAYS_MS) return false;
    }
    return activeTimeRef.current >= FIVE_MINUTES_MS;
  }, []);

  useEffect(() => {
    lastTickRef.current = Date.now();

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;
      // Only count if tab was active (delta < 2s means no sleep/background)
      if (delta < 2000) {
        activeTimeRef.current += delta;
        saveActiveTime(activeTimeRef.current);
      }
      if (!shouldShow && checkIfShouldShow()) {
        setShouldShow(true);
      }
    };

    intervalRef.current = setInterval(tick, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        lastTickRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shouldShow, checkIfShouldShow]);

  const markRated = () => {
    saveState({ ...getState(), rated: true });
    setShouldShow(false);
  };

  const markDismissed = () => {
    saveState({ ...getState(), dismissed: true, dismissedAt: Date.now() });
    setShouldShow(false);
  };

  const markFeedbackSent = () => {
    saveState({ ...getState(), feedbackSent: true });
    setShouldShow(false);
  };

  return { shouldShow, markRated, markDismissed, markFeedbackSent };
}
