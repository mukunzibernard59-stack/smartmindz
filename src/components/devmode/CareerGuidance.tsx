import React from 'react';
import { careerPaths } from '@/data/curriculum';
import { CareerPath } from '@/types/devMode';
import { Compass, ChevronRight, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface CareerGuidanceProps {
  completedLanguages: string[];
  onSelectPath: (path: CareerPath) => void;
}

const CareerGuidance: React.FC<CareerGuidanceProps> = ({ completedLanguages, onSelectPath }) => {
  const getPathProgress = (path: CareerPath) => {
    const languageProgress = path.languages.filter(l => 
      completedLanguages.includes(l)
    ).length / path.languages.length * 100;
    return Math.round(languageProgress);
  };

  const getRecommendedPath = () => {
    // Recommend based on completed languages
    if (completedLanguages.some(l => ['javascript', 'typescript', 'html', 'css'].includes(l))) {
      return 'frontend';
    }
    if (completedLanguages.some(l => ['python', 'r', 'sql'].includes(l))) {
      return 'data';
    }
    return 'fullstack'; // Default recommendation
  };

  const recommendedPathId = getRecommendedPath();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Career Paths</h2>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Explore different career paths in tech. We'll guide you based on your progress and interests.
        </p>
      </div>

      {/* Recommended Path */}
      <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">✨</span>
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const path = careerPaths.find(p => p.id === recommendedPathId)!;
            const progress = getPathProgress(path);
            
            return (
              <div className="flex items-center gap-4">
                <div className="text-4xl">{path.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{path.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </div>
                <Button onClick={() => onSelectPath(path)}>
                  Explore
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* All Career Paths */}
      <ScrollArea className="h-[500px]">
        <div className="grid gap-4 pr-4">
          {careerPaths.map(path => {
            const progress = getPathProgress(path);
            const isRecommended = path.id === recommendedPathId;
            
            return (
              <Card
                key={path.id}
                className={`transition-all hover:shadow-md cursor-pointer ${
                  isRecommended ? 'ring-2 ring-primary/20' : ''
                }`}
                onClick={() => onSelectPath(path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{path.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{path.title}</h4>
                        {isRecommended && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{path.description}</p>
                      
                      {/* Required Languages */}
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-2">Required Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {path.languages.map(lang => (
                            <Badge
                              key={lang}
                              variant="outline"
                              className={`text-xs ${
                                completedLanguages.includes(lang)
                                  ? 'bg-success/10 text-success border-success/30'
                                  : ''
                              }`}
                            >
                              {completedLanguages.includes(lang) ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Lock className="h-3 w-3 mr-1 opacity-50" />
                              )}
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills */}
                      <div>
                        <p className="text-xs font-medium mb-2">Key Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {path.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16">
                        <Progress value={progress} className="h-2 mb-1" />
                        <p className="text-xs text-muted-foreground">{progress}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CareerGuidance;
