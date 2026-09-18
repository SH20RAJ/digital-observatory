"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

type SearchPost = { slug:string; title:string; description:string; excerpt:string; publishedAt:string; category:string; tags:string[]; author:string; readingTime:string };

export function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    fetch(basePath + "/api/posts").then((r) => r.json()).then((data) => setPosts(data.posts || [])).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => [post.title, post.description, post.excerpt, post.category, post.author, ...post.tags].join(" ").toLowerCase().includes(query));
  }, [posts, q]);

  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Search</p><h1>Find an observation.</h1><p>{q ? "Showing results for “" + q + "”." : "Search across titles, context, tags, and authors."}</p></div><SearchForm defaultValue={q} />{loading ? <div className="empty">Loading the index…</div> : results.length ? <div className="post-grid">{results.map((post) => <PostCard key={post.slug} post={post as never} />)}</div> : <div className="empty">No matches. Try a broader term.</div>}</div></div>;
}
