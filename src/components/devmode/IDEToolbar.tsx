import React from 'react';
import {
  Play, Square, Trash2, AlignLeft, RotateCcw, Download, Copy, Save,
  Sparkles, ChevronDown, Bug, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface IDEToolbarProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  onFormat: () => void;
  onReset: () => void;
  onSave: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onAIReview: () => void;
  onTogglePreview: () => void;
  isRunning: boolean;
  isAnalyzing: boolean;
  showPreview: boolean;
  fileName?: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
];

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'run' | 'stop' | 'ai';
}> = ({ icon, label, onClick, disabled, variant = 'default' }) => {
  const classes = {
    default: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800',
    run: 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10',
    stop: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
    ai: 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10',
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${classes[variant]}`}
            onClick={onClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const IDEToolbar: React.FC<IDEToolbarProps> = ({
  language, onLanguageChange, onRun, onStop, onClear, onFormat, onReset,
  onSave, onCopy, onDownload, onAIReview, onTogglePreview,
  isRunning, isAnalyzing, showPreview, fileName,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-1 bg-[hsl(var(--ide-toolbar-bg,220_20%_13%))] border-b border-zinc-800 gap-2">
      {/* Left: Language & File */}
      <div className="flex items-center gap-2 min-w-0">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="h-7 w-28 text-xs bg-zinc-800 border-zinc-700 text-zinc-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-300">
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value} className="text-xs">{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fileName && (
          <span className="text-xs text-zinc-500 truncate max-w-[120px]">{fileName}</span>
        )}
      </div>

      {/* Center: Run Controls */}
      <div className="flex items-center gap-1">
        {isRunning ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
            onClick={onStop}
          >
            <Square className="h-3 w-3 fill-current" />
            Stop
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 text-xs"
            onClick={onRun}
          >
            <Play className="h-3 w-3 fill-current" />
            Run
          </Button>
        )}
        <div className="w-px h-4 bg-zinc-700 mx-1" />
        <ToolbarButton icon={<Save className="h-3.5 w-3.5" />} label="Save (Ctrl+S)" onClick={onSave} />
        <ToolbarButton icon={<AlignLeft className="h-3.5 w-3.5" />} label="Format Code" onClick={onFormat} />
        <ToolbarButton icon={<Trash2 className="h-3.5 w-3.5" />} label="Clear Console" onClick={onClear} />
        <ToolbarButton icon={<RotateCcw className="h-3.5 w-3.5" />} label="Reset Workspace" onClick={onReset} />
      </div>

      {/* Right: Tools */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label={isAnalyzing ? 'Analyzing...' : 'AI Review'}
          onClick={onAIReview}
          disabled={isAnalyzing}
          variant="ai"
        />
        <ToolbarButton icon={<Copy className="h-3.5 w-3.5" />} label="Copy Code" onClick={onCopy} />
        <ToolbarButton icon={<Download className="h-3.5 w-3.5" />} label="Download" onClick={onDownload} />
        <div className="w-px h-4 bg-zinc-700 mx-1" />
        <ToolbarButton
          icon={showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          label={showPreview ? 'Hide Preview' : 'Show Preview'}
          onClick={onTogglePreview}
        />
      </div>
    </div>
  );
};

export default IDEToolbar;
