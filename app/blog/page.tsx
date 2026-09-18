import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getCategories, categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

export const metadata: Metadata = {
  title: "Journal",
  description: "Research notes, observations, and explained signals from the Digital Observatory.",
  alternates: { canonical: "/blog" }
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  return <div className="page"><div className="shell">
    <div className="page-heading"><p className="eyebrow">The journal</p><h1>Signals, stories, and the machinery behind them.</h1><p>Every article is Markdown, reviewable in Git, enriched with provenance, and rendered as a fast server page.</p></div>
    <SearchForm />
    <div className="filter-row"><Link href="/blog" className="pill">All</Link>{categories.map((category) => <Link key={category} href={"/category/" + categorySlug(category)} className="pill">{category}</Link>)}</div>
    {posts.length ? <div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <div className="empty">No published observations yet.</div>}
  </div></div>;
}