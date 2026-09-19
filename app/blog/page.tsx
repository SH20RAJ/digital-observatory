import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts,getCategories,categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems } from "@/lib/pagination";

export const metadata:Metadata={title:"Journal",description:"Research notes, observations, and explained signals from the Digital Observatory.",alternates:{canonical:"/blog",types:{"application/rss+xml":"/feed.xml"}}};

export default function BlogPage(){
  const posts=getAllPosts();
  const categories=getCategories();
  return <div className="page"><div className="shell">
    <div className="page-heading"><p className="eyebrow">The journal</p><h1>Signals, stories, and the machinery behind them.</h1><p>{posts.length} published observations, reviewable in Git and enriched with source provenance.</p></div>
    <SearchForm/>
    <div className="filter-row"><Link href="/blog" className="pill">All</Link>{categories.map(category=><Link key={category} href={"/category/"+categorySlug(category)} className="pill">{category}</Link>)}</div>
    <div className="post-grid">{getPageItems(posts,1).map(post=><PostCard key={post.slug} post={post}/>)}</div>
    <Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath="/blog"/>
  </div></div>;
}
