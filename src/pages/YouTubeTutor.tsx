import React, { useEffect, useMemo, useState } from 'react';
import { Youtube, Check, Bookmark, BookmarkCheck, Search, ExternalLink, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolPage from '@/components/tools/ToolPage';

/* -----------------------------------------------------------
 * Universal Learning Hub — covers all major learning fields,
 * not just programming. Embedded YouTube, roadmaps,
 * progress tracking, bookmarks. Pure local data.
 * --------------------------------------------------------- */

type Level = 'Beginner' | 'Intermediate' | 'Advanced';

interface Topic {
  id: string;
  title: string;
  category: string;
  level: Level;
  description: string;
  videoId: string; // YouTube playlist or video id
  roadmap: string[];
}

const TOPICS: Topic[] = [
  // Programming
  { id: 'js-basics', title: 'JavaScript Fundamentals', category: 'Programming', level: 'Beginner', description: 'Variables, functions, arrays, DOM.', videoId: 'PkZNo7MFNFg', roadmap: ['Syntax & variables','Functions & scope','Arrays & objects','DOM','Events'] },
  { id: 'react-hooks', title: 'React Hooks', category: 'Programming', level: 'Intermediate', description: 'useState, useEffect, custom hooks.', videoId: 'TNhaISOUy6Q', roadmap: ['useState','useEffect','useContext','Custom hooks','Performance'] },
  { id: 'python', title: 'Python for Beginners', category: 'Programming', level: 'Beginner', description: 'Syntax and data structures.', videoId: 'rfscVS0vtbw', roadmap: ['Print/input','Control flow','Lists/dicts','Functions','File I/O'] },
  { id: 'algorithms', title: 'Algorithms & Data Structures', category: 'Programming', level: 'Advanced', description: 'Big-O, sorting, graphs, DP.', videoId: '8hly31xKli0', roadmap: ['Big-O','Arrays/strings','Linked lists','Trees & BFS/DFS','DP'] },
  { id: 'sql', title: 'SQL Fundamentals', category: 'Programming', level: 'Intermediate', description: 'Queries, joins, aggregations.', videoId: 'HXV3zeQKqGY', roadmap: ['SELECT/WHERE','JOINs','GROUP BY','Subqueries/CTEs','Indexes'] },
  { id: 'git', title: 'Git & GitHub', category: 'Programming', level: 'Beginner', description: 'Version control essentials.', videoId: 'RGOj5yH7evk', roadmap: ['init/add/commit','Branches','Remotes','Pull requests','Conflicts'] },
  { id: 'typescript', title: 'TypeScript Essentials', category: 'Programming', level: 'Intermediate', description: 'Types, interfaces, generics.', videoId: 'BwuLxPH8IDs', roadmap: ['Primitives','Interfaces','Generics','Utility types','Migration'] },

  // Mathematics
  { id: 'algebra', title: 'Algebra Basics', category: 'Mathematics', level: 'Beginner', description: 'Equations, expressions, graphs.', videoId: 'NybHckSEQBI', roadmap: ['Variables','Linear equations','Quadratics','Functions','Graphing'] },
  { id: 'calculus', title: 'Calculus 1', category: 'Mathematics', level: 'Intermediate', description: 'Limits, derivatives, integrals.', videoId: 'WUvTyaaNkzM', roadmap: ['Limits','Derivatives','Applications','Integrals','Fundamental theorem'] },
  { id: 'statistics', title: 'Statistics & Probability', category: 'Mathematics', level: 'Beginner', description: 'Probability, distributions, inference.', videoId: 'xxpc-HPKN28', roadmap: ['Descriptive stats','Probability','Distributions','Sampling','Hypothesis testing'] },
  { id: 'linear-algebra', title: 'Linear Algebra', category: 'Mathematics', level: 'Advanced', description: 'Vectors, matrices, transformations.', videoId: 'fNk_zzaMoSs', roadmap: ['Vectors','Matrices','Determinants','Eigenvalues','Applications'] },

  // Science
  { id: 'physics', title: 'Physics 101', category: 'Science', level: 'Beginner', description: 'Mechanics and motion fundamentals.', videoId: 'ZAqIoDhornk', roadmap: ['Units','Kinematics','Forces','Energy','Momentum'] },
  { id: 'chemistry', title: 'General Chemistry', category: 'Science', level: 'Beginner', description: 'Atoms, bonds, reactions.', videoId: 'FSyAehMdpyI', roadmap: ['Atomic structure','Periodic table','Bonding','Reactions','Stoichiometry'] },
  { id: 'biology', title: 'Biology Foundations', category: 'Science', level: 'Beginner', description: 'Cells, genetics, evolution.', videoId: 'QnQe0xW_JY4', roadmap: ['Cells','DNA & genes','Evolution','Ecology','Human body'] },

  // Medicine
  { id: 'anatomy', title: 'Human Anatomy', category: 'Medicine', level: 'Intermediate', description: 'Body systems overview.', videoId: 'uBGl2BujkPQ', roadmap: ['Skeletal','Muscular','Cardiovascular','Nervous','Digestive'] },
  { id: 'pharmacology', title: 'Intro to Pharmacology', category: 'Medicine', level: 'Advanced', description: 'Drug action and classes.', videoId: 'NMcMRE7kKKA', roadmap: ['Pharmacokinetics','Pharmacodynamics','CNS drugs','Cardio drugs','Antibiotics'] },

  // Business
  { id: 'business-101', title: 'Business Fundamentals', category: 'Business', level: 'Beginner', description: 'Strategy, operations, marketing.', videoId: 'Flw9IPyDp3w', roadmap: ['Business models','Operations','Marketing','Finance','Leadership'] },
  { id: 'entrepreneurship', title: 'Entrepreneurship', category: 'Business', level: 'Intermediate', description: 'Starting and scaling a business.', videoId: 'ZoqgAy3h4OM', roadmap: ['Idea validation','MVP','Customers','Funding','Scaling'] },

  // Accounting & Finance
  { id: 'accounting', title: 'Accounting Basics', category: 'Accounting', level: 'Beginner', description: 'Debits, credits, statements.', videoId: 'PHe0bXAIuk0', roadmap: ['Equation','Journal entries','Ledger','Trial balance','Financials'] },
  { id: 'personal-finance', title: 'Personal Finance', category: 'Finance', level: 'Beginner', description: 'Budgeting, saving, investing.', videoId: 'gFQNPmLKj1k', roadmap: ['Budgeting','Saving','Debt','Investing','Retirement'] },
  { id: 'trading', title: 'Stock Trading Basics', category: 'Trading', level: 'Intermediate', description: 'Markets, orders, risk.', videoId: 'p7HKvqRI_Bo', roadmap: ['Markets','Orders','Charts','Risk mgmt','Strategy'] },

  // Agriculture
  { id: 'agri', title: 'Modern Agriculture', category: 'Agriculture', level: 'Beginner', description: 'Soil, crops, sustainability.', videoId: 'GK_vRtHJZu4', roadmap: ['Soil','Seeds','Irrigation','Pest mgmt','Harvest'] },

  // Law
  { id: 'law', title: 'Intro to Law', category: 'Law', level: 'Beginner', description: 'Legal systems and principles.', videoId: 'TKCfFoUg_Cg', roadmap: ['Sources of law','Contracts','Torts','Criminal','Constitutional'] },

  // Languages
  { id: 'english', title: 'Learn English', category: 'Languages', level: 'Beginner', description: 'Speaking and grammar basics.', videoId: 'juKd26qkNAw', roadmap: ['Greetings','Grammar','Vocabulary','Conversation','Pronunciation'] },
  { id: 'french', title: 'Learn French', category: 'Languages', level: 'Beginner', description: 'Bonjour to fluency basics.', videoId: 'gJYO9beXNqY', roadmap: ['Pronunciation','Greetings','Verbs','Conversation','Listening'] },
  { id: 'spanish', title: 'Learn Spanish', category: 'Languages', level: 'Beginner', description: 'Spanish for everyday use.', videoId: 't33UPJvZJ6c', roadmap: ['Alphabet','Verbs','Tenses','Vocabulary','Conversation'] },

  // Engineering
  { id: 'mech-eng', title: 'Mechanical Engineering Intro', category: 'Engineering', level: 'Intermediate', description: 'Statics, dynamics, materials.', videoId: 'jmd5e_e29mE', roadmap: ['Statics','Dynamics','Materials','Thermodynamics','Design'] },
  { id: 'elec-eng', title: 'Electrical Engineering Basics', category: 'Engineering', level: 'Beginner', description: 'Circuits and electronics.', videoId: 'lf-MQyZ5K9w', roadmap: ['Voltage/current','Resistors','Capacitors','Op-amps','Digital logic'] },

  // Music & Art
  { id: 'music-theory', title: 'Music Theory', category: 'Music', level: 'Beginner', description: 'Notes, scales, chords.', videoId: 'rgaTLrZGlk0', roadmap: ['Notation','Scales','Intervals','Chords','Harmony'] },
  { id: 'guitar', title: 'Guitar for Beginners', category: 'Music', level: 'Beginner', description: 'First chords and songs.', videoId: 'BBz-Jyei4bI', roadmap: ['Tuning','Chords','Strumming','Transitions','Songs'] },
  { id: 'drawing', title: 'Drawing Fundamentals', category: 'Art', level: 'Beginner', description: 'Lines, shapes, shading.', videoId: 'mEiK8Fct3z0', roadmap: ['Lines','Shapes','Perspective','Shading','Anatomy'] },
  { id: 'photography', title: 'Photography Basics', category: 'Photography', level: 'Beginner', description: 'Exposure, composition, light.', videoId: 'V7z7BAZdt2M', roadmap: ['Exposure triangle','Composition','Lighting','Editing','Genres'] },

  // Design
  { id: 'graphic-design', title: 'Graphic Design Principles', category: 'Graphic Design', level: 'Beginner', description: 'Color, typography, layout.', videoId: 'YqQx75OPRa0', roadmap: ['Color theory','Typography','Layout','Branding','Tools'] },
  { id: 'animation', title: 'Animation Fundamentals', category: 'Animation', level: 'Intermediate', description: '12 principles of animation.', videoId: 'uDqjIdI4bF4', roadmap: ['Squash/stretch','Timing','Anticipation','Arcs','Follow-through'] },
  { id: 'architecture', title: 'Architecture 101', category: 'Architecture', level: 'Intermediate', description: 'Form, function, history.', videoId: 'lpYjF4n8mAk', roadmap: ['History','Materials','Structure','Sustainability','Design'] },

  // Marketing & AI
  { id: 'marketing', title: 'Digital Marketing', category: 'Marketing', level: 'Beginner', description: 'SEO, ads, content, analytics.', videoId: 'bixR-KIJKYM', roadmap: ['SEO','Content','Social','Ads','Analytics'] },
  { id: 'ai-intro', title: 'Introduction to AI', category: 'AI', level: 'Intermediate', description: 'ML, deep learning concepts.', videoId: 'JMUxmLyrhSk', roadmap: ['What is AI','ML basics','Neural nets','LLMs','Applications'] },
  { id: 'cyber', title: 'Cybersecurity Basics', category: 'Cybersecurity', level: 'Intermediate', description: 'Threats, defense, ethical hacking.', videoId: 'inWWhr5tnEA', roadmap: ['Threats','Networking','Crypto','Defense','Ethics'] },

  // Lifestyle / vocational
  { id: 'cooking', title: 'Cooking Fundamentals', category: 'Cooking', level: 'Beginner', description: 'Knife skills, sauces, technique.', videoId: 'ZJy1ajvMU1k', roadmap: ['Knife skills','Heat & technique','Sauces','Seasoning','Recipes'] },

  // History & Geography
  { id: 'world-history', title: 'World History Overview', category: 'History', level: 'Beginner', description: 'Major eras and civilizations.', videoId: 'Yocja_N5s1I', roadmap: ['Ancient','Classical','Medieval','Modern','Contemporary'] },
  { id: 'geography', title: 'World Geography', category: 'Geography', level: 'Beginner', description: 'Continents, climates, cultures.', videoId: 'iMZ7Mz5w7vU', roadmap: ['Continents','Countries','Climate','Population','Cultures'] },
];

const STORAGE_KEY = 'learning-hub-progress';
const BOOKMARKS_KEY = 'learning-hub-bookmarks';

const LEVELS: ('All' | Level)[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const YouTubeTutor: React.FC = () => {
  const categories = useMemo(() => ['All', ...Array.from(new Set(TOPICS.map(t => t.category)))], []);
  const [category, setCategory] = useState<string>('All');
  const [level, setLevel] = useState<'All' | Level>('All');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string>(TOPICS[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Load persisted state
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_KEY); if (c) setCompleted(JSON.parse(c));
      const b = localStorage.getItem(BOOKMARKS_KEY); if (b) setBookmarks(JSON.parse(b));
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch {} }, [completed]);
  useEffect(() => { try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks)); } catch {} }, [bookmarks]);

  const filtered = useMemo(() => TOPICS.filter(t =>
    (category === 'All' || t.category === category) &&
    (level === 'All' || t.level === level) &&
    (!showBookmarked || bookmarks[t.id]) &&
    (!query.trim() ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()))
  ), [category, level, query, showBookmarked, bookmarks]);

  const active = TOPICS.find(t => t.id === activeId) || TOPICS[0];
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((doneCount / TOPICS.length) * 100);

  // Hybrid embed: try the curated video first; if user reports it's
  // unavailable they can switch to a guaranteed search-results playlist.
  const [useFallback, setUseFallback] = useState(false);
  // Reset fallback when active topic changes.
  useEffect(() => { setUseFallback(false); }, [activeId]);

  const ytSearchQuery = `${active.title} ${active.level} tutorial`;
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ytSearchQuery)}`;
  const embedUrl = useFallback
    ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ytSearchQuery)}`
    : `https://www.youtube-nocookie.com/embed/${active.videoId}?rel=0`;

  const toggleDone = (id: string) => setCompleted(c => ({ ...c, [id]: !c[id] }));
  const toggleBookmark = (id: string) => setBookmarks(b => ({ ...b, [id]: !b[id] }));

  return (
    <ToolPage
      title="Learning Hub"
      description="Universal categories with embedded video lessons, roadmaps, progress and bookmarks."
      icon={<Youtube className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sidebar: filters + topic list */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search any topic…" className="pl-8" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    level === l ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'
                  }`}
                >{l}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={showBookmarked} onChange={e => setShowBookmarked(e.target.checked)} />
              Show only bookmarks
            </label>
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
              <div key={t.id} className={`w-full p-2 rounded-lg flex items-start gap-2 transition-colors ${
                activeId === t.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/60'
              }`}>
                <button onClick={() => setActiveId(t.id)} className="flex-1 text-left flex items-start gap-2 min-w-0">
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    completed[t.id] ? 'bg-emerald-500 border-emerald-500' : 'border-border'
                  }`}>
                    {completed[t.id] && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.category} • {t.level}</p>
                  </div>
                </button>
                <button onClick={() => toggleBookmark(t.id)} className="p-1 text-muted-foreground hover:text-primary" aria-label="Bookmark">
                  {bookmarks[t.id] ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active topic detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground">{active.category} • {active.level}</p>
                <h2 className="text-xl font-semibold">{active.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleBookmark(active.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary flex items-center gap-1">
                  {bookmarks[active.id] ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                  {bookmarks[active.id] ? 'Saved' : 'Save'}
                </button>
                <button onClick={() => toggleDone(active.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 ${
                    completed[active.id] ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                  }`}>
                  <Check className="h-4 w-4" /> {completed[active.id] ? 'Completed' : 'Mark done'}
                </button>
              </div>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                key={`${active.videoId}-${useFallback ? 'fb' : 'main'}`}
                src={embedUrl}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2 items-center text-xs">
              <button
                onClick={() => setUseFallback(f => !f)}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary flex items-center gap-1"
                title="Switch between curated video and live YouTube search results"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {useFallback ? 'Curated video' : 'Find more videos'}
              </button>
              <a
                href={ytSearchUrl}
                target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open on YouTube
              </a>
              {useFallback && (
                <span className="text-muted-foreground">Showing live search results — always available.</span>
              )}
            </div>
          </div>

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
        </div>
      </div>
    </ToolPage>
  );
};

export default YouTubeTutor;
