import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';
import Navbar from '@/components/Navbar';
import LanguageSelector from '@/components/devmode/LanguageSelector';
import LessonSidebar from '@/components/devmode/LessonSidebar';
import IDELayout from '@/components/devmode/IDELayout';
import ProgressTracker from '@/components/devmode/ProgressTracker';
import TerminalHistory from '@/components/devmode/TerminalHistory';
import Challenges from '@/components/devmode/Challenges';
import CareerGuidance from '@/components/devmode/CareerGuidance';
import Portfolio from '@/components/devmode/Portfolio';
import CrossLanguageTranslator from '@/components/devmode/CrossLanguageTranslator';
import LessonNotes from '@/components/devmode/LessonNotes';
import { useDevMode } from '@/hooks/useDevMode';
import { getTopicsForLanguage } from '@/data/curriculum';
import { getLessonContent } from '@/data/lessonContent';
import { ProgrammingLanguage, AIFeedback, Challenge } from '@/types/devMode';
import { 
  Code, BookOpen, Trophy, Clock, Target, Folder, ArrowLeftRight,
  Compass, ChevronLeft, Menu, Zap, Terminal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const DevMode: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState('basics');
  const [currentLessonId, setCurrentLessonId] = useState('intro');
  const [activeTab, setActiveTab] = useState('learn');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIDE, setShowIDE] = useState(false);
  const [terminalCode, setTerminalCode] = useState('');
  const { toast } = useToast();

  const {
    progress, history, projects,
    initializeLanguageProgress, completeLesson, addToHistory, clearHistory,
    addProject, updateProject, deleteProject, earnBadge, getTotalXp, getOverallRank,
  } = useDevMode();

  const topics = selectedLanguage ? getTopicsForLanguage(selectedLanguage.id) : [];
  const currentProgress = selectedLanguage ? progress[selectedLanguage.id] : null;
  const lessonContent = selectedLanguage ? getLessonContent(selectedLanguage.id, currentLessonId) : null;
  const currentTopic = topics.find(t => t.id === currentTopicId);
  const currentLesson = currentTopic?.lessons.find(l => l.id === currentLessonId);

  useEffect(() => {
    if (selectedLanguage) initializeLanguageProgress(selectedLanguage.id);
  }, [selectedLanguage, initializeLanguageProgress]);

  useEffect(() => {
    setShowIDE(false);
    if (lessonContent) setTerminalCode(lessonContent.starterCode);
  }, [currentLessonId, lessonContent?.starterCode]);

  const handleSelectLanguage = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
    setActiveTab('learn');
    setShowIDE(false);
    toast({ title: `Welcome to ${language.name}!`, description: "Let's start your coding journey" });
  };

  const handleSelectLesson = (topicId: string, lessonId: string) => {
    setCurrentTopicId(topicId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
    setShowIDE(false);
  };

  const handleOpenIDE = () => {
    if (lessonContent) setTerminalCode(lessonContent.starterCode);
    setShowIDE(true);
  };

  const handleFinishLesson = () => {
    if (!selectedLanguage) return;
    completeLesson(selectedLanguage.id, currentLessonId, 25);
    toast({ title: "Lesson Complete! 🎉", description: "Great job! Moving to the next lesson." });

    const currentTopicLessons = currentTopic?.lessons || [];
    const currentLessonIndex = currentTopicLessons.findIndex(l => l.id === currentLessonId);

    if (currentLessonIndex < currentTopicLessons.length - 1) {
      setCurrentLessonId(currentTopicLessons[currentLessonIndex + 1].id);
    } else {
      const currentTopicIndex = topics.findIndex(t => t.id === currentTopicId);
      if (currentTopicIndex < topics.length - 1) {
        const nextTopic = topics[currentTopicIndex + 1];
        setCurrentTopicId(nextTopic.id);
        if (nextTopic.lessons.length > 0) setCurrentLessonId(nextTopic.lessons[0].id);
      }
    }
  };

  const handleCodeExecute = (code: string, output: string, aiFeedback?: AIFeedback[]) => {
    if (!selectedLanguage) return;
    addToHistory({ code, language: selectedLanguage.id, output, aiFeedback });
    if (!output.toLowerCase().includes('error')) {
      completeLesson(selectedLanguage.id, currentLessonId, 50);
    }
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveTab('ide');
    toast({ title: `Challenge Started: ${challenge.title}`, description: challenge.description });
  };

  // Language selector screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="mb-4"><BackButton /></div>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-gradient-primary">Dev Mode</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A professional IDE with syntax highlighting, live preview, file explorer, 
                and integrated terminal. Your coding journey starts here.
              </p>
            </div>

            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{getTotalXp()}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <Badge className="text-lg px-4 py-1 bg-primary/10 text-primary">
                  {getOverallRank().charAt(0).toUpperCase() + getOverallRank().slice(1)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Your Rank</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{Object.keys(progress).length}</p>
                <p className="text-sm text-muted-foreground">Languages Started</p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl p-6">
              <LanguageSelector onSelectLanguage={handleSelectLanguage} selectedLanguageId={selectedLanguage?.id} />
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
              {[
                { icon: Code, title: 'Pro Editor', desc: 'Syntax highlighting & auto-complete', color: 'primary' },
                { icon: Terminal, title: 'Smart Terminal', desc: 'Interactive console with command history', color: 'success' },
                { icon: Trophy, title: 'Ranks & Badges', desc: 'Earn XP from Beginner to Master', color: 'warning' },
                { icon: Compass, title: 'Career Paths', desc: 'Guidance for your dream tech career', color: 'accent' },
              ].map(({ icon: Icon, title, desc, color }) => (
                <Card key={title} className="text-center">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-6 w-6 text-${color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 h-screen flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLanguage(null)} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Languages</span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedLanguage.icon}</span>
              <span className="font-semibold text-sm">{selectedLanguage.name}</span>
              <Badge variant="outline" className="text-xs">{selectedLanguage.difficulty}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-warning" />
              <span className="font-bold">{currentProgress?.xp || 0} XP</span>
              <Badge className="bg-primary/10 text-primary text-xs">{currentProgress?.rank || 'beginner'}</Badge>
            </div>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <LessonSidebar
                  topics={topics}
                  currentTopicId={currentTopicId}
                  currentLessonId={currentLessonId}
                  completedLessons={currentProgress?.completedLessons || []}
                  onSelectLesson={handleSelectLesson}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson Sidebar (Desktop) */}
          <div className="hidden md:block w-64 shrink-0">
            <LessonSidebar
              topics={topics}
              currentTopicId={currentTopicId}
              currentLessonId={currentLessonId}
              completedLessons={currentProgress?.completedLessons || []}
              onSelectLesson={handleSelectLesson}
            />
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 pt-2">
                <TabsList className="h-8">
                  <TabsTrigger value="learn" className="gap-1.5 text-xs h-7">
                    <BookOpen className="h-3.5 w-3.5" />Learn
                  </TabsTrigger>
                  <TabsTrigger value="ide" className="gap-1.5 text-xs h-7">
                    <Code className="h-3.5 w-3.5" />IDE
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="gap-1.5 text-xs h-7">
                    <Target className="h-3.5 w-3.5" />Challenges
                  </TabsTrigger>
                  <TabsTrigger value="history" className="gap-1.5 text-xs h-7">
                    <Clock className="h-3.5 w-3.5" />History
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="gap-1.5 text-xs h-7">
                    <Folder className="h-3.5 w-3.5" />Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="translate" className="gap-1.5 text-xs h-7">
                    <ArrowLeftRight className="h-3.5 w-3.5" />Translate
                  </TabsTrigger>
                  <TabsTrigger value="careers" className="gap-1.5 text-xs h-7">
                    <Compass className="h-3.5 w-3.5" />Careers
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Learn Tab */}
              <TabsContent value="learn" className="flex-1 overflow-auto p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentTopic?.title || 'Topic'}</span>
                  <span>→</span>
                  <span className="text-foreground font-medium">{currentLesson?.title || 'Lesson'}</span>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    {lessonContent && (
                      <LessonNotes
                        content={lessonContent}
                        languageName={selectedLanguage.name}
                        onRunCode={() => { handleOpenIDE(); setActiveTab('ide'); }}
                        onFinish={handleFinishLesson}
                        isActive
                      />
                    )}
                  </div>
                  <div>
                    {currentProgress && (
                      <ProgressTracker progress={currentProgress} languageName={selectedLanguage.name} />
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* IDE Tab - Full Professional IDE */}
              <TabsContent value="ide" className="flex-1 overflow-hidden p-2">
                <IDELayout
                  language={selectedLanguage.id}
                  initialCode={terminalCode}
                  onExecute={handleCodeExecute}
                />
              </TabsContent>

              <TabsContent value="challenges" className="flex-1 overflow-auto p-4">
                <Challenges completedChallenges={[]} onStartChallenge={handleStartChallenge} />
              </TabsContent>

              <TabsContent value="history" className="flex-1 overflow-auto p-4">
                <TerminalHistory history={history} onClear={clearHistory} />
              </TabsContent>

              <TabsContent value="portfolio" className="flex-1 overflow-auto p-4">
                <Portfolio projects={projects} onAddProject={addProject} onUpdateProject={updateProject} onDeleteProject={deleteProject} />
              </TabsContent>

              <TabsContent value="translate" className="flex-1 overflow-auto p-4">
                <CrossLanguageTranslator />
              </TabsContent>

              <TabsContent value="careers" className="flex-1 overflow-auto p-4">
                <CareerGuidance
                  completedLanguages={Object.keys(progress)}
                  onSelectPath={(path) => toast({ title: `${path.title} Path`, description: `Focus on: ${path.languages.join(', ')}` })}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DevMode;
