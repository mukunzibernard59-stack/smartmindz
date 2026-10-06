// Build-time prerender for GitHub Pages.
// For every public route, emits dist/<route>/index.html with:
//  - route-specific <title>, meta description, canonical, og/twitter tags
//  - real static text inside #root (replaced by React on hydration) so
//    crawlers see genuine content without executing JavaScript.
// Run with: bunx tsx scripts/prerender-routes.mts

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const BASE = "https://smartmindz.site";
const root = process.cwd();
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html not found — run vite build first.");
}

const shell = readFileSync(indexPath, "utf8");

interface RouteMeta {
  path: string; // "" for home
  title: string;
  description: string;
  body: string; // static HTML placed inside #root
  noindex?: boolean;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---- Load blog posts (source of truth) ----
const { posts: blogPosts } = await import("../src/data/blogPosts.ts");

const mdToHtml = (md: string): string =>
  md
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (!t) return "";
      if (t.startsWith("## ")) return `<h2>${esc(t.slice(3))}</h2>`;
      if (t.startsWith("### ")) return `<h3>${esc(t.slice(4))}</h3>`;
      if (t.startsWith("- "))
        return `<ul>${t.split("\n").map((l) => `<li>${esc(l.replace(/^- /, ""))}</li>`).join("")}</ul>`;
      if (/^\d+\. /.test(t))
        return `<ol>${t.split("\n").map((l) => `<li>${esc(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
      return `<p>${esc(t)}</p>`;
    })
    .join("\n");

const routes: RouteMeta[] = [
  {
    path: "",
    title: "SmartMind — Free Learning App for Rwandan Students",
    description:
      "SmartMind is a free learning app for Rwandan TVET students: study tools, a TVET library, translator, writer and more. No signup needed.",
    body: `<h1>SmartMind — Free Learning App for Rwandan Students</h1>
<p>SmartMind is a free smart learning app built for Rwandan students. It brings together study tools, a TVET library of notes and guides, a translator, a writing helper, and practice quizzes — all free, with no signup required to start learning.</p>
<h2>What you can do with SmartMind</h2>
<ul>
<li>Browse the TVET Library for course notes and study guides</li>
<li>Practice with quizzes and the learning assistant</li>
<li>Translate between English, French, Kinyarwanda and Swahili</li>
<li>Read study guides and blog articles written for TVET students</li>
</ul>`,
  },
  {
    path: "about",
    title: "About SmartMind — Free Learning App for Rwanda",
    description:
      "SmartMind is a free learning app built by Bernard Mukunzi for Rwandan TVET students. Learn who runs it, who it serves, and how to reach us.",
    body: `<h1>About SmartMind</h1>
<p>SmartMind is a free learning app for Rwandan students, especially those in TVET (Technical and Vocational Education and Training) schools. It was founded by Bernard Mukunzi to make quality study materials and learning tools available to every student with a phone.</p>
<p>The app includes a TVET library, study guides, a translator, writing tools, and practice quizzes. SmartMind is supported by advertising so it can stay free for students.</p>
<p>Contact: mukunzibernard59@gmail.com</p>`,
  },
  {
    path: "faq",
    title: "FAQ — SmartMind Help and Answers",
    description:
      "Answers to common questions about SmartMind: accounts, the TVET library, study tools, languages, and how the free app works.",
    body: `<h1>Frequently Asked Questions</h1>
<p>Find answers about SmartMind accounts, the TVET library, study tools, supported languages (English, French, Kinyarwanda, Swahili), and how the free app is funded.</p>`,
  },
  {
    path: "how-to",
    title: "How-To Guides — Get the Most from SmartMind",
    description:
      "Step-by-step guides for SmartMind: using the TVET library, translating text, writing letters, generating quizzes, and studying effectively.",
    body: `<h1>How-To Guides</h1>
<p>Step-by-step guides for using SmartMind: browsing the TVET library, translating between languages, writing letters and documents, generating practice quizzes, and building effective study habits.</p>`,
  },
  {
    path: "contact",
    title: "Contact SmartMind",
    description:
      "Contact the SmartMind team. Email mukunzibernard59@gmail.com for support, feedback, content requests, or privacy questions.",
    body: `<h1>Contact SmartMind</h1>
<p>Email us at mukunzibernard59@gmail.com for support, feedback, content requests, copyright matters, or privacy questions. We aim to reply within a few days.</p>`,
  },
  {
    path: "blog",
    title: "Blog — Study Tips for Rwandan TVET Students",
    description:
      "Original study tips, career guides, and learning strategies for Rwandan TVET students, written by the SmartMind team.",
    body: `<h1>SmartMind Blog</h1>
<p>Original study tips, career guides, and learning strategies written for Rwandan TVET students.</p>
<ul>${blogPosts
      .filter((p: any) => p.status !== "draft")
      .map((p: any) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> — ${esc(p.description)}</li>`)
      .join("")}</ul>`,
  },
  {
    path: "privacy",
    title: "Privacy Policy — SmartMind",
    description:
      "How SmartMind collects and uses data, including cookies, Google AdSense and DoubleClick, analytics, and your opt-out choices.",
    body: `<h1>Privacy Policy</h1>
<p>This policy explains what data SmartMind collects, how cookies and advertising (including Google AdSense and DoubleClick) work on this site, and how you can opt out.</p>`,
  },
  {
    path: "terms",
    title: "Terms of Service — SmartMind",
    description:
      "The terms that govern use of SmartMind: acceptable use, accounts, content, and limitations.",
    body: `<h1>Terms of Service</h1>
<p>These terms govern your use of SmartMind, including acceptable use, accounts, content ownership, and limitations of liability.</p>`,
  },
  {
    path: "copyright",
    title: "Copyright & Content Policy — SmartMind",
    description:
      "SmartMind's copyright and content policy: ownership of original content, curriculum sources, and how to request a takedown.",
    body: `<h1>Copyright & Content Policy</h1>
<p>How SmartMind handles content ownership, public curriculum sources, third-party copyright, and takedown requests.</p>`,
  },
  {
    path: "library",
    title: "TVET Library — Free Course Notes | SmartMind",
    description:
      "Browse free TVET course notes, modules, and study materials from Rwanda's RTB curriculum, organised by course, level, and module.",
    body: `<h1>TVET Library</h1>
<p>Browse free TVET course notes and study materials organised by course, level, and module, based on Rwanda's RTB curriculum. Open any module to read notes, view PDFs, and download materials to your device.</p>`,
  },
  {
    path: "learn",
    title: "Learn — Study Tools and Practice | SmartMind",
    description:
      "SmartMind's learning workspace: practice quizzes, a study assistant, and tools to help Rwandan students learn faster.",
    body: `<h1>Learn with SmartMind</h1>
<p>Your learning workspace: practice quizzes, a study assistant, and tools that help you understand your subjects and prepare for exams.</p>`,
  },
  {
    path: "translate",
    title: "Translator — English, French, Kinyarwanda, Swahili",
    description:
      "Free translator with voice input and read-aloud for English, French, Kinyarwanda, and Swahili. Type or speak to translate.",
    body: `<h1>Translator</h1>
<p>Translate text or speech between English, French, Kinyarwanda, and Swahili. Speak into your microphone, get the translation as text, and have it read aloud in the target language.</p>`,
  },
  {
    path: "youtube-tutor",
    title: "Learning Hub — Educational Videos | SmartMind",
    description:
      "Search and watch educational videos inside SmartMind. Find lessons on any topic and learn at your own pace.",
    body: `<h1>Learning Hub</h1>
<p>Search any topic and watch educational videos without leaving SmartMind. Find lessons, tutorials, and explanations to support your studies.</p>`,
  },
  {
    path: "ai-writer",
    title: "Writer — Letters and Documents | SmartMind",
    description:
      "Draft letters, CVs, and documents with SmartMind's writing tool. Export your work as PDF, DOCX, or TXT.",
    body: `<h1>Writer</h1>
<p>Draft letters, CVs, and documents, then export them as PDF, DOCX, or TXT. Includes templates like the friendly letter format taught in school.</p>`,
  },
  {
    path: "ai-homework-helper",
    title: "Homework Helper — SmartMind",
    description:
      "Get step-by-step help understanding homework questions. Learn the method, not just the answer.",
    body: `<h1>Homework Helper</h1>
<p>Get step-by-step help understanding your homework. SmartMind explains the method so you learn how to solve similar problems yourself.</p>`,
  },
];

