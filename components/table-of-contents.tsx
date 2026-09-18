import type { Post } from "@/lib/content";

export function TableOfContents({ post }: { post: Post }) {
  if (post.headings.length < 2) return null;
  return <aside className="toc" aria-label="Table of contents">
    <p className="eyebrow">On this page</p>
    <ol>{post.headings.map((heading) => <li key={heading.id} className={heading.depth === 3 ? "toc-sub" : ""}><a href={"#" + heading.id}>{heading.text}</a></li>)}</ol>
  </aside>;
}