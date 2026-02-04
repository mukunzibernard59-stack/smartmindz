import React, { useState, useMemo } from 'react';
import { programmingLanguages, languageCategories } from '@/data/languages';
import { ProgrammingLanguage } from '@/types/devMode';
import { Search, Filter, ChevronRight, Star, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LanguageSelectorProps {
  onSelectLanguage: (language: ProgrammingLanguage) => void;
  selectedLanguageId?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage, selectedLanguageId }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredLanguages = useMemo(() => {
    return programmingLanguages.filter(lang => {
      const matchesSearch = lang.name.toLowerCase().includes(search.toLowerCase()) ||
        lang.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || lang.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || lang.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/20 text-success border-success/30';
      case 'intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Choose Your Language</h2>
        </div>
        <p className="text-muted-foreground">
          Select any programming language to start learning
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search languages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="shrink-0"
            >
              All
            </Button>
            {languageCategories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="shrink-0 gap-1"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Difficulty Filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-4 w-4" /> Difficulty:
          </span>
          {['beginner', 'intermediate', 'advanced'].map(diff => (
            <Badge
              key={diff}
              variant="outline"
              className={`cursor-pointer transition-all ${
                selectedDifficulty === diff
                  ? getDifficultyColor(diff)
                  : 'hover:bg-secondary'
              }`}
              onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Language Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
          {filteredLanguages.map(lang => (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                selectedLanguageId === lang.id
                  ? 'border-primary bg-primary/10 shadow-primary'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Popular indicator */}
              {['javascript', 'python', 'java', 'typescript'].includes(lang.id) && (
                <Star className="absolute top-2 right-2 h-4 w-4 text-warning fill-warning" />
              )}

              <div className="text-3xl mb-2">{lang.icon}</div>
              <h3 className="font-semibold text-sm">{lang.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {lang.description}
              </p>
              <Badge
                variant="outline"
                className={`mt-2 text-xs ${getDifficultyColor(lang.difficulty)}`}
              >
                {lang.difficulty}
              </Badge>

              {/* Hover indicator */}
              <ChevronRight className="absolute right-2 bottom-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </button>
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No languages found matching your criteria</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LanguageSelector;
