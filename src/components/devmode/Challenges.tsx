import React from 'react';
import { challenges } from '@/data/curriculum';
import { Challenge } from '@/types/devMode';
import { Trophy, Clock, Star, Lock, CheckCircle, Swords, Rocket, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChallengesProps {
  completedChallenges: string[];
  onStartChallenge: (challenge: Challenge) => void;
}

const Challenges: React.FC<ChallengesProps> = ({ completedChallenges, onStartChallenge }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'hard': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'expert': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingEvents = [
    { id: 'hackathon-1', title: 'Weekend Hackathon', date: 'Feb 8-9', reward: '5000 XP', type: 'hackathon' },
    { id: 'quest-1', title: 'Algorithm Quest', date: 'Feb 10', reward: '2000 XP', type: 'quest' },
    { id: 'challenge-1', title: 'Speed Coding Challenge', date: 'Feb 12', reward: '1500 XP', type: 'challenge' },
  ];

  const completedCount = completedChallenges.length;
  const totalCount = challenges.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Challenge Progress</h3>
                <p className="text-sm text-muted-foreground">Complete challenges to earn XP and badges</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{completedCount}/{totalCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="gap-2">
            <Target className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="quests" className="gap-2">
            <Swords className="h-4 w-4" />
            Quests
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Rocket className="h-4 w-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="mt-4">
          <ScrollArea className="h-[400px]">
            <div className="grid gap-4 pr-4">
              {challenges.map((challenge) => {
                const isCompleted = completedChallenges.includes(challenge.id);
                
                return (
                  <Card
                    key={challenge.id}
                    className={`transition-all ${isCompleted ? 'opacity-60' : 'hover:shadow-md'}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <Target className="h-5 w-5 text-primary" />
                            )}
                            <h4 className="font-semibold">{challenge.title}</h4>
                            <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                              {challenge.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {challenge.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {challenge.requirements.map((req, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 text-warning mb-2">
                            <Star className="h-4 w-4 fill-warning" />
                            <span className="font-bold">{challenge.xpReward} XP</span>
                          </div>
                          <Button
                            size="sm"
                            variant={isCompleted ? 'outline' : 'default'}
                            onClick={() => !isCompleted && onStartChallenge(challenge)}
                            disabled={isCompleted}
                          >
                            {isCompleted ? 'Completed' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="quests" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Swords className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">Coding Quests Coming Soon!</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Epic multi-day coding adventures with story-driven challenges.
                Complete quests to unlock exclusive badges and rewards.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        event.type === 'hackathon' ? 'bg-accent/20' :
                        event.type === 'quest' ? 'bg-primary/20' : 'bg-warning/20'
                      }`}>
                        {event.type === 'hackathon' ? <Rocket className="h-5 w-5 text-accent" /> :
                         event.type === 'quest' ? <Swords className="h-5 w-5 text-primary" /> :
                         <Target className="h-5 w-5 text-warning" />}
                      </div>
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-warning/20 text-warning border-warning/30">
                        {event.reward}
                      </Badge>
                      <Button size="sm" variant="outline" className="mt-2 w-full">
                        Notify Me
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
