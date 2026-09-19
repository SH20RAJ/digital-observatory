import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const publicDir = path.join(process.cwd(), "public");
const ogDir = path.join(publicDir, "og");
const apiDir = path.join(publicDir, "api");

fs.mkdirSync(ogDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

const esc = (value) =>
  String(value)
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
  <circle cx="1062" cy="193" r="6" fill="${palette.accent}" opacity="0.85"/>
  <circle cx="878" cy="377" r="4.5" fill="${palette.accent2}" opacity="0.7"/>
  <circle cx="878" cy="193" r="4.5" fill="${palette.accent}" opacity="0.65"/>
  <circle cx="1062" cy="377" r="6" fill="${palette.accent2}" opacity="0.85"/>

  <circle cx="970" cy="285" r="30" fill="${palette.accent}" opacity="0.22"/>
  <circle cx="970" cy="285" r="16" fill="${palette.accent}" opacity="0.88"/>
  <circle cx="970" cy="285" r="7" fill="#ffffff" opacity="0.95"/>
</g>

<!-- Category Pill Header -->
<g>
  <rect x="80" y="64" width="${pillWidth}" height="32" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
  <circle cx="98" cy="80" r="4" fill="${palette.accent}"/>
  <text x="112" y="81" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="700" letter-spacing="1.5" fill="#f1f5f9">DIGITAL OBSERVATORY</text>
  <text x="264" y="81" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="600" fill="#64748b"> / </text>
  <text x="280" y="81" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" font-weight="750" letter-spacing="1" fill="${palette.accent}">${esc(catText)}</text>
</g>

<!-- Title -->
${titleSvg}

<!-- Description -->
${descSvg}

<!-- Footer Metadata -->
<g>
  <circle cx="85" cy="564" r="4" fill="${palette.accent}" opacity="0.9"/>
  <text x="98" y="568" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="550" fill="#64748b">${esc(publishedAt || "")}${readingTime ? "  •  " + esc(readingTime) : ""}  •  Source-backed observation</text>
  <text x="1120" y="568" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ui-monospace, monospace" font-size="13" font-weight="600" fill="#475569" letter-spacing="0.5">observatory.campusloop.space</text>
</g>
</svg>`;
}

const files = fs.existsSync(postsDir)
  ? fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"))
  : [];

const posts = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);
  if (data.status !== "published") continue;

  const slug = file.replace(/\.md$/, "");
  posts.push({
    slug,
    title: String(data.title || ""),
    description: String(data.description || ""),
    excerpt: String(data.excerpt || ""),
    publishedAt: String(data.publishedAt || ""),
    updatedAt: String(data.updatedAt || data.publishedAt || ""),
    category: String(data.category || ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    author: String(data.author || ""),
    readingTime: String(data.readingTime || ""),
    content
  });

  const palette = palettes[hash(slug) % palettes.length];
  const svg = generatePosterSvg({
    title: String(data.title || slug),
    description: String(data.description || data.excerpt || ""),
    category: String(data.category || "Observation"),
    publishedAt: String(data.publishedAt || ""),
    readingTime: String(data.readingTime || ""),
    palette
  });

  fs.writeFileSync(path.join(ogDir, slug + ".svg"), svg);
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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://observatory.campusloop.space").replace(/\/$/, "");
const publicBase = siteUrl + basePath;
const articleUrl = (slug) => publicBase + "/blog/" + slug;

const apiPosts = posts.map(({ content, ...post }) => ({ ...post, url: articleUrl(post.slug) }));
fs.writeFileSync(path.join(apiDir, "posts.json"), JSON.stringify({ count: apiPosts.length, posts: apiPosts }, null, 2));

const xmlEscape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const feedItems = posts
  .slice(0, 30)
  .map(
    (post) =>
      "<item><title>" +
      xmlEscape(post.title) +
      "</title><link>" +
      articleUrl(post.slug) +
      '</link><guid isPermaLink="true">' +
      articleUrl(post.slug) +
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
    xmlEscape(publicBase) +
    "</link><description>Source-backed digital research.</description>" +
    feedItems +
    "</channel></rss>"
);

const slugifySimple = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const categoriesList = [...new Set(posts.map((p) => p.category))].sort();
const authorsList = [...new Set(posts.map((p) => p.author))].sort();

const llms = [
  "# Digital Observatory",
  "",
  "> An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  "",
  "## Canonical pages",
  "",
  "- Home: " + publicBase,
  "- Journal: " + publicBase + "/blog",
  "- About: " + publicBase + "/about",
  "- RSS: " + publicBase + "/feed.xml",
  "- Full index: " + publicBase + "/llms-full.txt",
  "",
  "## Research Domains",
  "",
  ...categoriesList.map((cat) => "- [" + cat + "](" + publicBase + "/category/" + slugifySimple(cat) + ")"),
  "",
  "## Authors",
  "",
  ...authorsList.map((author) => "- [" + author + "](" + publicBase + "/author/" + encodeURIComponent(author) + ")"),
  "",
  "## Articles",
  ""
];

for (const post of posts) {
  llms.push("- [" + post.title + "](" + articleUrl(post.slug) + ") — " + post.description.replace(/\n/g, " "));
}

fs.writeFileSync(path.join(publicDir, "llms.txt"), llms.join("\n"));

const full = ["# Digital Observatory", "", "Canonical site: " + publicBase, "", "## Articles"];
for (const post of posts) {
  full.push(
    "",
    "### " + post.title,
    "",
    "URL: " + articleUrl(post.slug),
    "Category: " + post.category,
    "Published: " + post.publishedAt,
    "Author: " + post.author,
    "",
    post.content
  );
}
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), full.join("\n"));

const latestPostDate = posts[0]?.updatedAt || posts[0]?.publishedAt || null;
const urls = new Map([
  ["/", latestPostDate],
  ["/blog", latestPostDate],
  ["/about", latestPostDate]
]);

const categoryCounts = new Map();
const categoryLatest = new Map();
const tagCounts = new Map();
const tagLatest = new Map();
const authorCounts = new Map();
const authorLatest = new Map();

for (const post of posts) {
  const date = post.updatedAt || post.publishedAt;
  urls.set("/blog/" + post.slug, date);

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
  urls.set("/category/" + category, date);
}

for (const [tag, date] of tagLatest) {
  urls.set("/tag/" + tag, date);
}

for (const [author, date] of authorLatest) {
  urls.set("/author/" + author, date);
}

const pageCount = (count) => Math.ceil(count / 12);

for (let page = 2; page <= pageCount(posts.length); page += 1) {
  urls.set("/blog/page/" + page, latestPostDate);
}

for (const [slug, count] of categoryCounts) {
  const date = categoryLatest.get(slug) || null;
  for (let page = 2; page <= pageCount(count); page += 1) {
    urls.set("/category/" + slug + "/page/" + page, date);
  }
}

for (const [slug, count] of tagCounts) {
  const date = tagLatest.get(slug) || null;
  for (let page = 2; page <= pageCount(count); page += 1) {
    urls.set("/tag/" + slug + "/page/" + page, date);
  }
}

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  [...urls]
    .map(
      ([url, lastmod]) =>
        "<url><loc>" +
        xmlEscape(publicBase + url) +
        "</loc>" +
        (lastmod ? "<lastmod>" + String(lastmod).slice(0, 10) + "</lastmod>" : "") +
        "</url>"
    )
    .join("") +
  "</urlset>";

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(publicDir, "robots.txt"),
  "User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: " + publicBase + "/sitemap.xml\n"
);

console.log("Generated posters, machine indexes, RSS, paginated sitemap, robots, and API index.");
