import { getAllPosts } from "@/lib/content";
import { absoluteUrl, SITE } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
}

export function GET() {
  const items = getAllPosts().slice(0,30).map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl("/blog/" + post.slug)}</link>
      <guid isPermaLink="true">${absoluteUrl("/blog/" + post.slug)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${escapeXml(SITE.name)}</title>
<link>${SITE.url}</link>
<description>${escapeXml(SITE.description)}</description>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
