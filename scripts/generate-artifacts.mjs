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
  let fontSize = 42;
  let lineHeight = 48;
  let maxChars = 34;
  let maxLines = 4;

  if (len <= 42) {
    fontSize = 50;
    lineHeight = 56;
    maxChars = 28;
    maxLines = 3;
  } else if (len <= 65) {
    fontSize = 46;
    lineHeight = 52;
    maxChars = 31;
    maxLines = 3;
  } else if (len <= 92) {
    fontSize = 40;
    lineHeight = 46;
    maxChars = 34;
    maxLines = 4;
  } else if (len <= 120) {
    fontSize = 36;
    lineHeight = 42;
    maxChars = 38;
    maxLines = 4;
  } else {
    fontSize = 33;
    lineHeight = 39;
    maxChars = 41;
    maxLines = 4;
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
  { bg: "#090b0e", panel: "#11141a", accent: "#3b82f6", accent2: "#60a5fa", grid: "#202632" },
  { bg: "#0a0f0c", panel: "#111813", accent: "#34d399", accent2: "#6ee7b7", grid: "#202b25" },
  { bg: "#0f0d08", panel: "#17140e", accent: "#f59e0b", accent2: "#fbbf24", grid: "#2c2518" },
  { bg: "#0a0c12", panel: "#121721", accent: "#22d3ee", accent2: "#67e8f9", grid: "#1f2933" },
  { bg: "#0c0d10", panel: "#15171c", accent: "#a3e635", accent2: "#bef264", grid: "#252a31" }
];

function generatePosterSvg({ title, description, category, publishedAt, readingTime, palette }) {
  const titleLayout = computeTitleLayout(title);
  const descLines = wrapText(description, 58, 2);
  const titleStartY = titleLayout.lines.length >= 4 ? 176 : titleLayout.lines.length === 3 ? 188 : 206;
  const titleSvg = titleLayout.lines
    .map(
      (line, index) =>
        `<text x="76" y="${titleStartY + index * titleLayout.lineHeight}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="${titleLayout.fontSize}" font-weight="760" letter-spacing="-0.035em" fill="#f8fafc">${esc(line)}</text>`
    )
    .join("\n");

  const descStartY = titleStartY + titleLayout.lines.length * titleLayout.lineHeight + 26;
  const descSvg = descLines
    .map(
      (line, index) =>
        `<text x="76" y="${descStartY + index * 25}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="17" font-weight="420" fill="#94a3b8">${esc(line)}</text>`
    )
    .join("\n");

  const catText = (category || "Observation").toUpperCase();
  const pillWidth = Math.min(390, Math.max(210, 122 + catText.length * 7.2));
  const signal = hash(title);
  const bars = [0, 1, 2, 3, 4, 5].map((i) => 44 + ((signal >> (i * 3)) & 31));
  const linePoints = [
    [784, 388],
    [826, 360 - (signal % 22)],
    [872, 374 - ((signal >> 4) % 52)],
    [918, 322 - ((signal >> 9) % 68)],
    [964, 350 - ((signal >> 14) % 42)],
    [1010, 290 - ((signal >> 19) % 70)],
    [1056, 304 - ((signal >> 24) % 54)]
  ];
  const pathD = linePoints.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(title)}">
<rect width="1200" height="630" fill="${palette.bg}"/>
<rect x="1.5" y="1.5" width="1197" height="627" rx="20" fill="none" stroke="#202632" stroke-width="1.5"/>

<!-- Subtle editorial grid -->
<g opacity="0.45" stroke="${palette.grid}" stroke-width="1">
  <line x1="720" y1="116" x2="1160" y2="116"/>
  <line x1="720" y1="202" x2="1160" y2="202"/>
  <line x1="720" y1="288" x2="1160" y2="288"/>
  <line x1="720" y1="374" x2="1160" y2="374"/>
  <line x1="720" y1="460" x2="1160" y2="460"/>
  <line x1="760" y1="92" x2="760" y2="482"/>
  <line x1="820" y1="92" x2="820" y2="482"/>
  <line x1="880" y1="92" x2="880" y2="482"/>
  <line x1="940" y1="92" x2="940" y2="482"/>
  <line x1="1000" y1="92" x2="1000" y2="482"/>
  <line x1="1060" y1="92" x2="1060" y2="482"/>
  <line x1="1120" y1="92" x2="1120" y2="482"/>
</g>

<!-- Right-hand signal panel -->
<rect x="744" y="92" width="398" height="390" rx="16" fill="${palette.panel}" stroke="${palette.grid}" stroke-width="1.2"/>
<text x="770" y="122" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11" font-weight="700" letter-spacing="0.14em" fill="${palette.accent}">OBSERVATION / SIGNAL MAP</text>
<text x="770" y="145" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" fill="#64748b">deterministic visual fallback</text>

