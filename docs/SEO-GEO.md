# SEO + Generative Search Playbook

This project treats SEO and generative-search visibility as outcomes of useful, crawlable, well-structured publishing rather than ranking tricks.

## Verified principles

### People-first content

Google's current guidance prioritizes helpful, reliable, people-first content, original value, clear authorship, substantial analysis, and trustworthy sourcing. It warns against scaled pages created mainly for search traffic.

Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### AI search

Google says the fundamentals of SEO remain relevant for AI Overviews and AI Mode and that there are no additional special technical requirements for inclusion.

Source: https://developers.google.com/search/docs/appearance/ai-features

### Structured data

Google documents Article structured data for communicating article title, image, author, and dates, and BreadcrumbList for clarifying hierarchy.

Sources:
https://developers.google.com/search/docs/appearance/structured-data/article
https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

### Canonical URLs

Google treats canonical declarations as hints. Stable URLs, sitemap membership, redirects, and canonical annotations help disambiguate duplicate content.

Source: https://developers.google.com/search/docs/crawling-indexing/canonicalization

### Sitemaps and IndexNow

Google recommends submitting a sitemap for discovery. Bing's current AI-search guidance highlights accurate sitemaps and IndexNow for faster change notification.

Sources:
https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search
https://blogs.bing.com/webmaster/September-2024/IndexNow-When-and-How-Websites-Should-Notify-Search-Engines

## Article rules

- Answer the central question early.
- Name important entities explicitly.
- Put dates next to time-sensitive claims.
- Use descriptive headings.
- Link important claims to direct sources.
- Preserve author and update information.
- Use structured data that matches visible content.
- Make uncertainty visible.
- Use internal links only when they help the reader.
- Avoid keyword stuffing, duplicate pages, fake authority, fake citations, and made-up statistics.
- Never promise a ranking or AI citation.

## Implemented technical layer

- Next.js App Router and server-rendered articles
- canonical metadata
- BlogPosting and BreadcrumbList JSON-LD
- Organization and WebSite JSON-LD
- XML sitemap
- robots.txt
- RSS
- dynamic Open Graph posters
- optimized images
- author, category, and tag pages
- machine-readable content endpoints
- source/provenance rendering
- optional search-engine verification

## Measurement after launch

Use Google Search Console and Bing Webmaster Tools to inspect indexing, crawl health, query impressions, sitemap coverage, canonicalization, and AI citation/referral signals where available. Optimize based on observed evidence rather than generic SEO scorecards.
