import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Upload, RefreshCw, Download, Trash2, ShieldAlert } from 'lucide-react';
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
}

const AdminLibrary: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [rootUrl, setRootUrl] = useState('https://elearning.rtb.gov.rw');
  const [limit, setLimit] = useState(30);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [modules, setModules] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    (async () => {
      const { data } = await sb
        .from('user_roles').select('id').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [user]);

  const loadJobs = async () => {
    const { data } = await sb.from('tvet_import_jobs')
      .select('*').order('created_at', { ascending: false }).limit(20);
    setJobs((data as Job[]) || []);
  };

  const loadModules = async () => {
    const { data } = await sb.from('tvet_modules').select('id, title').order('title').limit(500);
    setModules(data || []);
  };

  useEffect(() => { if (isAdmin) { loadJobs(); loadModules(); } }, [isAdmin]);

  const runImporter = async () => {
    setRunning(true);
    try {
      const { data, error } = await sb.functions.invoke('import-rtb', {
        body: { rootUrl, limit },
      });
      if (error) throw error;
      toast({ title: 'Import finished', description: `Added ${data.resourcesAdded} resources from ${data.pagesProcessed} pages` });
      loadJobs();
    } catch (e: any) {
      toast({ title: 'Import failed', description: e.message || String(e), variant: 'destructive' });
    } finally { setRunning(false); }
  };

  const handleUpload = async () => {
    if (!uploadFile || !moduleId || !uploadTitle) {
      toast({ title: 'Missing fields', description: 'Pick a module, title, and file', variant: 'destructive' });
      return;
    }
    const path = `${moduleId}/${Date.now()}-${uploadFile.name}`;
    const { error: upErr } = await sb.storage.from('tvet-resources').upload(path, uploadFile);
    if (upErr) return toast({ title: 'Upload failed', description: upErr.message, variant: 'destructive' });
    const { data: pub } = sb.storage.from('tvet-resources').getPublicUrl(path);
    const isPdf = /\.pdf$/i.test(uploadFile.name);
    const { error: insErr } = await sb.from('tvet_resources').insert({
      module_id: moduleId, title: uploadTitle, type: isPdf ? 'pdf' : 'link', url: pub.publicUrl,
    });
    if (insErr) return toast({ title: 'Save failed', description: insErr.message, variant: 'destructive' });
    toast({ title: 'Uploaded', description: uploadTitle });
    setUploadFile(null); setUploadTitle('');
  };

  if (isAdmin === null) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
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
      </Card>

      <Card className="p-6 space-y-4 border-primary/20">
        <h2 className="font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Manual upload</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                  value={moduleId} onChange={(e) => setModuleId(e.target.value)}>
            <option value="">Select module…</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <Input placeholder="Resource title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} />
        </div>
        <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
        <Button onClick={handleUpload} variant="hero"><Upload className="h-4 w-4 mr-2" /> Upload</Button>
      </Card>

      <Card className="p-6 space-y-3 border-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent import jobs</h2>
          <Button size="sm" variant="ghost" onClick={loadJobs}><RefreshCw className="h-3 w-3 mr-1" /> Refresh</Button>
        </div>
        <div className="space-y-2">
          {jobs.length === 0 && <p className="text-sm text-muted-foreground">No jobs yet.</p>}
          {jobs.map((j) => (
            <div key={j.id} className="flex items-center justify-between text-xs p-2 rounded border border-border/50">
              <div className="truncate">
                <div className="font-mono truncate">{j.source_url}</div>
                <div className="text-muted-foreground">{new Date(j.created_at).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${j.status === 'completed' ? 'text-emerald-400' : j.status === 'running' ? 'text-amber-400' : 'text-destructive'}`}>{j.status}</div>
                <div className="text-muted-foreground">{j.resources_added} added · {j.pages_processed} pages</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminLibrary;
