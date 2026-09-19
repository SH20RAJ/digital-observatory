import type { Metadata } from "next";
import Link from "next/link";
import { SITE, absoluteUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, aboutPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

const title = "About";
const description = "How the Digital Observatory turns public signals into transparent, source-backed observations.";
const url = "/about";
const image = absoluteUrl("/og/default.svg");

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", title: title + " | " + SITE.name, description, url: absoluteUrl(url), images: [{ url: image, width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title: title + " | " + SITE.name, description, images: [image] }
};

export default function AboutPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About", path: "/about" }];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />
        <div className="page-heading">
          <p className="eyebrow">About the observatory</p>
          <h1>A research surface built for calm curiosity.</h1>
          <p>{SITE.description}</p>
        </div>
        <div className="article-layout">
          <div className="article-main prose">
            <h2>What counts as a signal?</h2>
            <p>A signal is a public, observable event or measurement: a release, repository change, package movement, research publication, vulnerability advisory, discussion spike, product launch, or other documented event.</p>
            <h2>How stories are made</h2>
            <p>We normalize sources, preserve provenance, compare measurements over time, and publish interpretations with explicit uncertainty. A chart is evidence. It is not automatically an explanation.</p>
            <h2>Why Markdown?</h2>
            <p>Every article is human-readable Markdown. That makes content diffable, reviewable, portable, Git-native, easy to edit in the CMS, and straightforward for people or agents to consume.</p>
            <h2>Search and AI discovery</h2>
            <p>The site exposes canonical URLs, descriptive metadata, Article and Breadcrumb structured data, RSS, XML sitemap, robots rules, and machine-readable content indexes. These improve clarity and discovery but never guarantee rankings or AI citations.</p>
            <h2>Open source</h2>
            <p>Contributors can add research, source adapters, editorial improvements, UI improvements, tests, accessibility fixes, and documentation.</p>
            <p><Link href={SITE.github} className="link-arrow">Browse the repository →</Link></p>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(aboutPageJsonLd())} />
      </div>
    </div>
  );
}