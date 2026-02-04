import React, { useState, useRef, useEffect } from 'react';
import { Play, Trash2, Copy, Download, Maximize2, Minimize2, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AIFeedback, TerminalHistory } from '@/types/devMode';

interface CodeEditorProps {
  language: string;
  onExecute: (code: string, output: string, aiFeedback?: AIFeedback[]) => void;
  onAIFeedback?: (feedback: AIFeedback[]) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, onExecute, onAIFeedback }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const getStarterCode = (lang: string): string => {
    const starters: Record<string, string> = {
      javascript: '// Welcome to JavaScript!\nconsole.log("Hello, World!");',
      typescript: '// Welcome to TypeScript!\nconst greeting: string = "Hello, World!";\nconsole.log(greeting);',
      python: '# Welcome to Python!\nprint("Hello, World!")',
      java: '// Welcome to Java!\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      cpp: '// Welcome to C++!\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      c: '// Welcome to C!\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
      csharp: '// Welcome to C#!\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
      ruby: '# Welcome to Ruby!\nputs "Hello, World!"',
      go: '// Welcome to Go!\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
      rust: '// Welcome to Rust!\nfn main() {\n    println!("Hello, World!");\n}',
      swift: '// Welcome to Swift!\nprint("Hello, World!")',
      kotlin: '// Welcome to Kotlin!\nfun main() {\n    println("Hello, World!")\n}',
      php: '<?php\n// Welcome to PHP!\necho "Hello, World!";',
      sql: '-- Welcome to SQL!\nSELECT "Hello, World!" AS greeting;',
      bash: '#!/bin/bash\n# Welcome to Bash!\necho "Hello, World!"',
      html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Welcome to CSS! */\nbody {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}',
    };
    return starters[lang] || `// Welcome to ${lang}!\n// Start coding here...`;
  };

  useEffect(() => {
    setCode(getStarterCode(language));
    setOutput('');
    setAiFeedback([]);
  }, [language]);

  const executeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to execute",
        description: "Please write some code first",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    setOutput('Running...');

    try {
      // Simulate code execution with basic JavaScript eval for JS
      if (language === 'javascript') {
        try {
          const logs: string[] = [];
          const originalLog = console.log;
          console.log = (...args) => logs.push(args.map(a => String(a)).join(' '));
          
          // eslint-disable-next-line no-eval
          const result = eval(code);
          
          console.log = originalLog;
          
          const output = logs.join('\n') + (result !== undefined ? `\n→ ${result}` : '');
          setOutput(output || 'No output');
          onExecute(code, output);
        } catch (error: any) {
          const errorOutput = `Error: ${error.message}`;
          setOutput(errorOutput);
          onExecute(code, errorOutput);
          analyzeCodeWithAI(code, errorOutput);
        }
      } else {
        // For other languages, simulate output
        const simulatedOutput = `[Simulated ${language} output]\nCode executed successfully!\n\nNote: Full execution for ${language} requires a backend compiler.`;
        setOutput(simulatedOutput);
        onExecute(code, simulatedOutput);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const analyzeCodeWithAI = async (codeToAnalyze: string, errorMessage?: string) => {
    setIsAnalyzing(true);
    
    try {
      const systemPrompt = `You are a helpful coding assistant. Analyze the following ${language} code and provide feedback.
      ${errorMessage ? `The code produced this error: ${errorMessage}` : ''}
      
      Respond with a JSON array of feedback objects, each with:
      - type: "error" | "warning" | "suggestion" | "praise"
      - message: Brief explanation
      - lineNumber: (optional) Line number
      - fixSuggestion: (optional) How to fix the issue
      
      Be encouraging but helpful. Point out good practices as well as issues.`;

      const response = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: codeToAnalyze }
          ]
        }
      });

      if (response.data) {
        try {
          // Parse streaming response or direct response
          const text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const feedback = JSON.parse(jsonMatch[0]) as AIFeedback[];
            setAiFeedback(feedback);
            onAIFeedback?.(feedback);
          }
        } catch (e) {
          console.log('Could not parse AI feedback');
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  const clearCode = () => {
    setCode(getStarterCode(language));
    setOutput('');
    setAiFeedback([]);
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
      cpp: 'cpp', c: 'c', csharp: 'cs', ruby: 'rb', go: 'go',
      rust: 'rs', swift: 'swift', kotlin: 'kt', php: 'php',
      sql: 'sql', bash: 'sh', html: 'html', css: 'css',
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex flex-col bg-card border border-border rounded-xl overflow-hidden ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <span className="text-sm font-medium text-muted-foreground ml-2">
            {language.charAt(0).toUpperCase() + language.slice(1)} Editor
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={copyCode} title="Copy">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={downloadCode} title="Download">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={clearCode} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} title="Toggle Fullscreen">
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-border min-h-[300px]">
        {/* Code Input */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 resize-none font-mono text-sm border-0 rounded-none bg-background focus-visible:ring-0 p-4"
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Output</span>
            <Button variant="ghost" size="sm" onClick={() => setOutput('')}>
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
          <ScrollArea className="h-[250px]">
            <pre className="font-mono text-sm whitespace-pre-wrap text-muted-foreground">
              {output || 'Run your code to see output...'}
            </pre>
          </ScrollArea>
        </div>
      </div>

      {/* AI Feedback Section */}
      {aiFeedback.length > 0 && (
        <div className="border-t border-border p-4 bg-secondary/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI Feedback</span>
          </div>
          <div className="space-y-2">
            {aiFeedback.map((fb, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-sm ${
                  fb.type === 'error' ? 'bg-destructive/10 border border-destructive/30' :
                  fb.type === 'warning' ? 'bg-warning/10 border border-warning/30' :
                  fb.type === 'suggestion' ? 'bg-primary/10 border border-primary/30' :
                  'bg-success/10 border border-success/30'
                }`}
              >
                <p>{fb.message}</p>
                {fb.fixSuggestion && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    💡 {fb.fixSuggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary border-t border-border">
        <Button
          variant="outline"
          onClick={() => analyzeCodeWithAI(code)}
          disabled={isAnalyzing || !code.trim()}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'AI Review'}
        </Button>

        <Button
          variant="hero"
          onClick={executeCode}
          disabled={isExecuting}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isExecuting ? 'Running...' : 'Run Code'}
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;
