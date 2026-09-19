# Architecture

This document describes the architectural design of **Digital Observatory**, distinguishing between the **Current Implementation** and the **Planned Observatory Infrastructure**.

---

## 1. Current Implementation: Static Research Publishing Platform

The current repository operates as a **Markdown-first, static research publishing platform and digital journal**.

### Architecture Diagram

```
content/posts/*.md (Canonical Source of Truth)
       │
       ▼
lib/content.ts (Unified Parsing, Sanitization & Indexing)
 ├── getAllPublishedPosts()  ──► Next.js App Router (/blog/[slug])
 ├── getAllIndexablePosts()  ──► Archives, Categories, Tags, Authors, Search, Sitemaps
 ├── getRelatedPosts()       ──► Bounded scoring (Category + Shared Tags + Recency)
 └── resolvePostImage()      ──► Strict Image Parity (Hero === OG === Twitter === JSON-LD)
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
 └── /search (Client-side In-Memory Search)
```

### Key Technical Characteristics
- **One Canonical Content Pipeline**: All routes and build artifacts consume `lib/content.ts`. There is no duplicated or divergent Markdown parsing.
- **Canonical Domain Discipline**: `https://observatory.campusloop.space` is the primary canonical domain. `https://sh20raj.github.io/digital-observatory` is treated strictly as secondary/fallback. Canonical URLs always point to the custom domain.
- **Strict `noIndex` Consistency**: Articles with `noIndex: true` are generated at direct URLs with `<meta name="robots" content="noindex, follow" />` but are systematically excluded from public archives, category listings, tag pages, author listings, sitemaps, RSS feeds, search indexes, and LLMS feeds.
- **Lightweight Static Search**: Search runs client-side against `public/api/posts.json`, which indexes only metadata (slug, title, description, excerpt, category, tags, author, readingTime, publishedAt, url). Full Markdown bodies are never shipped in the search index payload.
- **Reproducible Dependencies**: Dependencies are strictly pinned via `package-lock.json`, and all CI/CD pipelines use `npm ci`.

---

## 2. Planned Observatory Infrastructure (Future Phase)

The long-term vision of Digital Observatory includes an automated telemetry collection and anomaly detection engine that continuously ingests public ecosystem data and surfaces candidate signals to human and AI editors.

### Planned Ingestion Flow

```
                  ┌─────────────────────┐
                  │ Public Data Sources │
                  │ GitHub · npm · PyPI │
                  │ HuggingFace · arXiv │
                  └──────────┬──────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Source Adapters │ (Modular connectors with rate limiting)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Normalization   │ (Validation, deduplication, provenance)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Historical DB   │ (PostgreSQL + Time-series snapshots)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Signal Engine   │ (Growth, acceleration, anomaly detection)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Editorial Gate  │ (Candidate signals proposed for investigation)
                    └────────┬────────┘
                             │
                             ▼
                 content/posts/{slug}.md
```

### Planned Components
1. **Source Adapters**: Pluggable connectors for GitHub, npm, PyPI, Hugging Face, arXiv, and CISA advisories.
2. **Canonical Store**: Time-series snapshots preserving raw measurements without overwriting historical baselines.
3. **Signal Detection Engine**: Statistical anomaly detection identifying unusual growth, acceleration, and cross-source correlation.
4. **Editorial Review Workflow**: Automated signal detection surfaces candidate leads, which human or AI researchers investigate, verify with primary evidence, and publish as Markdown articles.
