import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getCategories, categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";

export async function generateStaticParams() { return getCategories().map((category) => ({ category: categorySlug(category) })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const post = getAllPosts().find((item) => categorySlug(item.category) === category);
  return post ? { title: post.category, description: "Digital Observatory observations filed under " + post.category + ".", alternates: { canonical: "/category/" + category } } : {};
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = getAllPosts().filter((post) => categorySlug(post.category) === category);
  if (!posts.length) notFound();
  const name = posts[0].category;
  return <div className="page"><div className="shell"><div className="page-heading"><p className="eyebrow">Observatory world</p><h1>{name}</h1><p>Observations, methods, and stories collected under the {name} lens.</p></div><div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div></div></div>;
}