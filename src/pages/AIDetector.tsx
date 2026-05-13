import React, { useMemo, useState } from 'react';
import { Brain, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ToolPage from '@/components/tools/ToolPage';
import SEO from '@/components/SEO';

/* -----------------------------------------------------------
 * Local Text Analyzer — replaces AI detection.
 * Runs entirely in the browser. No API calls.
 *
 * Provides:
 *   - basic grammar / style hints
 *   - readability (Flesch Reading Ease)
 *   - repeated-word detection
 *   - sentence-length analysis
 *   - keyword density
 *   - simple spelling suggestions (common typos)
 * --------------------------------------------------------- */

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','of','to','in','on','for','with','at','by','from','is','are','was','were','be','been','being','it','its','this','that','these','those','as','i','you','he','she','we','they','them','our','your','my','me','him','her','us','do','does','did','have','has','had','will','would','can','could','should','may','might','not','no','so','than','also','about','into','over','under','out','up','down','very'
]);

const COMMON_TYPOS: Record<string, string> = {
  teh: 'the', recieve: 'receive', adress: 'address', occured: 'occurred', seperate: 'separate',
  definately: 'definitely', untill: 'until', wich: 'which', wether: 'whether', alot: 'a lot',
  thier: 'their', acheive: 'achieve', begining: 'beginning', beleive: 'believe', calender: 'calendar',
  enviroment: 'environment', goverment: 'government', neccessary: 'necessary', occassion: 'occasion',
  truely: 'truly', untill2: 'until', usefull: 'useful', wierd: 'weird', writting: 'writing',
};

const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
};

const analyze = (text: string) => {
  const trimmed = text.trim();
  const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;
  const charCount = trimmed.length;
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const avgWordsPerSentence = wordCount / sentenceCount;

  // Flesch Reading Ease
  const flesch = wordCount > 0
    ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount)
    : 0;

  let readabilityLabel = 'Average';
  if (flesch >= 80) readabilityLabel = 'Very easy';
  else if (flesch >= 60) readabilityLabel = 'Easy';
  else if (flesch >= 40) readabilityLabel = 'Moderate';
  else if (flesch >= 20) readabilityLabel = 'Difficult';
  else readabilityLabel = 'Very difficult';

  // Repeated words
  const freq: Record<string, number> = {};
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z']/g, '');
    if (!key || STOPWORDS.has(key)) continue;
    freq[key] = (freq[key] || 0) + 1;
  }
  const repeated = Object.entries(freq)
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Keyword density (top non-stopwords)
  const density = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w, n]) => ({ word: w, count: n, density: ((n / Math.max(wordCount, 1)) * 100).toFixed(2) + '%' }));

  // Long sentences
  const longSentences = sentences
    .map((s, i) => ({ idx: i + 1, words: s.split(/\s+/).filter(Boolean).length, preview: s.slice(0, 90) + (s.length > 90 ? '…' : '') }))
    .filter(s => s.words > 25)
    .slice(0, 5);

  // Spelling suggestions
  const spelling: { word: string; suggestion: string }[] = [];
  const seen = new Set<string>();
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z]/g, '');
    if (COMMON_TYPOS[key] && !seen.has(key)) {
      spelling.push({ word: w, suggestion: COMMON_TYPOS[key] });
      seen.add(key);
    }
  }

  // Grammar / style hints (basic regex heuristics)
  const grammar: string[] = [];
  if (/\bi\b/.test(text)) grammar.push('Lowercase "i" found — should be capitalized as "I".');
  if (/\s{2,}/.test(text)) grammar.push('Multiple consecutive spaces detected.');
  if (/\s+[.,;:!?]/.test(text)) grammar.push('Space before punctuation found — remove the extra space.');
  if (/[.,;:!?][a-zA-Z]/.test(text)) grammar.push('Missing space after punctuation in places.');
  if (/\b(very|really|just|actually|basically)\b/gi.test(text)) grammar.push('Filler words detected (very, really, just, actually) — consider removing for stronger writing.');
  if (avgWordsPerSentence > 22) grammar.push(`Average sentence length is ${avgWordsPerSentence.toFixed(1)} words — try shorter sentences.`);
  if (sentences.some(s => s.split(/\s+/).length < 3)) grammar.push('Some sentences are very short — consider combining for flow.');

  return {
    wordCount, sentenceCount, charCount,
    avgWordsPerSentence: +avgWordsPerSentence.toFixed(1),
    flesch: +flesch.toFixed(1), readabilityLabel,
    repeated, density, longSentences, spelling, grammar,
  };
};

