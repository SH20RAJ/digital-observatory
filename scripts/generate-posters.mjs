import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const outputDir = path.join(process.cwd(), "public", "og");
fs.mkdirSync(outputDir, { recursive: true });

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
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
for (const file of files) {
  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data } = matter(raw);
  if (data.status !== "published") continue;
  const titleLines = wrap(data.title);
  const titleSvg = titleLines.map((line, index) => '<text x="80" y="' + (230 + index * 68) + '" font-family="Arial,sans-serif" font-size="58" font-weight="800" fill="#ffffff">' + esc(line) + "</text>").join("");
  const category = esc(data.category || "Digital Observatory");
  const description = esc(String(data.description || "").slice(0, 110));
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0a0a09"/><stop offset=".62" stop-color="#17233a"/><stop offset="1" stop-color="#173f73"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1050" cy="90" r="170" fill="#78aaff" opacity=".08"/><circle cx="1110" cy="540" r="230" fill="#ffcf5a" opacity=".06"/><text x="80" y="78" font-family="Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="4" fill="#a9bad5">DIGITAL OBSERVATORY</text><text x="80" y="125" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#8fa0bb">' + category + "</text>" + titleSvg + '<text x="80" y="530" font-family="Arial,sans-serif" font-size="22" fill="#c6cfdd">' + description + '</text><text x="80" y="580" font-family="Arial,sans-serif" font-size="16" fill="#8f9caf">' + esc(data.publishedAt || "") + ' · Source-backed observation</text></svg>';
  fs.writeFileSync(path.join(outputDir, file.replace(/\.md$/, ".svg")), svg);
}
console.log("Generated static article posters.");
