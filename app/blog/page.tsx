import type { Metadata } from "next";
import Link from "next/link";
import { getAllIndexablePosts, getCategories, categorySlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { buildPageMetadata, jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";
import { getPageCount, getPageItems } from "@/lib/pagination";

const title = "Research Journal: Technology, AI & Digital Systems";
const description =
  "Browse Digital Observatory's source-backed research journal covering computer science, AI, software engineering, cybersecurity, open source, infrastructure, finance, and digital culture.";
const url = "/blog";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: url,
  keywords: [
    "technology research journal",
    "AI research",
    "computer science articles",
    "software engineering guides",
    "cybersecurity research",
    "open source research",
    "digital systems"
  ],
  feed: true
});

export default function BlogPage() {
  const posts = getAllIndexablePosts();
  const categories = getCategories();
  const pageItems = getPageItems(posts, 1);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" }
  ];

  return (
    <div className="page">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">The Research Journal</p>
          <h1>Signals, stories, and the machinery behind them.</h1>
          <p>
            {posts.length} verified observations, reviewable in Git and enriched with primary source provenance.
          </p>
        </div>

        <SearchForm />

        <div className="filter-row" aria-label="Category filters">
          <Link href="/blog" className="pill pill-active">
            All ({posts.length})
          </Link>
          {categories.slice(0, 8).map((category) => (
            <Link key={category} href={"/category/" + categorySlug(category)} className="pill">
              {category}
            </Link>
          ))}
          <Link href="/topics" className="pill">
            All Domains →
          </Link>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath="/blog" />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: "Digital Observatory Journal",
              description: `${posts.length} published observations`,
              url: "/blog",
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
