import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import BackButton from '@/components/BackButton';
import SEO from '@/components/SEO';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Search, BookOpen, FileText, Link2, HelpCircle, ArrowLeft, AlertCircle } from 'lucide-react';

const EmbeddedViewer = lazy(() => import('@/components/library/EmbeddedViewer'));

type Category = { id: string; slug: string; name: string; description: string | null; sort_order: number };
type Course = { id: string; category_id: string; title: string; description: string | null; sort_order: number };
type Level = { id: string; course_id: string; level: 'L3' | 'L4' | 'L5' };
type Module = { id: string; level_id: string; title: string; description: string | null; sort_order: number };
type Resource = {
  id: string;
  module_id: string;
  type: 'pdf' | 'note' | 'link' | 'quiz' | 'video';
  title: string;
  content: string | null;
  user_id: string | null;
  created_at: string;
  sort_order: number;
};

type View =
  | { kind: 'hub' }
  | { kind: 'category'; category: Category }
  | { kind: 'course'; category: Category; course: Course }
  | { kind: 'module'; category: Category; course: Course; level: Level; module: Module };

const CATEGORY_COLUMNS = 'id, slug, name, description, sort_order';
const COURSE_COLUMNS = 'id, category_id, title, description, sort_order';
const LEVEL_COLUMNS = 'id, course_id, level';
const MODULE_COLUMNS = 'id, level_id, title, description, sort_order';
const RESOURCE_COLUMNS = 'id, module_id, type, title, content, user_id, created_at, sort_order';

const useDebouncedValue = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

