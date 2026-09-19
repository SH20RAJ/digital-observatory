import fs from "node:fs";
import path from "node:path";
import {
  parseAllPosts,
  getAllPublishedPosts,
  getAllIndexablePosts,
  getPostBySlug,
  getCategories,
  getTags,
  getAuthors,
  resolvePostImage
} from "../lib/content.ts";
import { PRIMARY_CANONICAL_DOMAIN } from "../lib/site.ts";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✔ ${message}`);
  } else {
    failed++;
    console.error(`  ✖ FAIL: ${message}`);
  }
}

console.log("\n=== 1. Content & Frontmatter Invariant Tests ===");
const allPosts = parseAllPosts();
const published = getAllPublishedPosts();
const indexable = getAllIndexablePosts();

assert(allPosts.length > 0, `Loaded ${allPosts.length} total articles`);
assert(published.length > 0, `Identified ${published.length} published articles`);
assert(indexable.length <= published.length, `Indexable articles (${indexable.length}) <= published articles (${published.length})`);

// Test slug uniqueness
const slugSet = new Set();
let duplicateSlugs = 0;
for (const post of allPosts) {
  if (slugSet.has(post.slug)) duplicateSlugs++;
  slugSet.add(post.slug);
}
assert(duplicateSlugs === 0, `All slugs are strictly unique (duplicates: ${duplicateSlugs})`);

// Test draft filtering: drafts must not appear in indexable
const draftSlugs = new Set(allPosts.filter((p) => p.status === "draft").map((p) => p.slug));
const indexableDrafts = indexable.filter((p) => draftSlugs.has(p.slug));
assert(indexableDrafts.length === 0, `Draft articles are strictly excluded from indexable queries (count: ${indexableDrafts.length})`);

// Test noIndex filtering: noIndex: true must not appear in indexable
const noIndexSlugs = new Set(allPosts.filter((p) => p.noIndex).map((p) => p.slug));
const indexableNoIndex = indexable.filter((p) => noIndexSlugs.has(p.slug));
assert(indexableNoIndex.length === 0, `noIndex articles are strictly excluded from indexable queries (count: ${indexableNoIndex.length})`);

// Test source validity
let invalidSources = 0;
for (const post of published) {
  if (!post.sources || post.sources.length === 0) invalidSources++;
  for (const s of post.sources) {
    if (!s.url || !s.label || !/^https?:\/\//i.test(s.url)) invalidSources++;
  }
}
assert(invalidSources === 0, `All published articles have valid, labelled HTTP/HTTPS sources`);

console.log("\n=== 2. SEO & Image System Tests ===");
// Test image resolution parity
let imageParityFailures = 0;
for (const post of published) {
  const resolved = resolvePostImage(post);
  if (!resolved || (!resolved.startsWith("/") && !resolved.startsWith("http"))) {
    imageParityFailures++;
  }
}
assert(imageParityFailures === 0, `All published articles have a deterministically resolved image`);

// Test robots.txt invariants
const robotsPath = path.join(process.cwd(), "public", "robots.txt");
assert(fs.existsSync(robotsPath), `public/robots.txt exists`);
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, "utf8");
  assert(robots.includes("Disallow: /search"), `robots.txt disallows /search`);
  assert(robots.includes(`Sitemap: ${PRIMARY_CANONICAL_DOMAIN}/sitemap.xml`), `robots.txt points to canonical sitemap`);
}

// Test sitemap invariants
const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
assert(fs.existsSync(sitemapPath), `public/sitemap.xml exists`);
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  assert(!sitemap.includes("<loc>https://observatory.campusloop.space/search</loc>"), `sitemap.xml strictly excludes /search`);

  // Ensure no draft or noIndex slugs are in sitemap
  let leakedSlugs = 0;
  for (const slug of [...draftSlugs, ...noIndexSlugs]) {
    if (sitemap.includes(`/blog/${slug}</loc>`)) {
      leakedSlugs++;
    }
  }
  assert(leakedSlugs === 0, `sitemap.xml contains zero draft or noIndex URLs (leaked: ${leakedSlugs})`);
}

console.log("\n=== 3. Search & Machine Indexes Tests ===");
const apiPostsPath = path.join(process.cwd(), "public", "api", "posts.json");
assert(fs.existsSync(apiPostsPath), `public/api/posts.json exists`);
if (fs.existsSync(apiPostsPath)) {
  const apiData = JSON.parse(fs.readFileSync(apiPostsPath, "utf8"));
  assert(apiData.count === indexable.length, `api/posts.json count (${apiData.count}) equals indexable articles (${indexable.length})`);
  const hasBodies = apiData.posts.some((p) => p.content !== undefined);
  assert(!hasBodies, `api/posts.json does NOT contain heavy markdown content bodies`);
}

const llmsPath = path.join(process.cwd(), "public", "llms.txt");
assert(fs.existsSync(llmsPath), `public/llms.txt exists`);
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, "utf8");
  assert(llms.includes(PRIMARY_CANONICAL_DOMAIN), `llms.txt references canonical primary domain`);
}

const feedPath = path.join(process.cwd(), "public", "feed.xml");
assert(fs.existsSync(feedPath), `public/feed.xml exists`);
if (fs.existsSync(feedPath)) {
  const feed = fs.readFileSync(feedPath, "utf8");
  assert(feed.includes("<rss version=\"2.0\">"), `feed.xml is valid RSS 2.0`);
  assert(feed.includes(PRIMARY_CANONICAL_DOMAIN), `feed.xml links to primary canonical domain`);
}

console.log("\n=== 4. Routing & Archive Consistency Tests ===");
const categories = getCategories();
const tags = getTags();
const authors = getAuthors();

assert(categories.length > 0, `Discovered ${categories.length} active research categories`);
assert(tags.length > 0, `Discovered ${tags.length} active topic tags`);
assert(authors.length > 0, `Discovered ${authors.length} active article authors`);

// Every category must have at least one indexable article
let emptyCategories = 0;
for (const cat of categories) {
  const count = indexable.filter((p) => p.category === cat).length;
  if (count === 0) emptyCategories++;
}
assert(emptyCategories === 0, `All declared categories contain at least one indexable article`);

// Every author must have at least one indexable article
let emptyAuthors = 0;
for (const auth of authors) {
  const count = indexable.filter((p) => p.author === auth).length;
  if (count === 0) emptyAuthors++;
}
assert(emptyAuthors === 0, `All declared authors contain at least one indexable article`);

console.log(`\n================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
console.log(`✔ All test suites passed cleanly.\n`);
