import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts, categorySlug, tagSlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { articleJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { TableOfContents } from "@/components/table-of-contents";
import { SourceList } from "@/components/source-list";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;
export async function generateStaticParams() { return getAllPosts().map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const image = absoluteUrl("/og/" + post.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.length ? post.keywords : post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: post.canonicalUrl || "/blog/" + post.slug },
    openGraph: {
      type: "article", title: post.title, description: post.description, url: "/blog/" + post.slug,
      publishedTime: new Date(post.publishedAt).toISOString(), modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      section: post.category, tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.coverAlt || post.title }]
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [image] },
    robots: post.noIndex ? { index: false, follow: false } : {
      index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(post);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Journal", path: "/blog" }, { name: post.title, path: "/blog/" + post.slug }];
  const poster = post.coverImage || "/og/" + post.slug;
  return <article className="article-shell"><div className="shell">
    <Breadcrumbs items={crumbs.map((item) => ({ name: item.name, href: item.path }))} />
    <header className="article-header"><p className="eyebrow">{post.category}</p><h1>{post.title}</h1><p className="article-dek">{post.description}</p><div className="article-meta"><span>{post.author}</span><span className="dot">{post.publishedAt}</span><span className="dot">{post.readingTime}</span><span className="dot">{post.wordCount.toLocaleString()} words</span></div></header>
    <figure className="article-hero"><Image src={poster} alt={post.coverAlt || post.title} width={1200} height={630} priority sizes="(max-width: 1180px) 100vw, 1180px" /></figure>
    <div className="article-layout"><div className="article-main"><Markdown content={post.content} /><SourceList sources={post.sources} /><footer className="article-footer">{post.tags.map((tag) => <Link key={tag} href={"/tag/" + tagSlug(tag)} className="pill">#{tag}</Link>)}<Link href={"/category/" + categorySlug(post.category)} className="pill">{post.category}</Link></footer></div><TableOfContents post={post} /></div>
  </div><section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Keep exploring</p><h2>Related observations.</h2></div></div><div className="post-grid">{related.map((item) => <PostCard key={item.slug} post={item} />)}</div></div></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleJsonLd(post))} /><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} /></article>;
}