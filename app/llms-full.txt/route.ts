import { getAllPosts } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const sections = ["# " + SITE.name, "", SITE.description, "", "Canonical site: " + SITE.url, "", "## Articles"];
  for (const post of getAllPosts()) {
    sections.push("", "### " + post.title, "", "URL: " + absoluteUrl("/blog/" + post.slug), "Category: " + post.category, "Published: " + post.publishedAt, "Author: " + post.author, "", post.content);
  }
  return new Response(sections.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
