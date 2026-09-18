import { getAllPosts } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";

export function GET() {
  const lines = ["# " + SITE.name, "", "> " + SITE.description, "", "## Canonical pages", "", "- Home: " + SITE.url, "- Journal: " + absoluteUrl("/blog"), "- About: " + absoluteUrl("/about"), "- RSS: " + absoluteUrl("/feed.xml"), "- Full index: " + absoluteUrl("/llms-full.txt"), "", "## Articles", ""];
  for (const post of getAllPosts()) lines.push("- [" + post.title + "](" + absoluteUrl("/blog/" + post.slug) + ") — " + post.description.replace(/\n/g," ") + " — category: " + post.category);
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=1800, s-maxage=1800" } });
}