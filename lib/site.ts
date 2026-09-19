export const PRIMARY_CANONICAL_DOMAIN = "https://observatory.campusloop.space";
export const SECONDARY_FALLBACK_DOMAIN = "https://sh20raj.github.io/digital-observatory";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const SITE = {
  name: "Digital Observatory",
  shortName: "DO",
  description: "An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  url: process.env.NEXT_PUBLIC_SITE_URL || PRIMARY_CANONICAL_DOMAIN,
  canonicalDomain: PRIMARY_CANONICAL_DOMAIN,
  github: "https://github.com/SH20RAJ/digital-observatory",
  discussions: "https://github.com/SH20RAJ/digital-observatory/discussions",
  locale: "en_US",
  themeColor: "#090b0e"
} as const;

export const NAV_ITEMS = [
  { href: "/blog", label: "Journal" },
  { href: "/topics", label: "Topics" },
  { href: "/about", label: "About" }
] as const;

/**
 * Normalizes a relative or absolute path into a leading-slash path.
 */
function normalizePath(path: string): string {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : "/" + path;
}

/**
 * Returns the configured base path for the active deployment.
 */
export function getBasePath(): string {
  return BASE_PATH;
}

/**
 * Resolves static public assets (icons, images, manifests, feeds) with the configured base path.
 */
export function getAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  return BASE_PATH + normalized;
}

// Backwards-compatible alias
export const assetUrl = getAssetUrl;

/**
 * Resolves absolute URLs against the active deployment domain and base path.
 * Used for deployment-specific operations (e.g. badges, internal redirects).
 */
export function getAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  const origin = new URL(SITE.url).origin;
  return new URL(BASE_PATH + normalized, origin).toString();
}

// Backwards-compatible alias
export const absoluteUrl = getAbsoluteUrl;

/**
 * Generates the canonical URL for search engines and structured data.
 * Always resolves against the primary production domain (https://observatory.campusloop.space)
 * to prevent duplicate content indexing on secondary/fallback deployments.
 */
export function getCanonicalUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  return PRIMARY_CANONICAL_DOMAIN.replace(/\/$/, "") + normalized;
}

// Backwards-compatible alias
export const canonicalUrl = getCanonicalUrl;
