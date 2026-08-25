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

console.log("Created dist/404.html and dist/CNAME for GitHub Pages.");