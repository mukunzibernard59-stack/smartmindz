import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search, BookOpen, FileText, Link2, HelpCircle, ArrowLeft, Sparkles } from 'lucide-react';
import EmbeddedViewer from '@/components/library/EmbeddedViewer';

type Category = { id: string; slug: string; name: string; description: string | null; sort_order: number };
type Course = { id: string; category_id: string; title: string; description: string | null };
type Level = { id: string; course_id: string; level: 'L3' | 'L4' | 'L5' };
type Module = { id: string; level_id: string; title: string; description: string | null };
type Resource = { id: string; module_id: string; type: 'pdf' | 'note' | 'link' | 'quiz' | 'video'; title: string; url: string | null; extracted_text: string | null };

type View =
  | { kind: 'hub' }
  | { kind: 'category'; category: Category }
  | { kind: 'course'; category: Category; course: Course }
  | { kind: 'module'; category: Category; course: Course; level: Level; module: Module };

const Library: React.FC = () => {
  const [view, setView] = useState<View>({ kind: 'hub' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<{ courses: Course[]; modules: Module[]; resources: Resource[] } | null>(null);
  const [viewerResource, setViewerResource] = useState<Resource | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('tvet_categories').select('*').order('sort_order');
      setCategories(data || []);
      setLoading(false);
    })();
  }, []);

  // Load courses for a category
  useEffect(() => {
    if (view.kind === 'category' || view.kind === 'course' || view.kind === 'module') {
      const catId = view.kind === 'category' ? view.category.id : view.category.id;
      supabase.from('tvet_courses').select('*').eq('category_id', catId).order('sort_order')
        .then(({ data }) => setCourses(data || []));
    }
  }, [view]);

  // Load levels + modules for a course
  useEffect(() => {
    if (view.kind === 'course' || view.kind === 'module') {
      const courseId = view.course.id;
      supabase.from('tvet_levels').select('*').eq('course_id', courseId).order('level')
        .then(async ({ data: lvls }) => {
          setLevels(lvls || []);
          if (lvls?.length) {
            const ids = lvls.map(l => l.id);
            const { data: mods } = await supabase.from('tvet_modules').select('*').in('level_id', ids).order('sort_order');
            setModules(mods || []);
          }
        });
    }
  }, [view.kind === 'course' || view.kind === 'module' ? (view as any).course.id : null]);

  // Load resources for a module
  useEffect(() => {
    if (view.kind === 'module') {
      supabase.from('tvet_resources').select('*').eq('module_id', view.module.id).order('sort_order')
        .then(({ data }) => setResources(data || []));
    }
  }, [view.kind === 'module' ? (view as any).module.id : null]);

  // Smart search
  useEffect(() => {
    const q = search.trim();
    if (q.length < 2) { setSearchResults(null); return; }
    const t = setTimeout(async () => {
      const [c, m, r] = await Promise.all([
        supabase.from('tvet_courses').select('*').ilike('title', `%${q}%`).limit(10),
        supabase.from('tvet_modules').select('*').ilike('title', `%${q}%`).limit(10),
        supabase.from('tvet_resources').select('*').or(`title.ilike.%${q}%,extracted_text.ilike.%${q}%`).limit(10),
      ]);
      setSearchResults({ courses: c.data || [], modules: m.data || [], resources: r.data || [] });
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const breadcrumb = useMemo(() => {
    const parts: { label: string; onClick: () => void }[] = [{ label: 'Library', onClick: () => setView({ kind: 'hub' }) }];
    if (view.kind !== 'hub') parts.push({ label: view.category.name, onClick: () => setView({ kind: 'category', category: view.category }) });
    if (view.kind === 'course' || view.kind === 'module') parts.push({ label: view.course.title, onClick: () => setView({ kind: 'course', category: view.category, course: view.course }) });
    if (view.kind === 'module') parts.push({ label: `${view.level.level} • ${view.module.title}`, onClick: () => {} });
    return parts;
  }, [view]);

  const resourceIcon = (t: Resource['type']) => {
    if (t === 'pdf') return <FileText className="h-4 w-4 text-primary" />;
    if (t === 'note') return <BookOpen className="h-4 w-4 text-primary" />;
    if (t === 'link') return <Link2 className="h-4 w-4 text-primary" />;
    if (t === 'quiz') return <HelpCircle className="h-4 w-4 text-primary" />;
    return <FileText className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Rwanda TVET Learning Library | SmartMind"
        description="Browse official Rwanda TVET courses, levels L3/L4/L5, modules, notes, PDFs and quizzes — all inside one app."
        path="/library"
      />
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto px-3 max-w-6xl">
          <div className="flex items-center gap-2 py-3">
            <BackButton />
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="h-3 w-3" />}
                  <button onClick={b.onClick} className="hover:text-primary transition-colors">{b.label}</button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Hero */}
          {view.kind === 'hub' && (
            <div className="text-center py-6 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs mb-3">
                <Sparkles className="h-3 w-3" /> Rwanda TVET Library
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                Learn Your Trade. Inside the App.
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Official TVET sectors, courses, L3/L4/L5 levels, modules and resources — all rendered seamlessly.
              </p>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, modules, notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border h-11"
            />
          </div>

          {searchResults ? (
            <div className="space-y-4">
              {searchResults.courses.length === 0 && searchResults.modules.length === 0 && searchResults.resources.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No results for "{search}"</p>
              )}
              {searchResults.courses.length > 0 && (
                <Section title="Courses">
                  {searchResults.courses.map(c => (
                    <button key={c.id} onClick={async () => {
                      const cat = categories.find(x => x.id === c.category_id);
                      if (cat) setView({ kind: 'course', category: cat, course: c });
                      setSearch('');
                    }} className="block w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-all">
                      <div className="font-medium text-sm">{c.title}</div>
                      {c.description && <div className="text-xs text-muted-foreground mt-0.5">{c.description}</div>}
                    </button>
                  ))}
                </Section>
              )}
              {searchResults.modules.length > 0 && (
                <Section title="Modules">
                  {searchResults.modules.map(m => (
                    <div key={m.id} className="p-3 rounded-xl bg-card border border-border">
                      <div className="font-medium text-sm">{m.title}</div>
                      {m.description && <div className="text-xs text-muted-foreground mt-0.5">{m.description}</div>}
                    </div>
                  ))}
                </Section>
              )}
              {searchResults.resources.length > 0 && (
                <Section title="Resources">
                  {searchResults.resources.map(r => (
                    <button key={r.id} onClick={() => setViewerResource(r)} className="flex items-center gap-2 w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
                      {resourceIcon(r.type)}
                      <span className="text-sm">{r.title}</span>
                    </button>
                  ))}
                </Section>
              )}
            </div>
          ) : view.kind === 'hub' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
                : categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setView({ kind: 'category', category: c })}
                      className="group relative p-5 text-left rounded-2xl bg-card border border-border hover:border-primary/60 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.5)] transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative">
                        <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{c.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                        <div className="mt-3 inline-flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore <ChevronRight className="h-3 w-3 ml-0.5" />
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
          ) : view.kind === 'category' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No courses yet in this category.</p>
              ) : courses.map(c => (
                <button key={c.id} onClick={() => setView({ kind: 'course', category: view.category, course: c })}
                  className="group p-4 text-left rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-all">
                  <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{c.title}</div>
                  {c.description && <div className="text-xs text-muted-foreground">{c.description}</div>}
                </button>
              ))}
            </div>
          ) : view.kind === 'course' ? (
            <div className="space-y-5">
              {(['L3','L4','L5'] as const).map(lvl => {
                const level = levels.find(l => l.level === lvl);
                if (!level) return null;
                const lvlModules = modules.filter(m => m.level_id === level.id);
                return (
                  <div key={lvl} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-semibold">{lvl}</span>
                      <span className="text-sm text-muted-foreground">{lvlModules.length} modules</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {lvlModules.map(m => (
                        <button key={m.id} onClick={() => setView({ kind: 'module', category: view.category, course: view.course, level, module: m })}
                          className="flex items-center justify-between gap-2 p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/40 hover:bg-secondary transition-all text-left">
                          <div>
                            <div className="text-sm font-medium">{m.title}</div>
                            {m.description && <div className="text-xs text-muted-foreground">{m.description}</div>}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : view.kind === 'module' ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <button onClick={() => setView({ kind: 'course', category: view.category, course: view.course })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3">
                <ArrowLeft className="h-3 w-3" /> Back to {view.course.title}
              </button>
              <h2 className="text-lg font-semibold mb-1">{view.module.title}</h2>
              {view.module.description && <p className="text-sm text-muted-foreground mb-4">{view.module.description}</p>}
              <div className="space-y-2">
                {resources.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No resources uploaded yet. Admin tools coming next phase.
                  </p>
                ) : resources.map(r => (
                  <button key={r.id} onClick={() => setViewerResource(r)}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/40 transition-all">
                    {resourceIcon(r.type)}
                    <span className="text-sm flex-1">{r.title}</span>
                    <span className="text-xs uppercase text-muted-foreground">{r.type}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <EmbeddedViewer resource={viewerResource} onClose={() => setViewerResource(null)} />
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

export default Library;
