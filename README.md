# Digital Observatory

[![CI](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml)
[![Pages Deployment](https://github.com/SH20RAJ/digital-observatory/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/deploy-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Canonical Domain](https://img.shields.io/badge/Canonical%20Domain-observatory.campusloop.space-emerald)](https://observatory.campusloop.space)

> **Observe the digital world without losing the plot.**

**Digital Observatory** is a Markdown-first, open-source research journal and digital observatory tracking public signals across artificial intelligence, open source, developer systems, internet infrastructure, cybersecurity, and digital policy — with evidence, context, and uncertainty kept strictly visible.

- **Primary Canonical Domain:** [https://observatory.campusloop.space](https://observatory.campusloop.space/)
- **GitHub Pages Fallback:** [https://sh20raj.github.io/digital-observatory/](https://sh20raj.github.io/digital-observatory/)
- **Repository:** [https://github.com/SH20RAJ/digital-observatory](https://github.com/SH20RAJ/digital-observatory)

---

## Architecture at a Glance

Digital Observatory is built around **one canonical content pipeline**:

```
content/posts/*.md (Canonical Markdown Corpus)
       │
       ▼
lib/content.ts (Unified Parsing, Sanitization & Indexing)
 ├── getAllPublishedPosts()  ──► Next.js App Router (/blog/[slug])
 ├── getAllIndexablePosts()  ──► Public Archives, Categories, Tags, Authors
 ├── getRelatedPosts()       ──► Bounded scoring (Category + Shared Tags + Recency)
 └── resolvePostImage()      ──► Image Parity (Hero === OG === Twitter === JSON-LD)
       │
 ┌─────┴───────────────────────────────────────┐
 ▼                                             ▼
Next.js Static Export (output: "export")       scripts/generate-artifacts.mjs
 ├── / (Editorial Observatory Home)             ├── public/og/*.svg (Deterministic Posters)
 ├── /blog & /blog/page/* (Archives)            ├── public/api/posts.json (Lightweight Search)
 ├── /topics (Taxonomy Directory)               ├── public/sitemap.xml (All Indexable Routes)
 ├── /category/* & /tag/* (Lenses)              ├── public/feed.xml (RSS 2.0 Feed)
 ├── /author/* (ProfilePage JSON-LD)            ├── public/llms.txt & llms-full.txt (AI Discovery)
 ├── /about (Methodology)                       └── public/robots.txt (Crawler Directives)
 └── /search (Client-side Search)
```

Read [ARCHITECTURE.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/ARCHITECTURE.md) for full architectural documentation.

---

## Local Development

Requirements: Node.js 22+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/SH20RAJ/digital-observatory.git
cd digital-observatory

# 2. Install pinned dependencies reproducibly
npm ci

# 3. Start local development server
npm run dev

# 4. Open in your browser
open http://localhost:3000
```

---

## Content Authoring

Articles live in `content/posts/{slug}.md`. Every article requires structured YAML frontmatter:

```yaml
---
title: "A Clear, Specific Observation Headline"
description: "A 1-2 sentence summary describing the measurable change, time window, and primary evidence."
publishedAt: "2026-09-19"
status: "published" # or "draft"
category: "AI" # Standard category
tags: ["llm", "evaluations", "safety"]
author: "Your Name"
authorRole: "Researcher / Domain Specialist"
sources:
  - label: "Official Advisory, RFC, or Repository"
    url: "https://example.com/primary-source"
    note: "Grounds the specific measurement reported in paragraph 1."
---

Opening observation statement...
```

See [docs/CMS.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/docs/CMS.md) for full authoring workflows and headless CMS integration notes.

---

## Validation & Testing

Digital Observatory enforces strict quality gates on every commit:

```bash
# Validate frontmatter, dates, RFC source URLs, and internal links
npm run content:check

# Typecheck TypeScript across the entire project
npm run typecheck

# Run automated tests (content, SEO, sitemap, search, routing)
npm test

# Generate posters, sitemaps, RSS, and compile static Next.js export
npm run build

# Verify generated artifact integrity
npm run verify:artifacts
```

Or run everything with a single command:
```bash
npm run check
```

---

## Design System & Accessibility

- **Design System Guide:** [docs/DESIGN-SYSTEM.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/docs/DESIGN-SYSTEM.md)
- **Design Tokens:** Centralized CSS custom properties in `app/globals.css`.
- **Accessibility:** Target WCAG 2.1 AA/AAA compliance with visible focus indicators (`:focus-visible`), high contrast in light & dark modes, semantic landmarks, skip links, and touch targets ≥ 44×44px.

---

## SEO & AI Agent Discovery

- **Canonical URL Discipline:** All pages declare canonical URLs referencing `https://observatory.campusloop.space`.
- **Structured Data:** Emits WebSite, Organization, BlogPosting, BreadcrumbList, CollectionPage, and ProfilePage JSON-LD schemas.
- **Image Parity:** The resolved article image is identically shared across the visible hero, Open Graph meta, Twitter card, and BlogPosting JSON-LD.
- **Agent Discovery:** Exposes canonical `public/llms.txt` and `public/llms-full.txt` index files for autonomous AI search systems.
- **Strict `noIndex` Discipline:** Any article flagged with `noIndex: true` is excluded from all public feeds, category archives, tag pages, sitemaps, and search indexes.

---

## Deployment Strategy

Digital Observatory generates pre-rendered static HTML via Next.js `output: "export"`.

1. **Primary Custom Domain:** Hosted at `https://observatory.campusloop.space` via Cloudflare / custom CDN.
2. **Secondary GitHub Pages:** Automated static deployment to `https://sh20raj.github.io/digital-observatory/` via `.github/workflows/deploy-pages.yml`.

Both deployments are produced from the identical source tree using environment-aware base path configuration (`NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL`).

---

## Contributing

We welcome contributions from researchers, software engineers, data specialists, and designers.

Please read:
- [CONTRIBUTING.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/CONTRIBUTING.md) — Contributor guide & review expectations.
- [AGENTS.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/AGENTS.md) — Operating contract for human and AI collaborators.
- [docs/METHODOLOGY.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/docs/METHODOLOGY.md) — 4-layer measurement principles.

---

## License

MIT License. External datasets, APIs, and quoted research retain their respective terms.
