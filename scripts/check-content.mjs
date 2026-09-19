import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CANONICAL_HOST = "observatory.campusloop.space";
const dir = path.join(process.cwd(), "content", "posts");
const publicDir = path.join(process.cwd(), "public");
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];

const errors = [];
const warnings = [];

const REQUIRED_FIELDS = [
  "title",
  "description",
  "publishedAt",
  "status",
  "category",
  "author",
  "authorRole",
  "sources"
];

const KNOWN_FIELDS = new Set([
  "title",
  "description",
  "excerpt",
  "publishedAt",
  "updatedAt",
  "status",
  "category",
  "tags",
  "author",
  "authorRole",
  "featured",
  "coverImage",
  "coverAlt",
  "keywords",
  "canonicalUrl",
  "noIndex",
  "sources"
]);

const VALID_STATUSES = new Set(["draft", "published"]);

const VALID_CATEGORIES = new Set([
  "AI",
  "Open Source",
  "Developers",
  "Startups",
  "Internet",
  "Security",
  "Experiments",
  "Digital Culture",
  "Methodology",
  "Observatory"
]);

const seenSlugs = new Map();
const seenCanonicalUrls = new Map();
const allKnownSlugs = new Set(files.map((f) => f.replace(/\.md$/, "")));

function isValidIsoDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}/.test(str)) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

for (const file of files) {
  const filePath = path.join(dir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const slug = file.replace(/\.md$/, "");

  // 1. Slug format check
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${file}: slug "${slug}" must be lowercase alphanumeric with single hyphens`);
  }

  // 2. Duplicate slug check
  if (seenSlugs.has(slug)) {
    errors.push(`${file}: duplicate slug detected (already used in ${seenSlugs.get(slug)})`);
  } else {
    seenSlugs.set(slug, file);
  }

  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    errors.push(`${file}: YAML frontmatter parse error: ${err.message}`);
    continue;
  }

  const data = parsed.data || {};
  const content = parsed.content || "";

  // 3. Required fields check
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      errors.push(`${file}: missing required frontmatter field "${field}"`);
    }
  }

  // 4. Unknown frontmatter fields check
  for (const key of Object.keys(data)) {
    if (!KNOWN_FIELDS.has(key)) {
      warnings.push(`${file}: unrecognized frontmatter key "${key}"`);
    }
  }

  // 5. Status check
  if (data.status && !VALID_STATUSES.has(String(data.status))) {
    errors.push(`${file}: status must be "draft" or "published" (got "${data.status}")`);
  }

  // 6. Dates and date ordering check
  const pubDateStr = String(data.publishedAt || "").slice(0, 10);
  if (data.publishedAt && !isValidIsoDate(pubDateStr)) {
    errors.push(`${file}: publishedAt must be a valid ISO date YYYY-MM-DD (got "${data.publishedAt}")`);
  }

  if (data.updatedAt) {
    const upDateStr = String(data.updatedAt).slice(0, 10);
    if (!isValidIsoDate(upDateStr)) {
      errors.push(`${file}: updatedAt must be a valid ISO date YYYY-MM-DD (got "${data.updatedAt}")`);
    } else if (pubDateStr && upDateStr < pubDateStr) {
      errors.push(`${file}: updatedAt (${upDateStr}) cannot precede publishedAt (${pubDateStr})`);
    }
  }

  // 7. Category check
  if (data.category && !VALID_CATEGORIES.has(String(data.category))) {
    warnings.push(
      `${file}: category "${data.category}" is not in the standard list (${[...VALID_CATEGORIES].join(", ")})`
    );
  }

  // 8. Description length check
  const desc = String(data.description || "").trim();
  if (desc && desc.length < 40) {
    errors.push(`${file}: description is too short (${desc.length} chars, minimum 40)`);
  }

  // 9. Canonical URL check
  if (data.canonicalUrl) {
    try {
      const u = new URL(String(data.canonicalUrl));
      if (seenCanonicalUrls.has(u.href)) {
        errors.push(
          `${file}: duplicate canonicalUrl "${u.href}" (already used in ${seenCanonicalUrls.get(u.href)})`
        );
      } else {
        seenCanonicalUrls.set(u.href, file);
      }
    } catch {
      errors.push(`${file}: invalid canonicalUrl "${data.canonicalUrl}"`);
    }
  }

  // 10. Sources validation
  if (!Array.isArray(data.sources) || data.sources.length < 1) {
    errors.push(`${file}: research articles must cite at least one verified source in "sources"`);
  } else {
    for (let i = 0; i < data.sources.length; i++) {
      const src = data.sources[i];
      if (!src || typeof src !== "object") {
        errors.push(`${file}: sources[${i}] must be an object with "label" and "url"`);
        continue;
      }
      if (!src.label || String(src.label).trim() === "") {
        errors.push(`${file}: sources[${i}] is missing a descriptive "label"`);
      }
      if (!src.url) {
        errors.push(`${file}: sources[${i}] is missing "url"`);
      } else {
        try {
          const parsedUrl = new URL(String(src.url));
          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            errors.push(`${file}: sources[${i}].url must use http or https (got "${src.url}")`);
          }
        } catch {
          errors.push(`${file}: sources[${i}].url is not a valid URL ("${src.url}")`);
        }
      }
    }
  }

  // 11. Cover image & alt text validation
  if (data.coverImage) {
    const coverPath = String(data.coverImage).trim();
    if (coverPath.startsWith("/")) {
      const fullDiskPath = path.join(publicDir, coverPath.replace(/^\//, ""));
      if (!fs.existsSync(fullDiskPath)) {
        errors.push(`${file}: coverImage "${coverPath}" does not exist in public/ directory`);
      }
    }
    if (!data.coverAlt || String(data.coverAlt).trim() === "") {
      errors.push(`${file}: coverAlt is required when coverImage is specified`);
    }
  }

  // 12. Unicode research markers check (\uE200-\uE20F)
  if (/[\uE200-\uE20F]/.test(raw)) {
    errors.push(
      `${file}: contains raw AI citation unicode artifacts (\\uE200-\\uE20F). Clean them into standard Markdown links.`
    );
  }

  // 13. Article body minimum length
  if (content.trim().length < 400) {
    errors.push(`${file}: article body is too short (${content.trim().length} chars, minimum 400 chars required)`);
  }

  // 14. Heading ID uniqueness
  const headings = content
    .split("\n")
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter(Boolean)
    .map((m) =>
      m[2]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );

  const seenHeadings = new Set();
  for (const h of headings) {
    if (seenHeadings.has(h)) {
      warnings.push(`${file}: duplicate heading anchor ID "#${h}" found in article body`);
    }
    seenHeadings.add(h);
  }

  // 15. Internal links validation: check if [text](/blog/xyz) links point to actual articles
  const internalLinkMatches = content.matchAll(/\[[^\]]+\]\((\/blog\/([a-z0-9-]+))\)/g);
  for (const match of internalLinkMatches) {
    const targetSlug = match[2];
    if (!allKnownSlugs.has(targetSlug)) {
      errors.push(`${file}: broken internal link to nonexistent article "/blog/${targetSlug}"`);
    }
  }
}

if (warnings.length > 0) {
  console.log(`\nContent Warnings (${warnings.length}):`);
  for (const warning of warnings) {
    console.log(`  ⚠ ${warning}`);
  }
}

if (errors.length > 0) {
  console.error(`\nContent Validation Failed (${errors.length} error(s)):`);
  for (const err of errors) {
    console.error(`  ✖ ${err}`);
  }
  process.exit(1);
}

console.log(`\n✔ Content validation passed cleanly for all ${files.length} article(s).`);