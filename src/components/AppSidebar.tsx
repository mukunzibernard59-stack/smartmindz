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
  { title: 'AI Writer', tool: 'writer', icon: Sparkles },
  { title: 'AI Detector', tool: 'detector', icon: Brain },
  { title: 'YouTube Tutor', tool: 'youtube', icon: Youtube },
  { title: 'Generate Image', tool: 'image', icon: ImagePlus },
  { title: 'Design Letter', tool: 'letter', icon: FileText },
  { title: 'Build App Prompt', tool: 'build-app', icon: Wand2 },
  { title: 'Translate', tool: 'translate', icon: Languages },
];

const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const openTool = (tool: string) => {
    if (tool === 'image') {
      navigate('/learn?tool=image');
    } else if (tool === 'letter') {
      navigate('/design-letters');
    } else {
      navigate(`/learn?tool=${tool}`);
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
                    className={cn(
                      'transition-colors',
                      isActive(item.url) && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <button onClick={() => navigate(item.url)} className="w-full flex items-center">
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
                    className="transition-colors hover:text-primary hover:bg-primary/10"
                  >
                    <button onClick={() => openTool(item.tool)} className="w-full flex items-center">
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
