import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CANONICAL_BASE = "https://observatory.campusloop.space";
const postsDir = path.join(process.cwd(), "content", "posts");
const publicDir = path.join(process.cwd(), "public");
const ogDir = path.join(publicDir, "og");
const apiDir = path.join(publicDir, "api");

fs.mkdirSync(ogDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

const esc = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const xmlEscape = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

function wrapText(text, maxChars, maxLines = 3) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    const next = current ? current + " " + w : w;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const res = lines.slice(0, maxLines);
    let last = res[maxLines - 1];
    if (last.length > maxChars - 3) {
      const spaceIdx = last.lastIndexOf(" ", maxChars - 3);
      if (spaceIdx > 12) {
        last = last.slice(0, spaceIdx);
      } else {
        last = last.slice(0, maxChars - 3);
      }
    }
    res[maxLines - 1] = last.trimEnd() + "…";
    return res;
  }
  return lines;
}

function computeTitleLayout(title) {
  const len = title.length;
  let fontSize = 48;
  let lineHeight = 58;
  let maxChars = 26;
  let maxLines = 3;

  if (len <= 40) {
    fontSize = 50;
    lineHeight = 62;
    maxChars = 24;
    maxLines = 3;
  } else if (len <= 65) {
    fontSize = 42;
    lineHeight = 52;
    maxChars = 29;
    maxLines = 3;
  } else if (len <= 85) {
    fontSize = 36;
    lineHeight = 46;
    maxChars = 35;
    maxLines = 3;
  } else {
    fontSize = 32;
    lineHeight = 42;
    maxChars = 40;
    maxLines = 3;
  }

  const lines = wrapText(title, maxChars, maxLines);
  return { fontSize, lineHeight, lines };
}

const hash = (value) => {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = ((result << 5) - result + value.charCodeAt(index)) | 0;
  }
  return Math.abs(result);
};

const palettes = [
  { bg: "#080c14", bg2: "#0f172a", accent: "#38bdf8", accent2: "#818cf8", glow: "#0284c7" },
  { bg: "#06120d", bg2: "#0c2419", accent: "#34d399", accent2: "#6ee7b7", glow: "#059669" },
  { bg: "#0d0914", bg2: "#1c122c", accent: "#c084fc", accent2: "#f472b6", glow: "#9333ea" },
  { bg: "#140c06", bg2: "#27170a", accent: "#fb923c", accent2: "#fde047", glow: "#ea580c" },
  { bg: "#061014", bg2: "#0b2029", accent: "#22d3ee", accent2: "#a5f3fc", glow: "#0891b2" },
  { bg: "#0a0c16", bg2: "#141a2e", accent: "#60a5fa", accent2: "#93c5fd", glow: "#2563eb" }
];

