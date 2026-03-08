import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IDECodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  readOnly?: boolean;
  onSave?: () => void;
}

const LANGUAGE_KEYWORDS: Record<string, { keywords: string[]; builtins: string[]; types: string[] }> = {
  javascript: {
    keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'true', 'false', 'null', 'undefined', 'yield', 'delete', 'void', 'super', 'static', 'get', 'set', 'with', 'debugger', 'enum'],
    builtins: ['console', 'log', 'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'RegExp', 'Map', 'Set', 'Promise', 'Error', 'setTimeout', 'setInterval', 'fetch', 'document', 'window', 'alert', 'parseInt', 'parseFloat', 'isNaN', 'require'],
    types: [],
  },
  typescript: {
    keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class', 'extends', 'import', 'export', 'default', 'from', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'enum', 'implements', 'abstract', 'as', 'is', 'keyof', 'readonly', 'declare', 'namespace', 'module', 'public', 'private', 'protected'],
    builtins: ['console', 'log', 'Math', 'JSON', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'Promise', 'Error', 'Map', 'Set', 'Record', 'Partial', 'Required', 'Readonly', 'Pick', 'Omit'],
    types: ['string', 'number', 'boolean', 'void', 'any', 'never', 'unknown', 'object', 'bigint', 'symbol'],
  },
  python: {
    keywords: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'pass', 'yield', 'lambda', 'global', 'nonlocal', 'assert', 'del', 'and', 'or', 'not', 'is', 'in', 'True', 'False', 'None', 'async', 'await'],
    builtins: ['print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict', 'set', 'tuple', 'type', 'input', 'open', 'map', 'filter', 'zip', 'enumerate', 'sorted', 'reversed', 'abs', 'min', 'max', 'sum', 'round', 'isinstance', 'hasattr', 'getattr', 'setattr', 'super', 'property'],
    types: [],
  },
  java: {
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'void', 'true', 'false', 'null', 'instanceof', 'synchronized', 'volatile', 'transient', 'native', 'enum', 'default', 'assert'],
    builtins: ['System', 'out', 'println', 'String', 'Integer', 'Double', 'Boolean', 'ArrayList', 'HashMap', 'Arrays', 'Collections', 'Math', 'Scanner', 'Object', 'Exception', 'Thread'],
    types: ['int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean'],
  },
  c: {
    keywords: ['auto', 'break', 'case', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extern', 'for', 'goto', 'if', 'register', 'return', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'volatile', 'while', 'NULL'],
    builtins: ['printf', 'scanf', 'malloc', 'free', 'calloc', 'realloc', 'sizeof', 'strlen', 'strcpy', 'strcmp', 'strcat', 'memset', 'memcpy', 'fopen', 'fclose', 'fprintf', 'fscanf', 'exit', 'abs', 'atoi', 'atof'],
    types: ['int', 'long', 'short', 'char', 'float', 'double', 'void', 'unsigned', 'signed', 'size_t'],
  },
  cpp: {
    keywords: ['auto', 'break', 'case', 'class', 'const', 'continue', 'default', 'delete', 'do', 'else', 'enum', 'explicit', 'extern', 'for', 'friend', 'goto', 'if', 'inline', 'mutable', 'namespace', 'new', 'operator', 'private', 'protected', 'public', 'register', 'return', 'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'try', 'catch', 'typedef', 'typename', 'union', 'using', 'virtual', 'volatile', 'while', 'true', 'false', 'nullptr', 'override', 'final', 'constexpr', 'noexcept', 'decltype', 'static_assert'],
    builtins: ['cout', 'cin', 'endl', 'cerr', 'clog', 'string', 'vector', 'map', 'set', 'pair', 'make_pair', 'sort', 'find', 'begin', 'end', 'push_back', 'pop_back', 'size', 'empty', 'clear', 'erase', 'insert', 'swap', 'reverse', 'unique_ptr', 'shared_ptr', 'make_shared', 'make_unique', 'move', 'forward', 'to_string', 'stoi', 'stof', 'getline'],
    types: ['int', 'long', 'short', 'char', 'float', 'double', 'void', 'unsigned', 'signed', 'bool', 'size_t', 'wchar_t', 'char16_t', 'char32_t', 'int8_t', 'int16_t', 'int32_t', 'int64_t', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t'],
  },
  html: { keywords: [], builtins: [], types: [] },
  css: { keywords: [], builtins: [], types: [] },
  json: { keywords: ['true', 'false', 'null'], builtins: [], types: [] },
  bash: {
    keywords: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'case', 'esac', 'in', 'function', 'return', 'local', 'export', 'source', 'alias', 'unalias', 'set', 'unset', 'shift', 'trap', 'exit', 'break', 'continue', 'declare', 'readonly', 'typeset', 'select', 'until', 'true', 'false'],
    builtins: ['echo', 'printf', 'read', 'cd', 'pwd', 'ls', 'cat', 'grep', 'sed', 'awk', 'find', 'sort', 'uniq', 'wc', 'head', 'tail', 'cut', 'tr', 'tee', 'xargs', 'chmod', 'chown', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'touch', 'ln', 'test', 'expr', 'bc', 'date', 'sleep', 'kill', 'ps', 'top', 'df', 'du', 'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'curl', 'wget', 'ssh', 'scp', 'git', 'npm', 'node', 'python', 'pip'],
    types: [],
  },
};

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const highlightLine = (line: string, language: string): string => {
  const lang = LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.javascript;

  if (language === 'html') {
    return line
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-red-400">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span class="text-yellow-300">$1</span>$2')
      .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-zinc-500 italic">$1</span>');
  }

  if (language === 'css') {
    return line
      .replace(/([\w-]+)(\s*:)/g, '<span class="text-cyan-300">$1</span>$2')
      .replace(/(:\s*)([\w#.-]+)/g, '$1<span class="text-orange-300">$2</span>')
      .replace(/(\/\*.*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>')
      .replace(/([.#][\w-]+)/g, '<span class="text-yellow-300">$1</span>');
  }

  // Comments
  const commentIdx = language === 'python' || language === 'bash'
    ? line.indexOf('#')
    : line.indexOf('//');

  let codePart = line;
  let commentPart = '';
  if (commentIdx >= 0) {
    codePart = line.slice(0, commentIdx);
    commentPart = `<span class="text-zinc-500 italic">${line.slice(commentIdx)}</span>`;
  }

  // Strings
  codePart = codePart.replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-emerald-400">$&</span>');

  // Numbers
  codePart = codePart.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300">$1</span>');

  // Types
  if (lang.types.length) {
    const typesRe = new RegExp(`\\b(${lang.types.join('|')})\\b`, 'g');
    codePart = codePart.replace(typesRe, '<span class="text-cyan-300">$1</span>');
  }

  // Keywords
  if (lang.keywords.length) {
    const kwRe = new RegExp(`\\b(${lang.keywords.join('|')})\\b`, 'g');
    codePart = codePart.replace(kwRe, '<span class="text-purple-400 font-semibold">$1</span>');
  }

  // Builtins
  if (lang.builtins.length) {
    const builtRe = new RegExp(`\\b(${lang.builtins.join('|')})\\b`, 'g');
    codePart = codePart.replace(builtRe, '<span class="text-yellow-300">$1</span>');
  }

  // Function calls
  codePart = codePart.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="text-blue-300">$1</span>(');

  // Brackets
  codePart = codePart.replace(/([{}[\]()])/g, '<span class="text-zinc-400">$1</span>');

  return codePart + commentPart;
};

const BRACKET_PAIRS: Record<string, string> = { '(': ')', '{': '}', '[': ']' };
const CLOSE_BRACKETS = new Set([')', '}', ']']);

const IDECodeEditor: React.FC<IDECodeEditorProps> = ({ code, onChange, language, readOnly, onSave }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorLine, setCursorLine] = useState(0);

  const lines = code.split('\n');

  const syncScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = ta.scrollTop;
      highlightRef.current.scrollLeft = ta.scrollLeft;
    }
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  useEffect(() => {
    syncScroll();
  }, [code, syncScroll]);

  const getIndent = (line: string) => {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = textareaRef.current;
    if (!ta) return;

    // Save shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
      return;
    }

    // Tab indent
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const indent = '  ';

      if (e.shiftKey) {
        // Outdent
        const lineStart = code.lastIndexOf('\n', start - 1) + 1;
        const lineText = code.slice(lineStart, end);
        if (lineText.startsWith(indent)) {
          const newCode = code.slice(0, lineStart) + lineText.slice(indent.length) + code.slice(end);
          onChange(newCode);
          setTimeout(() => { ta.selectionStart = ta.selectionEnd = start - indent.length; }, 0);
        }
      } else {
        const newCode = code.slice(0, start) + indent + code.slice(end);
        onChange(newCode);
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + indent.length; }, 0);
      }
      return;
    }

    // Auto-close brackets
    if (BRACKET_PAIRS[e.key]) {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const open = e.key;
      const close = BRACKET_PAIRS[open];
      const newCode = code.slice(0, start) + open + code.slice(start, end) + close + code.slice(end);
      onChange(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1; }, 0);
      return;
    }

    // Skip closing bracket if already there
    if (CLOSE_BRACKETS.has(e.key)) {
      const start = ta.selectionStart;
      if (code[start] === e.key) {
        e.preventDefault();
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1; }, 0);
        return;
      }
    }

    // Auto-close quotes
    if (e.key === '"' || e.key === "'" || e.key === '`') {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (code[start] === e.key) {
        e.preventDefault();
        setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1; }, 0);
        return;
      }
      e.preventDefault();
      const newCode = code.slice(0, start) + e.key + code.slice(start, end) + e.key + code.slice(end);
      onChange(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1; }, 0);
      return;
    }

    // Enter with auto-indent
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = ta.selectionStart;
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.slice(lineStart, start);
      let indent = getIndent(currentLine);

      // Increase indent after { or :
      const trimmed = currentLine.trimEnd();
      if (trimmed.endsWith('{') || trimmed.endsWith(':') || trimmed.endsWith('(')) {
        indent += '  ';
      }

      const newCode = code.slice(0, start) + '\n' + indent + code.slice(ta.selectionEnd);
      onChange(newCode);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 1 + indent.length;
      }, 0);
      return;
    }
  };

  const handleCursorChange = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const line = code.slice(0, ta.selectionStart).split('\n').length - 1;
    setCursorLine(line);
  };

  const highlightedHtml = lines
    .map((line) => highlightLine(escapeHtml(line), language))
    .join('\n');

  return (
    <div ref={containerRef} className="flex h-full bg-[hsl(var(--ide-editor-bg,222_47%_11%))] text-sm font-mono relative overflow-hidden">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex-shrink-0 select-none overflow-hidden text-right pr-3 pl-3 py-3 text-zinc-600 border-r border-zinc-800 bg-[hsl(var(--ide-gutter-bg,222_47%_9%))]"
        style={{ minWidth: '3.5rem' }}
      >
        {lines.map((_, i) => (
          <div
            key={i}
            className={`leading-6 text-xs ${i === cursorLine ? 'text-zinc-300' : ''}`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Syntax Highlight Layer */}
        <pre
          ref={highlightRef}
          className="absolute inset-0 p-3 leading-6 text-sm overflow-hidden pointer-events-none whitespace-pre text-zinc-300"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* Current line highlight */}
        <div
          className="absolute left-0 right-0 bg-zinc-800/30 pointer-events-none transition-transform"
          style={{ top: `${cursorLine * 24 + 12}px`, height: '24px' }}
        />

        {/* Textarea (invisible, captures input) */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="absolute inset-0 w-full h-full p-3 leading-6 text-sm resize-none bg-transparent text-transparent caret-zinc-300 outline-none whitespace-pre overflow-auto z-10"
          style={{ caretColor: 'hsl(187 85% 53%)' }}
        />
      </div>
    </div>
  );
};

export default IDECodeEditor;
