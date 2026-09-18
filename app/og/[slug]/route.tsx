import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:68,background:"linear-gradient(135deg,#0b0c0d 0%,#121a2a 60%,#17385d 100%)",color:"white",fontFamily:"sans-serif"}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:20,letterSpacing:1.5,color:"#a8b8d3"}}><span>DIGITAL OBSERVATORY</span><span>{post.category}</span></div>
      <div style={{display:"flex",flexDirection:"column",gap:18,maxWidth:1020}}><div style={{display:"flex",fontSize:60,fontWeight:900,lineHeight:1.02}}>{post.title}</div><div style={{display:"flex",fontSize:24,color:"#c9d1de"}}>{post.description}</div></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:18,color:"#9ba8bb"}}><span>{post.publishedAt} · {post.readingTime}</span><span>digital-observatory.dev</span></div>
    </div>,
    { width: 1200, height: 630 }
  );
}