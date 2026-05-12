import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  /** When true (default), renders as a fixed floating button. Set false to render inline (e.g. in the navbar). */
  floating?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', floating = true }) => {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  const base =
    'h-9 w-9 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-foreground';
  const positioning = floating ? 'fixed top-3 right-3 z-[60]' : '';

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`${positioning} ${base} ${className}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-400" />}
    </button>
  );
};

export default ThemeToggle;
