import React from 'react';
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
  Video,
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

const AI_TOOLS = [
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
    id: 'solve',
    label: 'Solve Problem',
    icon: Calculator,
    description: 'Step-by-step solution',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: Languages,
    description: 'Translate to another language',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm Ideas',
    icon: Lightbulb,
    description: 'Generate creative ideas',
  },
  {
    id: 'rewrite',
    label: 'Rewrite Text',
    icon: PenTool,
    description: 'Improve or rephrase text',
  },
  {
    id: 'simplify',
    label: 'Simplify',
    icon: MessageCircle,
    description: 'Make it easier to understand',
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
      <DropdownMenuContent 
        align="end" 
        className="w-64 z-50 bg-popover border border-border shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Tools
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {AI_TOOLS.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onSelectAction(action.id)}
            className="flex items-start gap-3 py-2 cursor-pointer hover:bg-accent"
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
          className="flex items-start gap-3 py-2 cursor-pointer hover:bg-accent"
        >
          <Image className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium text-sm">Generate Image</p>
            <p className="text-xs text-muted-foreground">Create AI images from text</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onSelectAction('video')}
          className="flex items-start gap-3 py-2 cursor-pointer hover:bg-accent"
        >
          <Video className="h-4 w-4 mt-0.5 text-primary" />
          <div>
            <p className="font-medium text-sm">Generate Video</p>
            <p className="text-xs text-muted-foreground">Create video scripts & plans</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AITutorMenu;
