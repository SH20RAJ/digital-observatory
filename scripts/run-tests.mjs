import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
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
import { sanitizeMarkdown, stripMarkdown, makeExcerpt, makeHeadings } from "../lib/markdown.ts";
import { slugify, categorySlug, tagSlug, authorSlug, extractCategories } from "../lib/taxonomy.ts";
import { PAGE_SIZE, getPageCount, getPageItems, getPageNumbers, getPaginationRange } from "../lib/pagination.ts";
import { articleJsonLd } from "../lib/seo.ts";

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

// Auto-generate artifacts if missing (e.g. in fresh CI/CD runner checkout)
const requiredArtifactPaths = [
  path.join(process.cwd(), "public", "robots.txt"),
  path.join(process.cwd(), "public", "sitemap.xml"),
  path.join(process.cwd(), "public", "feed.xml"),
  path.join(process.cwd(), "public", "api", "posts.json"),
  path.join(process.cwd(), "public", "llms.txt")
];

if (requiredArtifactPaths.some((p) => !fs.existsSync(p))) {
  console.log("Artifacts missing in public/; running generator before running test suite...");
  execSync("node scripts/generate-artifacts.mjs", { stdio: "inherit" });
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
  assert(feed.includes("<rss version=\"2.0\""), `feed.xml is valid RSS 2.0`);
  assert(feed.includes(PRIMARY_CANONICAL_DOMAIN), `feed.xml links to primary canonical domain`);
  assert(feed.includes("<enclosure url="), `feed.xml includes rich media image enclosures for RSS cards`);
  assert(feed.includes("<media:content url="), `feed.xml includes Yahoo Media RSS content tags`);
}

// Test sitemap Google Image extension
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  assert(sitemap.includes("xmlns:image=\"http://www.google.com/schemas/sitemap-image/1.1\""), `sitemap.xml includes Google Image Sitemap XML schema`);
  assert(sitemap.includes("<image:image>"), `sitemap.xml includes Google Image tags for article discovery`);
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

console.log("\n=== 5. Codebase Modularization & Domain Isolation Tests ===");
assert(typeof sanitizeMarkdown === "function", `lib/markdown.ts exports sanitizeMarkdown`);
assert(typeof stripMarkdown === "function", `lib/markdown.ts exports stripMarkdown`);
assert(typeof makeExcerpt === "function", `lib/markdown.ts exports makeExcerpt`);
assert(typeof makeHeadings === "function", `lib/markdown.ts exports makeHeadings`);

// Test markdown sanitization
const rawWithMarkers = "Check \uE200url\uE201Target\uE202https://example.com\uE203 out";
const sanitized = sanitizeMarkdown(rawWithMarkers);
assert(sanitized === "Check [Target](https://example.com) out", `sanitizeMarkdown converts research markers into standard markdown link`);

// Test heading extraction
const sampleMd = "# Title\n\n## First Heading\nBody\n\n### Sub Heading\nMore body";
const headings = makeHeadings(sampleMd);
assert(headings.length === 2 && headings[0].id === "first-heading" && headings[1].depth === 3, `makeHeadings cleanly extracts TOC headings`);

// Test taxonomy module
assert(slugify("Open Source & AI Infrastructure") === "open-source-and-ai-infrastructure", `slugify handles ampersand and hyphens correctly`);
assert(categorySlug("Artificial Intelligence") === "artificial-intelligence", `categorySlug maps correctly`);
assert(tagSlug("Next.js 16") === "next-js-16", `tagSlug maps correctly`);
assert(authorSlug("Shaswat Raj") === "Shaswat%20Raj", `authorSlug percent-encodes author name`);

const testPosts = [
  { category: "AI", tags: ["ml"], author: "Alice" },
  { category: "Web", tags: ["css"], author: "Bob" },
  { category: "AI", tags: ["deep-learning"], author: "Alice" }
];
const extractedCats = extractCategories(testPosts);
assert(extractedCats.length === 2 && extractedCats[0] === "AI", `extractCategories deduplicates and sorts categories`);

// Test pagination module
assert(PAGE_SIZE === 12, `PAGE_SIZE constant is 12`);
assert(getPageCount(25, 10) === 3, `getPageCount computes 3 pages for 25 items at 10 items/page`);
const page2 = getPageItems([1, 2, 3, 4, 5], 2, 2);
assert(page2.length === 2 && page2[0] === 3 && page2[1] === 4, `getPageItems slices page 2 correctly`);
assert(getPageNumbers(30, 10).length === 3, `getPageNumbers produces [1, 2, 3]`);
const range = getPaginationRange(5, 10);
assert(range.includes("...") && range[0] === 1 && range[range.length - 1] === 10, `getPaginationRange produces ellipsis range`);

// Test advanced SEO JSON-LD
if (indexable.length > 0) {
  const jsonLdData = articleJsonLd(indexable[0]);
  assert(jsonLdData.inLanguage === "en-US", `articleJsonLd sets inLanguage: "en-US"`);
  assert(jsonLdData.speakable && jsonLdData.speakable["@type"] === "SpeakableSpecification", `articleJsonLd specifies speakable configuration for AI/voice assistants`);
  assert(Array.isArray(jsonLdData.image) && jsonLdData.image.length === 2, `articleJsonLd provides rich ImageObject array`);
}

console.log(`\n================================`);
console.log(`Test Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
console.log(`✔ All test suites passed cleanly.\n`);
