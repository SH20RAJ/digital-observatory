import type { Post } from "./content";
import { SITE, absoluteUrl } from "./site";

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\u003c") };
}

export function websiteJsonLd() {
  return {
    "@context":"https://schema.org","@type":"WebSite",name:SITE.name,url:SITE.url,description:SITE.description,inLanguage:"en",
    publisher:{"@id":SITE.url+"#organization"},
    potentialAction:{"@type":"SearchAction",target:absoluteUrl("/search?q={search_term_string}"),"query-input":"required name=search_term_string"}
  };
}

export function organizationJsonLd() {
  return {"@context":"https://schema.org","@type":"Organization","@id":SITE.url+"#organization",name:SITE.name,url:SITE.url,description:SITE.description,sameAs:[SITE.github]};
}

export function postImageUrl(post: Post) {
  return absoluteUrl(post.coverImage || "/og/" + post.slug + ".svg");
}

export function articleJsonLd(post: Post) {
  const image=postImageUrl(post);
  return {
    "@context":"https://schema.org","@type":"BlogPosting",
    mainEntityOfPage:{"@type":"WebPage","@id":absoluteUrl("/blog/"+post.slug)},
    headline:post.title,description:post.description,image:[image],
    datePublished:new Date(post.publishedAt).toISOString(),dateModified:new Date(post.updatedAt||post.publishedAt).toISOString(),
    author:{"@type":"Person",name:post.author,jobTitle:post.authorRole,url:SITE.url+"/author/"+encodeURIComponent(post.author)},
    publisher:{"@id":SITE.url+"#organization"},articleSection:post.category,
    keywords:post.keywords.length?post.keywords.join(", "):post.tags.join(", "),wordCount:post.wordCount,isAccessibleForFree:true,
    ...(post.sources.length?{citation:post.sources.map((source)=>source.url)}:{})
  };
}

export function breadcrumbJsonLd(items:{name:string;path:string}[]) {
  return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.name,item:absoluteUrl(item.path)}))};
}
