import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Sparkles, Loader2, Download, Film, Camera, Music, FileText, Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const VIDEO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-video`;

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

type OutputMode = 'none' | 'script' | 'video';

const VideoGenerator: React.FC = () => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [voiceover, setVoiceover] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [outputMode, setOutputMode] = useState<OutputMode>('none');

  const isLoading = isGeneratingScript || isGeneratingVideo;

  const ensureAuth = async (): Promise<string | null> => {
    if (!isAuthenticated) {
      toast.error('Please sign in');
      setLoginOpen(true);
      return null;
    }
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return null;
    }
    const token = await getAccessToken();
    if (!token) {
      toast.error('Session expired. Please sign in again.');
      setLoginOpen(true);
      return null;
    }
    return token;
  };

  const generateScript = async () => {
    const token = await ensureAuth();
    if (!token) return;

    setIsGeneratingScript(true);
    setOutputMode('script');
    setScriptContent('');

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const systemPrompt = `You are a professional video production AI. Generate a complete, structured video production plan in markdown with these exact sections:

## Title
[Creative title]

## Scene Breakdown
[Numbered scenes with descriptions, timing]

## Camera Directions
[Shot types, angles, movements for each scene]

## Dialogue / Narration
[Complete script with timestamps]

## Visual Effects
[VFX descriptions per scene]

## Music & Sound
[Background music style, sound effects]

Style: ${style}
${voiceover ? `Voiceover notes: ${voiceover}` : ''}`;

        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Create a complete video production plan for: ${prompt}` },
            ],
          }),
        });

        if (!resp.ok) {
          if (resp.status === 429) { toast.error('Rate limited. Please wait.'); break; }
          if (resp.status === 402) { toast.error('Usage limit reached.'); break; }
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
              if (delta) { content += delta; setScriptContent(content); }
            } catch {}
          }
        }

        if (content) { toast.success('Script generated!'); break; }
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 1000));
          toast.info(`Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        } else {
          toast.error('Failed to generate script. Please try again.');
        }
      }
    }
    setIsGeneratingScript(false);
  };

  const generateVideo = async () => {
    const token = await ensureAuth();
    if (!token) return;

    setIsGeneratingVideo(true);
    setOutputMode('video');
    setVideoUrl(null);

    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(VIDEO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            prompt: `${style} style: ${prompt}${voiceover ? `. Voiceover: ${voiceover}` : ''}`,
            style,
            duration: 5,
            aspect_ratio: '16:9',
          }),
        });

        if (!resp.ok) {
          if (resp.status === 429) { toast.error('Rate limited. Please wait.'); break; }
          if (resp.status === 402) { toast.error('Usage limit reached.'); break; }
          throw new Error('Failed to generate video');
        }

        const data = await resp.json();
        if (data.videoUrl) {
          setVideoUrl(data.videoUrl);
          toast.success('Video generated!');
          break;
        } else {
          throw new Error('No video returned');
        }
      } catch (error) {
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 1000));
          toast.info(`Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        } else {
          toast.error('Failed to generate video. Please try again.');
        }
      }
    }
    setIsGeneratingVideo(false);
  };

  const exportScript = () => {
    if (!scriptContent) return;
    const blob = new Blob([scriptContent], { type: 'text/markdown' });
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
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Video className="h-7 w-7 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold">Generate Video</h2>
        <p className="text-sm text-muted-foreground">Create professional video scripts or AI-generated videos from text prompts</p>
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

          {/* Two Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={generateScript}
              disabled={isLoading || !prompt.trim()}
              variant="outline"
              className="gap-2 h-11"
            >
              {isGeneratingScript ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><FileText className="h-4 w-4" /> Generate Script</>
              )}
            </Button>
            <Button
              onClick={generateVideo}
              disabled={isLoading || !prompt.trim()}
              variant="hero"
              className="gap-2 h-11"
            >
              {isGeneratingVideo ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating Video...</>
              ) : (
              <><Sparkles className="h-4 w-4" /> Generate Visual</>
            )}
          </Button>
          </div>

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
              {outputMode === 'video' ? 'AI Visual Preview' : 'Production Plan'}
            </span>
            <div className="flex items-center gap-1.5">
              {scriptContent && outputMode === 'script' && (
                <Button variant="ghost" size="sm" onClick={exportScript} className="gap-1.5 h-7 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              )}
              {videoUrl && outputMode === 'video' && (
                <Button variant="ghost" size="sm" asChild className="gap-1.5 h-7 text-xs">
                  <a href={videoUrl} download="ai-visual.png" target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Loading states */}
            {isGeneratingScript && !scriptContent && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm">Generating your video script...</p>
              </div>
            )}

            {isGeneratingVideo && !videoUrl && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Video className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-medium">Creating your video...</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
              </div>
            )}

            {/* Script Output */}
            {outputMode === 'script' && scriptContent && (
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{scriptContent}</ReactMarkdown>
              </div>
            )}

            {/* Video Output - AI Generated Visual */}
            {outputMode === 'video' && videoUrl && (
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-black aspect-video relative group">
                  <img
                    src={videoUrl}
                    alt="AI Generated Visual"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    AI Generated
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  AI-generated visual based on your prompt. Real-time video rendering requires an external video API (e.g. Runway ML).
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={generateVideo} disabled={isLoading} className="gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                  <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <a href={videoUrl} download="ai-visual.png" target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && outputMode === 'none' && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Video className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">Choose to generate a script or video</p>
                <p className="text-xs mt-1">Your output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} defaultTab="login" />
    </div>
  );
};

export default VideoGenerator;
