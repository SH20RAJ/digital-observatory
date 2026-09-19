import type { Post } from "./content";
import { resolvePostImage } from "./content";
import { SITE, getCanonicalUrl } from "./site";

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}

export function websiteJsonLd() {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: homeUrl,
    description: SITE.description,
    inLanguage: "en",
    publisher: { "@id": homeUrl + "#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: getCanonicalUrl("/search?q={search_term_string}"),
      "query-input": "required name=search_term_string"
    }
  };
}

export function organizationJsonLd() {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": homeUrl + "#organization",
    name: SITE.name,
    url: homeUrl,
    description: SITE.description,
    logo: {
      "@type": "ImageObject",
      url: getCanonicalUrl("/icon.svg"),
      width: 512,
      height: 512
    },
    sameAs: [SITE.github]
  };
}

/**
 * Returns the fully-qualified canonical URL for the article's hero / social image.
 * Matches resolvePostImage() precisely to guarantee image parity between metadata and JSON-LD.
 */
export function postImageUrl(post: { slug: string; coverImage?: string }): string {
  const relativeImage = resolvePostImage(post);
  return getCanonicalUrl(relativeImage);
}

export function articleJsonLd(post: Post) {
  const image = postImageUrl(post);
  const postUrl = getCanonicalUrl("/blog/" + post.slug);
  const homeUrl = getCanonicalUrl("/");
  const authorUrl = getCanonicalUrl("/author/" + encodeURIComponent(post.author));

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    },
    headline: post.title,
    description: post.description,
    image: [image],
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      url: authorUrl
    },
    publisher: {
      "@type": "Organization",
      "@id": homeUrl + "#organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: getCanonicalUrl("/icon.svg")
      }
    },
    articleSection: post.category,
    keywords: post.keywords.length ? post.keywords.join(", ") : post.tags.join(", "),
    wordCount: post.wordCount,
    isAccessibleForFree: true,
    ...(post.sources.length ? { citation: post.sources.map((source) => source.url) } : {})
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path)
    }))
  };
}

export function collectionJsonLd({
  name,
  description,
  url,
  posts
}: {
  name: string;
  description: string;
  url: string;
  posts: Post[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: getCanonicalUrl(url),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getCanonicalUrl("/blog/" + post.slug),
        name: post.title
      }))
    }
  };
}

export function profilePageJsonLd({
  name,
  role,
  url,
  postCount
}: {
  name: string;
  role: string;
  url: string;
  postCount: number;
}) {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      jobTitle: role,
      description: `${role} at ${SITE.name}. Author of ${postCount} published observation${postCount === 1 ? "" : "s"}.`,
      url: getCanonicalUrl(url),
      worksFor: { "@id": homeUrl + "#organization" }
    }
  };
}

export function aboutPageJsonLd() {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About " + SITE.name,
    description: SITE.description,
    url: getCanonicalUrl("/about"),
    mainEntity: { "@id": homeUrl + "#organization" }
  };
}
