import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { useAuth } from '@/hooks/useAuth';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, RefreshCw, Download, ShieldAlert, FolderTree } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  source_url: string;
  status: string;
  pages_processed: number;
  resources_added: number;
  error: string | null;
  created_at: string;
  log?: any[] | null;
}

type Category = { id: string; name: string; sort_order?: number };
type Course = { id: string; category_id: string; title: string };
type Level = { id: string; course_id: string; level: 'L3' | 'L4' | 'L5' };
type Module = { id: string; level_id: string; title: string };

const JOB_COLUMNS = 'id, source_url, status, pages_processed, resources_added, error, created_at, log';


const AdminLibrary: React.FC = () => {
  const { user } = useAuth();
  const { data: isAdmin = false, isPending: isAdminPending } = useAdminStatus(user);
  const [running, setRunning] = useState(false);
  const [rootUrl, setRootUrl] = useState('https://elearning.rtb.gov.rw');
  const [limit, setLimit] = useState(30);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  // Hierarchical picker state
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [levelId, setLevelId] = useState('');
  const [moduleId, setModuleId] = useState('');

  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<'pdf' | 'docx' | 'txt' | 'md' | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileLoading, setFileLoading] = useState(false);

  const pollRef = useRef<number | null>(null);

  const loadJobs = async () => {
    const { data } = await sb.from('tvet_import_jobs')
      .select(JOB_COLUMNS).order('created_at', { ascending: false }).limit(20);
    const list = (data as Job[]) || [];
    setJobs(list);
    const live = list.find((j) => j.status === 'running');
    if (live) setActiveJob(live);
  };

  const loadCategories = async () => {
    const { data } = await sb.from('tvet_categories').select('id, name, sort_order').order('sort_order');
    setCategories(data || []);
  };

  const extractPdfDataUrl = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return `data:application/pdf;base64,${base64}`;
  };

  const extractHtmlFromDocx = async (file: File) => {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.convertToHtml({ arrayBuffer });
    return value;
  };

  const extractTextFromFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (extension === 'pdf') return { content: await extractPdfDataUrl(file), type: 'pdf' as const };
    if (extension === 'docx') return { content: await extractHtmlFromDocx(file), type: 'docx' as const };
    if (extension === 'txt' || extension === 'md') return { content: await file.text(), type: extension as 'txt' | 'md' };
    throw new Error('Unsupported file type. Use PDF, DOCX, TXT, or MD.');
  };

  const handleSelectedFile = async (file: File) => {
    setFileError('');
    setFileLoading(true);
    try {
      const result = await extractTextFromFile(file);
      setSelectedFileName(file.name);
      setSelectedFileType(result.type);
      if (!uploadTitle.trim()) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setUploadContent(result.content.trim ? result.content.trim() : result.content);
    } catch (error: any) {
      setFileError(error?.message || 'Failed to process file.');
    } finally {
      setFileLoading(false);
      setDragActive(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleSelectedFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  useEffect(() => { if (isAdmin) { loadJobs(); loadCategories(); } }, [isAdmin]);

  // Cascade: category -> courses
  useEffect(() => {
    setCourseId(''); setLevelId(''); setModuleId('');
    setCourses([]); setLevels([]); setModules([]);
    if (!categoryId) return;
    sb.from('tvet_courses').select('id, category_id, title')
      .eq('category_id', categoryId).order('title')
      .then(({ data }: any) => setCourses(data || []));
  }, [categoryId]);

  // Cascade: course -> levels
  useEffect(() => {
    setLevelId(''); setModuleId('');
    setLevels([]); setModules([]);
    if (!courseId) return;
    sb.from('tvet_levels').select('id, course_id, level')
      .eq('course_id', courseId).order('level')
      .then(({ data }: any) => setLevels(data || []));
  }, [courseId]);

  // Cascade: level -> modules
  useEffect(() => {
    setModuleId('');
    setModules([]);
    if (!levelId) return;
    sb.from('tvet_modules').select('id, level_id, title')
      .eq('level_id', levelId).order('title')
      .then(({ data }: any) => setModules(data || []));
  }, [levelId]);

  // Poll the active job for live progress
  useEffect(() => {
    if (!activeJob || activeJob.status !== 'running' || activeJob.id === 'pending') {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }
    pollRef.current = window.setInterval(async () => {
      const { data } = await sb.from('tvet_import_jobs')
        .select(JOB_COLUMNS).eq('id', activeJob.id).maybeSingle();
      if (data) {
        setActiveJob(data as Job);
        if ((data as Job).status !== 'running') loadJobs();
      }
    }, 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeJob?.id, activeJob?.status]);

  const runImporter = async () => {
    setRunning(true);
    setActiveJob({
      id: 'pending', source_url: rootUrl, status: 'running',
      pages_processed: 0, resources_added: 0, error: null,
      created_at: new Date().toISOString(), log: [],
    });
    try {
      const { data, error } = await sb.functions.invoke('import-rtb', {
        body: { rootUrl, limit },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({
        title: 'Import finished',
        description: `Added ${data.resourcesAdded} resources from ${data.pagesProcessed} pages`,
      });
      loadJobs();
      setActiveJob(null);
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message || String(e), variant: 'destructive' });
      setActiveJob(null);
    } finally { setRunning(false); }
  };

  const handleUpload = async () => {
    if (!moduleId) return toast({ title: 'Pick a module', description: 'Select Category → Course → Level → Module', variant: 'destructive' });
    if (!uploadTitle.trim()) return toast({ title: 'Enter a title', variant: 'destructive' });
    if (!uploadContent.trim()) return toast({ title: 'Enter content', variant: 'destructive' });

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const uploadType = selectedFileType === 'pdf' ? 'pdf' : 'note';

      const { error: insErr } = await supabase
        .from('tvet_resources')
        .insert({
          module_id: moduleId,
          title: uploadTitle.trim(),
          content: uploadContent.trim(),
          user_id: user?.id ?? null,
          type: uploadType,
        });

      if (insErr) throw insErr;
      toast({ title: 'Uploaded', description: `${uploadTitle} is now available to users in the library.` });
      setUploadTitle('');
      setUploadContent('');
      setSelectedFileName('');
      setSelectedFileType(null);
    } catch (e: any) {
      toast({ title: 'Upload failed', description: e.message || String(e), variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (isAdminPending && user) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-5xl">
        <div className="h-9 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">Admin access required</h1>
        <p className="text-muted-foreground max-w-md">
          Only the assigned library admin can manage TVET resources. Please sign in with the admin account.
        </p>
        <Link to="/library"><Button variant="outline">Back to library</Button></Link>
      </div>
    );
  }


  const percent = activeJob
    ? Math.min(100, Math.round(((activeJob.pages_processed || 0) / Math.max(1, limit)) * 100))
    : 0;
  const liveLog = (activeJob?.log as any[]) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TVET Library Admin
        </h1>
        <p className="text-muted-foreground">Import from RTB, upload resources, and manage modules.</p>
      </header>

      <Card className="p-6 space-y-4 border-primary/20">
        <h2 className="font-semibold flex items-center gap-2"><Download className="h-4 w-4" /> RTB Auto-Importer</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Input value={rootUrl} onChange={(e) => setRootUrl(e.target.value)} placeholder="Root URL" className="sm:col-span-2" />
          <Input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 30)} placeholder="Limit" />
        </div>
        <Button onClick={runImporter} disabled={running} variant="hero" className="w-full sm:w-auto">
          {running ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing…</> : <><RefreshCw className="h-4 w-4 mr-2" /> Run import</>}
        </Button>

        {activeJob && (
          <div className="space-y-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                Status: <span className="text-primary">{activeJob.status}</span>
              </span>
              <span className="text-muted-foreground">
                {activeJob.pages_processed}/{limit} pages · {activeJob.resources_added} added
              </span>
            </div>
            <Progress value={percent} className="h-2" />
            <div className="text-right text-xs text-muted-foreground">{percent}%</div>

            <div className="bg-background/60 border border-border/50 rounded-md p-3 max-h-56 overflow-y-auto text-[11px] font-mono space-y-1">
              {liveLog.length === 0 && <div className="text-muted-foreground">Waiting for first log entry…</div>}
              {liveLog.slice(-100).map((entry: any, i: number) => (
                <div key={i} className={
                  entry.step === 'error' ? 'text-destructive'
                  : entry.step === 'added' ? 'text-emerald-400'
                  : entry.step === 'skip-dup' ? 'text-amber-400'
                  : 'text-muted-foreground'
                }>
                  <span className="opacity-60">{entry.at?.slice(11, 19)}</span>{' '}
                  <span className="font-semibold">{entry.step}</span>{' '}
                  <span className="truncate">{entry.url || entry.count || entry.error || ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-4 border-primary/20">
        <h2 className="font-semibold flex items-center gap-2">
          <Upload className="h-4 w-4" /> Manual upload
        </h2>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <FolderTree className="h-3 w-3" /> Pick where this note belongs — same structure as the public TVET Library.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">1. Sector / Category</label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select category…" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">2. Course</label>
            <Select value={courseId} onValueChange={setCourseId} disabled={!categoryId || courses.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={!categoryId ? 'Pick a category first' : courses.length === 0 ? 'No courses yet' : 'Select course…'} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">3. Level</label>
            <Select value={levelId} onValueChange={setLevelId} disabled={!courseId || levels.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={!courseId ? 'Pick a course first' : levels.length === 0 ? 'No levels yet' : 'Select level…'} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {levels.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">4. Module</label>
            <Select value={moduleId} onValueChange={setModuleId} disabled={!levelId || modules.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={!levelId ? 'Pick a level first' : modules.length === 0 ? 'No modules yet' : 'Select module…'} />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {modules.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Input placeholder="Resource title (shown to users)" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
          <div
            className={`rounded-3xl border-2 ${dragActive ? 'border-primary bg-primary/10' : 'border-border bg-slate-900/5'} p-4 transition-all`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Drag and drop a PDF, DOCX, TXT, or MD file here</p>
                <p className="text-xs text-slate-500">The extracted text will populate the note content automatically.</p>
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900 cursor-pointer hover:bg-slate-100">
                Select file
                <input type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            {selectedFileName && <p className="pt-3 text-sm text-slate-600">Selected file: {selectedFileName}</p>}
            {fileLoading && <p className="pt-2 text-sm text-muted-foreground">Extracting file text…</p>}
            {fileError && <p className="pt-2 text-sm text-destructive">{fileError}</p>}
          </div>
          <textarea
            placeholder="Resource content (text, notes, or summaries)"
            value={uploadContent}
            onChange={(e) => setUploadContent(e.target.value)}
            className="w-full min-h-32 p-4 rounded-2xl border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button onClick={handleUpload} variant="hero" disabled={uploading || fileLoading}>
          {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</> : <><Upload className="h-4 w-4 mr-2" /> Upload to library</>}
        </Button>
      </Card>

      <Card className="p-6 space-y-3 border-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent import jobs</h2>
          <Button size="sm" variant="ghost" onClick={loadJobs}><RefreshCw className="h-3 w-3 mr-1" /> Refresh</Button>
        </div>
        <div className="space-y-2">
          {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs yet.</p>}
          {jobs.map((j) => (
            <button
              key={j.id}
              onClick={() => setActiveJob(j)}
              className="w-full flex items-center justify-between text-xs p-2 rounded border border-border/50 hover:border-primary/40 text-left"
            >
              <div className="truncate">
                <div className="font-mono truncate">{j.source_url}</div>
                <div className="text-muted-foreground">{new Date(j.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${j.status === 'completed' ? 'text-emerald-400' : j.status === 'running' ? 'text-amber-400' : 'text-destructive'}`}>{j.status}</div>
                <div className="text-muted-foreground">{j.resources_added} added · {j.pages_processed} pages</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminLibrary;
