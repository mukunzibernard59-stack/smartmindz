import React, { useRef, useState } from 'react';
import { Brain, Camera, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import { runAITask } from '@/lib/aiTask';

interface DetectionResult {
  ai_score: number;
  human_score: number;
  verdict: string;
  reasons: string[];
}

const AIDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const onPickImage = async (file?: File) => {
    if (!file) return;
    setOcrLoading(true);
    try {
      const dataUrl: string = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const ocr = await runAITask({
        model: 'google/gemini-2.5-flash',
        system: 'You are an OCR engine. Return ONLY the verbatim text visible in the image. No commentary, no markdown, no quotes.',
        prompt: 'Extract all readable text from this image exactly as shown.',
        imageUrl: dataUrl,
      });
      if (ocr && ocr.trim().length > 2) {
        setText(prev => (prev ? prev + '\n' : '') + ocr.trim());
        toast.success('Text extracted from image');
      } else {
        toast.message('No text detected. Try a clearer photo.');
      }
    } catch (e: any) {
      toast.error('Could not read the image. Try pasting text instead.');
    } finally {
      setOcrLoading(false);
    }
  };

  const detect = async () => {
    if (text.trim().length < 30) { toast.error('Please provide at least 30 characters.'); return; }
    setLoading(true); setResult(null);
    try {
      const raw = await runAITask({
        json: true,
        system: `You are an AI text detector. Analyze the provided text and estimate the probability it was written by AI.
Return STRICT JSON only with this shape:
{"ai_score": <0-100 integer>, "human_score": <0-100 integer>, "verdict": "<short verdict>", "reasons": ["<reason1>", "<reason2>", "<reason3>"]}
ai_score + human_score must equal 100.`,
        prompt: `Analyze this text:\n\n${text}`,
      });
      const parsed: DetectionResult = JSON.parse(raw);
      setResult(parsed);
    } catch (e: any) {
      toast.error('Detection failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <ToolPage
      title="AI Detector"
      description="Paste text or take a photo of a document — get an AI-presence score on a 100% scale."
      icon={<Brain className="h-5 w-5" />}
    >
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3 bg-card border border-border rounded-2xl p-4 sm:p-5">
          <label className="text-sm font-medium">Text to analyze</label>
          <Textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste any text here..." className="min-h-[220px] resize-y" />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={e => { onPickImage(e.target.files?.[0] || undefined); e.target.value = ''; }}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={e => { onPickImage(e.target.files?.[0] || undefined); e.target.value = ''; }}
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" disabled={ocrLoading}
              onClick={() => cameraInputRef.current?.click()}>
              <Camera className="h-4 w-4 mr-2" />
              {ocrLoading ? 'Reading…' : 'Take photo'}
            </Button>
            <Button type="button" variant="secondary" size="sm" disabled={ocrLoading}
              onClick={() => uploadInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload image
            </Button>
          </div>
          <Button onClick={detect} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing…</> : <><Brain className="h-4 w-4 mr-2" />Detect AI</>}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-medium mb-3">Result</h3>
          {!result && <p className="text-sm text-muted-foreground">No analysis yet.</p>}
          {result && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>AI presence</span>
                  <span className="font-medium">{result.ai_score}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${result.ai_score}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Human-likeness</span>
                  <span className="font-medium">{result.human_score}%</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${result.human_score}%` }} />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/60">
                <p className="text-sm font-medium mb-1">Verdict</p>
                <p className="text-sm text-muted-foreground">{result.verdict}</p>
              </div>
              {result.reasons?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Why</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
};

export default AIDetector;
