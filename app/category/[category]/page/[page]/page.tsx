import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts,getCategories,categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
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
  return {title:posts[0].category+" — Page "+current,description:"Page "+current+" of the "+posts[0].category+" archive.",alternates:{canonical}};
}
export default async function CategoryPageNumber({params}:{params:Promise<{category:string;page:string}>}){
  const {category,page}=await params; const posts=getAllPosts().filter(post=>categorySlug(post.category)===category); const current=Number(page); const total=getPageCount(posts.length);
  if(!posts.length||!Number.isInteger(current)||current<1||current>total)notFound();
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Archive</p><h1>{posts[0].category} · {current}</h1></div><div className="post-grid">{getPageItems(posts,current).map(post=><PostCard key={post.slug} post={post}/>)}</div><Pagination currentPage={current} totalPages={total} basePath={"/category/"+category}/></div></div>;
}
