export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const SITE = {
  name: "Digital Observatory",
  shortName: "DO",
  description: "An open-source digital observatory for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://observatory.campusloop.space",
  github: "https://github.com/SH20RAJ/digital-observatory",
  discussions: "https://github.com/SH20RAJ/digital-observatory/discussions",
  locale: "en_US",
  themeColor: "#0a0a0a"
} as const;

export const NAV_ITEMS = [
  { href: "/blog", label: "Journal" },
  { href: "/category/ai", label: "AI" },
  { href: "/category/open-source", label: "Open Source" },
  { href: "/category/internet", label: "Internet" },
  { href: "/category/security", label: "Security" },
  { href: "/about", label: "About" }
] as const;

export function assetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : "/" + path;
  return BASE_PATH + normalized;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : "/" + path;
  return new URL(BASE_PATH + normalized, new URL(SITE.url).origin).toString();
}
