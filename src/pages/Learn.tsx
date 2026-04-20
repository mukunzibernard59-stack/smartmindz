import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Home,
  GraduationCap,
  Code2,
  Menu,
  X,
  Search,
  RefreshCw,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIAssistantTab from '@/components/learn/AIAssistantTab';
import AITutorTab from '@/components/learn/AITutorTab';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const sidebarItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/dev', label: 'Dev Mode', icon: Code2 },
];

const Learn: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('assistant');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => window.location.reload();

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2 px-3 h-16 shrink-0 border-b border-border/40 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_-3px_hsl(187_85%_53%/0.5)] shrink-0">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-foreground truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Smart<span className="text-primary">Mind</span>
          </span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            const link = (
              <Link
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_0_15px_-3px_hsl(187_85%_53%/0.5)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
            return (
              <li key={item.to}>
                {collapsed ? (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : link}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden md:block p-2 border-t border-border/40">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-4 w-4" />
          {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col glass-strong border-r border-border/40 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile sidebar (drawer) */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-background/70 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-0 left-0 bottom-0 w-64 z-50 glass-strong border-r border-border/40 flex flex-col animate-slide-in-right">
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 glass-strong border-b border-border/40 flex items-center gap-2 px-3 sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate flex-1">
            {activeTab === 'assistant' ? 'AI Assistant' : 'AI Tutor'}
          </h1>

          {showSearch && (
            <div className="hidden sm:flex items-center animate-fade-in">
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-48 bg-secondary/40"
                onBlur={() => !searchQuery && setShowSearch(false)}
              />
            </div>
          )}

          <div className="flex items-center gap-1">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch((s) => !s)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Link to="/"><Settings className="h-5 w-5" /></Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden flex flex-col px-3 sm:px-5 py-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full max-w-md justify-start bg-secondary/50 p-1 rounded-xl shrink-0 mb-3">
              <TabsTrigger
                value="assistant"
                className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">AI Assistant</span>
                <span className="sm:hidden">Assistant</span>
              </TabsTrigger>
              <TabsTrigger
                value="tutor"
                className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">AI Tutor</span>
                <span className="sm:hidden">Tutor</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assistant" className="flex-1 overflow-hidden mt-0 animate-fade-in">
              <AIAssistantTab />
            </TabsContent>
            <TabsContent value="tutor" className="flex-1 overflow-y-auto mt-0 animate-fade-in">
              <AITutorTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Learn;
