import React, { useState } from 'react';
import { Wand2, Loader2, Copy, Check, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { runAITask } from '@/lib/aiTask';

const BuildAppPrompt: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [advice, setAdvice] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!idea.trim()) { toast.error('Describe your app idea first.'); return; }
    setLoading(true); setPrompt(''); setAdvice([]);
    try {
      const raw = await runAITask({
        json: true,
        system: `You are a senior product engineer in 2026. Convert the user's idea into a world-class build prompt for an AI app builder.
Return STRICT JSON: {"prompt":"<full ready-to-paste prompt, modern 2026 style: tech stack, UX, screens, data model, features, design system, edge cases>", "advice":["<actionable tip 1>","<tip 2>","<tip 3>","<tip 4>","<tip 5>"]}
Make the prompt detailed, professional, and immediately usable.`,
        prompt: `App idea: ${idea}`,
      });
      const parsed = JSON.parse(raw);
      setPrompt(parsed.prompt || '');
      setAdvice(Array.isArray(parsed.advice) ? parsed.advice : []);
    } catch (e: any) {
      toast.error('Failed to build prompt. Try again.');
    } finally { setLoading(false); }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true); toast.success('Prompt copied');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="Build App Prompt"
      description="Describe your app idea — get a polished prompt for any AI app builder, plus advice to make it shine."
      icon={<Wand2 className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <label className="text-sm font-medium">Your app idea</label>
          <Textarea value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="e.g. A meal-planning app that uses AI to build weekly menus from what's in my fridge..."
            className="min-h-[200px] resize-y" />
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Building…</> : <><Wand2 className="h-4 w-4 mr-2" />Build Prompt</>}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Generated prompt</h3>
            <Button variant="outline" size="sm" onClick={copy} disabled={!prompt}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
            </Button>
          </div>
          <div className="min-h-[200px] max-h-[40vh] overflow-y-auto p-4 rounded-xl bg-secondary/40 text-sm whitespace-pre-wrap">
            {prompt || <span className="text-muted-foreground">Your ready-to-paste prompt will appear here.</span>}
          </div>
          {advice.length > 0 && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Advice to make it great</p>
              </div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {advice.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
};

export default BuildAppPrompt;
