"use client";

import { usePathname } from "next/navigation";

const BADGE_ORIGIN = "https://api.visitorbadge.io/api/combined";
const STATUS_ORIGIN = "https://visitorbadge.io/status";

export function VisitorCounter() {
  const pathname = usePathname() || "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pagePath = pathname.startsWith(basePath) ? pathname : basePath + pathname;
  const pageUrl = "https://sh20raj.github.io" + (pagePath || "/");
  const encodedPath = encodeURIComponent(pageUrl);
  const badgeUrl = BADGE_ORIGIN + "?path=" + encodedPath + "&countColor=%23263759&style=flat";
  const statusUrl = STATUS_ORIGIN + "?path=" + encodedPath;

  return (
    <a href={statusUrl} target="_blank" rel="noopener noreferrer" className="visitor-counter" aria-label="Page visitor counter">
      <img src={badgeUrl} alt="Visitors" loading="lazy" width={90} height={20} />
    </a>
  );
}
