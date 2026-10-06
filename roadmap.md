# AdSense-readiness overhaul (smartmindz.site)

- [x] 1. Per-page SEO — SEO.tsx per route; prerender now stamps real title/description/canonical/og per route into static HTML; keywords tag removed; unverifiable claims removed
- [x] 2. Crawlable content — scripts/prerender-routes.mts emits per-route static HTML with real text inside #root (25+ routes incl. all published blog posts)
- [x] 3. Routing/bugs — per-route index.html (no 404s), real noindex 404 page, sitemap generated from source at build time, robots.txt OK, library viewer has error+retry, internal links verified, downloads work
- [x] 4. Trust pages — About, Contact, Privacy, Terms, Copyright (/copyright) all complete and footer-linked
- [ ] 5. Content quality — blog overhaul in progress (subagent sub_bnjbqxrw): 10 posts expanded to 900–1500 words, 10 new posts, author bio, dates, related posts, Article+Breadcrumb JSON-LD, draft status for [ADD/VERIFY] markers
- [ ] 6. Study guides — in progress (subagent sub_92azc3hh): /guides + /guides/:slug, 6+ guides, sitemap + prerender integration
- [x] 7. Copyright/safety — CopyrightPolicy page, academic-integrity wording in Writer/Detector
- [x] 8. AdSlot + consent — ContentAd rewritten: consent-gated (no AdSense load before accept), "Advertisement" label, min-height, admin excluded, content routes only; ConsentBanner with Accept/Reject/Manage
- [x] 9. Policy rules — AnnouncementPopup + PushPermissionPrompt suppressed on ad pages; no ads on tools/admin/404
- [ ] 10. Verify — final build + report after subagents land

After subagents: run build, confirm guides/blog routes prerendered, update sitemap automatically (script reads source), tell user to publish + resubmit sitemap + request AdSense review.
