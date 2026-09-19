import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems,getPageNumbers } from "@/lib/pagination";

export const dynamicParams=false;
export function generateStaticParams(){return getPageNumbers(getAllPosts().length).map(page=>({page:String(page)}));}
export async function generateMetadata({params}:{params:Promise<{page:string}>}):Promise<Metadata>{
  const {page}=await params; const current=Number(page); const total=getPageCount(getAllPosts().length);
  if(!Number.isInteger(current)||current<1||current>total)return {};
  const canonical=current===1?"/blog":"/blog/page/"+current;
  return {title:"Journal — Page "+current,description:"Page "+current+" of the Digital Observatory journal archive.",alternates:{canonical}};
}
export default async function BlogPageNumber({params}:{params:Promise<{page:string}>}){
  const {page}=await params; const current=Number(page); const posts=getAllPosts(); const total=getPageCount(posts.length);
  if(!Number.isInteger(current)||current<1||current>total)notFound();
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Journal archive</p><h1>Page {current}</h1><p>Older Digital Observatory observations, kept in stable crawlable pages.</p></div><div className="post-grid">{getPageItems(posts,current).map(post=><PostCard key={post.slug} post={post}/>)}</div><Pagination currentPage={current} totalPages={total} basePath="/blog"/></div></div>;
}
