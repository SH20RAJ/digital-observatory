import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts, getCategories, categorySlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { buildPageMetadata, jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPageCount, getPageItems } from "@/lib/pagination";

export async function generateStaticParams() {
  return getCategories().map((category) => ({ category: categorySlug(category) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const post = getAllIndexablePosts().find((item) => categorySlug(item.category) === category);
  if (!post) return {};

  const title = post.category;
  const description = `Digital Observatory research observations filed under ${post.category}.`;
  const url = "/category/" + category;

  const matchingPosts = getAllIndexablePosts().filter((item) => categorySlug(item.category) === category);
  const tags = [...new Set(matchingPosts.flatMap((item) => item.tags))].slice(0, 10);
  return buildPageMetadata({
    title: title + ": Research Guides & Observations",
    description:
      `Explore ${matchingPosts.length} source-backed Digital Observatory articles and field guides about ${title}, including its latest concepts, systems, and practical context.`,
    path: url,
    keywords: [title, title + " guides", title + " research", ...tags],
    section: title
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getAllIndexablePosts().filter((post) => categorySlug(post.category) === category);
  if (!posts.length) notFound();

  const name = posts[0].category;
  const pageItems = getPageItems(posts, 1);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name, path: "/category/" + category }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">Research Domain</p>
          <h1>{name}</h1>
          <p>
            {posts.length} published observation{posts.length === 1 ? "" : "s"} collected under this domain with
            verified sources.
          </p>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath={"/category/" + category} />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name,
              description: `${posts.length} observations in ${name}`,
              url: "/category/" + category,
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
