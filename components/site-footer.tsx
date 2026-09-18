import Link from "next/link";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><div className="footer-brand">Digital Observatory</div><p className="muted">A public research journal for understanding what changes across the digital world.</p></div>
        <div><p className="eyebrow">Explore</p><Link href="/blog">Journal</Link><Link href="/about">Methodology</Link><Link href="/search">Search</Link><a href="/feed.xml">RSS feed</a></div>
        <div><p className="eyebrow">Open</p><a href={SITE.github} rel="noreferrer">Source code</a><a href={SITE.discussions} rel="noreferrer">Discussions</a><a href="/llms.txt">For AI agents</a></div>
      </div>
      <div className="shell footer-bottom"><span>Open source. Source-specific data terms always apply.</span><span>Built for evidence, not noise.</span></div>
    </footer>
  );
}