/* -----------------------------------------------------------
 * Free, key-less retrieval from Wikipedia for simple questions.
 * Cached in-memory + localStorage. No AI calls.
 * --------------------------------------------------------- */

export interface WikiResult {
  title: string;
  extract: string;       // human-readable summary
  url: string;           // canonical Wikipedia article
  thumbnail?: string;
  related: string[];     // related article titles
  youtubeSearch: string; // YouTube search URL for the topic
}

const CACHE_KEY = 'smartmind_wiki_cache_v1';
const memCache = new Map<string, WikiResult>();

function loadDiskCache(): Record<string, WikiResult> {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
}
function saveDiskCache(map: Record<string, WikiResult>) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(map)); } catch {}
}

export async function fetchWikipediaAnswer(topic: string): Promise<WikiResult | null> {
  const key = topic.toLowerCase().trim();
  if (!key) return null;
  if (memCache.has(key)) return memCache.get(key)!;
  const disk = loadDiskCache();
  if (disk[key]) { memCache.set(key, disk[key]); return disk[key]; }

  try {
    // 1) Resolve a likely page title via opensearch (handles fuzzy matches).
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=5&search=${encodeURIComponent(topic)}`;
    const sRes = await fetch(searchUrl);
    if (!sRes.ok) throw new Error('search failed');
    const sJson = await sRes.json();
    const titles: string[] = sJson?.[1] || [];
    if (titles.length === 0) return null;
    const primary = titles[0];
    const related = titles.slice(1, 5);

    // 2) Fetch summary for the primary title.
    const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(primary)}`;
    const r = await fetch(sumUrl);
    if (!r.ok) throw new Error('summary failed');
    const j = await r.json();

    if (j?.type === 'disambiguation' || !j?.extract) {
      // Fall back: just use the search list as related links.
      const result: WikiResult = {
        title: primary,
        extract: `"${primary}" can refer to several things. See related articles below.`,
        url: j?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(primary)}`,
        related,
        youtubeSearch: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}`,
      };
      memCache.set(key, result);
      const d = loadDiskCache(); d[key] = result; saveDiskCache(d);
      return result;
    }

    const result: WikiResult = {
      title: j.title || primary,
      extract: j.extract,
      url: j?.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(primary)}`,
      thumbnail: j?.thumbnail?.source,
      related,
      youtubeSearch: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' explained')}`,
    };
    memCache.set(key, result);
    const d = loadDiskCache(); d[key] = result; saveDiskCache(d);
    return result;
  } catch (e) {
    console.warn('Wiki fetch failed:', e);
    return null;
  }
}

/** Format a WikiResult into a clean Markdown answer to drop into the chat. */
export function formatWikiAnswer(r: WikiResult): string {
  const related = r.related.length
    ? `\n\n**Related topics:** ${r.related.map(t => `[${t}](https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/\s/g, '_'))})`).join(' • ')}`
    : '';
  const yt = `\n\n📺 [Watch related videos on YouTube](${r.youtubeSearch})`;
  return `**${r.title}**\n\n${r.extract}${related}\n\n*Source: [Wikipedia](${r.url})*${yt}`;
}
