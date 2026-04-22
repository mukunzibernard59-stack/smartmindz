import React, { useState } from 'react';
import { Youtube, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { runAITask } from '@/lib/aiTask';

const YouTubeTutor: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const teach = async () => {
    if (!topic.trim()) { toast.error('Enter a topic to learn.'); return; }
    setLoading(true); setOutput('');
    try {
      const out = await runAITask({
        system: `You are a friendly YouTube-style tutor. Teach the topic at ${level} level with:
1) A 30-second hook
2) Key concepts (numbered)
3) A worked example
4) Common mistakes
5) A 3-step practice plan
6) Suggested YouTube search queries to deepen learning
Use clear plain-text formatting.`,
        prompt: `Topic: ${topic}`,
      });
      setOutput(out);
    } catch { toast.error('Could not generate the lesson.'); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="YouTube Tutor"
      description="Pick a topic — get a structured mini-lesson plus search queries to find the best videos."
      icon={<Youtube className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <label className="text-sm font-medium">Topic</label>
          <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Introduction to React Hooks" />
          <label className="text-xs text-muted-foreground">Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
            {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
          </select>
          <Button onClick={teach} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Preparing lesson…</> : <><Youtube className="h-4 w-4 mr-2" />Teach me</>}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Lesson</h3>
            <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
            </Button>
          </div>
          <Textarea readOnly value={output} placeholder="Your lesson appears here…" className="min-h-[300px]" />
        </div>
      </div>
    </ToolPage>
  );
};

export default YouTubeTutor;
