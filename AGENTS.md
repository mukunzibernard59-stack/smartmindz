# Project rules
- Public article listings, detail pages, and sitemap generation share the publication predicate in `src/lib/publicContent.ts` so unfinished articles cannot leak through a different entry point.
- Public library availability is derived from accessible resources without fetching their content; keep empty curriculum records available in the admin panel for future uploads.
- Static route output must not contain a branded loading splash or off-screen crawler-only text; no-JavaScript fallback content belongs in `noscript`.