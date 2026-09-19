import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPageCount, getPageItems, getPageNumbers } from "@/lib/pagination";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPageNumbers(getAllIndexablePosts().length).map((page) => ({ page: String(page) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const current = Number(page);
  const total = getPageCount(getAllIndexablePosts().length);
  if (!Number.isInteger(current) || current < 1 || current > total) return {};

  const path = current === 1 ? "/blog" : "/blog/page/" + current;
  const canonical = getCanonicalUrl(path);
  const title = "Research Journal — Page " + current;
  const description = "Page " + current + " of the Digital Observatory research journal archive.";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE.name}`,
      description,
      url: canonical,
      images: [{ url: getCanonicalUrl("/og/default.svg"), width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [getCanonicalUrl("/og/default.svg")]
    }
  };
}

export default async function BlogPageNumber({
  params
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const current = Number(page);
  const posts = getAllIndexablePosts();
  const total = getPageCount(posts.length);
  if (!Number.isInteger(current) || current < 1 || current > total) notFound();

  const pageItems = getPageItems(posts, current);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: "Page " + current, path: "/blog/page/" + current }
  ];

  return (
    <div className="page">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">Journal Archive</p>
          <h1>Page {current}</h1>
          <p>Historical Digital Observatory observations, preserved in stable crawlable archives.</p>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={current} totalPages={total} basePath="/blog" />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: `Digital Observatory Journal — Page ${current}`,
              description: `Page ${current} of journal observations`,
              url: "/blog/page/" + current,
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
