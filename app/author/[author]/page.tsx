import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/post-card";

function authorSlug(value: string) {
  return encodeURIComponent(value);
}

export async function generateStaticParams() {
  return [...new Set(getAllPosts().map((post) => post.author))].map((author) => ({ author: authorSlug(author) }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }): Promise<Metadata> {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const post = getAllPosts().find((item) => item.author === decoded);
  if (!post) return {};
  return {
    title: decoded,
    description: "Articles published by " + decoded + " in the Digital Observatory.",
    alternates: { canonical: "/author/" + encodeURIComponent(decoded) }
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const posts = getAllPosts().filter((post) => post.author === decoded);
  if (!posts.length) notFound();
  const role = posts[0].authorRole;

  return (
    <div className="page">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">Author</p>
          <h1>{decoded}</h1>
          <p>{role}. {posts.length} published observation{posts.length === 1 ? "" : "s"}.</p>
        </div>
        <div className="post-grid">{posts.map((post) => <PostCard key={post.slug} post={post} />)}</div>
      </div>
    </div>
  );
}