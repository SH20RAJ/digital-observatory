import type { Post } from "./types.ts";

/**
 * Normalizes text into a clean, URL-safe slug.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Returns canonical slug for a category.
 */
export function categorySlug(category: string): string {
  return slugify(category);
}

/**
 * Returns canonical slug for a tag.
 */
export function tagSlug(tag: string): string {
  return slugify(tag);
}

/**
 * Returns URI-encoded slug for an author.
 */
export function authorSlug(author: string): string {
  return encodeURIComponent(author);
}

/**
 * Extracts sorted, unique categories from a list of posts.
 */
export function extractCategories(posts: Post[]): string[] {
  return [...new Set(posts.map((post) => post.category))].sort();
}

/**
 * Computes category post observation counts.
 */
export function extractCategoryCounts(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of posts) {
    const slug = categorySlug(post.category);
    map.set(slug, (map.get(slug) || 0) + 1);
  }
  return map;
}

/**
 * Extracts sorted, unique tags from a list of posts.
 */
export function extractTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

/**
 * Computes tag observation counts.
 */
export function extractTagCounts(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      map.set(slug, (map.get(slug) || 0) + 1);
    }
  }
  return map;
}

/**
 * Extracts sorted, unique authors from a list of posts.
 */
export function extractAuthors(posts: Post[]): string[] {
  return [...new Set(posts.map((post) => post.author))].sort();
}

/**
 * Computes author observation counts.
 */
export function extractAuthorCounts(posts: Post[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const post of posts) {
    const slug = authorSlug(post.author);
    map.set(slug, (map.get(slug) || 0) + 1);
  }
  return map;
}
