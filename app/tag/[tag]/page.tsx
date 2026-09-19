import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts, getTags, tagSlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPageCount, getPageItems } from "@/lib/pagination";

export async function generateStaticParams() {
  return getTags().map((tag) => ({ tag: tagSlug(tag) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const title = "#" + tag;
  const description = `Digital Observatory research articles tagged #${tag}.`;
  const url = "/tag/" + tag;

  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(url) },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE.name}`,
      description,
      url: getCanonicalUrl(url),
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

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getAllIndexablePosts().filter((post) => post.tags.some((item) => tagSlug(item) === tag));
  if (!posts.length) notFound();

  const pageItems = getPageItems(posts, 1);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: "#" + tag, path: "/tag/" + tag }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">Topic Thread</p>
          <h1>#{tag}</h1>
          <p>
            {posts.length} published observation{posts.length === 1 ? "" : "s"} tracking this thread.
          </p>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath={"/tag/" + tag} />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: "#" + tag,
              description: `${posts.length} observations tagged ${tag}`,
              url: "/tag/" + tag,
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
