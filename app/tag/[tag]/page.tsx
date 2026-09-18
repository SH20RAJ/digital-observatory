import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getTags, tagSlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export async function generateStaticParams() { return getTags().map((tag) => ({ tag: tagSlug(tag) })); }
export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: "#" + tag, description: "Digital Observatory articles tagged " + tag + ".", alternates: { canonical: "/tag/" + tag } };
}
export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = getAllPosts().filter((post) => post.tags.some((item) => tagSlug(item) === tag));
  if (!posts.length) notFound();
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Tag archive</p><h1>#{tag}</h1><p>{posts.length} published observation{posts.length === 1 ? "" : "s"} in this thread.</p></div><div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div></div></div>;
}