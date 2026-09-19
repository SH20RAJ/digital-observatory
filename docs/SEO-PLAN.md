# Digital Observatory SEO & Scale Plan

Updated: 2026-09-19

## Direction

Keep the Observatory static, fast, crawlable, source-transparent, and easy to extend from dozens to thousands of observations.

Google's current guidance says the same foundational SEO practices apply to AI Overviews and AI Mode: crawlable pages, strong internal links, useful text, good page experience, and structured data that matches visible content. There is no separate AI-search markup requirement.

## Implemented

- Real HTML pagination for the journal, category archives, and tag archives.
- Self-canonical URLs for paginated archive pages.
- Twelve cards per archive page to keep HTML payloads bounded.
- Stable internal links from every archive page to adjacent pages.
- Site-wide branded icon, manifest, and OG identity.
- Distinct deterministic article posters.
- Article metadata and BlogPosting JSON-LD use the same canonical poster.
- RSS exposed as an alternate feed.
- Sitemap generation can include archive pages and article last-modified dates.
- Search remains noindex and uses a separate metadata index.
- Static-export deployment is preserved, so public routes remain pre-rendered HTML.

## High-value next SEO changes

### Search Console as measurement

Verify the canonical domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, then watch indexing, crawl errors, Core Web Vitals, search queries, Discover, and generative-search visibility.

Google launched dedicated Search Generative AI performance views in Search Console in 2026; use those reports as measurement rather than chasing speculative GEO hacks.

### Author entities

Expand author pages with a short expertise statement, genuine profile links, and stable identity references. Article structured data should point at that author page with a stable URL.

### Collection semantics

Add CollectionPage and ItemList structured data only where it exactly matches the visible archive. Do not generate markup for hidden or non-visible items.

### Topic graph

Every article should naturally link to a prior observation, its category or tags when useful, and primary sources. This improves navigation and discovery without turning internal links into a ranking trick.

### Performance as SEO infrastructure

Keep primary content server-rendered and static. Prefer native HTML links, minimal client JavaScript, responsive images, lazy loading below the fold, and a small third-party footprint. Monitor LCP, CLS, and INP continuously.

### Canonical discipline

Maintain one stable URL per article. Do not put tracking parameters into canonical links. Only redirect URLs when they genuinely move.

### Source transparency

Keep source name, URL, date context, and a short note describing what the source supports. Never turn a generated summary into a source of record.

### Scale threshold

When the corpus reaches thousands of articles, split the sitemap into multiple sitemap files plus a sitemap index. Add a dedicated build-time search index or external search only when measured search/build costs justify it.

## What not to do

Do not create thin tag pages, duplicate pagination, keyword-stuffed metadata, fake author identities, fake review schema, or large volumes of near-identical AI articles.

The main growth lever is a durable graph of useful observations connected by clear taxonomy, stable URLs, source transparency, strong internal linking, and excellent page experience.
