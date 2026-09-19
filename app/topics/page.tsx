import type { Metadata } from "next";
import Link from "next/link";
import {
  getCategories,
  categorySlug,
  getTags,
  tagSlug,
  getCategoryCounts,
  getTagCounts,
  getAllIndexablePosts
} from "@/lib/content";
import { SITE, getCanonicalUrl, getAssetUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

const title = "Topics & Research Domains";
const description = "Explore the Digital Observatory topic directory across artificial intelligence, open source, developer systems, security, internet infrastructure, and digital policy.";
const url = "/topics";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    title: title + " | " + SITE.name,
    description,
    url: getCanonicalUrl(url),
    images: [{ url: getCanonicalUrl("/og/default.svg"), width: 1200, height: 630, alt: title }]
  },
  twitter: {
    card: "summary_large_image",
    title: title + " | " + SITE.name,
    description,
    images: [getCanonicalUrl("/og/default.svg")]
  }
};

export default function TopicsPage() {
  const categories = getCategories();
  const tags = getTags();
  const categoryCounts = getCategoryCounts();
  const tagCounts = getTagCounts();
  const totalPosts = getAllIndexablePosts().length;

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">Taxonomy &amp; Lenses</p>
          <h1>Topics &amp; Research Domains</h1>
          <p>
            The Observatory tracks signals across {categories.length} research categories and {tags.length} topic
            threads, spanning {totalPosts} published observations with verified provenance.
          </p>
        </div>

        <section className="section" aria-labelledby="categories-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Domains</p>
              <h2 id="categories-heading">Research Categories</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const slug = categorySlug(category);
              const count = categoryCounts.get(slug) || 0;
              return (
                <Link key={category} className="category-tile" href={"/category/" + slug}>
                  <div className="category-tile-content">
                    <span className="category-tile-title">{category}</span>
                    <span className="category-tile-count">
                      {count} observation{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <span className="category-tile-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section" aria-labelledby="tags-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Threads</p>
              <h2 id="tags-heading">Topic Tags</h2>
            </div>
          </div>
          <div className="topics-tag-cloud">
            {tags.map((tag) => {
              const slug = tagSlug(tag);
              const count = tagCounts.get(slug) || 0;
              return (
                <Link key={tag} href={"/tag/" + slug} className="pill topic-tag-pill">
                  <span className="topic-tag-hash">#</span>
                  <span className="topic-tag-name">{tag}</span>
                  <span className="topic-tag-badge">{count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
      </div>
    </div>
  );
}
