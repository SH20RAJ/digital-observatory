import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts,getTags,tagSlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems,getPageNumbers } from "@/lib/pagination";

export const dynamicParams=false;
export function generateStaticParams(){
  const output:{tag:string;page:string}[]=[];
  for(const tag of getTags()){
    const posts=getAllPosts().filter(post=>post.tags.some(item=>tagSlug(item)===tagSlug(tag)));
    for(const page of getPageNumbers(posts.length))output.push({tag:tagSlug(tag),page:String(page)});
  }
  return output;
}
export async function generateMetadata({params}:{params:Promise<{tag:string;page:string}>}):Promise<Metadata>{
  const {tag,page}=await params; const posts=getAllPosts().filter(post=>post.tags.some(item=>tagSlug(item)===tag)); const current=Number(page); const total=getPageCount(posts.length);
  if(!posts.length||!Number.isInteger(current)||current<1||current>total)return {};
  const canonical=current===1?"/tag/"+tag:"/tag/"+tag+"/page/"+current;
  return{title:"#"+tag+" — Page "+current,description:"Page "+current+" of the "+tag+" tag archive.",alternates:{canonical}};
}
export default async function TagPageNumber({params}:{params:Promise<{tag:string;page:string}>}){
  const {tag,page}=await params; const posts=getAllPosts().filter(post=>post.tags.some(item=>tagSlug(item)===tag)); const current=Number(page); const total=getPageCount(posts.length);
  if(!posts.length||!Number.isInteger(current)||current<1||current>total)notFound();
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Tag archive</p><h1>#{tag} · {current}</h1></div><div className="post-grid">{getPageItems(posts,current).map(post=><PostCard key={post.slug} post={post}/>)}</div><Pagination currentPage={current} totalPages={total} basePath={"/tag/"+tag}/></div></div>;
}
