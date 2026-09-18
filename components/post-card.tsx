import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/content";
import { categorySlug } from "@/lib/content";

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const poster = post.coverImage || "/og/" + post.slug;
  return (
    <article className={featured ? "post-card post-card-featured" : "post-card"}>
      <Link href={"/blog/" + post.slug} className="post-card-media" aria-label={post.title}>
        <Image src={poster} alt={post.coverAlt || ""} fill
          sizes={featured ? "(max-width: 920px) 100vw, 65vw" : "(max-width: 640px) 100vw, (max-width: 920px) 50vw, 33vw"}
          priority={featured} className="card-image" />
        <span className="media-label">{post.category}</span>
      </Link>
      <div className="post-card-body">
        <div className="post-meta-row"><Link href={"/category/" + categorySlug(post.category)}>{post.category}</Link><span>{post.readingTime}</span></div>
        <h3><Link href={"/blog/" + post.slug}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="post-card-bottom"><span>{post.publishedAt}</span><span>{post.tags.slice(0, 2).join(" · ")}</span></div>
      </div>
    </article>
  );
}