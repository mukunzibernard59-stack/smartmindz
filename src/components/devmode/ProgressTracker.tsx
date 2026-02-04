import React from 'react';
import { UserProgress, UserRank } from '@/types/devMode';
import { rankXpThresholds } from '@/data/curriculum';
import { Trophy, Zap, Target, Flame, Award, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressTrackerProps {
  progress: UserProgress;
  languageName: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, languageName }) => {
  const getRankInfo = (rank: UserRank) => {
    const ranks = {
      beginner: { label: 'Beginner', icon: '🌱', color: 'bg-muted text-muted-foreground' },
      junior: { label: 'Junior', icon: '🌿', color: 'bg-success/20 text-success' },
      intermediate: { label: 'Intermediate', icon: '🌳', color: 'bg-primary/20 text-primary' },
      advanced: { label: 'Advanced', icon: '⚡', color: 'bg-warning/20 text-warning' },
      expert: { label: 'Expert', icon: '🏆', color: 'bg-accent/20 text-accent' },
      master: { label: 'Master', icon: '👑', color: 'bg-primary text-primary-foreground' },
    };
    return ranks[rank];
  };

  const getNextRank = (currentRank: UserRank): UserRank | null => {
    const ranks: UserRank[] = ['beginner', 'junior', 'intermediate', 'advanced', 'expert', 'master'];
    const currentIndex = ranks.indexOf(currentRank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
  };

  const getProgressToNextRank = () => {
    const nextRank = getNextRank(progress.rank);
    if (!nextRank) return 100;
    
    const currentThreshold = rankXpThresholds[progress.rank];
    const nextThreshold = rankXpThresholds[nextRank];
    const progressInRange = progress.xp - currentThreshold;
    const rangeSize = nextThreshold - currentThreshold;
    
    return Math.min((progressInRange / rangeSize) * 100, 100);
  };

  const rankInfo = getRankInfo(progress.rank);
  const nextRank = getNextRank(progress.rank);

  return (
    <div className="space-y-4">
      {/* Rank Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Your Rank
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{rankInfo.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge className={rankInfo.color}>{rankInfo.label}</Badge>
                <span className="text-sm text-muted-foreground">in {languageName}</span>
              </div>
              
              {nextRank && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{progress.xp} XP</span>
                    <span>{rankXpThresholds[nextRank]} XP to {getRankInfo(nextRank).label}</span>
                  </div>
                  <Progress value={getProgressToNextRank()} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.xp}</p>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Target className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.completedLessons.length}</p>
              <p className="text-xs text-muted-foreground">Lessons Done</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Flame className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.streakDays}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Award className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{progress.badges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-warning" />
              Earned Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-secondary rounded-lg"
                  title={badge.description}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;
