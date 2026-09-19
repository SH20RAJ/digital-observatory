import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllIndexablePosts, authorSlug } from "@/lib/content";
import { SITE, getCanonicalUrl } from "@/lib/site";
import { jsonLd, breadcrumbJsonLd, profilePageJsonLd, collectionJsonLd } from "@/lib/seo";
import { PostCard } from "@/components/post-card";
import { Breadcrumbs } from "@/components/breadcrumbs";

export async function generateStaticParams() {
  const authors = [...new Set(getAllIndexablePosts().map((post) => post.author))];
  return authors.map((author) => ({ author: authorSlug(author) }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ author: string }>;
}): Promise<Metadata> {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const posts = getAllIndexablePosts().filter((item) => item.author === decoded);
  if (!posts.length) return {};

  const role = posts[0].authorRole || "Researcher";
  const title = `${decoded} (${role})`;
  const description = `Research notes, verified observations, and reports published by ${decoded} in the Digital Observatory.`;
  const canonicalUrl = getCanonicalUrl("/author/" + authorSlug(decoded));

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "profile",
      title: `${title} | ${SITE.name}`,
      description,
      url: canonicalUrl,
      images: [
        {
          url: getCanonicalUrl("/og/default.svg"),
          width: 1200,
          height: 630,
          alt: decoded
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [getCanonicalUrl("/og/default.svg")]
    }
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  const posts = getAllIndexablePosts().filter((post) => post.author === decoded);
  if (!posts.length) notFound();

  const role = posts[0].authorRole || "Editorial & Research";
  const authorUrl = "/author/" + authorSlug(decoded);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Authors", path: "/topics" },
    { name: decoded, path: authorUrl }
  ];

  return (
    <div className="page">
      <div className="shell">
        <Breadcrumbs items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

        <div className="page-heading author-heading">
          <div className="author-badge">
            <span className="author-avatar" aria-hidden="true">
              {decoded.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="eyebrow">Observer Profile</p>
              <h1>{decoded}</h1>
            </div>
          </div>
          <p className="author-bio">
            <strong>{role}</strong> at {SITE.name}. Contributor of {posts.length} published observation
            {posts.length === 1 ? "" : "s"} with verified primary-source provenance.
          </p>
        </div>

        <section className="section" aria-labelledby="author-posts-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Publications</p>
              <h2 id="author-posts-heading">Observations by {decoded}</h2>
            </div>
          </div>
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(crumbs))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            profilePageJsonLd({
              name: decoded,
              role,
              url: authorUrl,
              postCount: posts.length
            })
          )}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(
            collectionJsonLd({
              name: `Observations by ${decoded}`,
              description: `${posts.length} observations published by ${decoded}`,
              url: authorUrl,
              posts
            })
          )}
        />
      </div>
    </div>
  );
}