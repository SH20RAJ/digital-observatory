# Digital Observatory

[![Build](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/ci.yml)
[![Pages](https://github.com/SH20RAJ/digital-observatory/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/deploy-pages.yml)
[![Publish](https://github.com/SH20RAJ/digital-observatory/actions/workflows/publish.yml/badge.svg)](https://github.com/SH20RAJ/digital-observatory/actions/workflows/publish.yml)

> **Observe the digital world without losing the plot.**

Digital Observatory is a Markdown-first, open-source research journal for tracking public signals across AI, open source, developers, startups, internet infrastructure, security, and digital culture.

**Repository:** https://github.com/SH20RAJ/digital-observatory  
**GitHub Pages:** https://sh20raj.github.io/digital-observatory/  
**Primary domain:** https://digital-observatory.dev

## GitHub Pages

The Pages workflow builds a static Next.js export and deploys `out/` using GitHub's Pages artifact deployment. Next.js documents `output: "export"` for static hosting and notes that server-only runtime features are not available on a static host. [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)

The Markdown corpus remains canonical. The Keystatic CMS remains available for local/server-capable deployments; GitHub Pages itself only serves the resulting static site.

## Visitor counters

Every public page renders a page-specific VisitorBadge counter in the footer. The badge derives its counter key from the current GitHub Pages URL, so different pages receive separate counters.

## Contributing

Research, articles, source adapters, methodology, design, accessibility, performance, SEO, tests, documentation and AI-agent tooling are welcome.

Read `AGENTS.md`, `CONTRIBUTING.md`, `docs/CONTENT-SYSTEM.md`, `docs/RESEARCH-AGENT.md`, `docs/SEO-GEO.md`, and `docs/GITHUB-PAGES.md`.

## License

MIT for the codebase. External datasets, APIs, images and source material retain their own terms.
