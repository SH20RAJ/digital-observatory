import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import type { Post, PostFilterOptions, Source } from "./types.ts";
import { sanitizeMarkdown, makeExcerpt, makeHeadings } from "./markdown.ts";
import {
  categorySlug,
  tagSlug,
  authorSlug,
  extractCategories,
  extractCategoryCounts,
  extractTags,
  extractTagCounts,
  extractAuthors,
  extractAuthorCounts
} from "./taxonomy.ts";

// Re-export core types for seamless backward compatibility
export type {
  Source,
  Heading,
  Post,
  PostFilterOptions,
  SearchResult,
  BreadcrumbItem,
  TaxonomyCount,
  PaginationOptions
} from "./types.ts";

// Re-export markdown utilities
export { sanitizeMarkdown, stripMarkdown, makeExcerpt, makeHeadings } from "./markdown.ts";

// Re-export taxonomy utilities
export {
  slugify,
  categorySlug,
  tagSlug,
  authorSlug,
  extractCategories,
  extractCategoryCounts,
  extractTags,
  extractTagCounts,
  extractAuthors,
  extractAuthorCounts
} from "./taxonomy.ts";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
let cachedPosts: Post[] | null = null;

function normalizeDate(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  return str;
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

/**
 * Resolves the canonical hero and social image path for an article.
 * Guarantees that hero image === OG image === Twitter image === BlogPosting JSON-LD.
 */
export function resolvePostImage(post: { slug: string; coverImage?: string }): string {
  if (post.coverImage && post.coverImage.trim()) {
    return post.coverImage.trim();
  }
  return `/og/${post.slug}.svg`;
}

function parsePost(fileName: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const slug = fileName.replace(/\.(md|mdown|markdown)$/i, "");
  const content = sanitizeMarkdown(parsed.content.trim());
  const stats = readingTime(content);

  const sources: Source[] = Array.isArray(data.sources)
    ? data.sources
        .map((rawSource) => {
          const source = rawSource as Record<string, unknown>;
          return {
            label: String(source.label || ""),
            url: String(source.url || ""),
            note: source.note ? String(source.note) : undefined
          };
        })
        .filter((source) => source.label && source.url)
    : [];

  const publishedAt = normalizeDate(data.publishedAt);
  const updatedAt = normalizeDate(data.updatedAt || data.publishedAt);

  return {
    slug,
    title: String(data.title || slug).trim(),
    description: String(data.description || data.excerpt || "").trim(),
    excerpt: String(data.excerpt || makeExcerpt(content)).slice(0, 320).trim(),
    publishedAt,
    updatedAt: updatedAt || publishedAt,
    status: data.status === "draft" ? "draft" : "published",
    category: String(data.category || "Observatory").trim(),
    tags: normalizeArray(data.tags),
    author: String(data.author || "Digital Observatory").trim(),
    authorRole: String(data.authorRole || "Editorial & Research").trim(),
    featured: Boolean(data.featured),
    coverImage: data.coverImage ? String(data.coverImage).trim() : undefined,
    coverAlt: data.coverAlt ? String(data.coverAlt).trim() : undefined,
    keywords: normalizeArray(data.keywords),
    canonicalUrl: data.canonicalUrl ? String(data.canonicalUrl).trim() : undefined,
    noIndex: Boolean(data.noIndex),
    sources,
    readingTime: stats.text,
    wordCount: stats.words,
    content,
    headings: makeHeadings(content)
  };
}

function getFileNames(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => /\.(md|mdown|markdown)$/i.test(f));
}

/**
 * Loads and caches all posts from content/posts.
 */
export function parseAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts;
  cachedPosts = getFileNames()
    .map(parsePost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.slug.localeCompare(a.slug));
  return cachedPosts;
}

/**
 * Invalidate post cache (primarily for tests).
 */
export function clearPostCache(): void {
  cachedPosts = null;
}

/**
 * Returns all published posts (including noIndex: true) for static route generation.
 * Excludes drafts.
 */
