import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal, X, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  text: string;
  timestamp: Date;
}

interface IDETerminalProps {
  lines: TerminalLine[];
  onCommand?: (command: string) => void;
  onClear: () => void;
  isRunning?: boolean;
  language?: string;
}

const IDETerminal: React.FC<IDETerminalProps> = ({ lines, onCommand, onClear, isRunning, language }) => {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      onCommand?.(input.trim());
      setCommandHistory(prev => [...prev, input.trim()]);
      setHistoryIndex(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      if (newIndex >= 0) {
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] : '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onClear();
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-cyan-400';
      case 'output': return 'text-zinc-300';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      case 'success': return 'text-emerald-400';
    }
  };

  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '$ ';
      case 'error': return '✗ ';
      case 'success': return '✓ ';
      case 'info': return 'ℹ ';
      default: return '  ';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--ide-terminal-bg,220_20%_7%))] text-zinc-300 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[hsl(var(--ide-panel-header,220_20%_12%))] border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-zinc-500" />
          <span className="text-xs font-medium text-zinc-400">Terminal</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Running
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-zinc-500 hover:text-zinc-300" onClick={onClear}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Output */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-0.5" onClick={() => inputRef.current?.focus()}>
        {lines.length === 0 && (
          <div className="text-zinc-600 text-xs">
            <p>Welcome to SmartMind Terminal</p>
            <p>Language: {language || 'javascript'}</p>
            <p>Type a command or run your code...</p>
            <p className="mt-1">Shortcuts: Ctrl+L (clear) | ↑↓ (history)</p>
          </div>
        )}
        {lines.map((line, i) => (
          <div key={i} className={`${getLineColor(line.type)} leading-5 whitespace-pre-wrap break-all`}>
            <span className="text-zinc-600">{getLinePrefix(line.type)}</span>
            {line.text}
          </div>
        ))}
        {isRunning && (
          <div className="text-zinc-500 animate-pulse">Executing...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-800 bg-[hsl(var(--ide-terminal-input,220_20%_9%))]">
        <span className="text-cyan-500 font-bold text-xs">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          className="flex-1 bg-transparent text-zinc-300 text-xs outline-none placeholder:text-zinc-700"
          disabled={isRunning}
        />
      </div>
    </div>
  );
};

export type { TerminalLine };
export default IDETerminal;
