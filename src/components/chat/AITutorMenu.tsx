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

interface AITutorMenuProps {
  onSelectAction: (action: string) => void;
  onOpenImageGenerator: () => void;
}

const AI_ACTIONS = [
  {
    id: 'explain',
    label: 'Explain This',
    icon: BookOpen,
    description: 'Get a detailed explanation',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: FileSearch,
    description: 'Create a brief summary',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: Languages,
    description: 'Translate to another language',
  },
  {
    id: 'solve',
    label: 'Solve Problem',
    icon: Calculator,
    description: 'Step-by-step solution',
  },
];

const AITutorMenu: React.FC<AITutorMenuProps> = ({
  onSelectAction,
  onOpenImageGenerator,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Tutor
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Assistant Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {AI_ACTIONS.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onSelectAction(action.id)}
            className="flex items-start gap-3 py-2"
          >
            <action.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onOpenImageGenerator}
          className="flex items-start gap-3 py-2"
        >
          <Image className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium text-sm">Generate Image</p>
            <p className="text-xs text-muted-foreground">Create AI images from text</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AITutorMenu;
