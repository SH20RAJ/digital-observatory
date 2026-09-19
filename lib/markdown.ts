import type { Heading } from "./types.ts";
import { slugify } from "./taxonomy.ts";

/**
 * Strips raw research markers or unicode sequences (\uE200-\uE20F) into clean Markdown.
 */
export function sanitizeMarkdown(value: string): string {
  if (!value) return "";
  return value
    .replace(/[\uE200-\uE20F]url[\uE200-\uE20F]([^\uE200-\uE20F]*?)[\uE200-\uE20F]([^\uE200-\uE20F]*?)[\uE200-\uE20F]/g, "[$1]($2)")
    .replace(/[\uE200-\uE20F]cite[\uE200-\uE20F][^\uE200-\uE20F]*?[\uE200-\uE20F]/g, "")
    .replace(/[\uE200-\uE20F]/g, "");
}

/**
 * Strips markdown markup to generate clean plain text.
 */
export function stripMarkdown(value: string): string {
  return value
    .replace(/`{3}[\s\S]*?`{3}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts a readable excerpt from the markdown content.
 */
export function makeExcerpt(content: string, maxChars = 320): string {
  const paragraphs = content.split(/\n\s*\n/).map(stripMarkdown).filter(Boolean);
  const candidate = paragraphs.find((x) => x.length > 80) || paragraphs[0] || "";
  if (candidate.length <= maxChars) return candidate;
  return candidate.slice(0, maxChars).trim() + "…";
}

/**
 * Extracts table of contents headings (h2 and h3) from markdown.
 */
export function makeHeadings(content: string): Heading[] {
  return content
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (!match) return null;
      const text = match[2].replace(/[*_]/g, "").trim();
      return { id: slugify(text), text, depth: match[1].length };
    })
    .filter((x): x is Heading => Boolean(x));
}
