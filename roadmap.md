# AdSense-readiness overhaul (smartmindz.site)

## Current cleanup
- [x] Remove the branded startup splash and off-screen crawler-only text.
- [x] Hide empty library branches without deleting the admin's curriculum.
- [x] Enforce draft filtering for unverified articles across pages and sitemap generation.
- [x] Check startup and public library navigation — browser opened Software Development and PHP Programming; three availability tests pass; harness build OK.

- [x] 1. Per-page SEO — SEO.tsx per route; prerender now stamps real title/description/canonical/og per route into static HTML; keywords tag removed; unverifiable claims removed
- [x] 2. Crawlable content — scripts/prerender-routes.mts emits per-route static HTML with real text inside #root (25+ routes incl. all published blog posts)
- [x] 3. Routing/bugs — per-route index.html (no 404s), real noindex 404 page, sitemap generated from source at build time, robots.txt OK, library viewer has error+retry, internal links verified, downloads work
- [x] 4. Trust pages — About, Contact, Privacy, Terms, Copyright (/copyright) all complete and footer-linked
- [x] 5. Content quality — published articles and study guides retained; unverified articles remain drafts, with shared publication filtering.
- [x] 6. Study guides — /guides + 6 subject guides live, routed, footer-linked, prerendered with full text (32 routes total)
- [x] 7. Copyright/safety — CopyrightPolicy page, academic-integrity wording in Writer/Detector
- [x] 8. AdSlot + consent — ContentAd rewritten: consent-gated (no AdSense load before accept), "Advertisement" label, min-height, admin excluded, content routes only; ConsentBanner with Accept/Reject/Manage
- [x] 9. Policy rules — AnnouncementPopup + PushPermissionPrompt suppressed on ad pages; no ads on tools/admin/404
- [x] 10. Verify — harness build OK, public library flow checked and availability tests passed.

Deployment builds generate the sitemap automatically. AdSense approval and human editorial review cannot be confirmed from source checks.
