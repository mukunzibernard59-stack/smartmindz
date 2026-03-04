import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Sparkles, Loader2, Download, Film, Camera, Music, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface VideoScript {
  title: string;
  scenes: string;
  cameraDirections: string;
  vfx: string;
  musicSuggestion: string;
  voiceover: string;
  fullScript: string;
}

const STYLES = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'anime', label: 'Anime' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'educational', label: 'Educational' },
  { value: 'music-video', label: 'Music Video' },
  { value: 'explainer', label: 'Explainer' },
  { value: 'short-film', label: 'Short Film' },
];

const VideoGenerator: React.FC = () => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [voiceover, setVoiceover] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [rawResponse, setRawResponse] = useState('');

  const generateVideoScript = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to generate videos');
      setLoginOpen(true);
      return;
    }
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }

    setIsGenerating(true);
    setScript(null);
    setRawResponse('');

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          toast.error('Session expired. Please sign in again.');
          setLoginOpen(true);
          setIsGenerating(false);
          return;
        }

        const systemPrompt = `You are a professional video production AI. Generate a complete, structured video production plan. Return ONLY the structured output in markdown format with these exact sections:

## Title
[Creative title]

## Scene Breakdown
[Numbered scenes with descriptions]

## Camera Directions
[Shot types, angles, movements for each scene]

## Visual Effects
[VFX descriptions per scene]

## Music & Sound
[Background music style, sound effects]

## Voiceover Script
[Complete narration script]

Style: ${style}
${voiceover ? `Voiceover notes: ${voiceover}` : ''}`;

        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Create a complete video production plan for: ${prompt}` },
            ],
          }),
        });

        if (!resp.ok) {
          if (resp.status === 429) {
            toast.error('Rate limited. Please wait a moment.');
            break;
          }
          if (resp.status === 402) {
            toast.error('Usage limit reached.');
            break;
          }
          throw new Error('Failed to generate');
        }

        const reader = resp.body?.getReader();
        if (!reader) throw new Error('No response');

        const decoder = new TextDecoder();
        let buffer = '';
        let content = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let idx;
          while ((idx = buffer.indexOf('\n')) !== -1) {
            let line = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 1);
            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (!line.startsWith('data: ')) continue;
            const json = line.slice(6).trim();
            if (json === '[DONE]') break;
            try {
              const parsed = JSON.parse(json);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                content += delta;
                setRawResponse(content);
              }
            } catch {}
          }
        }

        if (content) {
          setRawResponse(content);
          toast.success('Video script generated!');
          break;
        }
      } catch (error) {
        console.warn(`Attempt ${attempt}/${MAX_RETRIES} failed`);
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 1000));
          toast.info(`Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        } else {
          toast.error('Failed to generate video script. Please try again.');
        }
      }
    }

    setIsGenerating(false);
  };

  const exportScript = () => {
    if (!rawResponse) return;
    const blob = new Blob([rawResponse], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-script.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Script exported!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Video className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Generate Video</h2>
        <p className="text-sm text-muted-foreground">Create professional video scripts and production plans from text prompts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Story Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video concept in detail... (e.g., A 60-second product launch video for a new AI-powered fitness app)"
              className="min-h-[120px] bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Style</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Voiceover Notes (optional)</label>
            <Textarea
              value={voiceover}
              onChange={(e) => setVoiceover(e.target.value)}
              placeholder="Tone, pace, language preferences..."
              className="min-h-[60px] bg-secondary border-border"
            />
          </div>

          <Button
            onClick={generateVideoScript}
            disabled={isGenerating || !prompt.trim()}
            variant="hero"
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Video Script
              </>
            )}
          </Button>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Film, label: 'Scene Breakdown' },
              { icon: Camera, label: 'Camera Directions' },
              { icon: Music, label: 'Music Suggestions' },
              { icon: FileText, label: 'Full Script' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/30">
            <span className="text-sm font-medium flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              Production Plan
            </span>
            {rawResponse && (
              <Button variant="ghost" size="sm" onClick={exportScript} className="gap-1.5 h-7 text-xs">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {isGenerating && !rawResponse && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm">Generating your video script...</p>
              </div>
            )}
            {rawResponse ? (
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{rawResponse}</ReactMarkdown>
              </div>
            ) : !isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Video className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">Your video production plan will appear here</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} defaultTab="login" />
    </div>
  );
};

export default VideoGenerator;
