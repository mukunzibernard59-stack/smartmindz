import React, { useEffect, useMemo, useState } from 'react';
import { Youtube, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ToolPage from '@/components/tools/ToolPage';

/* -----------------------------------------------------------
 * Structured Learning Hub — replaces AI tutor.
 * Curated topics, embedded YouTube playlists, roadmaps,
 * progress tracker (localStorage), and coding exercises.
 * --------------------------------------------------------- */

type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface Topic {
  id: string;
  title: string;
  level: Level;
  description: string;
  /** YouTube playlist or video ID (used in iframe). */
  videoId: string;
  roadmap: string[];
  exercises: string[];
}

const TOPICS: Topic[] = [
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals',
    level: 'Beginner',
    description: 'Variables, functions, arrays, objects, and the DOM.',
    videoId: 'PkZNo7MFNFg',
    roadmap: ['Syntax & variables', 'Functions & scope', 'Arrays & objects', 'DOM manipulation', 'Events & forms'],
    exercises: ['Build a tip calculator', 'Create a to-do list', 'Make a digital clock', 'Build a quiz with 5 questions'],
  },
  {
    id: 'react-hooks',
    title: 'React Hooks',
    level: 'Intermediate',
    description: 'useState, useEffect, useContext, custom hooks.',
    videoId: 'TNhaISOUy6Q',
    roadmap: ['useState basics', 'useEffect lifecycle', 'useContext for shared state', 'Custom hooks', 'Performance with useMemo / useCallback'],
    exercises: ['Build a counter with persistent state', 'Fetch posts from an API', 'Create a useDebounce hook', 'Build a theme toggle with context'],
  },
  {
    id: 'python-basics',
    title: 'Python for Beginners',
    level: 'Beginner',
    description: 'Syntax, control flow, lists, dicts, functions.',
    videoId: 'rfscVS0vtbw',
    roadmap: ['Print & input', 'If / for / while', 'Lists & dictionaries', 'Functions', 'File I/O'],
    exercises: ['FizzBuzz', 'Number guessing game', 'Word counter', 'CSV reader'],
  },
  {
    id: 'css-flex-grid',
    title: 'CSS Flexbox & Grid',
    level: 'Beginner',
    description: 'Modern layout systems made simple.',
    videoId: 'phWxA89Dy94',
    roadmap: ['Flex container basics', 'Justify & align', 'Grid template columns/rows', 'Responsive layouts', 'Real-world dashboard'],
    exercises: ['Build a card gallery', 'Recreate a pricing table', 'Make a holy-grail layout', 'Build a magazine grid'],
  },
  {
    id: 'algorithms',
    title: 'Algorithms & Data Structures',
    level: 'Advanced',
    description: 'Big-O, sorting, searching, trees, graphs.',
    videoId: '8hly31xKli0',
    roadmap: ['Big-O notation', 'Arrays & strings', 'Linked lists & stacks', 'Trees & BFS/DFS', 'Dynamic programming'],
    exercises: ['Two-sum problem', 'Reverse a linked list', 'Implement a binary search', 'Solve longest substring without repeating chars'],
  },
  {
    id: 'sql-fundamentals',
    title: 'SQL Fundamentals',
    level: 'Intermediate',
    description: 'Queries, joins, aggregations, subqueries.',
    videoId: 'HXV3zeQKqGY',
    roadmap: ['SELECT & WHERE', 'JOIN types', 'GROUP BY & aggregations', 'Subqueries & CTEs', 'Indexes & performance basics'],
    exercises: ['Find top 10 customers by sales', 'Compute monthly revenue', 'Detect duplicate rows', 'Write a recursive CTE'],
  },
  {
    id: 'git-github',
    title: 'Git & GitHub',
    level: 'Beginner',
    description: 'Version control essentials and team workflows.',
    videoId: 'RGOj5yH7evk',
    roadmap: ['Init, add, commit', 'Branches & merging', 'Remotes & push/pull', 'Pull requests', 'Resolving conflicts'],
    exercises: ['Create a repo and push it', 'Open a PR to a sample repo', 'Resolve a merge conflict', 'Revert a bad commit'],
  },
  {
    id: 'typescript',
    title: 'TypeScript Essentials',
    level: 'Intermediate',
    description: 'Types, interfaces, generics, utility types.',
    videoId: 'BwuLxPH8IDs',
    roadmap: ['Primitives & inference', 'Interfaces vs types', 'Generics', 'Utility types', 'Migrating a JS project'],
    exercises: ['Type a fetch wrapper', 'Build a typed event emitter', 'Create a generic Result<T,E>', 'Type a small Redux-like store'],
  },
];

const LEVELS: ('All' | Level)[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const STORAGE_KEY = 'learning-hub-progress';

const YouTubeTutor: React.FC = () => {
  const [level, setLevel] = useState<'All' | Level>('All');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(TOPICS[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Load progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch {}
  }, [completed]);

  const filtered = useMemo(() => TOPICS.filter(t =>
    (level === 'All' || t.level === level) &&
    (!query.trim() || t.title.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()))
  ), [level, query]);

  const active = TOPICS.find(t => t.id === activeId) || TOPICS[0];
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((doneCount / TOPICS.length) * 100);

  const toggleDone = (id: string) => setCompleted(c => ({ ...c, [id]: !c[id] }));

  return (
    <ToolPage
      title="Learning Hub"
      description="Curated topics, embedded tutorials, roadmaps, and exercises with progress tracking."
      icon={<Youtube className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sidebar: filters + topic list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search topics…" />
            <div className="flex flex-wrap gap-1.5">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    level === l ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'
                  }`}
                >{l}</button>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Your progress</span><span className="font-medium">{doneCount}/{TOPICS.length}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-2 max-h-[60vh] overflow-y-auto">
            {filtered.length === 0 && <p className="p-3 text-sm text-muted-foreground">No topics match.</p>}
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full text-left p-3 rounded-lg flex items-start gap-2 transition-colors ${
                  activeId === t.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  completed[t.id] ? 'bg-emerald-500 border-emerald-500' : 'border-border'
                }`}>
                  {completed[t.id] && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.level}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active topic detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">{active.level}</p>
                <h2 className="text-xl font-semibold">{active.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
              </div>
              <Button
                size="sm"
                variant={completed[active.id] ? 'default' : 'outline'}
                onClick={() => toggleDone(active.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                {completed[active.id] ? 'Completed' : 'Mark done'}
              </Button>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                key={active.videoId}
                src={`https://www.youtube-nocookie.com/embed/${active.videoId}`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-medium mb-2">Topic roadmap</h3>
              <ol className="space-y-2 text-sm">
                {active.roadmap.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5"><Code2 className="h-4 w-4" /> Coding exercises</h3>
              <ul className="space-y-2 text-sm">
                {active.exercises.map((ex, i) => (
                  <li key={i} className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default YouTubeTutor;
