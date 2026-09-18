import { getAllPosts } from "@/lib/content";

export function GET() {
  return Response.json({ ok: true, service: "digital-observatory", publishedPosts: getAllPosts().length, generatedAt: new Date().toISOString() });
}