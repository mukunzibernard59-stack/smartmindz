import React, { useState } from 'react';
import {
  Brain,
  Image,
  FileSearch,
  Languages,
  Calculator,
  BookOpen,
  ChevronDown,
  Sparkles,
  PenTool,
  MessageCircle,
  Lightbulb,
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

const AITutorMenu: React.FC<AITutorMenuProps> = ({ onSelectAction, onOpenImageGenerator }) => {
  return (
    <DropdownMenu>
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

          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AITutorMenu;
