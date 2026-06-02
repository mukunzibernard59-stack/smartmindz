# Rwanda TVET Learning Library

Transform the Learn menu into a full in-app TVET LMS with categories → courses → levels (L3/L4/L5) → modules → notes/PDFs/quizzes, all rendered inside the app with embedded viewers. Dark neon UI preserved.

This is a large build. I'll ship it in 3 phases so each phase is reviewable and the app stays working. Phase 1 starts as soon as you approve.

---

## Phase 1 — Foundation + UI shell (this round)

### Database (Supabase migration)
- `tvet_categories` (slug, name, icon, sort_order)
- `tvet_courses` (category_id, slug, title, description)
- `tvet_levels` (course_id, level enum: L3/L4/L5)
- `tvet_modules` (level_id, title, sort_order, source_url)
- `tvet_resources` (module_id, type: pdf|note|link|quiz, title, url, extracted_text)
- Full-text index on `extracted_text` + trigram on titles for smart search
- RLS: public SELECT, service_role write
- GRANTs to anon/authenticated/service_role
- Seed: all 9 categories + initial course tree (ICT, Energy, Construction, Hospitality, Agriculture, Manufacturing, Transport, Crafts, Technical Services)

### Routes & components
- New `/library` route
- `LibraryHub` — animated category grid (dark neon, glowing hover, skeletons)
- `CategoryView` — courses list, collapsible
- `CourseView` — L3/L4/L5 tabs → modules
- `ModuleView` — notes, PDFs, quiz launcher
- `EmbeddedViewer` — priority chain: iframe → react-pdf → in-app modal → new tab (last resort)
- `TVETSearch` — searches courses/modules/resources/extracted_text
- Install `react-pdf` + `pdfjs-dist` for in-app PDF preview (zoom, page nav, search)

### Learn menu rewire
- Replace static "Explore Subject Notes" in `AITutorTab` with a featured-categories CTA linking to `/library`
- Keep AI chat, QuickQuiz, SubjectNotes intact

---

## Phase 2 — Content importer + Admin (next round)

- Edge function `import-rtb` scraping https://elearning.rtb.gov.rw via Firecrawl connector (needs Firecrawl link)
- `user_roles` table + `has_role()` security definer (admin role)
- `/admin/library` — manual PDF upload to Storage bucket `tvet-resources`, edit modules, manage quizzes, trigger RTB import
- Quiz integration with existing `QuickQuiz` per module

---

## Phase 3 — Polish & future-proof (later)

- Bookmark page / continue reading (per-user `tvet_progress`)
- Offline PDF download (IndexedDB cache)
- Kinyarwanda translation toggle on notes
- Student progress dashboard
- Teacher uploads
- Lazy loading, category preload, mobile polish

---

## Technical notes

- PDF.js worker served from `/pdf.worker.min.js` to avoid CDN/CSP issues
- iframe fallback detection via `onLoad` timeout + `X-Frame-Options` heuristic
- Search uses Postgres `tsvector` on `extracted_text` + `pg_trgm` on titles
- All RLS policies follow project convention (PERMISSIVE, public read for library tables)

---

## Quick confirmations before I start Phase 1

1. Proceed with Phase 1 now (DB + UI shell + `/library` + react-pdf), defer RTB scraping & admin to Phase 2?
2. Seed with placeholder modules referencing public RTB PDF links, or empty until Phase 2 importer runs?
3. Admin email for Phase 2 role grant — which account?
