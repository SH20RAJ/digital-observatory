import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchResults } from "@/components/search-results";

export const metadata: Metadata = { title: "Search", description: "Search the Digital Observatory journal.", alternates: { canonical: "/search" }, robots: { index: false, follow: true } };

export default function SearchPage() {
  return <Suspense fallback={<div className="page"><div className="shell"><div className="empty">Loading search…</div></div></div>}><SearchResults /></Suspense>;
}
