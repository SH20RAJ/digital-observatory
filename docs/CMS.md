# Content Authoring & Architecture

Digital Observatory is designed from the ground up as a **Markdown-first, Git-native digital research publication**.

## 1. Why Git-Native Markdown?

- **Zero Database Requirement**: Content is permanently stored as human-readable, portable Markdown files in `content/posts/*.md`.
- **Complete Audit Trail**: Every fact, date correction, and source addition has a transparent Git commit history.
- **Diffable Review**: Maintainers and peer researchers review editorial proposals as standard code diffs.
- **Collaborative**: Both human researchers and AI research agents work against the exact same structured frontmatter schema.
- **Static Export Compatible**: The entire publication compiles to pre-rendered, crawlable HTML with zero server runtime overhead.

---

## 2. Article Authoring Workflow

To publish a new observation or update existing research:

1. Create a new branch:
   ```bash
   git checkout -b content/my-observation-slug
   ```
2. Create a Markdown file in `content/posts/{slug}.md`.
3. Add the required frontmatter:
   ```yaml
   ---
   title: "A Concise, Specific Observation Title"
   description: "A 1-2 sentence evidence summary describing the measurable change and time window."
   publishedAt: "2026-09-19"
   status: "published" # or "draft" for works in progress
   category: "AI" # Standard category
   tags: ["llm", "benchmarks", "evaluations"]
   author: "Your Name or Team"
   authorRole: "Researcher / Domain Specialist"
   sources:
     - label: "Official Registry or RFC Specification"
       url: "https://example.com/official-source"
       note: "Directly reports the baseline measurement and timing."
   ---

   State the measurable observation in the opening paragraph...
   ```
4. Validate the content locally:
   ```bash
   npm run content:check
   ```
5. Open a Pull Request on GitHub. Once merged into `main`, the deployment workflow compiles the static site and regenerates all canonical artifacts.

---

## 3. Headless CMS & External Visual Editors

GitHub Pages and static host exports serve pre-rendered HTML without an active Node.js server runtime. Dynamic CMS write endpoints (such as `@keystatic/next` API handlers) require a serverful environment and are decoupled from the static publishing pipeline.

If visual editing is desired:
- **Local Editors**: Tools like VS Code with Markdown extensions, Obsidian, or local companion CMS instances can edit `content/posts/*.md` directly on disk.
- **Decoupled CMS Deployments**: Headless Git-based editors (such as Keystatic, Decap CMS, or Tina) can be deployed as independent services with GitHub OAuth to commit directly to the repository via GitHub's API.
