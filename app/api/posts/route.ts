import { getAllPosts } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.category,
    tags: post.tags,
    author: post.author,
    readingTime: post.readingTime,
    url: "/blog/" + post.slug
  }));
  return Response.json({ count: posts.length, posts });
}
