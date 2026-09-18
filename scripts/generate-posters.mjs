import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const publicDir = path.join(process.cwd(), "public");
const ogDir = path.join(publicDir, "og");
const apiDir = path.join(publicDir, "api");
fs.mkdirSync(ogDir, { recursive: true });
fs.mkdirSync(apiDir, { recursive: true });

const esc = (value) => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
const wrap = (text, max = 42) => {
  const lines = []; let line = "";
  for (const word of String(text).split(/\s+/)) {
    if ((line + " " + word).trim().length > max && line) { lines.push(line); line = word; }
    else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
};

const files = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((file) => file.endsWith(".md")) : [];
const posts = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);
  if (data.status !== "published") continue;

  const slug = file.replace(/\.md$/, "");
  posts.push({
    slug, title:String(data.title || ""), description:String(data.description || ""), excerpt:String(data.excerpt || ""),
    publishedAt:String(data.publishedAt || ""), updatedAt:String(data.updatedAt || data.publishedAt || ""),
    category:String(data.category || ""), tags:Array.isArray(data.tags) ? data.tags.map(String) : [],
    author:String(data.author || ""), readingTime:String(data.readingTime || ""), content
  });

  const titleLines = wrap(data.title);
  const titleSvg = titleLines.map((line, index) => '<text x="80" y="' + (230 + index * 68) + '" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#ffffff">' + esc(line) + "</text>").join("");
  const category = esc(data.category || "Digital Observatory");
  const description = esc(String(data.description || "").slice(0, 110));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0a0a09"/><stop offset=".62" stop-color="#17233a"/><stop offset="1" stop-color="#173f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1050" cy="90" r="170" fill="#78aaff" opacity=".08"/><circle cx="1110" cy="540" r="230" fill="#ffcf5a" opacity=".06"/><text x="80" y="78" font-family="Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#a9bad5">DIGITAL OBSERVATORY</text><text x="80" y="125" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#8fa0bb">' + category + "</text>" + titleSvg + '<text x="80" y="530" font-family="Arial,sans-serif" font-size="22" fill="#c6cfdd">' + description + '</text><text x="80" y="580" font-family="Arial,sans-serif" font-size="16" fill="#8f9caf">' + esc(data.publishedAt || "") + ' · Source-backed observation</text></svg>';
  fs.writeFileSync(path.join(ogDir, slug + ".svg"), svg);
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://digital-observatory.dev").replace(/\/$/, "");
const publicBase = siteUrl + basePath;
const articleUrl = (slug) => publicBase + "/blog/" + slug;

const apiPosts = posts.map(({ content, ...post }) => ({ ...post, url: articleUrl(post.slug) }));
fs.writeFileSync(path.join(apiDir, "posts.json"), JSON.stringify({ count: apiPosts.length, posts: apiPosts }, null, 2));

const xmlEscape = (value) => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
const feedItems = posts.slice(0, 30).map((post) =>
  "<item><title>" + xmlEscape(post.title) + "</title><link>" + articleUrl(post.slug) + "</link><guid isPermaLink=\"true\">" + articleUrl(post.slug) + "</guid><description>" + xmlEscape(post.description) + "</description><pubDate>" + new Date(post.publishedAt).toUTCString() + "</pubDate></item>"
).join("");
fs.writeFileSync(path.join(publicDir, "feed.xml"),
  '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Digital Observatory</title><link>' + xmlEscape(publicBase) + '</link><description>Source-backed digital research.</description>' + feedItems + "</channel></rss>"
);

const llms = ["# Digital Observatory", "", "> An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.", "", "## Canonical pages", "", "- Home: " + publicBase, "- Journal: " + publicBase + "/blog", "- About: " + publicBase + "/about", "- RSS: " + publicBase + "/feed.xml", "- Full index: " + publicBase + "/llms-full.txt", "", "## Articles", ""];
for (const post of posts) llms.push("- [" + post.title + "](" + articleUrl(post.slug) + ") — " + post.description.replace(/\n/g, " "));
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms.join("\n"));

const full = ["# Digital Observatory", "", "Canonical site: " + publicBase, "", "## Articles"];
for (const post of posts) full.push("", "### " + post.title, "", "URL: " + articleUrl(post.slug), "Category: " + post.category, "Published: " + post.publishedAt, "Author: " + post.author, "", post.content);
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), full.join("\n"));

const urls = new Set(["/", "/blog", "/about", "/search"]);
for (const post of posts) urls.add("/blog/" + post.slug);
for (const post of posts) {
  urls.add("/category/" + post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  for (const tag of post.tags) urls.add("/tag/" + tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  urls.add("/author/" + encodeURIComponent(post.author));
}
const sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  [...urls].map((url) => "<url><loc>" + xmlEscape(publicBase + url) + "</loc></url>").join("") + "</urlset>";
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

fs.writeFileSync(path.join(publicDir, "robots.txt"),
  "User-agent: *\nAllow: /\nDisallow: /search\n\nSitemap: " + publicBase + "/sitemap.xml\n"
);

console.log("Generated static posters, machine indexes, RSS, sitemap, robots, and API index.");
