import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IDECodeEditorProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
  onRun?: () => void;
  errorLines?: number[];
}

// Syntax highlighting tokenizer
const tokenize = (line: string, lang: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  
  const keywords: Record<string, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'from', 'default', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'of', 'in', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false', 'yield'],
    typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'from', 'default', 'try', 'catch', 'finally', 'throw', 'async', 'await', 'of', 'in', 'typeof', 'instanceof', 'null', 'undefined', 'true', 'false', 'type', 'interface', 'enum', 'implements', 'abstract', 'private', 'public', 'protected', 'readonly'],
    python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'None', 'True', 'False', 'self', 'print', 'async', 'await', 'global', 'nonlocal'],
    java: ['public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements', 'void', 'int', 'long', 'double', 'float', 'boolean', 'char', 'byte', 'short', 'String', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'null', 'true', 'false', 'abstract'],
    cpp: ['#include', 'int', 'void', 'char', 'float', 'double', 'bool', 'long', 'short', 'unsigned', 'signed', 'const', 'static', 'class', 'struct', 'enum', 'union', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'delete', 'this', 'nullptr', 'true', 'false', 'using', 'namespace', 'std', 'template', 'typename', 'virtual', 'override', 'public', 'private', 'protected', 'try', 'catch', 'throw', 'auto', 'cout', 'cin', 'endl'],
    c: ['#include', 'int', 'void', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'signed', 'const', 'static', 'struct', 'enum', 'union', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'NULL', 'sizeof', 'typedef', 'printf', 'scanf', 'main'],
    html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'img', 'link', 'script', 'style', 'meta', 'title', 'section', 'header', 'footer', 'nav', 'main', 'article', 'aside'],
    css: ['color', 'background', 'background-color', 'font-size', 'font-family', 'font-weight', 'margin', 'padding', 'border', 'display', 'flex', 'grid', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'max-width', 'min-width', 'overflow', 'z-index', 'opacity', 'transform', 'transition', 'animation', 'box-shadow', 'text-align', 'line-height', 'cursor', 'outline', 'none', 'auto', 'inherit', 'initial'],
    bash: ['echo', 'if', 'then', 'else', 'fi', 'for', 'do', 'done', 'while', 'case', 'esac', 'function', 'return', 'exit', 'export', 'source', 'alias', 'cd', 'ls', 'rm', 'mv', 'cp', 'mkdir', 'chmod', 'chown', 'grep', 'sed', 'awk', 'cat', 'head', 'tail', 'sort', 'uniq', 'wc'],
    json: [],
  };

  const langKeywords = keywords[lang] || keywords['javascript'] || [];
  
  // Simple regex-based tokenization
  const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|--.*$|\b\d+\.?\d*\b|\b[a-zA-Z_#]\w*\b|[{}()\[\];,.:=<>!+\-*/&|^~?@]|\s+)/gm;
  
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(<span key={`gap-${lastIndex}`}>{line.slice(lastIndex, match.index)}</span>);
    }

    const token = match[0];
    let className = '';

    if (token.startsWith('//') || token.startsWith('#') || token.startsWith('--') || token.startsWith('/*')) {
      className = 'text-emerald-500/70 italic';
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      className = 'text-amber-300';
    } else if (/^\d/.test(token)) {
      className = 'text-purple-400';
    } else if (langKeywords.includes(token)) {
      className = 'text-pink-400 font-medium';
    } else if (/^[A-Z]/.test(token)) {
      className = 'text-cyan-300';
    } else if (token === '(' || token === ')' || token === '{' || token === '}' || token === '[' || token === ']') {
      className = 'text-yellow-200';
    } else if (/^[=<>!+\-*/&|^~?@.:;,]$/.test(token)) {
      className = 'text-sky-300';
    } else if (/^\s+$/.test(token)) {
      className = '';
    } else {
      className = 'text-slate-200';
    }

    tokens.push(
      <span key={`${match.index}-${token}`} className={className}>
        {token}
      </span>
    );
    lastIndex = match.index + token.length;
  }

  if (lastIndex < line.length) {
    tokens.push(<span key={`end-${lastIndex}`}>{line.slice(lastIndex)}</span>);
  }

  return tokens;
};

