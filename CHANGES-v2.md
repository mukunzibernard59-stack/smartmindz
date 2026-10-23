# SmartMind v2 — AdSense readiness changes

Crawler / technical
- prerender-routes.mts: added /dev, /ai-detector, /generate-image, /build-app-prompt (previously returned HTTP 404 on GitHub Pages). Sitemap regenerates from this list at build.
- index.html: added <meta name="google-adsense-account"> (does not load ads).
- public/google36c5ca2ef2595b2e.html: now contains the correct Search Console verification string.
- .gitignore: now excludes .env, .env.*, *.pem, *.key.

Content
- Homepage (SEOContent.tsx) rewritten: plain, accurate, TVET-focused, no keyword stuffing, no "3x faster" claim.
- Hero text cleaned up.
- Blog: removed two unsupported claims ("top band", "ninety percent").
- FAQ: removed "many teachers use…" claim.
- About: added "How we create and source content" section.
- Library: added RTB source/ownership note.

Navigation / layout
- Navbar: Study Guides, Learn, Translate, Blog, How-To, About (Dev Mode moved out; still reachable via tool pages).
- Footer: removed duplicate Help Center/FAQ/Contact links; "Support" column is now "Legal".
- Tool sidebar, install button and rating banner are hidden on editorial pages.
- Ads can now appear on Study Guide pages (ContentAd still only renders on pages with enough text).

Not changed (you should decide)
- Library still contains RTB-imported text; ads are never shown on /library.
- Add 3–5 more original posts/guides before applying.
- The .env and .git folders were NOT included in this zip.
