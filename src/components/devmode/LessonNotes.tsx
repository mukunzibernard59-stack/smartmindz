 import React from 'react';
 import { LessonContent } from '@/data/lessonContent';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Play, BookOpen, Lightbulb, CheckCircle2, Code2 } from 'lucide-react';
 
 interface LessonNotesProps {
   content: LessonContent;
   languageName: string;
   onRunCode: () => void;
  onFinish: () => void;
   isActive?: boolean;
 }
 
const LessonNotes: React.FC<LessonNotesProps> = ({ content, languageName, onRunCode, onFinish, isActive }) => {
  const hasPractice = content.hasPractice !== false && content.starterCode.trim().length > 0;
  
   return (
     <Card className={`h-full flex flex-col ${isActive ? 'ring-2 ring-primary' : ''}`}>
       <CardHeader className="pb-3 border-b border-border">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
               <BookOpen className="h-5 w-5 text-primary" />
             </div>
             <div>
               <CardTitle className="text-lg">{content.title}</CardTitle>
               <p className="text-sm text-muted-foreground">{languageName}</p>
             </div>
           </div>
           <Badge variant="secondary" className="hidden sm:flex">
             <Code2 className="h-3 w-3 mr-1" />
             Lesson
           </Badge>
         </div>
       </CardHeader>
 
       <CardContent className="flex-1 p-0 overflow-hidden">
         <ScrollArea className="h-full p-4">
           {/* Main Notes */}
           <div className="space-y-6">
             <section>
               <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                 <BookOpen className="h-4 w-4" />
                 What You'll Learn
               </h3>
               <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                 {content.notes}
               </p>
             </section>
 
             {/* Key Points */}
             <section>
               <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                 <CheckCircle2 className="h-4 w-4" />
                 Key Points
               </h3>
               <ul className="space-y-2">
                 {content.keyPoints.map((point, index) => (
                   <li 
                     key={index} 
                     className="flex items-start gap-3 p-2 rounded-lg bg-secondary/50 text-sm"
                   >
                     <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium shrink-0">
                       {index + 1}
                     </span>
                     <span className="text-foreground">{point}</span>
                   </li>
                 ))}
               </ul>
             </section>
 
             {/* Tips */}
             {content.tips && content.tips.length > 0 && (
               <section>
                 <h3 className="text-sm font-semibold text-warning mb-3 flex items-center gap-2">
                   <Lightbulb className="h-4 w-4" />
                   Pro Tips
                 </h3>
                 <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 space-y-2">
                   {content.tips.map((tip, index) => (
                     <p key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                       <span className="text-warning">💡</span>
                       {tip}
                     </p>
                   ))}
                 </div>
               </section>
             )}
 
            {/* Code Preview - only show if has practice */}
            {hasPractice && (
              <section>
                <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Code Example Preview
                </h3>
                <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {content.starterCode.slice(0, 200)}
                    {content.starterCode.length > 200 && '...'}
                  </pre>
                </div>
              </section>
            )}

            {/* Next Steps for theory-only lessons */}
            {!hasPractice && (
              <section>
                <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to Continue
                </h3>
                <p className="text-sm text-muted-foreground">
                  Great job reading through this introduction! Click "Finish" below to mark this lesson complete and move to the next topic where you'll start coding.
                </p>
              </section>
            )}
           </div>
         </ScrollArea>
       </CardContent>
 
      {/* Action Button - Run Code or Finish */}
       <div className="p-4 border-t border-border bg-secondary/30">
        {hasPractice ? (
          <>
            <Button 
              onClick={onRunCode} 
              className="w-full gap-2" 
              variant="hero"
              size="lg"
            >
              <Play className="h-4 w-4" />
              Open Terminal & Practice
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Start coding with the example above
            </p>
          </>
        ) : (
          <>
            <Button 
              onClick={onFinish} 
              className="w-full gap-2" 
              variant="default"
              size="lg"
            >
              <CheckCircle2 className="h-4 w-4" />
              Finish & Continue
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Mark as complete and proceed to next lesson
            </p>
          </>
        )}
       </div>
     </Card>
   );
 };
 
 export default LessonNotes;