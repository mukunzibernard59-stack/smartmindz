## Overview

Three independent improvements, all preserving the existing app design, routes, sidebar, and Supabase integration:

1. **Hybrid Learn Q&A system** (simple = non-AI / Wikipedia, complex = AI)
2. **AI Writer "Friendly Letter" template + Learning Hub video reliability + Kinyarwanda already in Translate (verify)**
3. **Light/Dark theme toggle in the header** (ChatGPT-style light mode)

---

## 1. Hybrid Learn System

**Files**
- New: `src/lib/questionAnalyzer.ts` — classifies SIMPLE vs COMPLEX
- New: `src/lib/wikiSearch.ts` — fetches Wikipedia summary + related links + YouTube search URL
- Edit: `src/components/learn/AIAssistantTab.tsx` (and/or `AITutorTab.tsx`) — route question through analyzer; if SIMPLE call non-AI path, else fall back to existing AI flow
- Cache: in-memory `Map` + `localStorage` for repeated simple queries

**Analyzer rules (lightweight, deterministic)**
- SIMPLE if matches `^(what is|who is|who was|define|meaning of|who discovered|when was)\b` AND length < 12 words AND no complex keywords
- COMPLEX keywords: `explain ... deeply|compare|debug|analyze|strategy|why does|how does .* work|step by step|create a|build a|write code|optimize`
- Default fallback: COMPLEX (safer)

**Non-AI source: Wikipedia REST**
- `https://en.wikipedia.org/api/rest_v1/page/summary/<title>` → extract, thumbnail, description
- Related: `https://en.wikipedia.org/w/api.php?action=opensearch&search=...`
- YouTube: link to `https://www.youtube.com/results?search_query=<topic>+tutorial`
- Show source label "Wikipedia" with link; expandable answer card

**UI**
- Reuse existing message bubble; add a small "Source: Wikipedia" badge for non-AI answers
- Loading indicator stays the same
- No "powered by" labels for AI path

---

## 2. AI Writer + Learning Hub + Translate

**AI Writer (`src/pages/AIWriter.tsx`)**
- Add `friendly` template alongside `job-application`
- Fields: senderName, senderLocation, date, recipientName, greeting, body, closing, signature
- Reuse existing PDF/DOCX/TXT export and live A4 preview pipeline
- Keep job-application unchanged

**Learning Hub videos (`src/pages/YouTubeTutor.tsx`)**
- Replace any "Video not available" placeholders with **real YouTube search-embed URLs**: `https://www.youtube.com/embed?listType=search&list=<topic>+<level>+tutorial`
- This guarantees always-playable results (YouTube returns matches)
- Organize per topic in beginner / intermediate / advanced sections
- Add `onError` fallback that swaps to a generic search embed if a specific video id fails

**Translate (`src/pages/Translate.tsx`)**
- Kinyarwanda (`rw`) already present in LANGUAGES — verify it works in MyMemory (it does: `en|rw`); no code changes required other than ensuring it's selectable (it is). No-op unless missing.

---

## 3. Theme Switcher (Light/Dark)

**Files**
- New: `src/contexts/ThemeContext.tsx` — provider, `useTheme()`, persists to `localStorage('theme')`, toggles `.light` class on `<html>` (default = dark since space theme is dark)
- New: `src/components/ThemeToggle.tsx` — sun/moon button, fits header
- Edit: `src/index.css` — add `html.light { … }` block overriding the same CSS variables with ChatGPT-like light palette:
  - `--background: 0 0% 100%`
  - `--foreground: 222 20% 12%`
  - `--card: 0 0% 100%`, soft border `220 14% 90%`
  - `--primary` kept (cyan) but `--primary-foreground` adjusted
  - `--sidebar-background: 0 0% 98%`, sidebar foreground dark
  - `--muted: 220 14% 96%`
- Edit: `src/components/Navbar.tsx` — mount `<ThemeToggle />` next to existing right-side controls
- Edit: `src/App.tsx` — wrap with `ThemeProvider`
- Smooth transition: add `transition-colors` on body via index.css

**No structural changes** — just CSS variable overrides, so all existing components automatically retheme.

---

## Out of scope
- No route changes, no sidebar changes, no auth changes, no Supabase schema changes.
- Existing AI Tutor/Assistant flows preserved; hybrid only short-circuits to Wikipedia for clearly simple lookups.
