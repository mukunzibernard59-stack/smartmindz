import React, { useState } from 'react';
import { Languages, Camera, Upload, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { runAITask } from '@/lib/aiTask';

const LANGUAGES = [
  'English','French','Spanish','German','Italian','Portuguese','Dutch','Russian','Polish','Turkish',
  'Arabic','Hebrew','Persian','Hindi','Bengali','Urdu','Tamil','Telugu','Marathi','Gujarati','Punjabi',
  'Chinese (Simplified)','Chinese (Traditional)','Japanese','Korean','Vietnamese','Thai','Indonesian','Malay','Filipino',
  'Swahili','Kinyarwanda','Yoruba','Igbo','Hausa','Amharic','Zulu','Xhosa','Somali',
  'Greek','Czech','Slovak','Hungarian','Romanian','Bulgarian','Ukrainian','Serbian','Croatian','Norwegian','Swedish','Danish','Finnish',
  'Latin','Esperanto',
];

const Translate: React.FC = () => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('French');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const onPickImage = async (file?: File) => {
    if (!file) return;
    setOcrLoading(true);
    try {
      const reader = new FileReader();
      const dataUrl: string = await new Promise((res, rej) => {
        reader.onload = () => res(reader.result as string); reader.onerror = rej; reader.readAsDataURL(file);
      });
      const ocr = await runAITask({
        system: 'You are an OCR engine. Return ONLY the verbatim text visible in the image. No commentary.',
        prompt: `Extract all readable text from this image data URL: ${dataUrl.slice(0, 80)}…`,
      });
      if (ocr && ocr.trim().length > 3) setText(prev => (prev ? prev + '\n' : '') + ocr.trim());
      else toast.message('OCR produced no text. Please paste text directly.');
    } catch {
      toast.error('Could not read the image. Paste text instead.');
    } finally { setOcrLoading(false); }
  };

  const translate = async () => {
    if (!text.trim()) { toast.error('Provide text to translate.'); return; }
    setLoading(true); setOutput('');
    try {
      const out = await runAITask({
        system: `You are a professional translator. Translate the user's text into ${target}, preserving meaning, tone, and formatting. Output the translation only — no explanations.`,
        prompt: text,
      });
      setOutput(out);
    } catch {
      toast.error('Translation failed. Try again.');
    } finally { setLoading(false); }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true); toast.success('Copied');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="Translate"
      description="Paste text or scan a document — translate into any major language."
      icon={<Languages className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <label className="text-sm font-medium">Source text</label>
          <Textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste text or scan a document..." className="min-h-[200px] resize-y" />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex">
              <input type="file" accept="image/*" capture="environment" hidden
                onChange={e => onPickImage(e.target.files?.[0] || undefined)} />
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm cursor-pointer">
                <Camera className="h-4 w-4" /> {ocrLoading ? 'Reading…' : 'Take photo'}
              </span>
            </label>
            <label className="inline-flex">
              <input type="file" accept="image/*" hidden
                onChange={e => onPickImage(e.target.files?.[0] || undefined)} />
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm cursor-pointer">
                <Upload className="h-4 w-4" /> Upload
              </span>
            </label>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Translate into</label>
            <select value={target} onChange={e => setTarget(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <Button onClick={translate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Translating…</> : <><Languages className="h-4 w-4 mr-2" />Translate</>}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Translation</h3>
            <Button variant="outline" size="sm" onClick={copy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
            </Button>
          </div>
          <div className="min-h-[260px] p-4 rounded-xl bg-secondary/40 text-sm whitespace-pre-wrap">
            {output || <span className="text-muted-foreground">Your translation will appear here.</span>}
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default Translate;
