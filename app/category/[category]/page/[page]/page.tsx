import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts,getCategories,categorySlug } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPageCount,getPageItems,getPageNumbers } from "@/lib/pagination";

export const dynamicParams=false;
export function generateStaticParams(){
  const output:{category:string;page:string}[]=[];
  for(const category of getCategories()){
    const posts=getAllPosts().filter(post=>categorySlug(post.category)===categorySlug(category));
    for(const page of getPageNumbers(posts.length))output.push({category:categorySlug(category),page:String(page)});
  }
  return output;
}
export async function generateMetadata({params}:{params:Promise<{category:string;page:string}>}):Promise<Metadata>{
  const {category,page}=await params; const posts=getAllPosts().filter(post=>categorySlug(post.category)===category); const current=Number(page); const total=getPageCount(posts.length);
  if(!posts.length||!Number.isInteger(current)||current<1||current>total)return {};
  const canonical=current===1?"/category/"+category:"/category/"+category+"/page/"+current;
  const title=posts[0].category+" — Page "+current;
  const description="Page "+current+" of the "+posts[0].category+" archive.";
  const image=absoluteUrl("/og/default.svg");
  return {
    title,
    description,
    alternates:{canonical},
    openGraph:{type:"website",title:title+" | "+SITE.name,description,url:absoluteUrl(canonical),images:[{url:image,width:1200,height:630,alt:title}]},
    twitter:{card:"summary_large_image",title:title+" | "+SITE.name,description,images:[image]}
  };
}
export default async function CategoryPageNumber({params}:{params:Promise<{category:string;page:string}>}){
  const {category,page}=await params; const posts=getAllPosts().filter(post=>categorySlug(post.category)===category); const current=Number(page); const total=getPageCount(posts.length);
  if(!posts.length||!Number.isInteger(current)||current<1||current>total)notFound();
  const name=posts[0].category;
  const pageItems=getPageItems(posts,current);
  const crumbs=[{name:"Home",path:"/"},{name:"Categories",path:"/blog"},{name,path:"/category/"+category},{name:"Page "+current,path:"/category/"+category+"/page/"+current}];
  return <div className="page"><div className="shell">
    <Breadcrumbs items={crumbs.map((c)=>({name:c.name,href:c.path}))}/>
    <div className="page-heading"><p className="eyebrow">Observatory category</p><h1>{name} · Page {current}</h1><p>Page {current} of observations filed under {name}.</p></div>
    <div className="post-grid">{pageItems.map(post=><PostCard key={post.slug} post={post}/>)}</div>
    <Pagination currentPage={current} totalPages={total} basePath={"/category/"+category}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collectionJsonLd({name:name+" — Page "+current,description:posts.length+" published observations in "+name,url:"/category/"+category+"/page/"+current,posts:pageItems}))}/>
  </div></div>;
}
