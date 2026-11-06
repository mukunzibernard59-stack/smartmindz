# Priority One AdSense Recovery — Implementation Plan

Nothing below is implemented yet. AdSense code, ads.txt, Google verification tags, sign-in, routes, learning tools and existing TVET files stay untouched.

## 1. Homepage educational value

**Problem:** the homepage shows about 18 words of real content (heading + one sentence).

**Change:** keep the current hero (photo background, gradient heading) and add three content sections below it:
- **What SmartMindz is for** — a short, honest explanation: a free study companion for Rwandan TVET and secondary learners, with notes, study guides and practice tools. No claim of official RTB partnership.
- **What you can study today** — list only what really exists now: Software Development notes in the library (PHP, databases, version control, Vue), the six study guides, and the blog. Future subjects are labelled "coming later", not presented as available.
- **How to study with SmartMindz** — a 4-step practical method (read the note → check the study guide → test yourself with the tutor → revise weak points), plus short descriptions of Translate, YouTube Tutor and the Writer and what each is good for.
- Links to Library, Guides, Blog and About.

Text will be written for students (roughly 400–600 useful words) — no filler, no keyword lists.

## 2. Vue learning note

**Problem:** the "Game in vue.js notes" resource contains only the title "Game In vue.js".

**Change (no existing record is changed):** add a **new** shared note in the same module, "Building a Simple Game with Vue.js — Beginner Lesson", written originally, containing:
- Learning objectives
- What Vue is and why it suits small games (reactivity, components)
- Setting up a project (`npm create vue@latest`)
- Worked example: a "Guess the Number" game — data, methods, `v-model`, `v-if`, `@click`, with expected result
- Second example: a click-counter with a timer (`setInterval`, cleanup in `onUnmounted`)
- Common mistakes (mutating outside reactive state, forgetting to clear timers)
- Exercises (3 graded tasks) with hints
- Summary
- Attribution line: "Original lesson by SmartMindz. Further reading: official Vue documentation (vuejs.org)."

The old 14-character note stays in the database. To stop it appearing as an empty lesson, the library will skip notes under a minimum length in **public display only** (a code rule, not a data change). Admins still see it.

## 3. Misplaced business-plan PDF

**Where it shows:** Software Development → PHP Programming, as "CCMDB401_Business plan development (1)". This module was renamed from "Business plan development" to "PHP Programming" earlier, so the PDF was originally uploaded for that business module.

**Recommended location:** a "Business Plan Development" (CCMDB401 — entrepreneurship) module. Two options:
- **A (recommended, needs one data change):** move this one file to the correct entrepreneurship module (or a recreated "Business Plan Development" module if none exists). The file itself is not altered or deleted; only which module it belongs to changes. Reversible in one step.
- **B (zero data change):** leave it in PHP Programming and hide it from that module's public view by code rule matching its CCMDB code.

You choose A or B before I act — A modifies one existing record, which your rules otherwise forbid.

## 4. Source attribution

**Problem:** none of the 19 shared resources records an author, publisher, source link or licence.

**Change:**
- Add four **new, optional** fields to resources: author/institution, source URL, licence/rights note, and a "last reviewed" date. Existing rows are untouched (all blank).
- The viewer shows an "About this resource" box when fields are filled; when blank it shows: "Source not yet recorded."
- The admin upload/edit panel gets inputs for these fields.
- I will provide you a table of all 19 resources with what the filename suggests (e.g. "TeM_" files look like RTB trainee manuals) — marked as **suggestions to verify**. I will not fill in any source or permission myself; you confirm and enter them.

## Deliverables summary

**Files to modify**
- Homepage content (Index page + a new homepage content section)
- Library page and document viewer (short-note filter, attribution box)
- Admin library panel (attribution inputs)
- Static page generator (so the new homepage text is in the published HTML)

**Database changes**
- New optional attribution columns on resources (additive only)
- One new Vue lesson resource (insert)
- PDF: one module reassignment only if you pick option A

## Risk assessment
- Low: homepage text and attribution box are additive.
- Low: short-note filter could hide another very short real note — mitigated by a small threshold (under ~100 characters) and admin visibility.
- Medium (option A only): reassigning the PDF changes where students find it — fully reversible.
- No risk to AdSense, ads.txt, verification, sign-in or routes: those files are not opened.

## Testing plan
- Browser: homepage on desktop and phone width — content readable, no overflow, hero unchanged.
- Library: Vue module shows the new lesson, not the empty note; PHP module shows the expected files; attribution box displays.
- Admin: attribution fields save and reload.
- Confirm published static homepage HTML contains the new text.
- Existing library availability tests still pass; build passes.

## Rollback plan
- Code: revert to the previous version from history.
- Vue lesson: delete only the new inserted row.
- Attribution columns: drop the new columns (no original data affected).
- PDF (option A): set its module back to PHP Programming.
