import type { Metadata } from "next";
import type { Post, BreadcrumbItem } from "./types.ts";
import { resolvePostImage } from "./content.ts";
import { SITE, getCanonicalUrl } from "./site.ts";

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}

export function websiteJsonLd() {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": homeUrl + "#website",
    name: SITE.name,
    alternateName: "DO",
    url: homeUrl,
    description: SITE.description,
    inLanguage: "en-US",
    publisher: { "@id": homeUrl + "#organization" },
    about: [
      { "@type": "Thing", name: "Computer Science" },
      { "@type": "Thing", name: "Artificial Intelligence" },
      { "@type": "Thing", name: "Web Development" },
      { "@type": "Thing", name: "Cybersecurity" },
      { "@type": "Thing", name: "Open Source" },
      { "@type": "Thing", name: "Digital Systems" }
    ],
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
    alternateName: "DO",
    url: homeUrl,
    description: SITE.description,
    inLanguage: "en-US",
    logo: {
      "@type": "ImageObject",
      url: getCanonicalUrl("/icon.svg"),
      width: 512,
      height: 512
    },
    sameAs: [SITE.github],
    knowsAbout: [
      "Computer Science",
      "Artificial Intelligence",
      "Web Development",
      "Backend Engineering",
      "Data Engineering",
      "Cybersecurity",
      "Open Source",
      "Cloud Computing",
      "Digital Policy"
    ],
    publishingPrinciples: getCanonicalUrl("/about")
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
    "@id": postUrl + "#article",
    url: postUrl,
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    },
    isPartOf: { "@id": homeUrl + "#website" },
    headline: post.title,
    description: post.description,
    image: [
      image,
      {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
        caption: post.coverAlt || post.title
      }
    ],
    thumbnailUrl: image,
    dateCreated: new Date(post.publishedAt).toISOString(),
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-header h1", ".article-dek", ".article-main > p:first-of-type"]
    },
    author: {
      "@type": "Person",
      "@id": authorUrl + "#person",
      name: post.author,
      jobTitle: post.authorRole,
      url: authorUrl,
      worksFor: { "@id": homeUrl + "#organization" }
    },
    publisher: {
      "@type": "Organization",
      "@id": homeUrl + "#organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: getCanonicalUrl("/icon.svg"),
        width: 512,
        height: 512
      }
    },
    articleSection: post.category,
    keywords: post.keywords.length ? post.keywords.join(", ") : post.tags.join(", "),
    wordCount: post.wordCount,
    isAccessibleForFree: true,
    about: [{ "@type": "Thing", name: post.category }],
    ...(post.tags.length ? { mentions: post.tags.map((tag) => ({ "@type": "Thing", name: tag })) } : {}),
    ...(post.sources.length ? { citation: post.sources.map((source) => source.url) } : {})
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
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
  const pageUrl = getCanonicalUrl(url);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl + "#webpage",
    name,
    description,
    inLanguage: "en-US",
    url: pageUrl,
    isPartOf: { "@id": getCanonicalUrl("/") + "#website" },
    publisher: { "@id": getCanonicalUrl("/") + "#organization" },
    mainEntity: {
      "@type": "ItemList",
      name,
      numberOfItems: posts.length,
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
  postCount,
  posts = []
}: {
  name: string;
  role: string;
  url: string;
  postCount: number;
  posts?: Post[];
}) {
  const homeUrl = getCanonicalUrl("/");
  const profileUrl = getCanonicalUrl(url);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": profileUrl + "#profile",
    inLanguage: "en-US",
    url: profileUrl,
    name: name + " — " + SITE.name,
    isPartOf: { "@id": homeUrl + "#website" },
    mainEntity: {
      "@type": "Person",
      "@id": profileUrl + "#person",
      name,
      jobTitle: role,
      description: role + " at " + SITE.name + ". Author of " + postCount + " published observation" + (postCount === 1 ? "" : "s") + ".",
      url: profileUrl,
      worksFor: { "@id": homeUrl + "#organization" }
    },
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": getCanonicalUrl("/blog/" + post.slug) + "#article",
      headline: post.title,
      url: getCanonicalUrl("/blog/" + post.slug)
    }))
  };
}

export function aboutPageJsonLd() {
  const homeUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": getCanonicalUrl("/about") + "#webpage",
    name: "About " + SITE.name,
    description: SITE.description,
    inLanguage: "en-US",
    url: getCanonicalUrl("/about"),
    isPartOf: { "@id": homeUrl + "#website" },
    publisher: { "@id": homeUrl + "#organization" },
    mainEntity: { "@id": homeUrl + "#organization" }
  };
}