const Library: React.FC = () => {
  const [view, setView] = useState<View>({ kind: 'hub' });
  const [search, setSearch] = useState('');
  const [viewerResource, setViewerResource] = useState<Resource | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim());

  const activeCategoryId = view.kind === 'category' || view.kind === 'course' || view.kind === 'module'
    ? view.category.id
    : null;
  const activeCourseId = view.kind === 'course' || view.kind === 'module' ? view.course.id : null;
  const activeModuleId = view.kind === 'module' ? view.module.id : null;

  const categoriesQuery = useQuery({
    queryKey: ['tvet', 'categories'],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from('tvet_categories')
        .select(CATEGORY_COLUMNS)
        .order('sort_order')
        .abortSignal(signal);
      if (error) throw error;
      return (data || []) as Category[];
    },
  });

  const coursesQuery = useQuery({
    queryKey: ['tvet', 'courses', activeCategoryId],
    enabled: !!activeCategoryId,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from('tvet_courses')
        .select(COURSE_COLUMNS)
        .eq('category_id', activeCategoryId!)
        .order('sort_order')
        .limit(60)
        .abortSignal(signal);
      if (error) throw error;
      return (data || []) as Course[];
    },
  });

  const courseContentQuery = useQuery({
    queryKey: ['tvet', 'course-content', activeCourseId],
    enabled: !!activeCourseId,
    queryFn: async ({ signal }) => {
      const { data: levelsData, error: levelsError } = await supabase
        .from('tvet_levels')
        .select(LEVEL_COLUMNS)
        .eq('course_id', activeCourseId!)
        .order('level')
        .abortSignal(signal);
      if (levelsError) throw levelsError;

      const levels = (levelsData || []) as Level[];
      if (levels.length === 0) {
        return { levels, modules: [] as Module[], resourcesByModule: {} as Record<string, Resource[]> };
      }

      const { data: modulesData, error: modulesError } = await supabase
        .from('tvet_modules')
        .select(MODULE_COLUMNS)
        .in('level_id', levels.map((level) => level.id))
        .order('sort_order')
        .abortSignal(signal);
      if (modulesError) throw modulesError;

      const modules = (modulesData || []) as Module[];
      if (modules.length === 0) {
        return { levels, modules, resourcesByModule: {} as Record<string, Resource[]> };
      }

      const { data: resourcesData, error: resourcesError } = await supabase
        .from('tvet_resources')
        .select(RESOURCE_COLUMNS)
        .in('module_id', modules.map((module) => module.id))
        .order('sort_order')
        .limit(300)
        .abortSignal(signal);
      if (resourcesError) throw resourcesError;

      const resourcesByModule: Record<string, Resource[]> = {};
      ((resourcesData || []) as Resource[]).forEach((resource) => {
        resourcesByModule[resource.module_id] = resourcesByModule[resource.module_id] || [];
        resourcesByModule[resource.module_id].push(resource);
      });

      return { levels, modules, resourcesByModule };
    },
  });

  const moduleResourcesQuery = useQuery({
    queryKey: ['tvet', 'module-resources', activeModuleId],
    enabled: !!activeModuleId && !courseContentQuery.data?.resourcesByModule[activeModuleId],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from('tvet_resources')
        .select(RESOURCE_COLUMNS)
        .eq('module_id', activeModuleId!)
        .order('sort_order')
        .limit(100)
        .abortSignal(signal);
      if (error) throw error;
      return (data || []) as Resource[];
    },
  });

  const searchQuery = useQuery({
    queryKey: ['tvet', 'search', debouncedSearch],
    enabled: debouncedSearch.length >= 2,
    staleTime: 60 * 1000,
    queryFn: async ({ signal }) => {
      const q = debouncedSearch.replace(/[%_]/g, '\\$&');
      const [courses, modules, resources] = await Promise.all([
        supabase.from('tvet_courses').select(COURSE_COLUMNS).ilike('title', `%${q}%`).order('title').limit(10).abortSignal(signal),
        supabase.from('tvet_modules').select(MODULE_COLUMNS).ilike('title', `%${q}%`).order('title').limit(10).abortSignal(signal),
        supabase
          .from('tvet_resources')
          .select(RESOURCE_COLUMNS)
          .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
          .order('title')
          .limit(10)
          .abortSignal(signal),
      ]);

      const error = courses.error || modules.error || resources.error;
      if (error) throw error;

      return {
        courses: (courses.data || []) as Course[],
        modules: (modules.data || []) as Module[],
        resources: (resources.data || []) as Resource[],
      };
    },
  });

  const categories = categoriesQuery.data || [];
  const courses = coursesQuery.data || [];
  const levels = courseContentQuery.data?.levels || [];
  const modules = courseContentQuery.data?.modules || [];
  const resourcesByModule = courseContentQuery.data?.resourcesByModule || {};
  const resources = activeModuleId
    ? resourcesByModule[activeModuleId] || moduleResourcesQuery.data || []
    : [];

  const isSearching = debouncedSearch.length >= 2;
  const isInitialHubLoading = view.kind === 'hub' && categoriesQuery.isPending;
  const isCategoryLoading = view.kind === 'category' && coursesQuery.isFetching && courses.length === 0;
  const isCourseLoading = view.kind === 'course' && courseContentQuery.isFetching && modules.length === 0;
  const isModuleLoading = view.kind === 'module' && (courseContentQuery.isFetching || moduleResourcesQuery.isFetching) && resources.length === 0;
  const currentError = categoriesQuery.error || coursesQuery.error || courseContentQuery.error || moduleResourcesQuery.error || searchQuery.error;

  const breadcrumb = useMemo(() => {
    const parts: { label: string; onClick: () => void }[] = [{ label: 'Library', onClick: () => setView({ kind: 'hub' }) }];
    if (view.kind !== 'hub') parts.push({ label: view.category.name, onClick: () => setView({ kind: 'category', category: view.category }) });
    if (view.kind === 'course' || view.kind === 'module') parts.push({ label: view.course.title, onClick: () => setView({ kind: 'course', category: view.category, course: view.course }) });
    if (view.kind === 'module') parts.push({ label: `${view.level.level} - ${view.module.title}`, onClick: () => {} });
    return parts;
  }, [view]);

  const resourceIcon = (type: Resource['type']) => {
    if (type === 'pdf') return <FileText className="h-4 w-4 text-primary" />;
    if (type === 'note') return <BookOpen className="h-4 w-4 text-primary" />;
    if (type === 'link') return <Link2 className="h-4 w-4 text-primary" />;
    if (type === 'quiz') return <HelpCircle className="h-4 w-4 text-primary" />;
    return <FileText className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Rwanda TVET Learning Library | SmartMind"
        description="Browse official Rwanda TVET courses, levels L3/L4/L5, modules, notes, PDFs and quizzes inside one app."
        path="/library"
      />
      <Navbar />
      <main className="flex-1 pt-16 pb-8">
        <div className="container mx-auto px-3 max-w-6xl">
          <div className="flex items-center gap-2 py-3 min-h-12">
            <BackButton />
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
              {breadcrumb.map((item, index) => (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && <ChevronRight className="h-3 w-3" />}
                  <button onClick={item.onClick} className="hover:text-primary transition-colors">{item.label}</button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {view.kind === 'hub' && (
            <div className="text-center py-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                Learn Your Trade. Inside the App.
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Official TVET sectors, courses, L3/L4/L5 levels, modules and resources rendered with cached navigation.
              </p>
            </div>
          )}

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, modules, notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 bg-card border-border h-11"
            />
          </div>

          {currentError && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>Could not refresh the library. Cached content remains available where possible.</span>
            </div>
          )}

          {isSearching ? (
            <SearchResults
              query={search}
              results={searchQuery.data}
              loading={searchQuery.isFetching && !searchQuery.data}
              categories={categories}
              setView={setView}
              setSearch={setSearch}
              setViewerResource={setViewerResource}
              resourceIcon={resourceIcon}
            />
          ) : view.kind === 'hub' ? (
            <HubView
              categories={categories}
              loading={isInitialHubLoading}
              setView={setView}
            />
          ) : view.kind === 'category' ? (
            <CategoryView
              category={view.category}
              courses={courses}
              loading={isCategoryLoading}
              setView={setView}
            />
          ) : view.kind === 'course' ? (
            <CourseView
              category={view.category}
              course={view.course}
              levels={levels}
              modules={modules}
              resourcesByModule={resourcesByModule}
              loading={isCourseLoading}
              setView={setView}
            />
          ) : view.kind === 'module' ? (
            <ModuleView
              view={view}
              resources={resources}
              loading={isModuleLoading}
              resourceIcon={resourceIcon}
              setView={setView}
              setViewerResource={setViewerResource}
            />
          ) : null}
        </div>
      </main>

      <Suspense fallback={<div className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm" />}>
        <EmbeddedViewer resource={viewerResource} onClose={() => setViewerResource(null)} />
      </Suspense>
    </div>
  );
};

const HubView = ({ categories, loading, setView }: {
  categories: Category[];
  loading: boolean;
  setView: (view: View) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {loading
      ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-lg" />)
      : categories.length === 0
        ? <EmptyState message="No library categories are available yet." />
        : categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setView({ kind: 'category', category })}
              className="group relative min-h-32 p-5 text-left rounded-lg bg-card border border-border hover:border-primary/60 hover:shadow-[0_0_30px_-8px_hsl(var(--primary)/0.5)] transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">{category.description}</p>
                <div className="mt-3 inline-flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ChevronRight className="h-3 w-3 ml-0.5" />
                </div>
              </div>
            </button>
          ))}
  </div>
);

