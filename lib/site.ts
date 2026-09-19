export const PRIMARY_CANONICAL_DOMAIN = "https://observatory.campusloop.space";
export const SECONDARY_FALLBACK_DOMAIN = "https://sh20raj.github.io/digital-observatory";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const SITE = {
  name: "Digital Observatory",
  shortName: "DO",
  description:
    "Digital Observatory is an open-source research journal and student field guide covering computer science, AI, web development, data, cybersecurity, open source, cloud systems, finance, and digital culture.",
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

function normalizePath(path: string): string {
  if (!path) return "/";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : "/" + path;
}

export function getBasePath(): string {
  return BASE_PATH;
}

export function getAssetUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  return BASE_PATH + normalized;
}

export const assetUrl = getAssetUrl;

export function getAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  const origin = new URL(SITE.url).origin;
  return new URL(BASE_PATH + normalized, origin).toString();
}

export const absoluteUrl = getAbsoluteUrl;

export function getCanonicalUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePath(path);
  return PRIMARY_CANONICAL_DOMAIN.replace(/\/$/, "") + normalized;
}

export const canonicalUrl = getCanonicalUrl;