const IDECodeEditor: React.FC<IDECodeEditorProps> = ({ code, language, onChange, onRun, errorLines = [] }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const lines = code.split('\n');

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const updateCursor = useCallback(() => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart;
    const textBefore = code.substring(0, pos);
    const lineNum = textBefore.split('\n').length;
    const colNum = pos - textBefore.lastIndexOf('\n');
    setCursorLine(lineNum);
    setCursorCol(colNum);
  }, [code]);

  useEffect(() => {
    updateCursor();
  }, [code, updateCursor]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Run shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.();
      return;
    }

    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (e.shiftKey) {
        // Outdent
        const lineStart = code.lastIndexOf('\n', start - 1) + 1;
        const lineText = code.substring(lineStart, start);
        if (lineText.startsWith('  ')) {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + 2);
          onChange(newCode);
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start - 2; }, 0);
        }
      } else {
        const newCode = code.substring(0, start) + '  ' + code.substring(end);
        onChange(newCode);
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 2; }, 0);
      }
      return;
    }

    // Auto-close brackets
    const pairs: Record<string, string> = { '(': ')', '{': '}', '[': ']', '"': '"', "'": "'", '`': '`' };
    if (pairs[e.key]) {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = code.substring(start, end);
      const newCode = code.substring(0, start) + e.key + selected + pairs[e.key] + code.substring(end);
      onChange(newCode);
      setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; }, 0);
      return;
    }

    // Enter: auto-indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indent = currentLine.match(/^(\s*)/)?.[1] || '';
      const charBefore = code[start - 1];
      const extraIndent = (charBefore === '{' || charBefore === '(' || charBefore === '[' || charBefore === ':') ? '  ' : '';
      
      const newCode = code.substring(0, start) + '\n' + indent + extraIndent + code.substring(start);
      onChange(newCode);
      setTimeout(() => {
        const newPos = start + 1 + indent.length + extraIndent.length;
        textarea.selectionStart = textarea.selectionEnd = newPos;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e] rounded-none overflow-hidden">
      {/* Editor body */}
      <div className="flex-1 flex relative overflow-hidden font-mono text-sm leading-6">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 overflow-hidden select-none text-right pr-3 pl-3 bg-[#1e1e2e] border-r border-border/30"
          style={{ width: '60px' }}
        >
          {lines.map((_, i) => (
            <div
              key={i}
              className={`leading-6 ${
                errorLines.includes(i + 1)
                  ? 'text-red-400 bg-red-500/10'
                  : cursorLine === i + 1
                    ? 'text-foreground'
                    : 'text-muted-foreground/50'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Highlighted code (overlay) */}
        <div
          ref={highlightRef}
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ left: '60px' }}
          aria-hidden
        >
          <div className="p-0 pl-3 pt-0">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`leading-6 whitespace-pre ${
                  errorLines.includes(i + 1) ? 'bg-red-500/10 border-l-2 border-red-500' : ''
                } ${cursorLine === i + 1 ? 'bg-white/[0.04]' : ''}`}
              >
                {tokenize(line || ' ', language)}
              </div>
            ))}
          </div>
        </div>

        {/* Textarea (input) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={e => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          onClick={updateCursor}
          onKeyUp={updateCursor}
          spellCheck={false}
          className="flex-1 bg-transparent text-transparent caret-white resize-none outline-none p-0 pl-3 pt-0 leading-6 z-10"
          style={{ caretColor: '#fff' }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-primary/10 border-t border-border/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="font-medium text-primary">{language.toUpperCase()}</span>
          <span>Ln {cursorLine}, Col {cursorCol}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{lines.length} lines</span>
          <span>UTF-8</span>
          <span className="text-primary/80">⌘↵ Run</span>
        </div>
      </div>
    </div>
  );
};

export default IDECodeEditor;
