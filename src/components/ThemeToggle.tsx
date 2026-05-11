import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';
  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`fixed top-3 right-3 z-[60] h-9 w-9 rounded-full border border-border bg-card/80 backdrop-blur-md shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center text-foreground ${className}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-400" />}
    </button>
  );
};

export default ThemeToggle;