// Blog post routes (published only) with real article text.
for (const post of blogPosts as any[]) {
  if (post.status === "draft") continue;
  routes.push({
    path: `blog/${post.slug}`,
    title: post.title.length > 60 ? post.title.slice(0, 57) + "…" : post.title,
    description: post.description.slice(0, 158),
    body: `<article>
<h1>${esc(post.title)}</h1>
<p><em>By ${esc(post.author || "Bernard Mukunzi")} — SmartMind</em></p>
${mdToHtml(post.content)}
</article>`,
  });
}

// Study guides (if the data file exists).
try {
  const guides = await import("../src/data/studyGuides.ts");
  const list = (guides.studyGuides || guides.default || []) as any[];
  if (list.length) {
    routes.push({
      path: "guides",
      title: "Study Guides — TVET Subjects | SmartMind",
      description:
        "Free study guides for TVET subjects: key topics, module summaries, and practice questions with explained answers.",
      body: `<h1>Study Guides</h1>
<p>Free study guides for TVET subjects: key topics, module summaries, and practice questions with explained answers.</p>
<ul>${list.map((g) => `<li><a href="/guides/${g.slug}">${esc(g.title || g.subject)}</a></li>`).join("")}</ul>`,
    });
    for (const g of list) {
      const sections = (g.keyTopics || [])
        .map((t: any) => `<h2>${esc(t.title || t.name || "")}</h2><p>${esc(t.explanation || t.summary || "")}</p>`)
        .join("\n");
      routes.push({
        path: `guides/${g.slug}`,
        title: `${g.title || g.subject} — Study Guide | SmartMind`.slice(0, 60),
        description: (g.intro || "").replace(/\s+/g, " ").slice(0, 158),
        body: `<article>
<h1>${esc(g.title || g.subject)}</h1>
<p>${esc(g.intro || "")}</p>
${sections}
</article>`,
      });
    }
  }
} catch {
  // studyGuides.ts not present yet — skip guide routes.
}

