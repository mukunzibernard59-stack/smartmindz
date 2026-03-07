import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, GraduationCap } from 'lucide-react';

// Lazy-loaded tab contents
const AIAssistantTab = React.lazy(() => import('./AIAssistantTab'));
const AITutorTab = React.lazy(() => import('./AITutorTab'));

const LearnTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistant');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start mb-6 bg-secondary/50 p-1 rounded-xl">
        <TabsTrigger value="assistant" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
          <span className="sm:hidden">Assistant</span>
        </TabsTrigger>
        <TabsTrigger value="tutor" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">AI Tutor</span>
          <span className="sm:hidden">Tutor</span>
        </TabsTrigger>
      </TabsList>

      <React.Suspense fallback={<div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>}>
        <TabsContent value="assistant" className="mt-0">
          <AIAssistantTab />
        </TabsContent>
        <TabsContent value="tutor" className="mt-0">
          <AITutorTab />
        </TabsContent>
      </React.Suspense>
    </Tabs>
  );
};

export default LearnTabs;
