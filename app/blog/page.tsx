import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts,getCategories,categorySlug } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems } from "@/lib/pagination";

const title = "Journal";
const description = "Research notes, observations, and explained signals from the Digital Observatory.";
const url = "/blog";
const image = absoluteUrl("/og/default.svg");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url, types: { "application/rss+xml": absoluteUrl("/feed.xml") } },
  openGraph: { type: "website", title: title + " | " + SITE.name, description, url: absoluteUrl(url), images: [{ url: image, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title: title + " | " + SITE.name, description, images: [image] }
};

export default function BlogPage(){
  const posts=getAllPosts();
  const categories=getCategories();
  const pageItems=getPageItems(posts,1);
  const crumbs=[{name:"Home",path:"/"},{name:"Journal",path:"/blog"}];

  return <div className="page"><div className="shell">
    <div className="page-heading"><p className="eyebrow">The journal</p><h1>Signals, stories, and the machinery behind them.</h1><p>{posts.length} published observations, reviewable in Git and enriched with source provenance.</p></div>
    <SearchForm/>
    <div className="filter-row"><Link href="/blog" className="pill">All</Link>{categories.map(category=><Link key={category} href={"/category/"+categorySlug(category)} className="pill">{category}</Link>)}</div>
    <div className="post-grid">{pageItems.map(post=><PostCard key={post.slug} post={post}/>)}</div>
    <Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath="/blog"/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collectionJsonLd({name:"Digital Observatory Journal",description:posts.length+" published observations",url:"/blog",posts:pageItems}))}/>
  </div></div>;
}
