import React from 'react';
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { ChatSession } from '@/hooks/useChatHistory';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  groupedSessions: { label: string; sessions: ChatSession[] }[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onToggle,
  groupedSessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearHistory,
}) => {
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          'fixed top-1/2 -translate-y-1/2 z-50 bg-card border border-border rounded-r-lg p-2 shadow-md transition-all duration-300 hover:bg-secondary',
          isOpen ? 'left-72' : 'left-0'
        )}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-40 flex flex-col transition-transform duration-300 shadow-lg',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              History
            </h2>
          </div>
          <Button
            onClick={onNewChat}
            className="w-full gap-2"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Sessions List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {groupedSessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No chat history yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start a conversation to see it here</p>
              </div>
            ) : (
              groupedSessions.map((group) => (
                <div key={group.label} className="mb-4">
                  <h3 className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.sessions.map((session) => (
                      <div
                        key={session.id}
                        className={cn(
                          'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                          activeSessionId === session.id
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-secondary'
                        )}
                        onClick={() => onSelectSession(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate flex-1">{session.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                          aria-label="Delete session"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {groupedSessions.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All History
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
