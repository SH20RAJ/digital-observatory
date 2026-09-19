import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts, getCategories, categorySlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { buildPageMetadata, jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPageCount, getPageItems, getPageNumbers } from "@/lib/pagination";

export const dynamicParams = false;

export function generateStaticParams() {
  const output: { category: string; page: string }[] = [];
  for (const category of getCategories()) {
    const posts = getAllIndexablePosts().filter(
      (post) => categorySlug(post.category) === categorySlug(category)
    );
    for (const page of getPageNumbers(posts.length)) {
      output.push({ category: categorySlug(category), page: String(page) });
    }
  }
  return output;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page } = await params;
  const posts = getAllIndexablePosts().filter((post) => categorySlug(post.category) === category);
  const current = Number(page);
  const total = getPageCount(posts.length);
  if (!posts.length || !Number.isInteger(current) || current < 1 || current > total) return {};

  const path = current === 1 ? "/category/" + category : "/category/" + category + "/page/" + current;
  const canonical = getCanonicalUrl(path);
  const title = `${posts[0].category} — Page ${current}`;
  const description = `Page ${current} of the ${posts[0].category} research archive.`;

  return buildPageMetadata({
    title,
    description,
    path,
    keywords: [posts[0].category, posts[0].category + " research archive", "Digital Observatory"],
    section: posts[0].category
  });
}

export default async function CategoryPageNumber({
  params
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;
  const posts = getAllIndexablePosts().filter((post) => categorySlug(post.category) === category);
  const current = Number(page);
  const total = getPageCount(posts.length);
  if (!posts.length || !Number.isInteger(current) || current < 1 || current > total) notFound();

  const name = posts[0].category;
  const pageItems = getPageItems(posts, current);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name, path: "/category/" + category },
    { name: "Page " + current, path: "/category/" + category + "/page/" + current }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">Observatory Domain</p>
          <h1>
            {name} · Page {current}
          </h1>
          <p>Page {current} of research observations filed under {name}.</p>
        </div>

        <div className="post-grid">
          {pageItems.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        <Pagination currentPage={current} totalPages={total} basePath={"/category/" + category} />

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: `${name} — Page ${current}`,
              description: `${posts.length} published observations in ${name}`,
              url: "/category/" + category + "/page/" + current,
              posts: pageItems
            })
          )}
        />
      </div>
    </div>
  );
}
