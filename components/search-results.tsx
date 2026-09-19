"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/search-form";
import { getAssetUrl } from "@/lib/site";

interface SearchPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: string;
  url: string;
}

const PAGE_SIZE = 12;

function SearchCard({ post }: { post: SearchPost }) {
  return (
    <article className="post-card">
      <div className="post-card-body">
        <div className="post-meta-row">
          <span className="post-category-tag">{post.category}</span>
          <span className="post-read-time">{post.readingTime}</span>
        </div>
        <h3>
          <Link href={"/blog/" + post.slug}>{post.title}</Link>
        </h3>
        <p>{post.excerpt || post.description}</p>
        <div className="post-card-bottom">
          <span>{post.publishedAt}</span>
          <span>{post.tags.slice(0, 2).join(" · ")}</span>
        </div>
      </div>
    </article>
  );
}

export function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    const indexPath = getAssetUrl("/api/posts.json");
    fetch(indexPath)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(posts.map((p) => p.category))].sort();
  }, [posts]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    let filtered = posts;

    if (activeCategory) {
      filtered = filtered.filter((post) => post.category === activeCategory);
    }

    if (!query) return filtered;

    return filtered.filter((post) =>
      [post.title, post.description, post.excerpt, post.category, post.author, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [posts, q, activeCategory]);

  useEffect(() => {
    setPage(1);
  }, [q, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="page">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">Search Observatory</p>
          <h1>Find an observation.</h1>
          <p>
            {q
              ? `Showing results for “${q}”.`
              : "Search across titles, descriptions, categories, tags, and authors."}
          </p>
        </div>

        <SearchForm defaultValue={q} />

        {/* Category Quick Filter */}
        {categories.length ? (
          <div className="filter-row search-filter-row" aria-label="Filter by category">
            <button
              type="button"
              className={`pill filter-chip ${activeCategory === "" ? "active" : ""}`}
              onClick={() => setActiveCategory("")}
            >
              All Categories ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill filter-chip ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : null}

        {/* Live Search Result Count */}
        <div className="search-status-bar" role="status" aria-live="polite">
          {!loading && (
            <span>
              Found <strong>{results.length}</strong> matching observation{results.length === 1 ? "" : "s"}
              {activeCategory ? ` in ${activeCategory}` : ""}.
            </span>
          )}
        </div>

        {loading ? (
          <div className="empty">Loading the search index…</div>
        ) : results.length ? (
          <>
            <div className="post-grid">
              {visible.map((post) => (
                <SearchCard key={post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav className="pagination" aria-label="Search pagination">
                <div className="pagination-side">
                  {page > 1 ? (
                    <button onClick={() => setPage(page - 1)} className="button">
                      ← Newer
                    </button>
                  ) : (
                    <span className="pagination-disabled">← Newer</span>
                  )}
                </div>

                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setPage(number)}
                      aria-current={number === page ? "page" : undefined}
                      className={`pagination-page-btn ${number === page ? "pagination-current" : ""}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <div className="pagination-side">
                  {page < totalPages ? (
                    <button onClick={() => setPage(page + 1)} className="button">
                      Older →
                    </button>
                  ) : (
                    <span className="pagination-disabled">Older →</span>
                  )}
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="empty search-empty-box">
            <h3>No matching observations</h3>
            <p>Try searching for a broader term, or explore by research category.</p>
            <Link href="/topics" className="button primary">
              Browse Topics &amp; Domains →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