// ---- Stamp each route's HTML ----
const headFor = (r: RouteMeta) => {
  const url = `${BASE}/${r.path}`;
  const robots = r.noindex ? `<meta name="robots" content="noindex" />` : "";
  return `<title>${esc(r.title)}</title>
    <meta name="description" content="${esc(r.description)}" />
    <link rel="canonical" href="${url}" />
    ${robots}
    <meta property="og:title" content="${esc(r.title)}" />
    <meta property="og:description" content="${esc(r.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${esc(r.title)}" />
    <meta name="twitter:description" content="${esc(r.description)}" />`;
};

const stamp = (r: RouteMeta): string => {
  // Replace the shell's head title/description block with route-specific tags.
  let html = shell.replace(/<title>[\s\S]*?<\/title>/, "");
  html = html.replace(/<meta name="description"[^>]*>/, "");
  html = html.replace(/<link rel="canonical"[^>]*>/, "");
  html = html.replace(/<meta property="og:[^"]*"[^>]*>/g, "");
  html = html.replace(/<meta name="twitter:[^"]*"[^>]*>/g, "");
  html = html.replace(/<\/title>/, `</title>`); // no-op safeguard
  html = html.replace(/(<meta name="viewport"[^>]*>)/, `$1\n    ${headFor(r)}`);
  // Inject static content that React replaces on hydration.
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><main style="max-width:720px;margin:0 auto;padding:2rem 1rem;font-family:system-ui,sans-serif;line-height:1.6">${r.body}</main></div>`
  );
  return html;
};

let count = 0;
for (const r of routes) {
  const target = r.path === "" ? resolve(distDir, "index.html") : resolve(distDir, r.path, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, stamp(r));
  count++;
}

// SPA fallback for unknown routes + custom domain.
copyFileSync(indexPath, resolve(distDir, "404.html"));
writeFileSync(resolve(distDir, "CNAME"), "smartmindz.site");

console.log(`Prerendered ${count} routes with real content; wrote 404.html and CNAME.`);
