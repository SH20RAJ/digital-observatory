import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts,getCategories,categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getPageCount,getPageItems } from "@/lib/pagination";

export async function generateStaticParams(){return getCategories().map(category=>({category:categorySlug(category)}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}):Promise<Metadata>{
  const {category}=await params; const post=getAllPosts().find(item=>categorySlug(item.category)===category);
  return post?{title:post.category,description:"Digital Observatory observations filed under "+post.category+".",alternates:{canonical:"/category/"+category}}:{};
}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){
  const {category}=await params; const posts=getAllPosts().filter(post=>categorySlug(post.category)===category);
  if(!posts.length)notFound(); const name=posts[0].category;
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Observatory world</p><h1>{name}</h1><p>{posts.length} published observation{posts.length===1?"":"s"} collected under this lens.</p></div><div className="post-grid">{getPageItems(posts,1).map(post=><PostCard key={post.slug} post={post}/>)}</div><Pagination currentPage={1} totalPages={getPageCount(posts.length)} basePath={"/category/"+category}/></div></div>;
}