const CategoryView = ({ category, courses, loading, setView }: {
  category: Category;
  courses: Course[];
  loading: boolean;
  setView: (view: View) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {loading
      ? Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-lg" />)
      : courses.length === 0
        ? <EmptyState message="No courses yet in this category." />
        : courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setView({ kind: 'course', category, course })}
              className="group min-h-24 p-4 text-left rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-all"
            >
              <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{course.title}</div>
              {course.description && <div className="text-xs text-muted-foreground line-clamp-2">{course.description}</div>}
            </button>
          ))}
  </div>
);

const CourseView = ({ category, course, levels, modules, resourcesByModule, loading, setView }: {
  category: Category;
  course: Course;
  levels: Level[];
  modules: Module[];
  resourcesByModule: Record<string, Resource[]>;
  loading: boolean;
  setView: (view: View) => void;
}) => {
  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-lg" />)}
      </div>
    );
  }

  if (levels.length === 0) return <EmptyState message="No levels are available for this course yet." />;

  return (
    <div className="space-y-5">
      {(['L3', 'L4', 'L5'] as const).map((levelName) => {
        const level = levels.find((item) => item.level === levelName);
        if (!level) return null;
        const levelModules = modules.filter((module) => module.level_id === level.id);
        return (
          <div key={levelName} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3 min-h-6">
              <span className="px-2.5 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-semibold">{levelName}</span>
              <span className="text-sm text-muted-foreground">{levelModules.length} modules</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {levelModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setView({ kind: 'module', category, course, level, module })}
                  className="flex min-h-20 items-center justify-between gap-2 p-3 rounded-lg bg-secondary/50 border border-transparent hover:border-primary/40 hover:bg-secondary transition-all text-left"
                >
                  <div>
                    <div className="text-sm font-medium">{module.title}</div>
                    {module.description && <div className="text-xs text-muted-foreground line-clamp-2">{module.description}</div>}
                    <div className="text-[11px] text-muted-foreground mt-1">{resourcesByModule[module.id]?.length || 0} resources</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ModuleView = ({ view, resources, loading, resourceIcon, setView, setViewerResource }: {
  view: Extract<View, { kind: 'module' }>;
  resources: Resource[];
  loading: boolean;
  resourceIcon: (type: Resource['type']) => React.ReactNode;
  setView: (view: View) => void;
  setViewerResource: (resource: Resource) => void;
}) => (
  <div className="rounded-lg border border-border bg-card p-5">
    <button
      onClick={() => setView({ kind: 'course', category: view.category, course: view.course })}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3"
    >
      <ArrowLeft className="h-3 w-3" /> Back to {view.course.title}
    </button>
    <h2 className="text-lg font-semibold mb-1">{view.module.title}</h2>
    {view.module.description && <p className="text-sm text-muted-foreground mb-4">{view.module.description}</p>}
    <div className="space-y-2 min-h-24">
      {loading
        ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-12 rounded-lg" />)
        : resources.length === 0
          ? <EmptyState message="No resources uploaded yet." />
          : resources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setViewerResource(resource)}
                className="flex items-center gap-3 w-full min-h-12 text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/40 transition-all"
              >
                {resourceIcon(resource.type)}
                <span className="text-sm flex-1">{resource.title}</span>
                <span className="text-xs uppercase text-muted-foreground">{resource.type}</span>
              </button>
            ))}
    </div>
  </div>
);

const SearchResults = ({ query, results, loading, categories, setView, setSearch, setViewerResource, resourceIcon }: {
  query: string;
  results?: { courses: Course[]; modules: Module[]; resources: Resource[] };
  loading: boolean;
  categories: Category[];
  setView: (view: View) => void;
  setSearch: (search: string) => void;
  setViewerResource: (resource: Resource) => void;
  resourceIcon: (type: Resource['type']) => React.ReactNode;
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
        <Skeleton className="h-20 rounded-lg" />
      </div>
    );
  }

  if (!results || (results.courses.length === 0 && results.modules.length === 0 && results.resources.length === 0)) {
    return <EmptyState message={`No results for "${query}".`} />;
  }

  return (
    <div className="space-y-4">
      {results.courses.length > 0 && (
        <Section title="Courses">
          {results.courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                const category = categories.find((item) => item.id === course.category_id);
                if (category) setView({ kind: 'course', category, course });
                setSearch('');
              }}
              className="block w-full min-h-16 text-left p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] transition-all"
            >
              <div className="font-medium text-sm">{course.title}</div>
              {course.description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{course.description}</div>}
            </button>
          ))}
        </Section>
      )}
      {results.modules.length > 0 && (
        <Section title="Modules">
          {results.modules.map((module) => (
            <div key={module.id} className="min-h-16 p-3 rounded-lg bg-card border border-border">
              <div className="font-medium text-sm">{module.title}</div>
              {module.description && <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{module.description}</div>}
            </div>
          ))}
        </Section>
      )}
      {results.resources.length > 0 && (
        <Section title="Resources">
          {results.resources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => setViewerResource(resource)}
              className="flex items-center gap-2 w-full min-h-12 text-left p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-all"
            >
              {resourceIcon(resource.type)}
              <span className="text-sm">{resource.title}</span>
            </button>
          ))}
        </Section>
      )}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs uppercase text-muted-foreground mb-2">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <p className="text-sm text-muted-foreground text-center py-8 col-span-full">{message}</p>
);

export default Library;
