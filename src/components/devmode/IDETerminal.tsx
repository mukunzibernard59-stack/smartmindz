import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'info' | 'success';
  content: string;
  timestamp?: Date;
}

interface IDETerminalProps {
  lines: TerminalLine[];
  onCommand?: (cmd: string) => void;
  onClear: () => void;
  isRunning?: boolean;
}

const IDETerminal: React.FC<IDETerminalProps> = ({ lines, onCommand, onClear, isRunning }) => {
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setCmdHistory(prev => [input, ...prev]);
    setHistoryIndex(-1);
    onCommand?.(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onClear();
    }
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-cyan-400';
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  const getLinePrefix = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return '❯ ';
      case 'error': return '✗ ';
      case 'success': return '✓ ';
      case 'info': return 'ℹ ';
      default: return '  ';
    }
  };

  if (isMinimized) {
    return (
      <div
        className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e2e] border-t border-border/30 cursor-pointer hover:bg-[#252540]"
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Terminal className="h-3.5 w-3.5" />
          <span>Terminal</span>
          {isRunning && <span className="text-primary animate-pulse">● Running</span>}
        </div>
        <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#0d0d1a] border-t border-border/30 h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e2e] border-b border-border/30">
        <div className="flex items-center gap-2 text-xs">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-muted-foreground">Terminal</span>
          {isRunning && (
            <span className="text-primary animate-pulse text-[10px] bg-primary/10 px-1.5 rounded">Running...</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClear} className="p-1 hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground" title="Clear (Ctrl+L)">
            <X className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-secondary/50 rounded text-muted-foreground hover:text-foreground">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Output */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 font-mono text-xs space-y-0.5" onClick={() => inputRef.current?.focus()}>
          {lines.length === 0 && (
            <div className="text-muted-foreground/50">
              <p>Welcome to Smart Mind Terminal v2.0</p>
              <p>Type 'help' for available commands. Press Ctrl+Enter to run code.</p>
              <p></p>
            </div>
          )}
          {lines.map((line, i) => (
            <div key={i} className={`${getLineColor(line.type)} whitespace-pre-wrap leading-5`}>
              <span className="opacity-60">{getLinePrefix(line.type)}</span>
              {line.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-2 border-t border-border/20">
        <span className="text-cyan-400 text-xs font-mono">❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none placeholder:text-muted-foreground/30"
          autoFocus
        />
      </form>
    </div>
  );
};

export type { TerminalLine };
export default IDETerminal;
