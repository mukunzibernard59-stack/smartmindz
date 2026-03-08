import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Plus, Trash2, X, Search, Image, PenLine,
  Check, MoreHorizontal, Edit3,
} from 'lucide-react';
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
  onRenameSession?: (sessionId: string, title: string) => void;
  onOpenImageGenerator?: () => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen, onToggle, groupedSessions, activeSessionId,
  onSelectSession, onNewChat, onDeleteSession, onClearHistory,
  onRenameSession, onOpenImageGenerator,
}) => {
  const [search, setSearch] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (renamingId) renameInputRef.current?.focus();
  }, [renamingId]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpenId]);

  const filteredGroups = search.trim()
    ? groupedSessions.map(g => ({
        ...g,
        sessions: g.sessions.filter(s =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.messages.some(m => m.content.toLowerCase().includes(search.toLowerCase()))
        ),
      })).filter(g => g.sessions.length > 0)
    : groupedSessions;

  const startRename = (session: ChatSession) => {
    setRenamingId(session.id);
    setRenameValue(session.title);
    setMenuOpenId(null);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim() && onRenameSession) {
      onRenameSession(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const totalChats = groupedSessions.reduce((sum, g) => sum + g.sessions.length, 0);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-72 bg-card z-50 flex flex-col transition-transform duration-300 ease-in-out border-r border-border',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top: New Chat + Close */}
        <div className="p-3 flex items-center gap-2">
          <Button
            onClick={() => { onNewChat(); if (window.innerWidth < 768) onToggle(); }}
            variant="outline"
            className="flex-1 gap-2 h-10 justify-start text-sm font-normal"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle} className="h-10 w-10 flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 bg-secondary border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tools */}
        {!search && (
          <div className="px-3 pb-2 space-y-0.5">
            {onOpenImageGenerator && (
              <button
                onClick={() => { onOpenImageGenerator(); if (window.innerWidth < 768) onToggle(); }}
                className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Image className="h-4 w-4" />
                <span>Images</span>
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="mx-3 border-t border-border" />

        {/* Conversations */}
        <div className="px-3 pt-2 pb-1">
          <p className="text-xs font-medium text-muted-foreground tracking-wide">
            Your Chats {totalChats > 0 && <span className="text-muted-foreground/60">({totalChats})</span>}
          </p>
        </div>

        <ScrollArea className="flex-1 px-1">
          <div className="px-2 pb-2">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  {search ? 'No matching conversations' : 'No conversations yet'}
                </p>
              </div>
            ) : (
              filteredGroups.map(group => (
                <div key={group.label} className="mb-3">
                  <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-2 py-1.5">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.sessions.map(session => {
                      const isActive = activeSessionId === session.id;
                      const isRenaming = renamingId === session.id;
                      const isMenuOpen = menuOpenId === session.id;

                      return (
                        <div
                          key={session.id}
                          className={cn(
                            'group relative flex items-center rounded-lg cursor-pointer transition-colors',
                            isActive ? 'bg-secondary' : 'hover:bg-secondary/60'
                          )}
                          onClick={() => {
                            if (!isRenaming) {
                              onSelectSession(session.id);
                              if (window.innerWidth < 768) onToggle();
                            }
                          }}
                        >
                          {isRenaming ? (
                            <div className="flex items-center gap-1 w-full p-1.5">
                              <input
                                ref={renameInputRef}
                                value={renameValue}
                                onChange={e => setRenameValue(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') confirmRename(); if (e.key === 'Escape') setRenamingId(null); }}
                                className="flex-1 px-2 py-1 bg-background border border-primary rounded text-xs focus:outline-none"
                                onClick={e => e.stopPropagation()}
                              />
                              <button onClick={(e) => { e.stopPropagation(); confirmRename(); }} className="p-1 hover:bg-primary/10 rounded">
                                <Check className="h-3 w-3 text-primary" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 w-full px-2.5 py-2 min-w-0">
                              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs truncate">{session.title}</p>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : session.id); }}
                                className={cn(
                                  'p-1 rounded transition-opacity flex-shrink-0',
                                  isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                                  'hover:bg-muted'
                                )}
                              >
                                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          )}

                          {/* Context menu */}
                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px] animate-scale-in"
                            >
                              {onRenameSession && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); startRename(session); }}
                                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-secondary transition-colors"
                                >
                                  <Edit3 className="h-3 w-3" /> Rename
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); setMenuOpenId(null); }}
                                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {totalChats > 0 && (
          <div className="p-3 border-t border-border">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all conversations
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
