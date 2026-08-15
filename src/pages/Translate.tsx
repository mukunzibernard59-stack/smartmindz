import React, { useState, useRef, useEffect } from 'react';
import { Languages, Loader2, Copy, Check, ArrowRightLeft, Mic, Square, Volume2, FileText, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import SEO from '@/components/SEO';


/* -----------------------------------------------------------
 * Lightweight translation — uses MyMemory's free public API.
 * No API key. Replaces the previous AI-based translation.
 * --------------------------------------------------------- */

interface Lang { code: string; name: string; }

const LANGUAGES: Lang[] = [
  { code: 'en', name: 'English' }, { code: 'fr', name: 'French' }, { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' }, { code: 'ru', name: 'Russian' }, { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' }, { code: 'ar', name: 'Arabic' }, { code: 'he', name: 'Hebrew' },
  { code: 'fa', name: 'Persian' }, { code: 'hi', name: 'Hindi' }, { code: 'bn', name: 'Bengali' },
  { code: 'ur', name: 'Urdu' }, { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' }, { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }, { code: 'vi', name: 'Vietnamese' }, { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' }, { code: 'ms', name: 'Malay' }, { code: 'sw', name: 'Swahili' },
  { code: 'rw', name: 'Kinyarwanda' }, { code: 'yo', name: 'Yoruba' }, { code: 'am', name: 'Amharic' },
  { code: 'el', name: 'Greek' }, { code: 'cs', name: 'Czech' }, { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' }, { code: 'uk', name: 'Ukrainian' }, { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' }, { code: 'da', name: 'Danish' }, { code: 'fi', name: 'Finnish' },
];

// Best-effort BCP-47 locales for speech recognition / synthesis.
const LOCALES: Record<string, string> = {
  en: 'en-US', fr: 'fr-FR', es: 'es-ES', de: 'de-DE', it: 'it-IT', pt: 'pt-PT', nl: 'nl-NL',
  ru: 'ru-RU', pl: 'pl-PL', tr: 'tr-TR', ar: 'ar-SA', he: 'he-IL', fa: 'fa-IR', hi: 'hi-IN',
  bn: 'bn-IN', ur: 'ur-PK', 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR',
  vi: 'vi-VN', th: 'th-TH', id: 'id-ID', ms: 'ms-MY', sw: 'sw-KE', rw: 'rw-RW', yo: 'yo-NG',
  am: 'am-ET', el: 'el-GR', cs: 'cs-CZ', hu: 'hu-HU', ro: 'ro-RO', uk: 'uk-UA', sv: 'sv-SE',
  no: 'nb-NO', da: 'da-DK', fi: 'fi-FI',
};

const Translate: React.FC = () => {
  const [text, setText] = useState('');
  const [source, setSource] = useState('en');
  const [target, setTarget] = useState('fr');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [askOutput, setAskOutput] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const fromVoiceRef = useRef(false);

  useEffect(() => () => {
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
  }, []);

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error('Voice input is not supported in this browser.'); return; }
    try {
      const rec = new SR();
      recognitionRef.current = rec;
      rec.lang = LOCALES[source] || 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      let final = '';
      rec.onresult = (e: any) => {
        let interim = '';
        final = '';
        for (let i = 0; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) final += r[0].transcript + ' ';
          else interim += r[0].transcript;
        }
        setText((final + interim).trim());
      };
      rec.onerror = (e: any) => {
        if (e.error === 'not-allowed') toast.error('Microphone permission denied.');
        else if (e.error !== 'no-speech' && e.error !== 'aborted') toast.error('Voice input failed.');
      };
      rec.onend = () => { setRecording(false); recognitionRef.current = null; };
      rec.start();
      setRecording(true);
      toast.info('Listening… speak now, then tap stop.');
    } catch {
      toast.error('Could not start voice input.');
    }
  };

  const stopRecording = () => {
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    setRecording(false);
    try { rec?.stop?.(); } catch { /* noop */ }
    setTimeout(() => {
      setText(prev => {
        if (prev.trim()) { fromVoiceRef.current = true; void translate(prev); }
        return prev;
      });
    }, 400);
  };

  const speak = (value: string, lang: string) => {
    if (!('speechSynthesis' in window)) { toast.error('Speech is not supported in this browser.'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(value);
    u.lang = LOCALES[lang] || lang;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };


  const translate = async (input?: string) => {
    const src = (input ?? text).trim();
    if (!src) { toast.error('Provide text to translate.'); return; }
    if (source === target) { setOutput(src); return; }
    setLoading(true); setOutput('');
    try {
      // Split into safe-size chunks (works for any length).
      const chunks: string[] = [];
      const sentences = src.split(/(?<=[.!?])\s+/);

      let buf = '';
      for (const s of sentences) {
        if ((buf + ' ' + s).length > 1500) { if (buf) chunks.push(buf); buf = s; }
        else buf = buf ? buf + ' ' + s : s;
      }
      if (buf) chunks.push(buf);

      // Primary: Google Translate public gtx endpoint — supports Kinyarwanda (rw)
      // and ~100 languages reliably. Fallback: MyMemory (limited language coverage).
      const translateChunk = async (chunk: string): Promise<string> => {
        try {
          const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(source)}&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(chunk)}`;
          const r = await fetch(gUrl);
          if (r.ok) {
            const j = await r.json();
            // j[0] is array of [translatedSegment, originalSegment, ...]
            const out = Array.isArray(j?.[0]) ? j[0].map((seg: any[]) => seg?.[0] || '').join('') : '';
            if (out) return out;
          }
        } catch { /* fall through */ }
        // Fallback to MyMemory (max 480 chars per call)
        const safe = chunk.slice(0, 480);
        const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(safe)}&langpair=${source}|${target}`;
        const mr = await fetch(mUrl);
        if (!mr.ok) throw new Error('Translation service unavailable');
        const mj = await mr.json();
        return mj?.responseData?.translatedText || '';
      };

      const parts: string[] = [];
      for (const chunk of chunks) parts.push(await translateChunk(chunk));
      const result = parts.join(' ');
      setOutput(result);
      if (fromVoiceRef.current && result) setAskOutput(true);
      fromVoiceRef.current = false;
    } catch (e: any) {
      toast.error(e?.message || 'Translation failed.');
    } finally { setLoading(false); }
  };


  const swap = () => {
    setSource(target); setTarget(source);
    setText(output); setOutput(text);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); toast.success('Copied'); setTimeout(() => setCopied(false), 1500); }
    catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="Translate"
      description="Fast translations powered by a lightweight free dictionary API."
      icon={<Languages className="h-5 w-5" />}
    >
      <SEO
        title="Free Translator — 100+ Languages incl. Kinyarwanda | SmartMind"
        description="Translate text instantly between 100+ languages including English, French, Swahili and Kinyarwanda. Free, no signup, no limits."
        path="/translate"
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <select value={source} onChange={e => setSource(e.target.value)}
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
            <Button variant="outline" size="icon" onClick={swap} title="Swap"><ArrowRightLeft className="h-4 w-4" /></Button>
            <select value={target} onChange={e => setTarget(e.target.value)}
              className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
            </select>
          </div>
          <Textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter text to translate…" className="min-h-[220px] resize-y" />
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
