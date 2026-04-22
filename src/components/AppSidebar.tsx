import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, GraduationCap, Sparkles, Brain, Youtube, Code2,
  ImagePlus, FileText, Wand2, Languages,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const mainItems = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Learn', url: '/learn', icon: GraduationCap },
  { title: 'Dev Mode', url: '/dev', icon: Code2 },
];

const aiTools = [
  { title: 'AI Writer', url: '/ai-writer', icon: Sparkles },
  { title: 'AI Detector', url: '/ai-detector', icon: Brain },
  { title: 'YouTube Tutor', url: '/youtube-tutor', icon: Youtube },
  { title: 'Generate Image', url: '/generate-image', icon: ImagePlus },
  { title: 'Design Letter', url: '/design-letters', icon: FileText },
  { title: 'Build App Prompt', url: '/build-app-prompt', icon: Wand2 },
  { title: 'Translate', url: '/translate', icon: Languages },
];

const AppSidebar: React.FC = () => {
  const { state, isMobile, setOpen, setOpenMobile } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const go = (url: string, isTool = false) => {
    navigate(url);
    if (isTool) {
      // Auto-collapse to icons-only for an immersive tool experience
      if (isMobile) setOpenMobile(false);
      else setOpen(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-card">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      'transition-colors',
                      isActive(item.url) && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <button onClick={() => go(item.url)} className="w-full flex items-center">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={cn(
                      'transition-colors hover:text-primary hover:bg-primary/10',
                      isActive(item.url) && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <button onClick={() => go(item.url, true)} className="w-full flex items-center">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
