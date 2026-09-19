import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { buildPageMetadata, jsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Digital Observatory",
  description: "Search Digital Observatory articles by topic, entity, source, technical concept, and date.",
  path: "/search",
  keywords: ["Digital Observatory search", "technology research search", "technical articles"],
  noIndex: true
});

export default function SearchPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="page">
            <div className="shell">
              <div className="empty">Loading search…</div>
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            name: "Search Digital Observatory",
            description: "Search the Digital Observatory research corpus.",
            url: "/search",
            type: "SearchResultsPage"
          })
        )}
      />
    </>
  );
}