export function getAllPublishedPosts(): Post[] {
  return parseAllPosts().filter((post) => post.status === "published");
}

/**
 * Returns all public, indexable posts.
 * Strictly excludes drafts AND noIndex: true posts.
 * Used for archives, sitemap, RSS, search index, LLMS, categories, tags, and authors.
 */
export function getAllIndexablePosts(): Post[] {
  return parseAllPosts().filter((post) => post.status === "published" && !post.noIndex);
}

/**
 * Primary post retrieval with filter options.
 * Defaults to indexable published posts.
 */
export function getAllPosts(options: PostFilterOptions = {}): Post[] {
  return parseAllPosts().filter((post) => {
    if (!options.includeDrafts && post.status !== "published") return false;
    if (!options.includeNoIndex && post.noIndex) return false;
    return true;
  });
}

/**
 * Retrieves a single post by slug.
 * Returns the published post (whether indexable or noIndex: true).
 * Strictly excludes drafts unless includeDrafts is true.
 */
export function getPostBySlug(slug: string, options: { includeDrafts?: boolean } = {}): Post | null {
  const safeSlug = path.basename(slug);
  const post = parseAllPosts().find((item) => item.slug === safeSlug);
  if (!post) return null;
  if (!options.includeDrafts && post.status !== "published") return null;
  return post;
}

/**
 * Bounded candidate related-posts scoring algorithm.
 * Uses category, shared tags, featured weight, and recency.
 * Does not re-scan or quadratically sort the entire corpus.
 */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const postTagSet = new Set(post.tags);
  const candidates = getAllIndexablePosts().filter((item) => item.slug !== post.slug);

  const scored = candidates
    .map((item) => {
      let score = 0;
      if (item.category === post.category) score += 4;
      for (const tag of item.tags) {
        if (postTagSet.has(tag)) score += 2;
      }
      if (item.featured) score += 1;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.item.publishedAt.localeCompare(a.item.publishedAt));

  if (scored.length >= limit) {
    return scored.slice(0, limit).map((e) => e.item);
  }

  // Fallback to recent indexable posts if score candidates are fewer than limit
  const selectedSlugs = new Set(scored.map((s) => s.item.slug));
  const fallback = candidates
    .filter((c) => !selectedSlugs.has(c.slug))
    .slice(0, limit - scored.length);

  return [...scored.map((e) => e.item), ...fallback];
}

/**
 * Returns sorted unique categories across indexable posts.
 */
export function getCategories(): string[] {
  return extractCategories(getAllIndexablePosts());
}

/**
 * Returns category observation counts across indexable posts.
 */
export function getCategoryCounts(): Map<string, number> {
  return extractCategoryCounts(getAllIndexablePosts());
}

/**
 * Returns sorted unique tags across indexable posts.
 */
export function getTags(): string[] {
  return extractTags(getAllIndexablePosts());
}

/**
 * Returns tag observation counts across indexable posts.
 */
export function getTagCounts(): Map<string, number> {
  return extractTagCounts(getAllIndexablePosts());
}

/**
 * Returns sorted unique authors across indexable posts.
 */
export function getAuthors(): string[] {
  return extractAuthors(getAllIndexablePosts());
}

/**
 * Returns author observation counts across indexable posts.
 */
export function getAuthorCounts(): Map<string, number> {
  return extractAuthorCounts(getAllIndexablePosts());
}

/**
 * Returns all indexable posts published by a specific author.
 */
export function getPostsByAuthor(author: string): Post[] {
  return getAllIndexablePosts().filter((post) => post.author === author);
}

/**
 * Fast search over indexed posts (excludes drafts and noIndex).
 */
export function findPosts(query: string): Post[] {
  const q = query.trim().toLowerCase();
  const posts = getAllIndexablePosts();
  if (!q) return posts;
  return posts.filter((post) =>
    [
      post.title,
      post.description,
      post.excerpt,
      post.category,
      post.author,
      post.tags.join(" "),
      post.keywords.join(" ")
    ]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
