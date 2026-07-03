// YouTube Data API v3 search proxy with JWT verification and in-memory cache.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const API_KEY = Deno.env.get('youtube') ?? Deno.env.get('YOUTUBE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

interface CacheEntry { at: number; data: unknown }
const cache = new Map<string, CacheEntry>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24h

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // JWT validation
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return json({ error: 'Missing auth' }, 401);
    const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: 'Invalid auth' }, 401);

    if (!API_KEY) return json({ error: 'YouTube API key not configured' }, 500);

    const body = await req.json().catch(() => ({}));
    const q = String(body?.q ?? '').trim().slice(0, 120);
    const maxResults = Math.min(Math.max(Number(body?.maxResults ?? 12), 1), 25);
    if (!q) return json({ error: 'Query required' }, 400);

    const cacheKey = `${q.toLowerCase()}::${maxResults}`;
    const hit = cache.get(cacheKey);
    if (hit && Date.now() - hit.at < TTL_MS) {
      return json({ items: hit.data, cached: true });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoEmbeddable', 'true');
    url.searchParams.set('safeSearch', 'strict');
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('q', q);
    url.searchParams.set('key', API_KEY);

    const r = await fetch(url.toString());
    if (!r.ok) {
      const text = await r.text();
      console.error('YouTube API error:', r.status, text);
      return json({ error: 'YouTube API error', status: r.status }, 502);
    }
    const j = await r.json();
    const items = (j.items ?? []).map((it: any) => ({
      videoId: it.id?.videoId,
      title: it.snippet?.title,
      description: it.snippet?.description,
      channelTitle: it.snippet?.channelTitle,
      publishedAt: it.snippet?.publishedAt,
      thumbnail: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
    })).filter((x: any) => x.videoId);

    cache.set(cacheKey, { at: Date.now(), data: items });
    return json({ items, cached: false });
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
