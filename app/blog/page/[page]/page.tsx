import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems,getPageNumbers } from "@/lib/pagination";

export const dynamicParams=false;
export function generateStaticParams(){return getPageNumbers(getAllPosts().length).map(page=>({page:String(page)}));}
export async function generateMetadata({params}:{params:Promise<{page:string}>}):Promise<Metadata>{
  const {page}=await params; const current=Number(page); const total=getPageCount(getAllPosts().length);
  if(!Number.isInteger(current)||current<1||current>total)return {};
  const canonical=current===1?"/blog":"/blog/page/"+current;
  const title="Journal — Page "+current;
  const description="Page "+current+" of the Digital Observatory journal archive.";
  const image=absoluteUrl("/og/default.svg");
  return {
    title,
    description,
    alternates:{canonical},
    openGraph:{type:"website",title:title+" | "+SITE.name,description,url:absoluteUrl(canonical),images:[{url:image,width:1200,height:630,alt:title}]},
    twitter:{card:"summary_large_image",title:title+" | "+SITE.name,description,images:[image]}
  };
}
export default async function BlogPageNumber({params}:{params:Promise<{page:string}>}){
  const {page}=await params; const current=Number(page); const posts=getAllPosts(); const total=getPageCount(posts.length);
  if(!Number.isInteger(current)||current<1||current>total)notFound();
  const pageItems=getPageItems(posts,current);
  const crumbs=[{name:"Home",path:"/"},{name:"Journal",path:"/blog"},{name:"Page "+current,path:"/blog/page/"+current}];

  return <div className="page"><div className="shell">
    <div className="page-heading"><p className="eyebrow">Journal archive</p><h1>Page {current}</h1><p>Older Digital Observatory observations, kept in stable crawlable pages.</p></div>
    <div className="post-grid">{pageItems.map(post=><PostCard key={post.slug} post={post}/>)}</div>
    <Pagination currentPage={current} totalPages={total} basePath="/blog"/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(collectionJsonLd({name:"Digital Observatory Journal — Page "+current,description:"Page "+current+" of journal observations",url:"/blog/page/"+current,posts:pageItems}))}/>
  </div></div>;
}
