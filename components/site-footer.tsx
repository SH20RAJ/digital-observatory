import Link from "next/link";
import { SITE, getAssetUrl } from "@/lib/site";
import { VisitorCounter } from "./visitor-counter";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand-col">
          <div className="footer-brand">
            <span className="footer-brand-mark">
              <img src={getAssetUrl("/icon.svg")} alt="" width={24} height={24} />
            </span>
            <strong>{SITE.name}</strong>
          </div>
          <p className="muted">
            A Markdown-first, open-source research journal tracking public signals across AI, open source,
            infrastructure, and digital ecosystems.
          </p>
        </div>
        <div className="footer-col">
          <p className="eyebrow">Explore</p>
          <Link href="/blog">Journal</Link>
          <Link href="/topics">Topics &amp; Domains</Link>
          <Link href="/about">Methodology</Link>
          <Link href="/search">Search</Link>
          <a href={getAssetUrl("/feed.xml")}>RSS Feed</a>
        </div>
        <div className="footer-col">
          <p className="eyebrow">Open</p>
          <a href={SITE.github} target="_blank" rel="noreferrer">Source Code</a>
          <a href={SITE.discussions} target="_blank" rel="noreferrer">Discussions</a>
          <a href={getAssetUrl("/llms.txt")}>For AI Agents</a>
          <a href={getAssetUrl("/sitemap.xml")}>XML Sitemap</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>MIT Licensed. Source-specific data terms always apply.</span>
        <span className="footer-counter">
          <VisitorCounter />
        </span>
        <span>Built for evidence, not noise.</span>
      </div>
    </footer>
  );
}
