import type { MetadataRoute } from "next";
import { getAllPosts, getCategories, getTags, categorySlug, tagSlug } from "@/lib/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();
  const base = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly" as const, priority: 1 },
    { url: SITE.url + "/blog", lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: SITE.url + "/about", lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 }
  ];
  const postEntries = posts.map((post) => ({ url: SITE.url + "/blog/" + post.slug, lastModified: new Date(post.updatedAt || post.publishedAt), changeFrequency: "monthly" as const, priority: post.featured ? 0.9 : 0.8 }));
  const categoryEntries = getCategories().map((category) => ({ url: SITE.url + "/category/" + categorySlug(category), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }));
  const tagEntries = getTags().map((tag) => ({ url: SITE.url + "/tag/" + tagSlug(tag), lastModified: now, changeFrequency: "weekly" as const, priority: 0.35 }));
  return [...base, ...postEntries, ...categoryEntries, ...tagEntries];
}