import { getPostBySlug } from "@/lib/content";

export const dynamic = "force-static";

export async function GET(_request: never, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ slug: post.slug, title: post.title, description: post.description, publishedAt: post.publishedAt, updatedAt: post.updatedAt, category: post.category, tags: post.tags, author: post.author, readingTime: post.readingTime, wordCount: post.wordCount, sources: post.sources, content: post.content });
}
