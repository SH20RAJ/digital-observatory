import { findPosts, getAllPosts } from "@/lib/content";

export function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const posts = (q ? findPosts(q) : getAllPosts()).map((post) => ({
    slug: post.slug, title: post.title, description: post.description, excerpt: post.excerpt,
    publishedAt: post.publishedAt, updatedAt: post.updatedAt, category: post.category,
    tags: post.tags, author: post.author, readingTime: post.readingTime,
    url: new URL("/blog/" + post.slug, request.url).toString()
  }));
  return Response.json({ count: posts.length, posts }, { headers: { "Cache-Control": "public, max-age=900, s-maxage=900" } });
}