function generatePosterSvg({ title, description, category, publishedAt, readingTime, palette }) {
  const titleLayout = computeTitleLayout(title);
  const maxDescLines = titleLayout.lines.length >= 3 ? 2 : 3;
  const descLines = wrapText(description, 54, maxDescLines);

  const titleStartY = titleLayout.lines.length >= 3 ? 180 : titleLayout.lines.length === 2 ? 210 : 240;
  const titleSvg = titleLayout.lines
    .map(
      (line, index) =>
        `<text x="80" y="${titleStartY + index * titleLayout.lineHeight}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="${titleLayout.fontSize}" font-weight="800" letter-spacing="-0.03em" fill="#f8fafc">${esc(line)}</text>`
    )
    .join("\n");

  const descStartY = titleStartY + titleLayout.lines.length * titleLayout.lineHeight + 30;
  const descSvg = descLines
    .map(
      (line, index) =>
        `<text x="80" y="${descStartY + index * 27}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="18" font-weight="400" fill="#94a3b8">${esc(line)}</text>`
    )
    .join("\n");

  const catText = (category || "Observation").toUpperCase();
  const pillWidth = Math.min(440, Math.max(260, 185 + catText.length * 8.5));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${palette.bg}"/>
    <stop offset="100%" stop-color="${palette.bg2}"/>
  </linearGradient>
  <radialGradient id="glowGrad" cx="80%" cy="45%" r="55%">
    <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.32"/>
    <stop offset="50%" stop-color="${palette.glow}" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="${palette.bg}" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- Background & Glow -->
<rect width="1200" height="630" fill="url(#bgGrad)"/>
<rect width="1200" height="630" fill="url(#glowGrad)"/>

<!-- Outer Bezel -->
<rect x="1.5" y="1.5" width="1197" height="627" rx="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

<!-- Right Telemetry Graphic -->
<g opacity="0.95">
  <line x1="770" y1="285" x2="1170" y2="285" stroke="#ffffff" stroke-width="1" opacity="0.06"/>
  <line x1="970" y1="85" x2="970" y2="485" stroke="#ffffff" stroke-width="1" opacity="0.06"/>
  <line x1="828" y1="143" x2="1112" y2="427" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 6" opacity="0.04"/>
  <line x1="828" y1="427" x2="1112" y2="143" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 6" opacity="0.04"/>

  <circle cx="970" cy="285" r="185" fill="none" stroke="${palette.accent}" stroke-width="1.2" stroke-dasharray="6 8" opacity="0.18"/>
  <circle cx="970" cy="285" r="130" fill="none" stroke="${palette.accent2}" stroke-width="1.5" opacity="0.28"/>
  <circle cx="970" cy="285" r="75" fill="none" stroke="${palette.accent}" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.38"/>

  <circle cx="1100" cy="285" r="5.5" fill="${palette.accent2}" opacity="0.85"/>
  <circle cx="840" cy="285" r="5" fill="${palette.accent}" opacity="0.7"/>
  <circle cx="970" cy="155" r="5" fill="${palette.accent}" opacity="0.75"/>
  <circle cx="970" cy="415" r="5.5" fill="${palette.accent2}" opacity="0.8"/>

  <path d="M 830 205 A 165 165 0 0 1 1085 180" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M 855 365 A 165 165 0 0 0 1085 390" fill="none" stroke="${palette.accent2}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
</g>

<!-- Top Brand Bar -->
<g transform="translate(80, 75)">
  <rect width="36" height="36" rx="8" fill="#1e293b" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <circle cx="18" cy="18" r="9" fill="none" stroke="${palette.accent}" stroke-width="2"/>
  <circle cx="18" cy="18" r="3.5" fill="${palette.accent}"/>
  <text x="48" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="16" font-weight="700" letter-spacing="0.08em" fill="#f1f5f9">DIGITAL OBSERVATORY</text>
  <text x="260" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="13" font-weight="500" letter-spacing="0.05em" fill="#64748b">/ OPEN RESEARCH</text>
</g>

<!-- Category Pill -->
<g transform="translate(80, 130)">
  <rect width="${pillWidth}" height="28" rx="6" fill="#1e293b" stroke="${palette.accent}" stroke-width="1" stroke-opacity="0.3"/>
  <circle cx="14" cy="14" r="3.5" fill="${palette.accent}"/>
  <text x="26" y="18.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="11" font-weight="700" letter-spacing="0.1em" fill="${palette.accent}">${esc(catText)} OBSERVATION</text>
</g>

<!-- Title & Description -->
${titleSvg}
${descSvg}

<!-- Footer Telemetry Strip -->
<g transform="translate(80, 560)">
  <line x1="0" y1="-20" x2="1040" y2="-20" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  
  <text x="0" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="0.08em" fill="#64748b">DATE</text>
  <text x="50" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="13" font-weight="500" fill="#cbd5e1">${esc(publishedAt || "Current")}</text>

  <text x="210" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="0.08em" fill="#64748b">READ</text>
  <text x="260" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="13" font-weight="500" fill="#cbd5e1">${esc(readingTime || "3 min read")}</text>

  <text x="420" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="12" font-weight="600" letter-spacing="0.08em" fill="#64748b">PROVENANCE</text>
  <text x="525" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="13" font-weight="500" fill="${palette.accent}">Source-backed / Git-verified</text>

  <text x="1040" y="5" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="12" font-weight="500" fill="#475569">observatory.campusloop.space</text>
</g>

</svg>`;
}

function slugifySimple(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// 1. Read and parse all Markdown files
const files = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((f) => f.endsWith(".md")) : [];
const allPosts = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");
  const stats = readingTime(content);

  const publishedAt = String(data.publishedAt || "").slice(0, 10);
  const updatedAt = String(data.updatedAt || data.publishedAt || "").slice(0, 10);

  allPosts.push({
    slug,
    title: String(data.title || slug).trim(),
    description: String(data.description || data.excerpt || "").trim(),
    excerpt: String(data.excerpt || "").trim(),
    publishedAt,
    updatedAt: updatedAt || publishedAt,
    status: data.status === "draft" ? "draft" : "published",
    category: String(data.category || "Observatory").trim(),
    tags: Array.isArray(data.tags) ? data.tags.map(String).map((s) => s.trim()).filter(Boolean) : [],
    author: String(data.author || "Digital Observatory").trim(),
    authorRole: String(data.authorRole || "Editorial & Research").trim(),
    featured: Boolean(data.featured),
    coverImage: data.coverImage ? String(data.coverImage).trim() : undefined,
    noIndex: Boolean(data.noIndex),
    readingTime: stats.text,
    wordCount: stats.words,
    content
  });
}

// Sort newest first
allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.slug.localeCompare(a.slug));

// Published posts (includes noIndex for direct URL generation)
const publishedPosts = allPosts.filter((p) => p.status === "published");

// Indexable posts strictly EXCLUDES drafts AND noIndex: true
const indexablePosts = publishedPosts.filter((p) => !p.noIndex);

console.log(
  `Corpus: ${allPosts.length} total articles | ${publishedPosts.length} published | ${indexablePosts.length} indexable`
);

// 2. Generate deterministic OG posters for published posts
for (const post of publishedPosts) {
  const palette = palettes[hash(post.slug) % palettes.length];
  const svg = generatePosterSvg({
    title: post.title,
    description: post.description,
    category: post.category,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    palette
  });
  fs.writeFileSync(path.join(ogDir, post.slug + ".svg"), svg);
}

// Generate default OG poster
const defaultSvg = generatePosterSvg({
  title: "Signals Worth Understanding.",
  description: "An open-source digital observatory tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  category: "Open Research Journal",
  publishedAt: "Live observatory",
  readingTime: "50+ observations",
  palette: palettes[0]
});
fs.writeFileSync(path.join(ogDir, "default.svg"), defaultSvg);

// 3. Generate Lightweight Search Index (public/api/posts.json & public/search-index.json)
// Excludes full content bodies; strictly includes only indexable posts
const searchIndex = indexablePosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  excerpt: post.excerpt || post.description.slice(0, 160),
  category: post.category,
  tags: post.tags,
  author: post.author,
  authorRole: post.authorRole,
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
  url: "/blog/" + post.slug
}));

fs.writeFileSync(
  path.join(apiDir, "posts.json"),
  JSON.stringify({ count: searchIndex.length, posts: searchIndex }, null, 2)
);
fs.writeFileSync(path.join(publicDir, "search-index.json"), JSON.stringify(searchIndex, null, 2));

// 4. Generate RSS 2.0 Feed (public/feed.xml)
// Strictly indexable posts, up to 30 items
const feedItems = indexablePosts
  .slice(0, 30)
  .map(
    (post) =>
      "<item><title>" +
      xmlEscape(post.title) +
      "</title><link>" +
      CANONICAL_BASE +
      "/blog/" +
      post.slug +
      "</link><guid isPermaLink=\"true\">" +
      CANONICAL_BASE +
      "/blog/" +
      post.slug +
      "</guid><description>" +
      xmlEscape(post.description) +
      "</description><pubDate>" +
      new Date(post.publishedAt).toUTCString() +
      "</pubDate>" +
      (post.category ? "<category>" + xmlEscape(post.category) + "</category>" : "") +
      (post.author ? "<author>" + xmlEscape(post.author) + "</author>" : "") +
      "</item>"
  )
  .join("");

fs.writeFileSync(
  path.join(publicDir, "feed.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Digital Observatory</title><link>' +
    xmlEscape(CANONICAL_BASE) +
    "</link><description>Source-backed digital research.</description>" +
    feedItems +
    "</channel></rss>"
);

// 5. Generate AI & Agent Indexes (public/llms.txt & public/llms-full.txt)
// Strictly indexable posts
const categoriesList = [...new Set(indexablePosts.map((p) => p.category))].sort();
const authorsList = [...new Set(indexablePosts.map((p) => p.author))].sort();

const llms = [
  "# Digital Observatory",
  "",
  "> An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  "",
  "## Canonical pages",
  "",
  "- Home: " + CANONICAL_BASE,
  "- Journal: " + CANONICAL_BASE + "/blog",
  "- Topics: " + CANONICAL_BASE + "/topics",
  "- About: " + CANONICAL_BASE + "/about",
  "- RSS: " + CANONICAL_BASE + "/feed.xml",
  "- Full index: " + CANONICAL_BASE + "/llms-full.txt",
  "",
  "## Research Domains",
  "",
  ...categoriesList.map((cat) => "- [" + cat + "](" + CANONICAL_BASE + "/category/" + slugifySimple(cat) + ")"),
  "",
  "## Authors",
  "",
  ...authorsList.map((author) => "- [" + author + "](" + CANONICAL_BASE + "/author/" + encodeURIComponent(author) + ")"),
  "",
  "## Articles",
  ""
];

for (const post of indexablePosts) {
  llms.push("- [" + post.title + "](" + CANONICAL_BASE + "/blog/" + post.slug + ") — " + post.description.replace(/\n/g, " "));
}
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms.join("\n"));

const full = [
  "# Digital Observatory — Complete Knowledge Index",
  "",
  "Canonical URL: " + CANONICAL_BASE,
  "Updated: " + new Date().toISOString().slice(0, 10),
  "",
  "## Articles"
];

for (const post of indexablePosts) {
  full.push(
    "",
    "### " + post.title,
    "",
    "URL: " + CANONICAL_BASE + "/blog/" + post.slug,
    "Category: " + post.category,
    "Published: " + post.publishedAt,
    "Author: " + post.author + " (" + post.authorRole + ")",
    "",
    post.content
  );
}
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), full.join("\n"));

// 6. Generate Complete Sitemap (public/sitemap.xml)
// Strictly indexable posts & actually rendered routes. Excludes /search, drafts, noIndex.
const latestPostDate = indexablePosts[0]?.updatedAt || indexablePosts[0]?.publishedAt || null;
const sitemapUrls = new Map([
  ["/", latestPostDate],
  ["/blog", latestPostDate],
  ["/topics", latestPostDate],
  ["/about", latestPostDate]
]);

const categoryCounts = new Map();
const categoryLatest = new Map();
const tagCounts = new Map();
const tagLatest = new Map();
const authorCounts = new Map();
const authorLatest = new Map();

for (const post of indexablePosts) {
  const date = post.updatedAt || post.publishedAt;
  sitemapUrls.set("/blog/" + post.slug, date);

  const category = slugifySimple(post.category);
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  if (!categoryLatest.has(category) || date > categoryLatest.get(category)) {
    categoryLatest.set(category, date);
  }

  for (const tag of post.tags) {
    const slug = slugifySimple(tag);
    tagCounts.set(slug, (tagCounts.get(slug) || 0) + 1);
    if (!tagLatest.has(slug) || date > tagLatest.get(slug)) {
      tagLatest.set(slug, date);
    }
  }

  if (post.author) {
    const authorEnc = encodeURIComponent(post.author);
    authorCounts.set(authorEnc, (authorCounts.get(authorEnc) || 0) + 1);
    if (!authorLatest.has(authorEnc) || date > authorLatest.get(authorEnc)) {
      authorLatest.set(authorEnc, date);
    }
  }
}

for (const [category, date] of categoryLatest) {
  sitemapUrls.set("/category/" + category, date);
}

for (const [tag, date] of tagLatest) {
  sitemapUrls.set("/tag/" + tag, date);
}

for (const [author, date] of authorLatest) {
  sitemapUrls.set("/author/" + author, date);
}

const pageCount = (count) => Math.ceil(count / 12);

for (let page = 2; page <= pageCount(indexablePosts.length); page += 1) {
  sitemapUrls.set("/blog/page/" + page, latestPostDate);
}

for (const [slug, count] of categoryCounts) {
  const date = categoryLatest.get(slug) || null;
  for (let page = 2; page <= pageCount(count); page += 1) {
    sitemapUrls.set("/category/" + slug + "/page/" + page, date);
  }
}

for (const [slug, count] of tagCounts) {
  const date = tagLatest.get(slug) || null;
  for (let page = 2; page <= pageCount(count); page += 1) {
    sitemapUrls.set("/tag/" + slug + "/page/" + page, date);
  }
}

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  [...sitemapUrls]
    .map(
      ([urlPath, lastmod]) =>
        "<url><loc>" +
        xmlEscape(CANONICAL_BASE + urlPath) +
        "</loc>" +
        (lastmod ? "<lastmod>" + String(lastmod).slice(0, 10) + "</lastmod>" : "") +
        "</url>"
    )
    .join("") +
  "</urlset>";

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

// 7. Generate Robots Policy (public/robots.txt)
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  "User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: " + CANONICAL_BASE + "/sitemap.xml\n"
);

console.log(
  `Generated artifacts successfully: ${publishedPosts.length} OG posters, ${sitemapUrls.size} sitemap URLs, feed.xml, lightweight search index, llms.txt, and robots.txt.`
);
