# Digital Observatory

[![Build](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml)
[![Publish](https://github.com/SH20RAJ/digital-observatory/actions/workflows/publish.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Observe the digital world without losing the plot.**

Digital Observatory is a **Markdown-first, open-source research journal and publishing platform** for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.

**Repository:** https://github.com/SH20RAJ/digital-observatory  
**Public site:** https://digital-observatory.dev

## What it does

- Research-driven articles with explicit provenance and source lists.
- Human-readable Markdown as the canonical content layer.
- Git-native history, review, contribution, and rollback.
- Visual CMS at **/keystatic** for easy editorial work.
- Dynamic Open Graph article posters.
- Automatic metadata, canonical URLs, Article JSON-LD, Breadcrumb JSON-LD, RSS, sitemap, robots rules, and AI-readable indexes.
- Searchable article archive, categories, tags, related observations, and reading-time metadata.
- Scheduled research automation that only publishes when there is meaningful novelty.
- Six-hour release windows that validate and deploy accumulated content.

## Content architecture

~~~text
content/posts/*.md
~~~

is the source of truth.

Each article carries structured frontmatter for title, description, excerpt, dates, status, category, tags, author, cover metadata, SEO keywords, canonical URL, indexing state, and sources.

Adding a valid Markdown file is enough to make it appear in the journal on the next production build.

## Editorial standard

The project follows:

**Observation → Evidence → Context → Interpretation → Uncertainty**

The automated writer is explicitly forbidden from inventing facts, hiding uncertainty, copying sources, or creating articles only because a keyword looks attractive.

Google's current guidance emphasizes helpful, reliable, people-first content, original value, clear authorship, source transparency, and avoiding scaled search-engine-first production. urlGoogle: Creating Helpful, Reliable, People-First Contenthttps://developers.google.com/search/docs/fundamentals/creating-helpful-content

## SEO + AI discovery

The site implements technical foundations rather than promising rankings:

- Server-rendered article pages with dynamic metadata.
- Canonical URLs and metadataBase.
- Article/BlogPosting and Breadcrumb structured data.
- XML sitemap and robots.txt.
- RSS feed.
- Descriptive titles, excerpts, image alt text, Open Graph, Twitter cards.
- Next.js image optimization.
- Machine-readable /llms.txt and /llms-full.txt endpoints.
- Stable public source URLs and explicit citation lists.
- Optional Google/Bing verification.
- Optional IndexNow notification.

Google says the same SEO fundamentals apply to AI Overviews and AI Mode; there is no separate secret AI-SEO requirement. Bing's current webmaster guidance additionally highlights keeping content fresh, reducing ambiguity, accurate sitemaps, and IndexNow for timely URL updates. urlGoogle: AI Features and Your Websitehttps://developers.google.com/search/docs/appearance/ai-features · urlBing: Keeping Content Discoverable with Sitemaps in AI-Powered Searchhttps://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search

## Run locally

~~~bash
npm install
cp .env.example .env.local
npm run dev
~~~

Then open:

- http://localhost:3000
- http://localhost:3000/blog
- http://localhost:3000/keystatic

For deployed GitHub-backed editing, switch KEYSTATIC_STORAGE=github and configure the Keystatic GitHub App variables in docs/CMS.md. Keystatic's GitHub mode uses GitHub authentication and writes content back to the repository. urlKeystatic GitHub modehttps://keystatic.com/docs/github-mode

## Publish model

The content creator runs **hourly as a conditional research watch**:

1. Check the internet for meaningful new signals.
2. Read recent repository articles first.
3. Reject duplicates and low-signal topics.
4. Research primary sources.
5. Draft an evidence-backed article.
6. Run editorial, SEO, and AI-discovery checks.
7. Commit the Markdown only when it passes.

The production workflow runs **every six hours** and on manual dispatch. It installs dependencies, validates content, runs TypeScript checks, builds Next.js, and optionally deploys to Vercel when deployment secrets are configured.

This keeps creation frequent but publication controlled.

## Contributing

This repository is intentionally friendly to contributors.

You can contribute:

- new source adapters and datasets
- research and analysis
- article drafts
- editorial corrections
- better metadata or structured data
- accessibility improvements
- performance work
- tests and validation
- design and interaction improvements
- documentation
- AI-agent tooling

Start with CONTRIBUTING.md, then read docs/CONTENT-SYSTEM.md and docs/RESEARCH-AGENT.md.

Please preserve source provenance, avoid copying third-party prose, and never bypass access controls, CAPTCHAs, paywalls, robots restrictions, or rate limits.

## Project map

| Path | Purpose |
|---|---|
| app/ | Next.js App Router, SEO, pages, APIs, feeds |
| components/ | UI building blocks |
| lib/ | content parsing, site metadata, structured data |
| content/posts/ | canonical Markdown articles |
| keystatic.config.ts | visual CMS schema |
| docs/ | architecture, editorial, AI-agent and contribution contracts |
| .github/workflows/ | validation and six-hour publishing |
| scripts/ | deterministic content validation |

## License

MIT for the codebase. Individual datasets, APIs, images, and external sources remain subject to their own licenses and terms.
