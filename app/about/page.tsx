import type { Metadata } from "next";
import Link from "next/link";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { buildPageMetadata, jsonLd, breadcrumbJsonLd, aboutPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";

const title = "Methodology & About";
const description =
  "How the Digital Observatory tracks public signals and turns them into transparent, source-backed observations.";
const url = "/about";

export const metadata: Metadata = buildPageMetadata({
  title: "About Digital Observatory: Methodology, Sources & Research Standards",
  description:
    "Learn how Digital Observatory researches public signals, separates measurements from interpretation, preserves source provenance, and publishes open research in Markdown.",
  path: "/about",
  keywords: [
    "Digital Observatory methodology",
    "research methodology",
    "source-backed research",
    "research provenance",
    "open research",
    "technical journalism",
    "Markdown research"
  ]
});

export default function AboutPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading">
          <p className="eyebrow">About the Observatory</p>
          <h1>A research surface built for calm curiosity.</h1>
          <p>{SITE.description}</p>
        </div>

        <div className="article-layout">
          <div className="article-main prose">
            <h2>What counts as a signal?</h2>
            <p>
              A signal is a public, observable event or empirical measurement: a software release, package registry
              spike, benchmark run, vulnerability disclosure (CVE), legislative filing, standard specification, or
              ecosystem inflection point.
            </p>

            <h2>Observation model: 4 layers of inquiry</h2>
            <p>To avoid conflating measurement with conjecture, every observation respects four distinct layers:</p>
            <ol>
              <li>
                <strong>Measurement:</strong> What the source directly reports (e.g., download figures, telemetry counts,
                Git commits, RFC text).
              </li>
              <li>
                <strong>Derived metric:</strong> Deterministic calculations performed on the raw measurement (e.g.,
                percentage delta, acceleration, normalized ratios).
              </li>
              <li>
                <strong>Context:</strong> Documented external events occurring in the same temporal window (e.g.,
                upstream releases, regulatory deadlines, security advisories).
              </li>
              <li>
                <strong>Interpretation:</strong> Cautious explanations of what the evidence may indicate, always
                accompanied by explicitly disclosed uncertainty.
              </li>
            </ol>

            <h2>Why Markdown-first?</h2>
            <p>
              The source of truth for every article is portable, version-controlled Markdown in <code>content/posts/</code>.
              This keeps the research diffable, auditable in Git, accessible to AI research agents, and independent of
              ephemeral databases or closed CMS vendor locks.
            </p>

            <h2>Search, Provenance, and AI Discovery</h2>
            <p>
              The Observatory publishes canonical URLs, descriptive Open Graph assets, BlogPosting and ProfilePage
              structured data, XML sitemaps, RSS feeds, and machine-readable agent indexes (<code>llms.txt</code>).
              These allow humans and autonomous systems to verify provenance and quote claims accurately without
              speculative SEO tricks.
            </p>

            <h2>Contributing &amp; Open Source</h2>
            <p>
              Digital Observatory is licensed under the MIT License. Contributions — whether adding verified observations,
              correcting a source URL, proposing new data collectors, or improving accessibility — are welcomed via
              GitHub pull requests.
            </p>
            <p>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="link-arrow">
                Browse the Observatory GitHub repository →
              </a>
            </p>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(aboutPageJsonLd())} />
      </div>
    </div>
  );
}