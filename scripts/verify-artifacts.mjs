import fs from "node:fs";
import path from "node:path";
import { getAllIndexablePosts } from "../lib/content.ts";

const publicDir = path.join(process.cwd(), "public");
const requiredFiles = [
  "sitemap.xml",
  "robots.txt",
  "feed.xml",
  "llms.txt",
  "llms-full.txt",
  path.join("api", "posts.json"),
  "search-index.json"
];

const errors = [];

for (const rel of requiredFiles) {
  const full = path.join(publicDir, rel);
  if (!fs.existsSync(full)) {
    errors.push(`Missing required generated artifact: public/${rel}`);
  } else {
    const stats = fs.statSync(full);
    if (stats.size === 0) {
      errors.push(`Generated artifact is empty (0 bytes): public/${rel}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Artifact Verification Failed:");
  for (const err of errors) console.error(" - " + err);
  process.exit(1);
}

const indexable = getAllIndexablePosts();
const apiPosts = JSON.parse(fs.readFileSync(path.join(publicDir, "api", "posts.json"), "utf8"));
if (apiPosts.count !== indexable.length) {
  errors.push(`api/posts.json count (${apiPosts.count}) does not match indexable posts (${indexable.length})`);
}

const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
if (sitemap.includes("<loc>https://observatory.campusloop.space/search</loc>")) {
  errors.push("sitemap.xml illegally contains /search URL!");
}

if (errors.length > 0) {
  console.error("Artifact Semantic Verification Failed:");
  for (const err of errors) console.error(" - " + err);
  process.exit(1);
}

console.log(`✔ All ${requiredFiles.length} generated artifacts verified against canonical corpus.`);
