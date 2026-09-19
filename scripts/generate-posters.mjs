import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const OG_DIR = path.join(ROOT, "public", "og");
const CANONICAL_BASE = "https://observatory.campusloop.space";

fs.mkdirSync(OG_DIR, { recursive: true });

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const palettes = [
  { bg: "#0a0d12", panel: "#11161d", line: "#26303c", accent: "#60a5fa", soft: "#1d2b40" },
  { bg: "#0a0f0c", panel: "#111a15", line: "#24352b", accent: "#34d399", soft: "#183326" },
  { bg: "#0d0b10", panel: "#17121d", line: "#30253a", accent: "#c084fc", soft: "#2a1d36" },
  { bg: "#110d09", panel: "#1b1510", line: "#382b20", accent: "#fb923c", soft: "#342216" },
  { bg: "#080e12", panel: "#0f1a20", line: "#21343d", accent: "#22d3ee", soft: "#17323b" }
];

const hash = (value) => {
  let result = 0;
  for (let i = 0; i < value.length; i += 1) result = ((result << 5) - result + value.charCodeAt(i)) | 0;
  return Math.abs(result);
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function wrapText(text, maxChars, maxLines) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const result = lines.slice(0, maxLines);
  const last = result[maxLines - 1];
  result[maxLines - 1] = `${last.replace(/[.,;:!?-]?$/, "").slice(0, Math.max(8, maxChars - 2)).trimEnd()}…`;
  return result;
}

function titleLayout(title) {
  const length = title.length;
  if (length <= 48) return { size: 50, leading: 56, chars: 27, lines: 3 };
  if (length <= 78) return { size: 43, leading: 49, chars: 31, lines: 3 };
  if (length <= 108) return { size: 37, leading: 43, chars: 35, lines: 3 };
  return { size: 32, leading: 38, chars: 39, lines: 4 };
}

function poster({ slug, title, description, category, publishedAt, readingTime: read, palette }) {
  const layout = titleLayout(title);
  const titleLines = wrapText(title, layout.chars, layout.lines);
  const descLines = wrapText(description, 55, 2);
  const titleY = titleLines.length === 4 ? 218 : titleLines.length === 3 ? 205 : 190;
  const descY = titleY + titleLines.length * layout.leading + 30;
  const cat = String(category || "Observation").toUpperCase();
  const signal = String((hash(slug) % 9999) + 1).padStart(4, "0");
  const titleSvg = titleLines.map((line, i) =>
    `<text x="72" y="${titleY + i * layout.leading}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="${layout.size}" font-weight="780" letter-spacing="-0.035em" fill="#f8fafc">${esc(line)}</text>`
  ).join("\n");
  const descSvg = descLines.map((line, i) =>
    `<text x="74" y="${descY + i * 25}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="17" font-weight="430" fill="#9aa7b6">${esc(line)}</text>`
  ).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(description)}</desc>
<rect width="1200" height="630" fill="${palette.bg}"/>
<rect x="1" y="1" width="1198" height="628" rx="18" fill="none" stroke="${palette.line}"/>
<path d="M0 92H1200" stroke="${palette.line}"/>
<path d="M742 92V552" stroke="${palette.line}"/>

<!-- calm research-grid, not decorative noise -->
<g opacity="0.55" stroke="${palette.line}" stroke-width="1">
  <path d="M810 150H1135M810 205H1135M810 260H1135M810 315H1135M810 370H1135M810 425H1135M810 480H1135"/>
  <path d="M865 150V480M920 150V480M975 150V480M1030 150V480M1085 150V480"/>
</g>
<g fill="${palette.accent}">
  <circle cx="865" cy="315" r="4"/><circle cx="975" cy="260" r="4"/><circle cx="1085" cy="370" r="4"/>
</g>
<path d="M865 315 L975 260 L1085 370" fill="none" stroke="${palette.accent}" stroke-width="2" opacity="0.72"/>
<rect x="808" y="138" width="304" height="356" rx="14" fill="${palette.panel}" stroke="${palette.line}"/>

