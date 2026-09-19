# Agent Instructions & Operating Contract

## 1. Ground Rules & Principles

1. Read `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `docs/DESIGN-SYSTEM.md`, and `docs/METHODOLOGY.md`.
2. Inspect recent articles in `content/posts/` before generating new content.
3. **Canonical content source of truth**: All articles live in `content/posts/*.md`. Never introduce a database as a prerequisite for publishing.
4. **Primary canonical production domain**: `https://observatory.campusloop.space`. Treat `https://sh20raj.github.io/digital-observatory` strictly as a secondary/fallback static deployment.
5. **Static export compatibility**: The application must build cleanly via Next.js `output: "export"`. Do not add server-only APIs or dynamic server routes that break static compilation.

---

## 2. Engineering Standards

- **TypeScript**: Strict typing across all utilities and components. Avoid `any` casting.
- **Next.js App Router**: Server-first rendering; minimal client-side JavaScript.
- **Canonical Content Layer**: Always use `lib/content.ts` for post querying, filtering, and image resolution (`resolvePostImage`). Never duplicate Markdown parsing in ad-hoc scripts.
- **Strict `noIndex` Discipline**: Articles with `noIndex: true` must never leak into public archives, category listings, tag listings, author profiles, sitemaps, RSS feeds, search indexes, or LLMS feeds.
- **Centralized URL Utility**: Always use `lib/site.ts` (`getCanonicalUrl`, `getAbsoluteUrl`, `getAssetUrl`, `getBasePath`). Never hardcode deployment-specific base paths.
- **Image Parity**: Hero image === Open Graph image === Twitter image === BlogPosting JSON-LD image.
- **Design System Fidelity**: Always follow tokens and rules defined in `docs/DESIGN-SYSTEM.md` and `app/globals.css`.

---

## 3. Research & Editorial Standards

- Research before writing; cite inspectable primary sources.
- Never fabricate numbers, citations, quotes, or sources.
- Maintain transparent separation between measurements, derived metrics, context, and interpretations.
- Disclose uncertainty honestly. When evidence is ambiguous, preserve the ambiguity.
- Do not create thin articles solely because a keyword is trending.

---

## 4. Change Workflow

Always follow this exact validation sequence before committing:

1. Inspect existing files.
2. Make the smallest coherent change.
3. Run `npm run content:check`.
4. Run `npm run typecheck`.
5. Run `npm test`.
6. Run `npm run build`.
7. Run `npm run verify:artifacts`.
8. Inspect the diff (`git diff`).
9. Commit with a clear, conventional commit message (e.g. `feat: ...`, `fix: ...`, `content: ...`).

---

## 5. Human Agency

Agents are collaborators, not authorities. When human review is warranted, leave a clear draft instead of pretending certainty.
