import type { Metadata } from "next";
import Link from "next/link";
import { getAllIndexablePosts, getCategories, categorySlug, getCategoryCounts } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";
import { SITE } from "@/lib/site";
import { buildPageMetadata, itemListJsonLd, jsonLd, webPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Digital Observatory — Computer Science, AI, Security & Student Technology",
  description:
    "Explore source-backed technical guides and current research across computer science, AI, web development, data, cybersecurity, open source, cloud systems, finance, and digital culture.",
  path: "/",
  keywords: [
    "computer science guides",
    "AI research",
    "software engineering",
    "web development",
    "cybersecurity",
    "data science",
    "open source",
    "student technology",
    "technical research"
  ],
  feed: true
});

const learningPaths = [
  {
    category: "Computer Science",
    title: "Think in systems",
    description: "Algorithms, data structures, operating systems, and the mental models behind them.",
    href: "/category/computer-science",
    starter: "/blog/how-to-think-about-algorithms-and-big-o"
  },
  {
    category: "Web & Software",
    title: "Build for the web",
    description: "Browsers, HTTP, CSS, JavaScript, APIs, accessibility, and performance.",
    href: "/category/web-and-software",
    starter: "/blog/how-a-browser-loads-a-web-page"
  },
  {
    category: "Backend & Data",
    title: "Work with data",
    description: "SQL, PostgreSQL, transactions, indexes, APIs, and backend design.",
    href: "/category/backend-and-data",
    starter: "/blog/postgresql-indexes-and-why-queries-get-slow"
  },
  {
    category: "AI & Data",
    title: "Understand AI",
    description: "Machine learning, evaluation, embeddings, Transformers, and data workflows.",
    href: "/category/ai-and-data",
    starter: "/blog/evaluating-ai-systems-with-multiple-measures"
  },
  {
    category: "Security",
    title: "Build safely",
    description: "Threat modeling, authentication, application security, secrets, and supply chains.",
    href: "/category/security",
    starter: "/blog/threat-modeling-for-student-projects"
  },
  {
    category: "Cloud & Open Source",
    title: "Ship and collaborate",
    description: "Git, open source, containers, CI/CD, Kubernetes, and observability.",
    href: "/category/cloud-and-open-source",
    starter: "/blog/open-source-contribution-with-pull-requests"
  },
  {
    category: "Careers & College",
    title: "Turn learning into leverage",
    description: "Projects, interviews, research, communication, finance, startups, and career skills.",
    href: "/category/careers-and-college",
    starter: "/blog/portfolio-projects-that-signal-engineering-skill"
  }
];

