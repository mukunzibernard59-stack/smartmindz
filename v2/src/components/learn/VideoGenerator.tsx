import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Sparkles, Loader2, Download, Film, Camera, Music, FileText, RotateCcw, Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from '@/components/LoginModal';
import ReactMarkdown from 'react-markdown';
import { Progress } from '@/components/ui/progress';

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

const RENDER_STAGES = [
  { label: 'Preparing scene', progress: 15 },
  { label: 'Generating starting frame', progress: 35 },
  { label: 'Generating motion frames', progress: 55 },
  { label: 'Rendering video', progress: 80 },
  { label: 'Finalizing video', progress: 95 },
];

type OutputMode = 'none' | 'script' | 'video';

const VideoGenerator: React.FC = () => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [duration, setDuration] = useState(5);
  const [voiceover, setVoiceover] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [outputMode, setOutputMode] = useState<OutputMode>('none');
  const [renderStage, setRenderStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isLoading = isGeneratingScript || isGeneratingVideo;

  // Simulate render stages during generation
  useEffect(() => {
    if (!isGeneratingVideo) {
      setRenderStage(0);
      return;
    }
    let stage = 0;
    const timings = [0, 3000, 8000, 20000, 60000];
    const timers: ReturnType<typeof setTimeout>[] = [];
    timings.forEach((delay, i) => {
      timers.push(setTimeout(() => setRenderStage(i), delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [isGeneratingVideo]);

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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
    setIsPlaying(false);
    setCurrentTime(0);
    setVideoDuration(0);

    const MAX_RETRIES = 2;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(VIDEO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            prompt: `${style} style: ${prompt}${voiceover ? `. Voiceover: ${voiceover}` : ''}`,
            style,
            duration,
          }),
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({ error: 'Unknown error' }));
          if (resp.status === 429) { toast.error(errData.error || 'Rate limited.'); break; }
          if (resp.status === 402) { toast.error(errData.error || 'Credits exhausted.'); break; }
          if (resp.status === 401) { toast.error(errData.error || 'Auth error.'); break; }
          throw new Error(errData.error || 'Failed to generate video');
        }

        const data = await resp.json();
        if (data.videoUrl && data.type === 'video') {
          setVideoUrl(data.videoUrl);
          toast.success('Video generated successfully!');
          break;
        } else {
          throw new Error('No video returned');
        }
      } catch (error) {
        console.error('Video generation error:', error);
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, attempt * 2000));
          toast.info(`Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        } else {
          toast.error(error instanceof Error ? error.message : 'Failed to generate video. Please try again.');
        }
      }
    }
    setIsGeneratingVideo(false);
  };

  const handleVideoLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoDuration(video.duration);
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
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
        <h2 className="text-xl font-bold">AI Video Generator</h2>
        <p className="text-sm text-muted-foreground">Create real AI-generated videos or professional scripts from text prompts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Story Description</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video scene... (e.g., A drifting car on a rainy city street at night with neon reflections)"
              className="min-h-[120px] bg-secondary border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="text-sm font-medium mb-1.5 block">Duration</label>
              <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Motion Notes (optional)</label>
            <Textarea
              value={voiceover}
              onChange={(e) => setVoiceover(e.target.value)}
              placeholder="Camera movement, animation style, transitions..."
              className="min-h-[60px] bg-secondary border-border"
            />
          </div>

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
                <><Loader2 className="h-4 w-4 animate-spin" /> Rendering...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Generate Video</>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Film, label: 'Scene Breakdown' },
              { icon: Camera, label: 'Camera Motion' },
              { icon: Music, label: 'Cinematic Style' },
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
              {outputMode === 'video' ? 'AI Video Player' : 'Production Plan'}
            </span>
            <div className="flex items-center gap-1.5">
              {scriptContent && outputMode === 'script' && (
                <Button variant="ghost" size="sm" onClick={exportScript} className="gap-1.5 h-7 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              )}
              {videoUrl && outputMode === 'video' && (
                <Button variant="ghost" size="sm" asChild className="gap-1.5 h-7 text-xs">
                  <a href={videoUrl} download="ai-video.mp4" target="_blank" rel="noopener noreferrer">
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Video rendering progress */}
            {isGeneratingVideo && !videoUrl && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Video className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-semibold mb-1">Generating Video...</p>
                <p className="text-xs text-muted-foreground mb-4">
                  {RENDER_STAGES[renderStage]?.label || 'Processing...'}
                </p>
                <div className="w-64">
                  <Progress value={RENDER_STAGES[renderStage]?.progress || 10} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  This may take 1–3 minutes
                </p>
              </div>
            )}

            {/* Script loading */}
            {isGeneratingScript && !scriptContent && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm">Generating your video script...</p>
              </div>
            )}

            {/* Script Output */}
            {outputMode === 'script' && scriptContent && (
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{scriptContent}</ReactMarkdown>
              </div>
            )}

            {/* Video Player */}
            {outputMode === 'video' && videoUrl && (
              <div className="space-y-3">
                <div className="rounded-lg overflow-hidden bg-black aspect-video relative">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    onLoadedMetadata={handleVideoLoaded}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    playsInline
                    preload="auto"
                  />
                </div>

                {/* Custom Controls */}
                <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                  {/* Timeline */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={videoDuration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-mono text-muted-foreground w-10">
                      {formatTime(videoDuration)}
                    </span>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={togglePlay} className="h-8 w-8 p-0">
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={toggleMute} className="h-8 w-8 p-0">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="sm" onClick={generateVideo} disabled={isLoading} className="gap-1.5 h-7 text-xs">
                        <RotateCcw className="h-3.5 w-3.5" /> Regenerate
                      </Button>
                      <Button variant="outline" size="sm" asChild className="gap-1.5 h-7 text-xs">
                        <a href={videoUrl} download="ai-video.mp4" target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  AI-generated video powered by Runway ML
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && outputMode === 'none' && (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Video className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">Generate a script or create an AI video</p>
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
