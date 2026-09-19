import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPublishedPosts,
  getPostBySlug,
  getRelatedPosts,
  categorySlug,
  tagSlug,
  resolvePostImage
} from "@/lib/content";
import { getCanonicalUrl, getAssetUrl } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, buildPageMetadata, postImageUrl, jsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { TableOfContents } from "@/components/table-of-contents";
import { SourceList } from "@/components/source-list";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const image = postImageUrl(post);
  const articleUrl = getCanonicalUrl("/blog/" + post.slug);

  return {
    ...buildPageMetadata({
      title: post.title,
      description: post.description,
      path: articleUrl,
      keywords: post.keywords.length ? post.keywords : post.tags,
      image,
      imageAlt: post.coverAlt || post.title,
      type: "article",
      noIndex: post.noIndex,
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      section: post.category,
      tags: post.tags,
      authors: [
        {
          name: post.author,
          url: getCanonicalUrl("/author/" + encodeURIComponent(post.author))
        }
      ]
    }),
    alternates: {
      canonical: post.canonicalUrl || articleUrl
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: post.category, path: "/category/" + categorySlug(post.category) },
    { name: post.title, path: "/blog/" + post.slug }
  ];

  const poster = getAssetUrl(resolvePostImage(post));

  return (
    <article className="article-shell">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((item) => ({ name: item.name, href: item.path }))} />

        <header className="article-header">
          <div className="article-category-line">
            <Link href={"/category/" + categorySlug(post.category)} className="eyebrow article-eyebrow-link">
              {post.category}
            </Link>
            {post.noIndex ? (
              <span className="unlisted-badge" title="This observation is unlisted from public archives">
                Unlisted
              </span>
            ) : null}
          </div>
          <h1>{post.title}</h1>
          <p className="article-dek">{post.description}</p>
          <div className="article-meta">
            <Link href={"/author/" + encodeURIComponent(post.author)} className="article-author-link">
              {post.author}
            </Link>
            <span className="dot">{post.authorRole}</span>
            <span className="dot">{post.publishedAt}</span>
            <span className="dot">{post.readingTime}</span>
            <span className="dot">{post.wordCount.toLocaleString()} words</span>
          </div>
        </header>

        <figure className="article-hero">
          <Image
            src={poster}
            alt={post.coverAlt || post.title}
            width={1200}
            height={630}
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
          />
        </figure>

        <div className="article-layout">
          <div className="article-main">
            <Markdown content={post.content} />
            <SourceList sources={post.sources} />
            <footer className="article-footer">
              <div className="article-footer-tags">
                <span className="article-footer-label">Topics:</span>
                {post.tags.map((tag) => (
                  <Link key={tag} href={"/tag/" + tagSlug(tag)} className="pill">
                    #{tag}
                  </Link>
                ))}
                <Link href={"/category/" + categorySlug(post.category)} className="pill pill-category">
                  {post.category}
                </Link>
              </div>
            </footer>
          </div>

          <TableOfContents post={post} />
        </div>
      </div>

      {related.length ? (
        <section className="section" aria-labelledby="related-heading">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Keep Exploring</p>
                <h2 id="related-heading">Related observations.</h2>
              </div>
              <Link href="/blog" className="link-arrow">
                View journal →
              </Link>
            </div>
            <div className="post-grid">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd(post))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
    </article>
  );
}