export default function HomePage() {
  const posts = getAllIndexablePosts();
  const spotlight = posts.find((post) => post.featured) || posts[0];
  const latest = posts.filter((post) => post.slug !== spotlight?.slug).slice(0, 6);
  const categories = getCategories();
  const categoryCounts = getCategoryCounts();

  const resolveCount = (name: string) => categoryCounts.get(categorySlug(name)) || 0;

  return (
    <div className="home">
      <section className="landing-hero">
        <div className="shell landing-hero-grid">
          <div className="landing-hero-copy">
            <div className="home-hero-line landing-hero-line">
              <p className="eyebrow">Digital Observatory / Student Field Guide</p>
              <span className="status-chip">
                <span className="status-dot" aria-hidden="true" />
                Source-backed &amp; inspectable
              </span>
            </div>

            <h1>A clearer map of the systems you are learning.</h1>

            <p className="home-lead">
              Long-form explainers and current observations across computer science, web development, AI, security,
              data, infrastructure, careers, and the digital systems college students actually encounter.
            </p>

            <div className="hero-actions">
              <Link className="button primary" href="/category/computer-science">
                Start learning
              </Link>
              <Link className="button" href="/blog">
                Browse the journal
              </Link>
            </div>

            <div className="landing-search">
              <SearchForm />
            </div>
          </div>

          <aside className="landing-hero-panel" aria-label="Observatory snapshot">
            <div className="landing-panel-kicker">THE LIBRARY</div>
            <div className="landing-panel-number">{posts.length}</div>
            <p>published observations and long-form field guides</p>
            <div className="landing-panel-rule" />
            <div className="landing-panel-grid">
              <div>
                <strong>{learningPaths.length}</strong>
                <span>learning paths</span>
              </div>
              <div>
                <strong>{categories.length}</strong>
                <span>active fields</span>
              </div>
              <div>
                <strong>Primary</strong>
                <span>source-first</span>
              </div>
              <div>
                <strong>Open</strong>
                <span>Markdown corpus</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section landing-section" aria-labelledby="paths-heading">
        <div className="shell">
          <div className="section-heading landing-heading">
            <div>
              <p className="eyebrow">Choose your starting point</p>
              <h2 id="paths-heading">Seven fields. One map.</h2>
            </div>
            <Link href="/topics" className="link-arrow">Explore all topics →</Link>
          </div>

          <div className="landing-path-grid">
            {learningPaths.map((path, index) => (
              <article className="landing-path-card" key={path.category}>
                <div className="landing-path-top">
                  <span className="landing-path-index">0{index + 1}</span>
                  <span className="landing-path-count">
                    {resolveCount(path.category)} {resolveCount(path.category) === 1 ? "read" : "reads"}
                  </span>
                </div>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <div className="landing-path-actions">
                  <Link href={path.starter}>Start here</Link>
                  <Link href={path.href}>View field ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {spotlight ? (
        <section className="section landing-section landing-spotlight" aria-labelledby="spotlight-heading">
          <div className="shell">
            <div className="section-heading landing-heading">
              <div>
                <p className="eyebrow">Featured observation</p>
                <h2 id="spotlight-heading">One signal worth slowing down for.</h2>
              </div>
              <Link href="/blog" className="link-arrow">Open the journal →</Link>
            </div>

            <div className="landing-spotlight-grid">
              <PostCard post={spotlight} featured />
              <div className="landing-spotlight-copy">
                <div>
                  <p className="landing-panel-kicker">HOW TO READ</p>
                  <h3>Answer first. Evidence second. Uncertainty stays visible.</h3>
                  <p>
                    Every article separates what a source reports from what the Observatory calculates or interprets.
                    That makes long reads useful for study without hiding the limits of the evidence.
                  </p>
                </div>
                <div className="landing-spotlight-links">
                  <Link href="/blog/signals-are-not-truth">Why signals need context →</Link>
                  <Link href="/about">Read the methodology →</Link>
                  <Link href={SITE.github} target="_blank" rel="noreferrer">Inspect the source →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section landing-section" aria-labelledby="latest-heading">
        <div className="shell">
          <div className="section-heading landing-heading">
            <div>
              <p className="eyebrow">Fresh from the observatory</p>
              <h2 id="latest-heading">Recent signals and deep reads.</h2>
            </div>
            <Link href="/blog" className="link-arrow">View all {posts.length} →</Link>
          </div>

          <div className="post-grid">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="section landing-section" aria-labelledby="student-start-heading">
        <div className="shell">
          <div className="section-heading landing-heading">
            <div>
              <p className="eyebrow">A better study loop</p>
              <h2 id="student-start-heading">Use the Observatory like a technical library.</h2>
            </div>
          </div>

          <div className="landing-study-grid">
            <article className="landing-study-step">
              <span>01</span>
              <h3>Learn the mental model</h3>
              <p>Read the core idea, then draw the boundary between the layers involved.</p>
            </article>
            <article className="landing-study-step">
              <span>02</span>
              <h3>Build the smallest experiment</h3>
              <p>Turn the explanation into a benchmark, demo, test, diagram, or tiny project.</p>
            </article>
            <article className="landing-study-step">
              <span>03</span>
              <h3>Keep the evidence</h3>
              <p>Record the result, assumptions, sources, and limitations so somebody else can reproduce it.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section landing-section landing-oss" aria-labelledby="oss-heading">
        <div className="shell">
          <div className="landing-oss-box">
            <div>
              <p className="eyebrow">Open research</p>
              <h2 id="oss-heading">Read it, fork it, improve it.</h2>
              <p>
                The Observatory is Markdown-first and version controlled. Articles, sources, design, and the publishing
                pipeline are inspectable in the open.
              </p>
            </div>
            <div className="oss-actions">
              <a href={SITE.github} target="_blank" rel="noreferrer" className="button primary">GitHub ↗</a>
              <Link href="/about" className="button">Methodology</Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          webPageJsonLd({
            name: "Digital Observatory — Computer Science, AI, Security & Student Technology",
            description:
              "Open-source research and long-form technical guides across computer science, AI, web development, data, cybersecurity, open source, cloud systems, finance, and digital culture.",
            url: "/",
            about: learningPaths.map((item) => item.category)
          })
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          itemListJsonLd({
            name: "Digital Observatory learning paths",
            url: "/",
            items: learningPaths.map((item, index) => ({
              name: item.category + " — " + item.title,
              url: item.href,
              position: index + 1
            }))
          })
        )}
      />
    </div>
  );
}