<!-- brand -->
<g transform="translate(72 34)">
  <rect width="30" height="30" rx="7" fill="${palette.soft}" stroke="${palette.accent}" stroke-opacity="0.5"/>
  <circle cx="15" cy="15" r="7" fill="none" stroke="${palette.accent}" stroke-width="2"/>
  <circle cx="15" cy="15" r="2.5" fill="${palette.accent}"/>
  <text x="42" y="13" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="12" font-weight="750" letter-spacing="0.12em" fill="#f8fafc">DIGITAL OBSERVATORY</text>
  <text x="42" y="28" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.08em" fill="#64748b">OPEN RESEARCH JOURNAL</text>
</g>

<!-- category -->
<g transform="translate(72 118)">
  <rect width="${Math.min(420, Math.max(180, 30 + cat.length * 7.2))}" height="28" rx="7" fill="${palette.soft}" stroke="${palette.accent}" stroke-opacity="0.35"/>
  <circle cx="14" cy="14" r="3" fill="${palette.accent}"/>
  <text x="25" y="18" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10.5" font-weight="700" letter-spacing="0.09em" fill="${palette.accent}">${esc(cat)}</text>
</g>

${titleSvg}
${descSvg}

<!-- right telemetry card -->
<g transform="translate(832 160)">
  <text x="0" y="0" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.12em" fill="#64748b">OBSERVATION / ${signal}</text>
  <text x="0" y="48" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.09em" fill="#64748b">DATE</text>
  <text x="0" y="68" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="18" font-weight="650" fill="#e2e8f0">${esc(publishedAt || "Current")}</text>
  <path d="M0 88H256" stroke="${palette.line}"/>
  <text x="0" y="120" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.09em" fill="#64748b">READ</text>
  <text x="0" y="140" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="17" font-weight="600" fill="#e2e8f0">${esc(read || "3 min read")}</text>
  <path d="M0 160H256" stroke="${palette.line}"/>
  <text x="0" y="192" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.09em" fill="#64748b">PROVENANCE</text>
  <text x="0" y="214" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,sans-serif" font-size="15" font-weight="600" fill="${palette.accent}">SOURCE-BACKED</text>
  <text x="0" y="258" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10" letter-spacing="0.09em" fill="#64748b">SIGNAL / CONTEXT / UNCERTAINTY</text>
</g>

<!-- footer -->
<path d="M72 552H1128" stroke="${palette.line}"/>
<text x="72" y="582" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10.5" letter-spacing="0.08em" fill="#64748b">OBSERVATORY.CAMPUSLOOP.SPACE</text>
<text x="1128" y="582" text-anchor="end" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="10.5" letter-spacing="0.08em" fill="#64748b">${esc(category || "OBSERVATION")} / ${signal}</text>
</svg>`;
}

const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md")) : [];
for (const file of files) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (data.status === "draft") continue;
  const slug = file.replace(/\.md$/, "");
  const palette = palettes[hash(slug) % palettes.length];
  const read = readingTime(content).text;
  const svg = poster({
    slug,
    title: String(data.title || slug),
    description: String(data.description || data.excerpt || ""),
    category: String(data.category || "Observation"),
    publishedAt: String(data.publishedAt || "Current").slice(0, 10),
    readingTime: read,
    palette
  });
  fs.writeFileSync(path.join(OG_DIR, `${slug}.svg`), svg);
}

const defaultSvg = poster({
  slug: "default",
  title: "Signals Worth Understanding.",
  description: "An open-source digital observatory tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  category: "Open Research Journal",
  publishedAt: "Live observatory",
  readingTime: "Research journal",
  palette: palettes[0]
});
fs.writeFileSync(path.join(OG_DIR, "default.svg"), defaultSvg);

console.log(`Generated refined posters for ${files.length} Markdown posts.`);