<!-- Signal chart -->
<g>
  <path d="${pathD}" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  ${linePoints.map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="${i === linePoints.length - 1 ? 5 : 3.5}" fill="${i === linePoints.length - 1 ? palette.accent2 : palette.accent}"/>`).join("\n  ")}
</g>

<!-- Small telemetry bars -->
<g transform="translate(778, 404)">
  ${bars.map((value, i) => {
    const x = i * 52;
    const h = value;
    return `<rect x="${x}" y="${68-h}" width="26" height="${h}" rx="4" fill="${palette.accent}" opacity="${0.28 + i * 0.09}"/>`;
  }).join("\n  ")}
</g>

<text x="770" y="472" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="600" letter-spacing="0.08em" fill="#64748b">SOURCE-BACKED / STATIC EXPORT</text>

<!-- Brand -->
<g transform="translate(76, 62)">
  <rect width="34" height="34" rx="8" fill="${palette.panel}" stroke="${palette.grid}" stroke-width="1"/>
  <circle cx="17" cy="17" r="8" fill="none" stroke="${palette.accent}" stroke-width="2"/>
  <circle cx="17" cy="17" r="3" fill="${palette.accent2}"/>
  <text x="46" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-size="15" font-weight="760" letter-spacing="0.075em" fill="#f1f5f9">DIGITAL OBSERVATORY</text>
  <text x="258" y="22" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="11.5" font-weight="600" letter-spacing="0.04em" fill="#64748b">/ OPEN RESEARCH</text>
</g>

<!-- Category -->
<g transform="translate(76, 116)">
  <rect width="${pillWidth}" height="28" rx="7" fill="${palette.panel}" stroke="${palette.accent}" stroke-opacity="0.45" stroke-width="1"/>
  <circle cx="13" cy="14" r="3" fill="${palette.accent}"/>
  <text x="25" y="18" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.09em" fill="${palette.accent}">${esc(catText)}</text>
</g>

<!-- Headline and deck -->
${titleSvg}
${descSvg}

<!-- Footer -->
<g transform="translate(76, 548)">
  <line x1="0" y1="-18" x2="1066" y2="-18" stroke="${palette.grid}" stroke-width="1"/>
  <text x="0" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.09em" fill="#64748b">DATE</text>
  <text x="46" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="600" fill="#cbd5e1">${esc(publishedAt || "Current")}</text>

  <text x="200" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.09em" fill="#64748b">READ</text>
  <text x="245" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="600" fill="#cbd5e1">${esc(readingTime || "3 min read")}</text>

  <text x="380" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="700" letter-spacing="0.09em" fill="#64748b">PROVENANCE</text>
  <text x="482" y="8" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="12" font-weight="600" fill="${palette.accent}">source-backed</text>

  <text x="1066" y="8" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10.5" font-weight="600" fill="#475569">observatory.campusloop.space</text>
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
  .map((post) => {
    const postUrl = CANONICAL_BASE + "/blog/" + post.slug;
    const posterUrl = CANONICAL_BASE + "/og/" + post.slug + ".svg";
    return (
      "<item><title>" +
      xmlEscape(post.title) +
      "</title><link>" +
      postUrl +
      "</link><guid isPermaLink=\"true\">" +
      postUrl +
      "</guid><description>" +
      xmlEscape(post.description) +
      "</description><pubDate>" +
      new Date(post.publishedAt).toUTCString() +
      "</pubDate>" +
      (post.category ? "<category>" + xmlEscape(post.category) + "</category>" : "") +
      (post.author
        ? "<dc:creator>" +
          xmlEscape(post.author) +
          "</dc:creator><author>" +
          xmlEscape(post.author) +
          "</author>"
        : "") +
      '<enclosure url="' +
      posterUrl +
      '" length="12000" type="image/svg+xml" />' +
      '<media:content url="' +
      posterUrl +
      '" medium="image" type="image/svg+xml">' +
      "<media:title>" +
      xmlEscape(post.title) +
      "</media:title>" +
      "</media:content>" +
      "</item>"
    );
  })
  .join("");

fs.writeFileSync(
  path.join(publicDir, "feed.xml"),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">\n' +
    "<channel>\n" +
    "<title>Digital Observatory</title>\n" +
    "<link>" +
    xmlEscape(CANONICAL_BASE) +
    "</link>\n" +
    "<description>Source-backed digital research.</description>\n" +
    '<atom:link href="' +
    xmlEscape(CANONICAL_BASE) +
    '/feed.xml" rel="self" type="application/rss+xml" />\n' +
    "<language>en-us</language>\n" +
    feedItems +
    "\n</channel>\n</rss>\n"
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

const postImageMap = new Map();
const categoryCounts = new Map();
const categoryLatest = new Map();
const tagCounts = new Map();
const tagLatest = new Map();
const authorCounts = new Map();
const authorLatest = new Map();

for (const post of indexablePosts) {
  const date = post.updatedAt || post.publishedAt;
  sitemapUrls.set("/blog/" + post.slug, date);
  postImageMap.set("/blog/" + post.slug, {
    imageUrl: CANONICAL_BASE + "/og/" + post.slug + ".svg",
    title: post.title
  });

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
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  [...sitemapUrls]
    .map(([urlPath, lastmod]) => {
      const img = postImageMap.get(urlPath);
      const imgXml = img
        ? "<image:image><image:loc>" +
          xmlEscape(img.imageUrl) +
          "</image:loc><image:title>" +
          xmlEscape(img.title) +
          "</image:title></image:image>"
        : "";
      return (
        "<url><loc>" +
        xmlEscape(CANONICAL_BASE + urlPath) +
        "</loc>" +
        (lastmod ? "<lastmod>" + String(lastmod).slice(0, 10) + "</lastmod>" : "") +
        imgXml +
        "</url>"
      );
    })
    .join("\n") +
  "\n</urlset>\n";

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

// 7. Generate Robots Policy (public/robots.txt)
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  "User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: " + CANONICAL_BASE + "/sitemap.xml\n"
);

console.log(
  `Generated artifacts successfully: ${publishedPosts.length} OG posters, ${sitemapUrls.size} sitemap URLs, feed.xml, lightweight search index, llms.txt, and robots.txt.`
);
