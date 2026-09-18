import Link from "next/link";
import { getAllPosts, getCategories, categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  const posts = getAllPosts();
  const spotlight = posts.find((post) => post.featured) || posts[0];
  const latest = spotlight ? posts.filter((post) => post.slug !== spotlight.slug).slice(0, 6) : posts.slice(0, 6);
  const categories = getCategories();

  return <>
    <section className="hero"><div className="shell hero-grid"><div>
      <p className="kicker">DIGITAL OBSERVATORY / OPEN RESEARCH JOURNAL</p>
      <h1>Observe the digital world without losing the plot.</h1>
      <p className="lead">Public signals, evidence, context, and uncertainty across AI, open source, developers, startups, internet infrastructure, security, and digital culture.</p>
      <div className="hero-actions"><Link className="button primary" href="/blog">Read the journal</Link><Link className="button" href="/about">How it works</Link></div>
    </div><aside className="hero-note"><p className="eyebrow">Editorial loop</p><strong>Observation → Evidence → Context → Interpretation → Uncertainty</strong><p>We optimize for useful understanding, not content volume.</p></aside></div></section>
    {spotlight ? <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Spotlight</p><h2>One idea worth sitting with.</h2></div><Link href="/blog" className="link-arrow">View all →</Link></div>
      <div className="featured-grid"><PostCard post={spotlight} featured /><div className="callout"><p className="eyebrow">What makes an observation useful?</p><strong>It is traceable enough to inspect, specific enough to understand, and honest about what the evidence cannot prove.</strong><p className="muted">Read the methodology before treating any chart or metric as a conclusion.</p><Link href="/about" className="link-arrow">Read methodology →</Link></div></div>
    </div></section> : null}
    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Latest signals</p><h2>New from the observatory.</h2></div></div>
      {latest.length ? <div className="post-grid">{latest.map((post) => <PostCard key={post.slug} post={post} />)}</div> : <div className="empty">Add a Markdown article in content/posts to publish it.</div>}
    </div></section>
    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Explore</p><h2>Choose a lens.</h2></div></div><div className="category-cloud">{categories.map((category) => <Link key={category} className="pill" href={"/category/" + categorySlug(category)}>{category}</Link>)}</div></div></section>
    <section className="section"><div className="shell"><SearchForm /></div></section>
  </>;
}