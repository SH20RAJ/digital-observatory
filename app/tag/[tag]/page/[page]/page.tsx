import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts, getTags, tagSlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPageCount, getPageItems, getPageNumbers } from "@/lib/pagination";

export const dynamicParams = false;

export function generateStaticParams() {
  const output: { tag: string; page: string }[] = [];
  for (const tag of getTags()) {
    const posts = getAllIndexablePosts().filter((post) =>
      post.tags.some((item) => tagSlug(item) === tagSlug(tag))
    );
    for (const page of getPageNumbers(posts.length)) {
      output.push({ tag: tagSlug(tag), page: String(page) });
    }
  }
  return output;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ tag: string; page: string }>;
}): Promise<Metadata> {
  const { tag, page } = await params;
  const posts = getAllIndexablePosts().filter((post) =>
    post.tags.some((item) => tagSlug(item) === tag)
  );
  const current = Number(page);
  const total = getPageCount(posts.length);
  if (!posts.length || !Number.isInteger(current) || current < 1 || current > total) return {};

  const path = current === 1 ? "/tag/" + tag : "/tag/" + tag + "/page/" + current;
  const canonical = getCanonicalUrl(path);
  const title = `#${tag} — Page ${current}`;
  const description = `Page ${current} of the #${tag} tag archive.`;

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

export default async function TagPageNumber({
  params
}: {
  params: Promise<{ tag: string; page: string }>;
}) {
  const { tag, page } = await params;
  const posts = getAllIndexablePosts().filter((post) =>
    post.tags.some((item) => tagSlug(item) === tag)
  );
  const current = Number(page);
  const total = getPageCount(posts.length);
  if (!posts.length || !Number.isInteger(current) || current < 1 || current > total) notFound();

  const pageItems = getPageItems(posts, current);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: "#" + tag, path: "/tag/" + tag },
    { name: "Page " + current, path: "/tag/" + tag + "/page/" + current }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">Tag Thread Archive</p>
          <h1>
            #{tag} · Page {current}
          </h1>
          <p>Page {current} of observations tagged #{tag}.</p>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={current} totalPages={total} basePath={"/tag/" + tag} />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: `#${tag} — Page ${current}`,
              description: `${posts.length} published observations tagged ${tag}`,
              url: "/tag/" + tag + "/page/" + current,
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
