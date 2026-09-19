"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {SearchForm} from "@/components/search-form";

type SearchPost={slug:string;title:string;description:string;excerpt:string;publishedAt:string;category:string;tags:string[];author:string;readingTime:string};
const PAGE_SIZE=12;

function SearchCard({post}:{post:SearchPost}){return <article className="post-card"><div className="post-card-body"><div className="post-meta-row"><span>{post.category}</span><span>{post.readingTime}</span></div><h3><Link href={"/blog/"+post.slug}>{post.title}</Link></h3><p>{post.excerpt||post.description}</p><div className="post-card-bottom"><span>{post.publishedAt}</span><span>{post.tags.slice(0,2).join(" · ")}</span></div></div></article>;}

export function SearchResults(){
  const params=useSearchParams(); const q=params.get("q")||""; const [posts,setPosts]=useState<SearchPost[]>([]); const [loading,setLoading]=useState(true); const [page,setPage]=useState(1);
  useEffect(()=>{const basePath=process.env.NEXT_PUBLIC_BASE_PATH||"";fetch(basePath+"/api/posts.json").then(r=>r.json()).then(data=>setPosts(data.posts||[])).catch(()=>setPosts([])).finally(()=>setLoading(false));},[]);
  const results=useMemo(()=>{const query=q.trim().toLowerCase(); if(!query)return posts; return posts.filter(post=>[post.title,post.description,post.excerpt,post.category,post.author,...post.tags].join(" ").toLowerCase().includes(query));},[posts,q]);
  useEffect(()=>setPage(1),[q]);
  const totalPages=Math.max(1,Math.ceil(results.length/PAGE_SIZE)); const visible=results.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Search</p><h1>Find an observation.</h1><p>{q?"Showing results for “"+q+"”.":"Search across titles, context, tags, and authors."}</p></div><SearchForm defaultValue={q}/>
    {loading?<div className="empty">Loading the index…</div>:results.length?<><div className="post-grid">{visible.map(post=><SearchCard key={post.slug} post={post}/>)}</div>{totalPages>1?<nav className="pagination" aria-label="Search pagination"><div className="pagination-side">{page>1?<button onClick={()=>setPage(page-1)}>← Newer</button>:<span>← Newer</span>}</div><div className="pagination-pages">{Array.from({length:totalPages},(_,i)=>i+1).map(number=><button key={number} onClick={()=>setPage(number)} aria-current={number===page?"page":undefined} className={number===page?"pagination-current":""}>{number}</button>)}</div><div className="pagination-side">{page<totalPages?<button onClick={()=>setPage(page+1)}>Older →</button>:<span>Older →</span>}</div></nav>:null}</>:<div className="empty">No matches. Try a broader term.</div>}
  </div></div>;
}
