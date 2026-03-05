import React, { useState } from 'react';
import {
  Brain,
  Image,
  FileSearch,
  Languages,
  Calculator,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PenTool,
  MessageCircle,
  Lightbulb,
  Video,
  Film,
  Camera,
  Wand2,
  FileText,
  Clapperboard,
  AppWindow,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AITutorMenuProps {
  onSelectAction: (action: string) => void;
  onOpenImageGenerator: () => void;
}

const AI_TOOLS = [
  { id: 'explain', label: 'Explain This', icon: BookOpen, description: 'Get a detailed explanation' },
  { id: 'summarize', label: 'Summarize', icon: FileSearch, description: 'Create a brief summary' },
  { id: 'solve', label: 'Solve Problem', icon: Calculator, description: 'Step-by-step solution' },
  { id: 'translate', label: 'Translate', icon: Languages, description: 'Translate to another language' },
  { id: 'brainstorm', label: 'Brainstorm Ideas', icon: Lightbulb, description: 'Generate creative ideas' },
  { id: 'rewrite', label: 'Rewrite Text', icon: PenTool, description: 'Improve or rephrase text' },
  { id: 'simplify', label: 'Simplify', icon: MessageCircle, description: 'Make it easier to understand' },
  { id: 'build-app', label: 'Build App Prompt', icon: AppWindow, description: 'Generate app-building prompts' },
  { id: 'design-letter', label: 'Design Letters', icon: Mail, description: 'Professional letter templates' },
];

const VIDEO_TOOLS = [
  { id: 'video-text', label: 'Text to Video', icon: Film, description: 'Generate video from text prompt' },
  { id: 'video-image', label: 'Image to Video', icon: Camera, description: 'Animate an image into video' },
  { id: 'video-animation', label: 'AI Animation', icon: Wand2, description: 'Create AI-powered animations' },
  { id: 'video-script', label: 'Video Script Generator', icon: FileText, description: 'Generate detailed scripts' },
  { id: 'video-cinematic', label: 'Cinematic Creator', icon: Clapperboard, description: 'Cinematic video production' },
];

const AITutorMenu: React.FC<AITutorMenuProps> = ({ onSelectAction, onOpenImageGenerator }) => {
  const [videoExpanded, setVideoExpanded] = useState(false);

  return (
    <DropdownMenu onOpenChange={() => setVideoExpanded(false)}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Tools
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 p-0 z-50 bg-popover border border-border shadow-xl rounded-xl overflow-hidden"
      >
        <div className="px-3 py-2.5 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">AI Tools</span>
          </div>
        </div>

        <ScrollArea className="h-[min(420px,60vh)]">
          <div className="p-1.5">
            {/* Core AI Tools */}
            {AI_TOOLS.map((action) => (
              <DropdownMenuItem
                key={action.id}
                onClick={() => onSelectAction(action.id)}
                className="flex items-start gap-3 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-accent/50 focus:bg-accent/50"
              >
                <action.icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="my-1" />

            {/* Generate Image */}
            <DropdownMenuItem
              onClick={onOpenImageGenerator}
              className="flex items-start gap-3 py-2 px-2.5 cursor-pointer rounded-lg hover:bg-accent/50 focus:bg-accent/50"
            >
              <Image className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm">Generate Image</p>
                <p className="text-xs text-muted-foreground">Create AI images from text</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />

            {/* Generate Video - Expandable */}
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideoExpanded(!videoExpanded);
                }}
                className={cn(
                  "w-full flex items-center gap-3 py-2 px-2.5 rounded-lg transition-colors text-left",
                  "hover:bg-accent/50",
                  videoExpanded && "bg-accent/30"
                )}
              >
                <Video className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">Generate Video</p>
                  <p className="text-xs text-muted-foreground">AI video creation tools</p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                    videoExpanded && "rotate-90"
                  )}
                />
              </button>

              {/* Nested Video Tools */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  videoExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="ml-4 pl-3 border-l-2 border-primary/20 py-1 space-y-0.5">
                  {VIDEO_TOOLS.map((tool) => (
                    <DropdownMenuItem
                      key={tool.id}
                      onClick={() => onSelectAction(tool.id)}
                      className="flex items-start gap-2.5 py-1.5 px-2 cursor-pointer rounded-lg hover:bg-accent/50 focus:bg-accent/50"
                    >
                      <tool.icon className="h-3.5 w-3.5 mt-0.5 text-primary/70 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs">{tool.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{tool.description}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AITutorMenu;
