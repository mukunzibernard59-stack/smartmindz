import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");
const cnamePath = resolve(distDir, "CNAME");

if (!existsSync(indexPath)) {
  throw new Error("Cannot create SPA fallback because dist/index.html was not found.");
}

mkdirSync(dirname(fallbackPath), { recursive: true });
copyFileSync(indexPath, fallbackPath);
writeFileSync(cnamePath, "smartmindz.site");

// GitHub Pages has no rewrites: 404.html is served with a 404 status, which makes
// Google report "Not found (404)" for deep links. Emit a real index.html for each
// known route so crawlers get HTTP 200.
const blogSlugs = [
  "how-to-study-for-tvet-exams-rwanda",
  "learn-kinyarwanda-english-with-smartmind",
  "best-free-ai-study-tools-2026",
  "writing-a-strong-cv-first-job",
  "staying-focused-while-studying-with-a-phone",
  "ai-tutor-vs-human-teacher",
  "time-management-for-students-rwanda",
  "digital-skills-every-tvet-student-needs",
  "preparing-for-a-job-interview-in-rwanda",
  "reading-more-books-as-a-busy-student",
];

const routes = [
  "about",
  "faq",
  "how-to",
  "contact",
  "blog",
  ...blogSlugs.map((s) => `blog/${s}`),
  "privacy",
  "terms",
  "library",
  "learn",
  "dev",
  "translate",
  "youtube-tutor",
  "ai-writer",
  "ai-detector",
  "generate-image",
  "ai-homework-helper",
  "build-app-prompt",
];

for (const route of routes) {
  const target = resolve(distDir, route, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(indexPath, target);
}

console.log(
  `Created dist/404.html, dist/CNAME and ${routes.length} static route entry points for GitHub Pages.`
);