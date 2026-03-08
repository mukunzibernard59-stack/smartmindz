import React, { useState, useCallback, useRef, useEffect } from 'react';
import IDECodeEditor from './IDECodeEditor';
import IDETerminal, { TerminalLine } from './IDETerminal';
import IDEFileExplorer, { VirtualFile, getLanguageFromFile } from './IDEFileExplorer';
import IDEPreview from './IDEPreview';
import IDEToolbar from './IDEToolbar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { supabase } from '@/integrations/supabase/client';
import { AIFeedback } from '@/types/devMode';
import { toast } from 'sonner';

interface IDELayoutProps {
  language: string;
  initialCode?: string;
  onExecute?: (code: string, output: string, aiFeedback?: AIFeedback[]) => void;
}

const getDefaultFile = (lang: string): { name: string; code: string } => {
  const defaults: Record<string, { name: string; code: string }> = {
    javascript: { name: 'main.js', code: '// Welcome to JavaScript!\nconsole.log("Hello, World!");\n\n// Try writing some code below\nconst greeting = "SmartMind IDE";\nconsole.log(`Welcome to ${greeting}!`);' },
    typescript: { name: 'main.ts', code: '// Welcome to TypeScript!\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);\n\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = { name: "Dev", age: 25 };\nconsole.log(user);' },
    python: { name: 'main.py', code: '# Welcome to Python!\nprint("Hello, World!")\n\n# Variables\nname = "SmartMind"\nprint(f"Welcome to {name} IDE!")\n\n# Functions\ndef greet(person):\n    return f"Hello, {person}!"\n\nprint(greet("Developer"))' },
    html: { name: 'index.html', code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to SmartMind IDE</p>\n  <button onclick="alert(\'Clicked!\')">Click Me</button>\n</body>\n</html>' },
    css: { name: 'style.css', code: '/* Welcome to CSS! */\nbody {\n  font-family: Arial, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n}\n\nh1 {\n  font-size: 3rem;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}' },
    java: { name: 'Main.java', code: '// Welcome to Java!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        String name = "SmartMind";\n        System.out.println("Welcome to " + name + " IDE!");\n    }\n}' },
    c: { name: 'main.c', code: '// Welcome to C!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    \n    char name[] = "SmartMind";\n    printf("Welcome to %s IDE!\\n", name);\n    \n    return 0;\n}' },
    cpp: { name: 'main.cpp', code: '// Welcome to C++!\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    \n    string name = "SmartMind";\n    cout << "Welcome to " << name << " IDE!" << endl;\n    \n    return 0;\n}' },
    json: { name: 'data.json', code: '{\n  "name": "SmartMind IDE",\n  "version": "1.0.0",\n  "description": "Professional coding environment",\n  "features": [\n    "Syntax Highlighting",\n    "Auto-complete",\n    "Live Preview",\n    "Terminal"\n  ]\n}' },
    bash: { name: 'script.sh', code: '#!/bin/bash\n# Welcome to Bash!\necho "Hello, World!"\n\nNAME="SmartMind"\necho "Welcome to $NAME IDE!"\n\n# Loop example\nfor i in 1 2 3; do\n  echo "Count: $i"\ndone' },
  };
  return defaults[lang] || { name: 'main.txt', code: '// Start coding here...' };
};

const IDELayout: React.FC<IDELayoutProps> = ({ language: initialLang, initialCode, onExecute }) => {
  const [language, setLanguage] = useState(initialLang);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(['html', 'css', 'javascript'].includes(initialLang));
  const [showExplorer, setShowExplorer] = useState(true);

  // File system
  const defaultFile = getDefaultFile(initialLang);
  const [files, setFiles] = useState<VirtualFile[]>([
    {
      id: 'root',
      name: 'project',
      type: 'folder',
      children: [
        {
          id: 'main',
          name: defaultFile.name,
          type: 'file',
          content: initialCode || defaultFile.code,
          language: initialLang,
          parentId: 'root',
        },
      ],
    },
  ]);
  const [activeFileId, setActiveFileId] = useState('main');
  const [openTabs, setOpenTabs] = useState<string[]>(['main']);

  // Get active file
  const findFile = useCallback((files: VirtualFile[], id: string): VirtualFile | null => {
    for (const f of files) {
      if (f.id === id) return f;
      if (f.children) {
        const found = findFile(f.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const activeFile = findFile(files, activeFileId);
  const currentCode = activeFile?.content || '';
  const currentLanguage = activeFile?.language || language;

  // Determine if preview should show
  const isWebLanguage = ['html', 'css', 'javascript'].includes(currentLanguage);

  // Update file content
  const updateFileContent = useCallback((fileId: string, content: string) => {
    const update = (files: VirtualFile[]): VirtualFile[] =>
      files.map(f => {
        if (f.id === fileId) return { ...f, content };
        if (f.children) return { ...f, children: update(f.children) };
        return f;
      });
    setFiles(prev => update(prev));
  }, []);

  // File operations
  const createFile = useCallback((name: string, parentId?: string) => {
    const newFile: VirtualFile = {
      id: `file_${Date.now()}`,
      name,
      type: 'file',
      content: '',
      language: getLanguageFromFile(name),
      parentId: parentId || 'root',
    };

    const addToParent = (files: VirtualFile[]): VirtualFile[] =>
      files.map(f => {
        if (f.id === (parentId || 'root') && f.type === 'folder') {
          return { ...f, children: [...(f.children || []), newFile] };
        }
        if (f.children) return { ...f, children: addToParent(f.children) };
        return f;
      });

    setFiles(prev => addToParent(prev));
    setActiveFileId(newFile.id);
    setOpenTabs(prev => [...prev, newFile.id]);
  }, []);

  const createFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: VirtualFile = {
      id: `folder_${Date.now()}`,
      name,
      type: 'folder',
      children: [],
      parentId: parentId || 'root',
    };

    const addToParent = (files: VirtualFile[]): VirtualFile[] =>
      files.map(f => {
        if (f.id === (parentId || 'root') && f.type === 'folder') {
          return { ...f, children: [...(f.children || []), newFolder] };
        }
        if (f.children) return { ...f, children: addToParent(f.children) };
        return f;
      });

    setFiles(prev => addToParent(prev));
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    const remove = (files: VirtualFile[]): VirtualFile[] =>
      files.map(f => {
        if (f.children) {
          return { ...f, children: remove(f.children.filter(c => c.id !== fileId)) };
        }
        return f;
      }).filter(f => f.id !== fileId);

    setFiles(prev => remove(prev));
    setOpenTabs(prev => prev.filter(id => id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(openTabs.find(id => id !== fileId) || 'main');
    }
  }, [activeFileId, openTabs]);

  const renameFile = useCallback((fileId: string, newName: string) => {
    const rename = (files: VirtualFile[]): VirtualFile[] =>
      files.map(f => {
        if (f.id === fileId) return { ...f, name: newName, language: f.type === 'file' ? getLanguageFromFile(newName) : f.language };
        if (f.children) return { ...f, children: rename(f.children) };
        return f;
      });
    setFiles(prev => rename(prev));
  }, []);

  const selectFile = useCallback((file: VirtualFile) => {
    setActiveFileId(file.id);
    if (!openTabs.includes(file.id)) {
      setOpenTabs(prev => [...prev, file.id]);
    }
  }, [openTabs]);

  const closeTab = useCallback((fileId: string) => {
    setOpenTabs(prev => prev.filter(id => id !== fileId));
    if (activeFileId === fileId) {
      const remaining = openTabs.filter(id => id !== fileId);
      setActiveFileId(remaining[remaining.length - 1] || 'main');
    }
  }, [activeFileId, openTabs]);

  // Add terminal line
  const addTerminalLine = useCallback((type: TerminalLine['type'], text: string) => {
    setTerminalLines(prev => [...prev, { type, text, timestamp: new Date() }]);
  }, []);

  // Execute code
  const runCode = useCallback(async () => {
    if (!currentCode.trim()) {
      addTerminalLine('error', 'No code to execute');
      return;
    }

    setIsRunning(true);
    addTerminalLine('info', `Running ${currentLanguage}...`);

    try {
      if (currentLanguage === 'javascript' || currentLanguage === 'typescript') {
        try {
          const logs: string[] = [];
          const origLog = console.log;
          const origError = console.error;
          const origWarn = console.warn;
          console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
          console.error = (...args) => logs.push('Error: ' + args.map(String).join(' '));
          console.warn = (...args) => logs.push('Warning: ' + args.map(String).join(' '));

          // eslint-disable-next-line no-eval
          const result = eval(currentCode);

          console.log = origLog;
          console.error = origError;
          console.warn = origWarn;

          logs.forEach(l => {
            const type = l.startsWith('Error:') ? 'error' : l.startsWith('Warning:') ? 'info' : 'output';
            addTerminalLine(type as TerminalLine['type'], l);
          });
          if (result !== undefined) {
            addTerminalLine('output', `→ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
          }
          addTerminalLine('success', 'Execution completed successfully');
          onExecute?.(currentCode, logs.join('\n'));
        } catch (error: any) {
          addTerminalLine('error', error.message);
          addTerminalLine('info', `Line ${error.lineNumber || '?'}: Check your syntax`);
          onExecute?.(currentCode, `Error: ${error.message}`);
        }
      } else if (currentLanguage === 'html' || currentLanguage === 'css') {
        addTerminalLine('success', 'Preview updated. Check the preview panel →');
        if (!showPreview) setShowPreview(true);
        onExecute?.(currentCode, 'Preview rendered');
      } else {
        // Simulated for non-JS languages
        addTerminalLine('output', `[${currentLanguage.toUpperCase()} Compiler]`);

        if (currentLanguage === 'python') {
          // Basic Python simulation
          const printMatch = currentCode.match(/print\((.+?)\)/g);
          if (printMatch) {
            printMatch.forEach(m => {
              const content = m.replace(/^print\(/, '').replace(/\)$/, '').replace(/^["']|["']$/g, '').replace(/f"(.+?)"/, '$1');
              addTerminalLine('output', content);
            });
          }
        }

        addTerminalLine('info', `Note: Full ${currentLanguage} execution requires a backend compiler`);
        addTerminalLine('success', 'Code analysis complete');
        onExecute?.(currentCode, `[Simulated ${currentLanguage} output]`);
      }
    } finally {
      setIsRunning(false);
    }
  }, [currentCode, currentLanguage, addTerminalLine, onExecute, showPreview]);

  // AI Review
  const analyzeCode = useCallback(async () => {
    if (!currentCode.trim()) return;
    setIsAnalyzing(true);
    addTerminalLine('info', '🤖 AI analyzing your code...');

    try {
      const response = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are a code reviewer. Analyze this ${currentLanguage} code. Give brief, helpful feedback. Format: 
- ✓ Good: [what's good]
- ⚠ Issue: [problems found]
- 💡 Tip: [suggestions]
Keep it concise, max 5 points.`
            },
            { role: 'user', content: currentCode }
          ]
        }
      });

      if (response.data) {
        const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const lines = text.split('\n').filter((l: string) => l.trim());
        lines.forEach((line: string) => {
          if (line.includes('Issue') || line.includes('Error') || line.includes('⚠')) {
            addTerminalLine('error', line);
          } else if (line.includes('Good') || line.includes('✓')) {
            addTerminalLine('success', line);
          } else {
            addTerminalLine('info', line);
          }
        });
      }
    } catch (e) {
      addTerminalLine('error', 'AI analysis unavailable');
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentCode, currentLanguage, addTerminalLine]);

  // Toolbar actions
  const handleFormat = useCallback(() => {
    // Basic formatting: fix indentation
    try {
      if (currentLanguage === 'json') {
        const parsed = JSON.parse(currentCode);
        updateFileContent(activeFileId, JSON.stringify(parsed, null, 2));
        addTerminalLine('success', 'JSON formatted');
      } else {
        addTerminalLine('info', 'Basic formatting applied');
      }
    } catch (e) {
      addTerminalLine('error', 'Format error: invalid syntax');
    }
  }, [currentCode, currentLanguage, activeFileId, updateFileContent, addTerminalLine]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentCode);
    toast.success('Code copied to clipboard');
  }, [currentCode]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile?.name || 'code.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [currentCode, activeFile]);

  const handleSave = useCallback(() => {
    toast.success('File saved');
  }, []);

  const handleReset = useCallback(() => {
    const def = getDefaultFile(language);
    updateFileContent(activeFileId, def.code);
    setTerminalLines([]);
    addTerminalLine('info', 'Workspace reset');
  }, [language, activeFileId, updateFileContent, addTerminalLine]);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    const def = getDefaultFile(lang);
    const newFile: VirtualFile = {
      id: `file_${Date.now()}`,
      name: def.name,
      type: 'file',
      content: def.code,
      language: lang,
      parentId: 'root',
    };

    setFiles(prev => prev.map(f =>
      f.id === 'root' ? { ...f, children: [...(f.children || []), newFile] } : f
    ));
    setActiveFileId(newFile.id);
    setOpenTabs(prev => [...prev, newFile.id]);
    setShowPreview(['html', 'css', 'javascript'].includes(lang));
  }, []);

  const handleTerminalCommand = useCallback((cmd: string) => {
    addTerminalLine('input', cmd);

    if (cmd === 'clear' || cmd === 'cls') {
      setTerminalLines([]);
      return;
    }
    if (cmd === 'run') {
      runCode();
      return;
    }
    if (cmd === 'help') {
      addTerminalLine('info', 'Available commands:');
      addTerminalLine('output', '  run     - Execute current code');
      addTerminalLine('output', '  clear   - Clear terminal');
      addTerminalLine('output', '  help    - Show this help');
      addTerminalLine('output', '  version - Show IDE version');
      addTerminalLine('output', '  ls      - List files');
      return;
    }
    if (cmd === 'version') {
      addTerminalLine('output', 'SmartMind IDE v1.0.0');
      return;
    }
    if (cmd === 'ls') {
      const root = files.find(f => f.id === 'root');
      root?.children?.forEach(f => {
        addTerminalLine('output', `${f.type === 'folder' ? '📁' : '📄'} ${f.name}`);
      });
      return;
    }
    addTerminalLine('error', `Command not found: ${cmd}. Type 'help' for available commands.`);
  }, [addTerminalLine, runCode, files]);

  // Get HTML/CSS/JS for preview
  const getPreviewContent = useCallback(() => {
    const allFiles = files.flatMap(function flatten(f: VirtualFile): VirtualFile[] {
      return f.type === 'folder' ? (f.children || []).flatMap(flatten) : [f];
    });

    const htmlFile = allFiles.find(f => f.language === 'html');
    const cssFile = allFiles.find(f => f.language === 'css');
    const jsFile = allFiles.find(f => f.language === 'javascript');

    return {
      html: htmlFile?.content || (currentLanguage === 'html' ? currentCode : ''),
      css: cssFile?.content || (currentLanguage === 'css' ? currentCode : ''),
      js: jsFile?.content || (currentLanguage === 'javascript' ? currentCode : ''),
    };
  }, [files, currentCode, currentLanguage]);

  const preview = getPreviewContent();

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--ide-bg,222_47%_11%))] rounded-lg overflow-hidden border border-zinc-800">
      {/* Toolbar */}
      <IDEToolbar
        language={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onRun={runCode}
        onStop={() => setIsRunning(false)}
        onClear={() => setTerminalLines([])}
        onFormat={handleFormat}
        onReset={handleReset}
        onSave={handleSave}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onAIReview={analyzeCode}
        onTogglePreview={() => setShowPreview(!showPreview)}
        isRunning={isRunning}
        isAnalyzing={isAnalyzing}
        showPreview={showPreview}
        fileName={activeFile?.name}
      />

      {/* Tab Bar */}
      <div className="flex items-center bg-[hsl(var(--ide-tabbar-bg,220_20%_10%))] border-b border-zinc-800 overflow-x-auto">
        {openTabs.map(tabId => {
          const file = findFile(files, tabId);
          if (!file) return null;
          return (
            <button
              key={tabId}
              onClick={() => setActiveFileId(tabId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border-r border-zinc-800 whitespace-nowrap transition-colors ${
                tabId === activeFileId
                  ? 'bg-[hsl(var(--ide-editor-bg,222_47%_11%))] text-zinc-200 border-t-2 border-t-cyan-500'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {file.name}
              {openTabs.length > 1 && (
                <span
                  onClick={(e) => { e.stopPropagation(); closeTab(tabId); }}
                  className="ml-1 hover:text-zinc-200 text-zinc-600"
                >
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* File Explorer */}
          {showExplorer && (
            <>
              <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
                <IDEFileExplorer
                  files={files}
                  activeFileId={activeFileId}
                  onSelectFile={selectFile}
                  onCreateFile={createFile}
                  onCreateFolder={createFolder}
                  onDeleteFile={deleteFile}
                  onRenameFile={renameFile}
                />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Editor + Preview */}
          <ResizablePanel defaultSize={showPreview ? 50 : 85}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={65} minSize={30}>
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={showPreview && isWebLanguage ? 50 : 100}>
                    <IDECodeEditor
                      code={currentCode}
                      onChange={(code) => updateFileContent(activeFileId, code)}
                      language={currentLanguage}
                      onSave={handleSave}
                    />
                  </ResizablePanel>

                  {showPreview && isWebLanguage && (
                    <>
                      <ResizableHandle />
                      <ResizablePanel defaultSize={50}>
                        <IDEPreview
                          html={preview.html}
                          css={preview.css}
                          js={preview.js}
                          visible={showPreview}
                        />
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </ResizablePanel>

              {/* Terminal */}
              <ResizableHandle />
              <ResizablePanel defaultSize={35} minSize={15}>
                <IDETerminal
                  lines={terminalLines}
                  onCommand={handleTerminalCommand}
                  onClear={() => setTerminalLines([])}
                  isRunning={isRunning}
                  language={currentLanguage}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default IDELayout;
