// RTB Firecrawl importer — scrapes elearning.rtb.gov.rw and ingests
// real PDFs / notes into the TVET library, attaching them to existing
// modules (best fuzzy title match) or under an "Imported" module.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';
const DEFAULT_ROOT = 'https://elearning.rtb.gov.rw';

interface ImportBody {
  rootUrl?: string;
  limit?: number;
  maxDepth?: number;
  includePaths?: string[];
  jobId?: string;
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function score(a: string, b: string) {
  const A = new Set(norm(a).split(' ').filter(Boolean));
  const B = new Set(norm(b).split(' ').filter(Boolean));
  if (!A.size || !B.size) return 0;
  let hit = 0;
  for (const t of A) if (B.has(t)) hit++;
  return hit / Math.max(A.size, B.size);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'FIRECRAWL_API_KEY missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Auth: must be admin
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userId = claims.claims.sub as string;

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const { data: roleRow } = await admin
      .from('user_roles').select('id').eq('user_id', userId).eq('role', 'admin').maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: 'Admin role required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = (await req.json().catch(() => ({}))) as ImportBody;
    const rootUrl = body.rootUrl || DEFAULT_ROOT;
    const limit = Math.min(body.limit ?? 30, 100);
    const maxDepth = body.maxDepth ?? 3;
    const includePaths = body.includePaths;

    // Create or update import job
    const { data: job } = await admin.from('tvet_import_jobs').insert({
      started_by: userId,
      source_url: rootUrl,
      status: 'running',
    }).select('id').single();
    const jobId = job!.id;
    const log: any[] = [];
    const pushLog = (entry: any) => { log.push({ at: new Date().toISOString(), ...entry }); };

    // Use Firecrawl /v2/crawl (start + poll) — but for first pass use /map to get URLs cheaply, then scrape PDFs/pages individually.
    pushLog({ step: 'map', url: rootUrl });
    const mapRes = await fetch(`${FIRECRAWL_V2}/map`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rootUrl, limit: 500, includeSubdomains: false }),
    });
   
    const mapData = await mapRes.json().catch(() => null);
if (!mapRes.ok) {
  throw new Error(`Firecrawl map failed: ${mapData?.error || mapData?.message || mapRes.status}`);
}


    const allLinks: string[] = (mapData.links || mapData.data?.links || []).map((l: any) =>
      typeof l === 'string' ? l : l.url
    ).filter(Boolean);
    pushLog({ step: 'mapped', count: allLinks.length });

    // Prioritize PDFs and resource/course/file pages
    const isInteresting = (u: string) =>
      /\.pdf($|\?)/i.test(u) ||
      /(resource|file|mod\/resource|course|view\.php|pluginfile)/i.test(u);

    const targets = allLinks.filter(isInteresting).slice(0, limit);
    pushLog({ step: 'targets', count: targets.length });

    // Fetch existing modules once for fuzzy match
    const { data: modules } = await admin.from('tvet_modules').select('id, title');
    const moduleList = modules ?? [];

    // Get or create "Imported from RTB" fallback module under a generic level
    async function getFallbackModuleId(): Promise<string> {
      let { data: cat } = await admin.from('tvet_categories')
        .select('id').eq('slug', 'imports').maybeSingle();
      if (!cat) {
        const { data: created } = await admin.from('tvet_categories')
          .insert({ name: 'Imports', slug: 'imports', icon: '📥', sort_order: 99 })
          .select('id').single();
        cat = created!;
      }
      let { data: course } = await admin.from('tvet_courses')
        .select('id').eq('slug', 'rtb-imports').maybeSingle();
      if (!course) {
        const { data: created } = await admin.from('tvet_courses')
          .insert({ category_id: cat!.id, slug: 'rtb-imports', title: 'RTB Imports', sort_order: 0 })
          .select('id').single();
        course = created!;
      }
      let { data: level } = await admin.from('tvet_levels')
        .select('id').eq('course_id', course!.id).eq('level', 'L3').maybeSingle();
      if (!level) {
        const { data: created } = await admin.from('tvet_levels')
          .insert({ course_id: course!.id, level: 'L3' }).select('id').single();
        level = created!;
      }
      let { data: mod } = await admin.from('tvet_modules')
        .select('id').eq('level_id', level!.id).eq('title', 'Imported from RTB').maybeSingle();
      if (!mod) {
        const { data: created } = await admin.from('tvet_modules')
          .insert({ level_id: level!.id, title: 'Imported from RTB', sort_order: 0 }).select('id').single();
        mod = created!;
      }
      return mod!.id;
    }

    const fallbackModuleId = await getFallbackModuleId();

    let pagesProcessed = 0;
    let resourcesAdded = 0;

    for (const url of targets) {
      pagesProcessed++;
      try {
        const isPdf = /\.pdf($|\?)/i.test(url);
        let title = url.split('/').pop() || url;
        let extracted: string | null = null;

        if (!isPdf) {
          const scrapeRes = await fetch(`${FIRECRAWL_V2}/scrape`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
          });
          const sd = await scrapeRes.json();
          if (scrapeRes.ok) {
            title = sd.metadata?.title || sd.data?.metadata?.title || title;
            extracted = (sd.markdown || sd.data?.markdown || '').slice(0, 10000) || null;
          }
        }

        // Fuzzy match to a module
        let bestId = fallbackModuleId;
        let bestScore = 0.35; // threshold
        for (const m of moduleList) {
          const s = score(title, m.title);
          if (s > bestScore) { bestScore = s; bestId = m.id; }
        }

        // Dedupe by URL
        const { data: existing } = await admin.from('tvet_resources')
          .select('id').eq('url', url).maybeSingle();
        if (existing) {
          pushLog({ step: 'skip-dup', url });
          continue;
        }

        await admin.from('tvet_resources').insert({
          module_id: bestId,
          title: title.slice(0, 200),
          type: isPdf ? 'pdf' : 'link',
          url,
          extracted_text: extracted,
        });
        resourcesAdded++;
        pushLog({ step: 'added', url, module_id: bestId, match: bestScore });
      } catch (err) {
        pushLog({ step: 'error', url, error: String(err) });
      }

      // Periodic progress flush
      if (pagesProcessed % 5 === 0) {
        await admin.from('tvet_import_jobs').update({
          pages_processed: pagesProcessed,
          resources_added: resourcesAdded,
          log,
          updated_at: new Date().toISOString(),
        }).eq('id', jobId);
      }
    }

    await admin.from('tvet_import_jobs').update({
      status: 'completed',
      pages_processed: pagesProcessed,
      resources_added: resourcesAdded,
      log,
      updated_at: new Date().toISOString(),
    }).eq('id', jobId);

    return new Response(JSON.stringify({
      success: true, jobId, pagesProcessed, resourcesAdded, mapped: allLinks.length, targets: targets.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('import-rtb error', err);
    return new Response(JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
