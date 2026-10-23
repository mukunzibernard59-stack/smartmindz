import React, { useState } from 'react';
import { Topic, Lesson } from '@/types/devMode';
import { ChevronDown, ChevronRight, Lock, CheckCircle, Circle, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LessonSidebarProps {
  topics: Topic[];
  currentTopicId?: string;
  currentLessonId?: string;
  completedLessons: string[];
  onSelectLesson: (topicId: string, lessonId: string) => void;
}

const LessonSidebar: React.FC<LessonSidebarProps> = ({
  topics,
  currentTopicId,
  currentLessonId,
  completedLessons,
  onSelectLesson,
}) => {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([currentTopicId || 'basics']);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getTopicProgress = (topic: Topic) => {
    const completed = topic.lessons.filter(l => completedLessons.includes(l.id)).length;
    return (completed / topic.lessons.length) * 100;
  };

  const isLessonUnlocked = (topic: Topic, lesson: Lesson) => {
    // First lesson is always unlocked
    if (lesson.order === 1 && topic.order === 1) return true;
    
    // Check if previous lesson is completed
    const prevLesson = topic.lessons.find(l => l.order === lesson.order - 1);
    if (prevLesson && completedLessons.includes(prevLesson.id)) return true;
    
    // Check if any lesson in this topic is completed (unlock remaining)
    const anyCompleted = topic.lessons.some(l => completedLessons.includes(l.id));
    if (anyCompleted) return true;
    
    // Check if previous topic is completed
    const prevTopic = topics.find(t => t.order === topic.order - 1);
    if (prevTopic) {
      const prevTopicCompleted = prevTopic.lessons.every(l => completedLessons.includes(l.id));
      if (prevTopicCompleted && lesson.order === 1) return true;
    }
    
    return false;
  };

  const totalLessons = topics.reduce((sum, t) => sum + t.lessons.length, 0);
  const overallProgress = (completedLessons.length / totalLessons) * 100;

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Course Progress</h3>
        </div>
        <Progress value={overallProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {completedLessons.length} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Topics List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {topics.map(topic => (
            <Collapsible
              key={topic.id}
              open={expandedTopics.includes(topic.id)}
              onOpenChange={() => toggleTopic(topic.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentTopicId === topic.id ? 'bg-primary/10' : 'hover:bg-secondary'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{topic.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-sm">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {topic.lessons.filter(l => completedLessons.includes(l.id)).length}/{topic.lessons.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12">
                      <Progress value={getTopicProgress(topic)} className="h-1" />
                    </div>
                    {expandedTopics.includes(topic.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-4 pl-4 border-l border-border space-y-1 py-2">
                  {topic.lessons.map(lesson => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isUnlocked = isLessonUnlocked(topic, lesson);
                    const isCurrent = currentLessonId === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => isUnlocked && onSelectLesson(topic.id, lesson.id)}
                        disabled={!isUnlocked}
                        className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-all ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isUnlocked
                            ? 'hover:bg-secondary'
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        ) : !isUnlocked ? (
                          <Lock className="h-4 w-4 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${isCurrent ? '' : isCompleted ? 'text-muted-foreground' : ''}`}>
                            {lesson.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LessonSidebar;
