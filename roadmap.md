# AdSense Readiness Overhaul (smartmindz.site)

- [ ] 1. Per-page SEO: react-helmet-async, unique title/desc/canonical/OG per route, JSON-LD (Org+WebSite home, Article+Breadcrumb blog), remove meta keywords, remove unverifiable claims
- [ ] 2. Prerender public routes at build time (/, /about, /faq, /how-to, /blog, /blog/:slug, /privacy, /terms, /contact, library overview)
- [ ] 3. Routing: direct-load 200s, real 404 (no ads), sitemap only public working pages w/ lastmod, robots.txt allow Googlebot+Mediapartners, library viewer retry/timeout, fix broken links/downloads
- [ ] 4. Trust pages: complete About/Contact/Privacy/Terms + new Copyright Policy w/ takedown contact, all in footer
- [ ] 5. Content: expand 10 posts to 900-1500 words, author bio/dates/reading time/related posts/unique images+alt, "what to do next" links, Last reviewed date
- [ ] 5c. Draft/published workflow: status field, admin Drafts list w/ marker counts, marker highlighting, Publish disabled while [ADD/VERIFY] markers remain, auto Last reviewed
- [ ] 5d. Public study guides per TVET subject (no login), library overview pages public, noindex thin pages (<3 items or <300 words)
- [ ] 6. Copyright: source/permission field in Library Admin, "Report this content", no third-party PDFs on ad pages; academic-integrity wording on Writer/Detector
- [ ] 7. AdSlot component (SPA-safe, one push, min-height, "Advertisement" label), ads only on content pages, none on tools/admin/404/modals, consent banner (EEA/UK/CH)
- [ ] 8. Policy: no ad-click language, popups dismissible & not on ad pages, push prompt only after user action, email/push opt-in + unsubscribe toggle in Settings
- [ ] 9. Quality: fix console/TS errors, lazy images w/ dimensions, no horizontal scroll
- [ ] 10. Verify: fetch pages w/o JS, sitemap 200s, robots/ads.txt, report manual items
