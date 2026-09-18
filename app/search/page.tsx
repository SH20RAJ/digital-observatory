import type { Metadata } from "next";
import { findPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

export const metadata: Metadata = { title: "Search", description: "Search the Digital Observatory journal.", alternates: { canonical: "/search" }, robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const posts = findPosts(q);
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Search</p><h1>Find an observation.</h1><p>{q ? "Showing results for “" + q + "”." : "Search across titles, context, tags, and full text."}</p></div><SearchForm defaultValue={q} />{posts.length ? <div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <div className="empty">No matches. Try a broader term.</div>}</div></div>;
}