import Link from "next/link";
import { getAllIndexablePosts, getCategories, categorySlug, getCategoryCounts } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  const posts = getAllIndexablePosts();
  const spotlight = posts.find((post) => post.featured) || posts[0];
  const latest = spotlight ? posts.filter((post) => post.slug !== spotlight.slug).slice(0, 6) : posts.slice(0, 6);
  const categories = getCategories();
  const categoryCounts = getCategoryCounts();

  return (
    <div className="home">
      {/* 1. Hero */}
      <section className="home-hero">
        <div className="shell">
          <div className="home-hero-line">
            <p className="eyebrow">Digital Observatory / Open Research Journal</p>
            <span className="status-chip">
              <span className="status-dot" aria-hidden="true" />
              Source-backed &amp; Git-verified
            </span>
          </div>
          <h1>Observe the digital world without losing the plot.</h1>
          <p className="home-lead">
            A calm, rigorous research publication tracking meaningful changes across artificial intelligence, open
            source, developer systems, internet infrastructure, cybersecurity, and digital policy — with evidence,
            context, and uncertainty kept strictly visible.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/blog">
              Read the Journal
            </Link>
            <Link className="button" href="/topics">
              Explore Topics
            </Link>
            <Link className="button" href="/about">
              Our Methodology
            </Link>
          </div>
          <div className="signal-strip" aria-label="Observatory principles">
            <div className="signal-strip-item">
              <strong>01</strong>
              <span>Observe</span>
            </div>
            <div className="signal-strip-item">
              <strong>02</strong>
              <span>Verify</span>
            </div>
            <div className="signal-strip-item">
              <strong>03</strong>
              <span>Context</span>
            </div>
            <div className="signal-strip-item">
              <strong>04</strong>
              <span>Uncertainty</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Spotlight Observation */}
      {spotlight ? (
        <section className="section" aria-labelledby="spotlight-heading">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Spotlight</p>
                <h2 id="spotlight-heading">One observation worth your time.</h2>
              </div>
              <Link href="/blog" className="link-arrow">
                View journal →
              </Link>
            </div>
            <div className="featured-grid">
              <PostCard post={spotlight} featured />
              <aside className="editor-note">
                <p className="eyebrow">Editorial Principle</p>
                <h3>Evidence before narrative.</h3>
                <p>
                  Every important claim is tied to an inspectable primary source. Measurement remains strictly
                  distinct from interpretation.
                </p>
                <div className="editor-note-links">
                  <Link href="/blog/signals-are-not-truth">Signals are not truth →</Link>
                  <Link href="/about">Read the methodology →</Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. Research Domains / Categories */}
      <section className="section" aria-labelledby="domains-heading">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What We Track</p>
              <h2 id="domains-heading">Research Domains</h2>
            </div>
            <Link href="/topics" className="link-arrow">
              All topics &amp; tags →
            </Link>
          </div>
          <div className="category-grid">
            {categories.slice(0, 8).map((category) => {
              const slug = categorySlug(category);
              const count = categoryCounts.get(slug) || 0;
              return (
                <Link key={category} className="category-tile" href={"/category/" + slug}>
                  <div className="category-tile-content">
                    <span className="category-tile-title">{category}</span>
                    <span className="category-tile-count">
                      {count} observation{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <span className="category-tile-arrow" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Latest Signals */}
      <section className="section" aria-labelledby="signals-heading">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Signals</p>
              <h2 id="signals-heading">Recent verified observations.</h2>
            </div>
            <Link href="/blog" className="link-arrow">
              View all {posts.length} articles →
            </Link>
          </div>
          {latest.length ? (
            <div className="post-grid">
              {latest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty">No published articles found.</div>
          )}
        </div>
      </section>

      {/* 5. Methodology & Evidence Statement */}
      <section className="section" aria-labelledby="method-heading">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Measurement Philosophy</p>
              <h2 id="method-heading">How the Observatory works.</h2>
            </div>
          </div>
          <div className="method-grid">
            <div className="method-card">
              <span className="method-num" aria-hidden="true">01</span>
              <h3>Primary Source Grounding</h3>
              <p>
                Every report links to official registries, RFC standards, Git commits, peer-reviewed papers, or verified
                disclosures. We avoid citing aggregators when primary artifacts exist.
              </p>
            </div>
            <div className="method-card">
              <span className="method-num" aria-hidden="true">02</span>
              <h3>Separation of Layers</h3>
              <p>
                Observations distinguish directly reported measurements from derived calculations, temporal context,
                and cautious interpretations. A chart is evidence, not an explanation.
              </p>
            </div>
            <div className="method-card">
              <span className="method-num" aria-hidden="true">03</span>
              <h3>Disclosed Uncertainty</h3>
              <p>
                When data is incomplete, correlational, or unverified by independent parties, the limitation is made
                visible rather than hidden behind false certainty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Open Source CTA */}
      <section className="section home-oss-cta" aria-labelledby="oss-heading">
        <div className="shell">
          <div className="oss-box">
            <div>
              <p className="eyebrow">Open Source Research</p>
              <h2 id="oss-heading">Built in the open. Maintained by researchers.</h2>
              <p>
                Digital Observatory is Markdown-first and version-controlled. Anyone can submit verified signals,
                propose source collectors, or enhance reporting via Git pull requests.
              </p>
            </div>
            <div className="oss-actions">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="button primary">
                Contribute on GitHub ↗
              </a>
              <Link href="/about" className="button">
                Read Contributor Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Search Bar */}
      <section className="section">
        <div className="shell">
          <SearchForm />
        </div>
      </section>
    </div>
  );
}
