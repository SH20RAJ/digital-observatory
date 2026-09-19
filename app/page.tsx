import Link from "next/link";
import { getAllPosts, getCategories, categorySlug } from "@/lib/content";
import { PostCard } from "@/components/post-card";
import { SearchForm } from "@/components/search-form";

export default function HomePage() {
  const posts=getAllPosts();
  const spotlight=posts.find((post)=>post.featured)||posts[0];
  const latest=spotlight?posts.filter((post)=>post.slug!==spotlight.slug).slice(0,6):posts.slice(0,6);
  const categories=getCategories();

  return <div className="home">
    <section className="home-hero"><div className="shell">
      <div className="home-hero-line"><p className="eyebrow">Digital Observatory / Open research journal</p><span className="status-chip"><span className="status-dot"/>Source-backed</span></div>
      <h1>Signals worth understanding.</h1>
      <p className="home-lead">A calm place to follow meaningful changes across AI, open source, developer infrastructure, the web, security, and digital culture — with evidence, context, and uncertainty kept visible.</p>
      <div className="hero-actions"><Link className="button primary" href="/blog">Read the journal</Link><Link className="button" href="/about">How it works</Link></div>
      <div className="signal-strip" aria-label="Editorial principles"><div><strong>01</strong><span>Observe</span></div><div><strong>02</strong><span>Verify</span></div><div><strong>03</strong><span>Context</span></div><div><strong>04</strong><span>Uncertainty</span></div></div>
    </div></section>

    {spotlight?<section className="section"><div className="shell">
      <div className="section-heading"><div><p className="eyebrow">Spotlight</p><h2>One observation worth your time.</h2></div><Link href="/blog" className="link-arrow">View journal →</Link></div>
      <div className="featured-grid"><PostCard post={spotlight} featured/><aside className="editor-note"><p className="eyebrow">Editorial rule</p><h3>Evidence before narrative.</h3><p>Every important claim is tied to a source, and interpretation stays separate from what the source directly measures.</p><div className="editor-note-links"><Link href="/blog/signals-are-not-truth">Signals are not truth →</Link><Link href="/about">Read the methodology →</Link></div></aside></div>
    </div></section>:null}

    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Latest signals</p><h2>What changed recently.</h2></div></div>
      {latest.length?<div className="post-grid">{latest.map((post)=><PostCard key={post.slug} post={post}/>)}</div>:<div className="empty">Add a Markdown article in content/posts to publish it.</div>}
    </div></section>

    <section className="section"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Explore</p><h2>Choose a lens.</h2></div></div>
      <div className="category-grid">{categories.map((category)=><Link key={category} className="category-tile" href={"/category/"+categorySlug(category)}><span>{category}</span><span aria-hidden="true">↗</span></Link>)}</div>
    </div></section>

    <section className="section"><div className="shell"><SearchForm/></div></section>
  </div>;
}
