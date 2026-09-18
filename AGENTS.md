# Agent Instructions

## Start here

1. Read README.md.
2. Read docs/CONTENT-SYSTEM.md.
3. Read docs/RESEARCH-AGENT.md for content generation.
4. Read docs/METHODOLOGY.md for measurement rules.
5. Inspect recent files in content/posts/ before writing.

## Canonical content

The source of truth is content/posts/*.md.

Do not introduce a database as a prerequisite for publishing articles.

## Code

- TypeScript.
- Next.js App Router.
- Server-first rendering.
- Minimal client-side JavaScript.
- Semantic HTML.
- Accessible controls and visible focus.
- Deterministic metadata.
- Stable public URLs.
- Avoid unnecessary dependencies.

## Content

Research before writing.

Prefer primary sources.

Every important factual claim needs inspectable provenance.

Never invent citations or facts.

Do not create thin articles merely because a topic is trending.

## SEO / AI discovery

Preserve canonical URLs, Article structured data, Breadcrumb structured data, sitemap, robots rules, RSS, llms.txt, descriptive metadata, author identity, and dates.

Do not add keyword stuffing or fake claims about ranking.

## Change workflow

1. Inspect existing files.
2. Make the smallest coherent change.
3. Run npm run content:check.
4. Run npm run typecheck.
5. Run npm run build.
6. Inspect the diff.
7. Commit with a clear message.

## Human agency

Agents are collaborators, not authorities.

When evidence is ambiguous, preserve the ambiguity.

When human review is warranted, leave a clear draft instead of pretending certainty.
