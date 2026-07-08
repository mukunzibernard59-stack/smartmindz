import React, { useRef, useState } from 'react';
import { Youtube, Search, ExternalLink, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolPage from '@/components/tools/ToolPage';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface YtResult {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
}

const DEFAULT_VIDEO_ID = 'PkZNo7MFNFg';
const DEFAULT_TITLE = 'Featured lesson';

const YouTubeTutor: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(DEFAULT_VIDEO_ID);
  const [activeTitle, setActiveTitle] = useState<string>(DEFAULT_TITLE);

  const [ytQuery, setYtQuery] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytResults, setYtResults] = useState<YtResult[]>([]);
  const [ytError, setYtError] = useState<string | null>(null);
  const searchCacheRef = useRef<Map<string, YtResult[]>>(new Map());

  const runYouTubeSearch = async (q: string) => {
    const term = q.trim();
    if (!term) return;
    setYtError(null);
    const cached = searchCacheRef.current.get(term.toLowerCase());
    if (cached) { setYtResults(cached); return; }
    setYtLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { q: term, maxResults: 12 },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const items: YtResult[] = (data as any)?.items ?? [];
      searchCacheRef.current.set(term.toLowerCase(), items);
      setYtResults(items);
      if (items.length === 0) setYtError('No videos found. Try different keywords.');
    } catch (e: any) {
      const msg = e?.message || 'Search failed';
      setYtError(msg);
      toast({ title: 'YouTube search failed', description: msg, variant: 'destructive' });
    } finally {
      setYtLoading(false);
    }
  };

  const playSearchResult = (r: YtResult) => {
    setActiveId(r.videoId);
    setActiveTitle(r.title);
    setTimeout(() => document.getElementById('yt-video-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${activeTitle} tutorial`)}`;
  const embedUrl = `https://www.youtube.com/embed/${activeId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&fs=1`;

  return (
    <ToolPage
      title="Learning Hub"
      description="Search any learning topic and watch curated video lessons."
      icon={<Youtube className="h-5 w-5" />}
    >
      <SEO
        title="Learning Hub — Free Video Courses | SmartMind"
        description="Search any topic and learn instantly with curated YouTube video lessons. Free."
        path="/youtube-tutor"
      />
      <div className="space-y-4" id="yt-player">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Search any learning topic</h3>
          </div>
          <div className="flex gap-2">
            <Input
              value={ytQuery}
              onChange={e => setYtQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') runYouTubeSearch(ytQuery); }}
              placeholder="e.g. Excel pivot tables, calculus limits, Kinyarwanda grammar…"
              className="flex-1"
            />
            <Button onClick={() => runYouTubeSearch(ytQuery)} disabled={ytLoading || !ytQuery.trim()} variant="hero" className="gap-1">
              {ytLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
          {ytError && <p className="text-xs text-destructive mt-2">{ytError}</p>}
          {ytResults.length > 0 && (
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {ytResults.map(r => (
                <button
                  key={r.videoId}
                  onClick={() => playSearchResult(r)}
                  className={`text-left rounded-xl overflow-hidden border transition-all hover:border-primary/60 hover:shadow-[0_0_20px_-6px_hsl(var(--primary)/0.4)] ${
                    activeId === r.videoId ? 'border-primary/60 bg-primary/5' : 'border-border bg-secondary/30'
                  }`}
                >
                  <div className="aspect-video bg-black">
                    {r.thumbnail && <img src={r.thumbnail} alt={r.title} loading="lazy" className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium line-clamp-2">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{r.channelTitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div id="yt-video-player" className="bg-card border border-border rounded-2xl p-4 sm:p-5">
          <h2 className="text-xl font-semibold mb-3">{activeTitle}</h2>
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              key={activeId}
              src={embedUrl}
              title={activeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              frameBorder={0}
              className="w-full h-full border-0"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 items-center text-xs">
            <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" /> Find more videos
            </a>
            <a href={`https://www.youtube.com/watch?v=${activeId}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary flex items-center gap-1">
              <ExternalLink className="h-3.5 w-3.5" /> Open on YouTube
            </a>
          </div>
        </div>
      </div>
    </ToolPage>
  );
};

export default YouTubeTutor;
