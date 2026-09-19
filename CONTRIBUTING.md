# Contributing to Digital Observatory

Thank you for contributing to **Digital Observatory**! This project is an open-source, evidence-first digital research journal and ecosystem observatory.

We welcome contributions across research, article writing, data methodology, UI design, accessibility, performance, and SEO.

---

## 1. Quick Start

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/SH20RAJ/digital-observatory.git
   cd digital-observatory
   ```
2. Install dependencies using the reproducible lockfile:
   ```bash
   npm ci
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Run all validation checks locally:
   ```bash
   npm run check
   ```

---

## 2. How to Add or Edit an Article

Articles live in `content/posts/{slug}.md`.

1. **Pick a Meaningful Signal**:
   - Focus on an observable, verifiable change (a release, security CVE, policy update, benchmark shift, standard change).
   - Check existing articles in `content/posts/` to avoid near-duplicates.
2. **Create the Markdown File**:
   - Name the file using lowercase alphanumeric characters with single hyphens: `content/posts/my-observation.md`.
   - Complete all required frontmatter fields:
     ```yaml
     ---
     title: "A Concise, Specific Observation Title"
     description: "A 1-2 sentence evidence summary describing the measurable change and time window."
     publishedAt: "2026-09-19"
     status: "published" # or "draft"
     category: "AI" # Pick from existing categories or propose a new one
     tags: ["llm", "benchmarks"]
     author: "Your Name"
     authorRole: "Researcher / Domain Specialist"
     sources:
       - label: "Official Release or Paper Title"
         url: "https://example.com/primary-source"
         note: "Describes what specific claim or measurement this link proves."
     ---

     The first paragraph should stand alone and summarize what measurable change occurred...
     ```
3. **Respect Editorial Rules**:
   - Distinguish measurements from interpretations.
   - Attach every important claim to a primary source.
   - Disclose uncertainties and data limits honestly.
4. **Validate Content**:
   ```bash
   npm run content:check
   ```

---

## 3. How to Modify the UI or Design System

- All CSS design tokens, typography scales, and component classes are centralized in [app/globals.css](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/app/globals.css).
- Review [docs/DESIGN-SYSTEM.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/docs/DESIGN-SYSTEM.md) before making visual changes.
- Ensure all new interactive controls:
  - Are keyboard accessible with visible `:focus-visible` rings.
  - Satisfy WCAG AA contrast (minimum 4.5:1 for body text) in both light and dark themes.
  - Provide a minimum 44×44px tap target on mobile viewports.

---

## 4. How to Add a Research Category or Tag

- Categories and tags are inferred automatically from the frontmatter of indexable articles.
- To introduce a new category, specify it in your article's `category:` field and add a clear justification in your pull request.
- Standard categories include: `AI`, `Open Source`, `Developers`, `Startups`, `Internet`, `Security`, `Experiments`, `Digital Culture`, `Methodology`, `Observatory`.

---

## 5. How to Propose a Source Adapter

- While automated collectors are being developed in Phase 2 of the roadmap (see [docs/DATA-SOURCES.md](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/docs/DATA-SOURCES.md)), you can propose new data sources by opening an issue using the `[Source]:` template.
- Specify: source name, official API or feed URL, rate limits, licensing terms, and update frequency.

---

## 6. How to Run Checks & Tests

Before opening a pull request, run the full validation suite:

```bash
# 1. Validate Markdown frontmatter and link integrity
npm run content:check

# 2. Verify TypeScript types
npm run typecheck

# 3. Run automated tests (content, SEO, sitemap, routing)
npm test

# 4. Compile the full static production build
npm run build

# 5. Verify all generated artifacts (sitemap, feed, llms, search index)
npm run verify:artifacts
```

Or run everything in one command:
```bash
npm run check
```

---

## 7. How Pull Requests are Reviewed

1. **Automated CI**: GitHub Actions runs `npm run check` on Ubuntu with Node 22. All checks must pass.
2. **Provenance Review**: Maintainers inspect cited sources to confirm that numbers and factual assertions are supported by evidence.
3. **SEO & Routing Check**: We verify that canonical URLs, Open Graph images, and sitemap entries remain consistent.
4. **Accessibility Check**: Visual changes are reviewed across mobile (375px) and desktop viewports in both light and dark modes.
