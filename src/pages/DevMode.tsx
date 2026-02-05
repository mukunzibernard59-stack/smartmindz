import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import LanguageSelector from '@/components/devmode/LanguageSelector';
import LessonSidebar from '@/components/devmode/LessonSidebar';
import CodeEditor from '@/components/devmode/CodeEditor';
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
  Compass, ChevronLeft, Menu, X, Sparkles, Zap
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
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalCode, setTerminalCode] = useState('');
  const { toast } = useToast();

  const {
    progress,
    history,
    projects,
    initializeLanguageProgress,
    completeLesson,
    addToHistory,
    clearHistory,
    addProject,
    updateProject,
    deleteProject,
    earnBadge,
    getTotalXp,
    getOverallRank,
  } = useDevMode();

  const topics = selectedLanguage ? getTopicsForLanguage(selectedLanguage.id) : [];
  const currentProgress = selectedLanguage ? progress[selectedLanguage.id] : null;
  const lessonContent = selectedLanguage ? getLessonContent(selectedLanguage.id, currentLessonId) : null;
  const currentTopic = topics.find(t => t.id === currentTopicId);
  const currentLesson = currentTopic?.lessons.find(l => l.id === currentLessonId);

  useEffect(() => {
    if (selectedLanguage) {
      initializeLanguageProgress(selectedLanguage.id);
    }
  }, [selectedLanguage, initializeLanguageProgress]);

  useEffect(() => {
    setShowTerminal(false);
    if (lessonContent) {
      setTerminalCode(lessonContent.starterCode);
    }
  }, [currentLessonId, lessonContent?.starterCode]);

  const handleSelectLanguage = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
    setActiveTab('learn');
    setShowTerminal(false);
    toast({
      title: `Welcome to ${language.name}!`,
      description: "Let's start your coding journey",
    });
  };

  const handleSelectLesson = (topicId: string, lessonId: string) => {
    setCurrentTopicId(topicId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
    setShowTerminal(false);
  };

  const handleOpenTerminal = () => {
    if (lessonContent) {
      setTerminalCode(lessonContent.starterCode);
    }
    setShowTerminal(true);
  };

  const handleBackToNotes = () => {
    setShowTerminal(false);
  };

  const handleCodeExecute = (code: string, output: string, aiFeedback?: AIFeedback[]) => {
    if (!selectedLanguage) return;

    addToHistory({
      code,
      language: selectedLanguage.id,
      output,
      aiFeedback,
    });

    // Award XP for running code
    if (!output.toLowerCase().includes('error')) {
      completeLesson(selectedLanguage.id, currentLessonId, 50);
    }
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveTab('learn');
    toast({
      title: `Challenge Started: ${challenge.title}`,
      description: challenge.description,
    });
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Developer Learning Environment</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-gradient-primary">Dev Mode</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Master any programming language with interactive lessons, AI-powered feedback, 
                and gamified challenges. Your journey to becoming a developer starts here.
              </p>
            </div>

            {/* Stats Bar */}
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
                <p className="text-3xl font-bold text-primary">
                  {Object.keys(progress).length}
                </p>
                <p className="text-sm text-muted-foreground">Languages Started</p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl p-6">
              <LanguageSelector
                onSelectLanguage={handleSelectLanguage}
                selectedLanguageId={selectedLanguage?.id}
              />
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Terminal</h3>
                  <p className="text-sm text-muted-foreground">
                    Write and run code with instant feedback
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold mb-2">AI Assistance</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help and explanations in plain language
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-6 w-6 text-warning" />
                  </div>
                  <h3 className="font-semibold mb-2">Ranks & Badges</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn XP and climb from Beginner to Master
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Compass className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Career Paths</h3>
                  <p className="text-sm text-muted-foreground">
                    Get guidance for your dream tech career
                  </p>
                </CardContent>
              </Card>
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
        <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLanguage(null)}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Change Language
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedLanguage.icon}</span>
              <span className="font-semibold">{selectedLanguage.name}</span>
              <Badge variant="outline">{selectedLanguage.difficulty}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-warning" />
              <span className="font-bold">{currentProgress?.xp || 0} XP</span>
              <Badge className="bg-primary/10 text-primary">
                {currentProgress?.rank || 'beginner'}
              </Badge>
            </div>

            {/* Mobile Menu */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
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
          <div className="hidden md:block w-72 shrink-0">
            <LessonSidebar
              topics={topics}
              currentTopicId={currentTopicId}
              currentLessonId={currentLessonId}
              completedLessons={currentProgress?.completedLessons || []}
              onSelectLesson={handleSelectLesson}
            />
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-auto p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="learn" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Learn
                </TabsTrigger>
                <TabsTrigger value="challenges" className="gap-2">
                  <Target className="h-4 w-4" />
                  Challenges
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="gap-2">
                  <Folder className="h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="translate" className="gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  Translate
                </TabsTrigger>
                <TabsTrigger value="careers" className="gap-2">
                  <Compass className="h-4 w-4" />
                  Careers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="learn" className="space-y-4">
                {/* Breadcrumb navigation */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{currentTopic?.title || 'Topic'}</span>
                  <span>→</span>
                  <span className="text-foreground font-medium">{currentLesson?.title || 'Lesson'}</span>
                  {showTerminal && (
                    <>
                      <span>→</span>
                      <span className="text-primary font-medium">Practice</span>
                    </>
                  )}
                </div>

                {!showTerminal ? (
                  /* Notes View */
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      {lessonContent && (
                        <LessonNotes
                          content={lessonContent}
                          languageName={selectedLanguage.name}
                          onRunCode={handleOpenTerminal}
                          isActive
                        />
                      )}
                    </div>
                    <div>
                      {currentProgress && (
                        <ProgressTracker
                          progress={currentProgress}
                          languageName={selectedLanguage.name}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  /* Terminal View */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBackToNotes}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Notes
                      </Button>
                      <Badge variant="secondary" className="gap-1">
                        <Code className="h-3 w-3" />
                        Practice Mode
                      </Badge>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2">
                        <CodeEditor
                          language={selectedLanguage.id}
                          onExecute={handleCodeExecute}
                          initialCode={terminalCode}
                        />
                      </div>
                      <div className="space-y-4">
                        {currentProgress && (
                          <ProgressTracker
                            progress={currentProgress}
                            languageName={selectedLanguage.name}
                          />
                        )}
                        {/* Quick reference from notes */}
                        {lessonContent && (
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                Quick Reference
                              </h4>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {lessonContent.keyPoints.slice(0, 3).map((point, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="challenges">
                <Challenges
                  completedChallenges={[]}
                  onStartChallenge={handleStartChallenge}
                />
              </TabsContent>

              <TabsContent value="history">
                <TerminalHistory
                  history={history}
                  onClear={clearHistory}
                />
              </TabsContent>

              <TabsContent value="portfolio">
                <Portfolio
                  projects={projects}
                  onAddProject={addProject}
                  onUpdateProject={updateProject}
                  onDeleteProject={deleteProject}
                />
              </TabsContent>

              <TabsContent value="translate">
                <CrossLanguageTranslator />
              </TabsContent>

              <TabsContent value="careers">
                <CareerGuidance
                  completedLanguages={Object.keys(progress)}
                  onSelectPath={(path) => {
                    toast({
                      title: `${path.title} Path`,
                      description: `Focus on: ${path.languages.join(', ')}`,
                    });
                  }}
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
