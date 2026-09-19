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
  return {
    "@context":"https://schema.org",
    "@type":"Organization",
    "@id":SITE.url+"#organization",
    name:SITE.name,
    url:SITE.url,
    description:SITE.description,
    logo:{"@type":"ImageObject","url":absoluteUrl("/icon.svg"),"width":512,"height":512},
    sameAs:[SITE.github]
  };
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
    author:{"@type":"Person",name:post.author,jobTitle:post.authorRole,url:absoluteUrl("/author/"+encodeURIComponent(post.author))},
    publisher:{"@type":"Organization","@id":SITE.url+"#organization",name:SITE.name,logo:{"@type":"ImageObject",url:absoluteUrl("/icon.svg")}},
    articleSection:post.category,
    keywords:post.keywords.length?post.keywords.join(", "):post.tags.join(", "),wordCount:post.wordCount,isAccessibleForFree:true,
    ...(post.sources.length?{citation:post.sources.map((source)=>source.url)}:{})
  };
}

export function breadcrumbJsonLd(items:{name:string;path:string}[]) {
  return {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":items.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.name,item:absoluteUrl(item.path)}))};
}

export function collectionJsonLd({name,description,url,posts}:{name:string;description:string;url:string;posts:Post[]}){
  return {
    "@context":"https://schema.org",
    "@type":"CollectionPage",
    name,
    description,
    url:absoluteUrl(url),
    mainEntity:{
      "@type":"ItemList",
      itemListElement:posts.map((post,index)=>({
        "@type":"ListItem",
        position:index+1,
        url:absoluteUrl("/blog/"+post.slug),
        name:post.title
      }))
    }
  };
}

export function profilePageJsonLd({name,role,url,postCount}:{name:string;role:string;url:string;postCount:number}){
  return {
    "@context":"https://schema.org",
    "@type":"ProfilePage",
    mainEntity:{
      "@type":"Person",
      name,
      jobTitle:role,
      description:`${role} at ${SITE.name}. Author of ${postCount} published observation${postCount===1?"":"s"}.`,
      url:absoluteUrl(url),
      worksFor:{"@id":SITE.url+"#organization"}
    }
  };
}

export function aboutPageJsonLd(){
  return {
    "@context":"https://schema.org",
    "@type":"AboutPage",
    name:"About "+SITE.name,
    description:SITE.description,
    url:absoluteUrl("/about"),
    mainEntity:{"@id":SITE.url+"#organization"}
  };
}
