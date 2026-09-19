import type { Post } from "@/lib/content";

export function TableOfContents({ post }: { post: Post }) {
  if (post.headings.length < 2) return null;
  return (
    <aside className="toc" aria-label="Table of contents">
      <div className="toc-header">
        <span className="toc-header-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </span>
        <span className="toc-title">On this page</span>
      </div>
      <nav className="toc-nav">
        <ol className="toc-list">
          {post.headings.map((heading, idx) => (
            <li key={heading.id} className={heading.depth === 3 ? "toc-item toc-sub" : "toc-item"}>
              <a href={"#" + heading.id} className="toc-link">
                {heading.depth === 2 && <span className="toc-index">{String(idx + 1).padStart(2, "0")}</span>}
                <span className="toc-text">{heading.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}