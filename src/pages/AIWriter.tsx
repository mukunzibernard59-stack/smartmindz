import React, { useRef, useState } from 'react';
import { Sparkles, Loader2, Printer, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { runAITask } from '@/lib/aiTask';

const AIWriter: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!idea.trim()) { toast.error('Please describe your idea first.'); return; }
    setLoading(true); setOutput('');
    try {
      const content = await runAITask({
        system: `You are a professional writer. Produce polished, well-structured content ready for print.
Tone: ${tone}. Length: ${length}.
Use clear headings, short paragraphs, and proper spacing. Output plain text (no markdown symbols).`,
        prompt: `Write a complete document about the following idea. Make it ready to print and copy:\n\n${idea}`,
      });
      setOutput(content);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to generate. Try again.');
    } finally { setLoading(false); }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  const printPaper = () => {
    if (!output) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>SmartMind Document</title>
      <style>
        body{font-family:Georgia,serif;color:#111;background:#fff;padding:48px;line-height:1.7;font-size:14pt;white-space:pre-wrap;}
        @page{size:A4;margin:24mm;}
      </style></head><body>${output.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'} as any)[c])}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <ToolPage
      title="AI Writer"
      description="Describe your idea — get a polished document ready to print or copy."
      icon={<Sparkles className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3 bg-card border border-border rounded-2xl p-4 sm:p-5">
          <label className="text-sm font-medium">Your idea</label>
          <Textarea
            value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="e.g. Write a 1-page article about the impact of AI on education in 2026..."
            className="min-h-[160px] resize-y"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                {['Professional','Casual','Academic','Persuasive','Friendly','Inspirational'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Length</label>
              <select value={length} onChange={e => setLength(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                {['Short','Medium','Long','Very long'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Writing...</> : <><Sparkles className="h-4 w-4 mr-2" />Generate</>}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 gap-2">
            <h3 className="text-sm font-medium">Output</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
              </Button>
              <Button variant="outline" size="sm" onClick={printPaper} disabled={!output}>
                <Printer className="h-4 w-4 mr-1" /> Print
              </Button>
            </div>
          </div>
          <div ref={paperRef}
            className="flex-1 min-h-[420px] bg-white text-zinc-900 rounded-xl p-6 sm:p-10 shadow-lg overflow-y-auto whitespace-pre-wrap leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', fontSize: '14px' }}>
            {output || <span className="text-zinc-400">Your generated document will appear here as a clean, printable white page…</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default AIWriter;