const AIDetector: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => (text.trim().length >= 20 ? analyze(text) : null), [text]);

  const copyReport = async () => {
    if (!result) return;
    const r = result;
    const lines = [
      `Words: ${r.wordCount} | Sentences: ${r.sentenceCount} | Characters: ${r.charCount}`,
      `Avg sentence length: ${r.avgWordsPerSentence} words`,
      `Readability (Flesch): ${r.flesch} — ${r.readabilityLabel}`,
      ``,
      `Top keywords:`,
      ...r.density.map(d => `  - ${d.word}: ${d.count} (${d.density})`),
      ``,
      `Repeated words: ${r.repeated.map(([w, n]) => `${w} (${n})`).join(', ') || 'none'}`,
      ``,
      `Grammar / style hints:`,
      ...(r.grammar.length ? r.grammar.map(g => `  - ${g}`) : ['  - No issues detected.']),
      ``,
      `Spelling suggestions: ${r.spelling.map(s => `${s.word} → ${s.suggestion}`).join(', ') || 'none'}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true); toast.success('Report copied');
      setTimeout(() => setCopied(false), 1500);
    } catch { toast.error('Copy failed'); }
  };

  return (
    <ToolPage
      title="Text Analyzer"
      description="Grammar, readability, repeated words, sentence length, keyword density and spelling — all instant, all local."
      icon={<Brain className="h-5 w-5" />}
    >
      <SEO
        title="AI Text Analyzer — Grammar & Readability | SmartMind"
        description="Instant local text analyzer: grammar hints, readability, repeated words, sentence length, keyword density and spelling — no signup."
        path="/ai-detector"
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-3 bg-card border border-border rounded-2xl p-4 sm:p-5">
          <label className="text-sm font-medium">Text to analyze</label>
          <Textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your text (minimum 20 characters)…"
            className="min-h-[280px] resize-y"
          />
          <p className="text-xs text-muted-foreground">Analysis runs instantly as you type — no AI, no upload.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Report</h3>
            <Button variant="outline" size="sm" onClick={copyReport} disabled={!result}>
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />} Copy
            </Button>
          </div>

          {!result && <p className="text-sm text-muted-foreground">Type or paste text to see results.</p>}

          {result && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Words" value={result.wordCount} />
                <Stat label="Sentences" value={result.sentenceCount} />
                <Stat label="Chars" value={result.charCount} />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Readability — {result.readabilityLabel}</span>
                  <span className="font-medium">{result.flesch}</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${Math.max(0, Math.min(100, result.flesch))}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Avg {result.avgWordsPerSentence} words per sentence.</p>
              </div>

              {result.grammar.length > 0 && (
                <Section title="Grammar & style">
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {result.grammar.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                </Section>
              )}

              {result.spelling.length > 0 && (
                <Section title="Spelling suggestions">
                  <ul className="text-muted-foreground space-y-1">
                    {result.spelling.map((s, i) => <li key={i}><span className="text-destructive">{s.word}</span> → <span className="text-emerald-500">{s.suggestion}</span></li>)}
                  </ul>
                </Section>
              )}

              {result.repeated.length > 0 && (
                <Section title="Repeated words">
                  <div className="flex flex-wrap gap-1.5">
                    {result.repeated.map(([w, n]) => (
                      <span key={w} className="text-xs px-2 py-1 rounded-full bg-secondary border border-border">{w} · {n}</span>
                    ))}
                  </div>
                </Section>
              )}

              {result.density.length > 0 && (
                <Section title="Keyword density (top 10)">
                  <div className="space-y-1">
                    {result.density.map(d => (
                      <div key={d.word} className="flex justify-between text-muted-foreground">
                        <span>{d.word}</span><span>{d.count} · {d.density}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {result.longSentences.length > 0 && (
                <Section title="Long sentences (>25 words)">
                  <ul className="space-y-1 text-muted-foreground">
                    {result.longSentences.map(s => <li key={s.idx}>#{s.idx} ({s.words} words): "{s.preview}"</li>)}
                  </ul>
                </Section>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="p-3 rounded-lg bg-secondary/60 text-center">
    <div className="text-lg font-semibold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-sm font-medium mb-2">{title}</p>
    {children}
  </div>
);

export default AIDetector;
