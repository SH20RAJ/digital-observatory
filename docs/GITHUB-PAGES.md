# GitHub Pages deployment

Public site: https://sh20raj.github.io/digital-observatory/

The Pages build is a pure static export. The repository keeps its Markdown source and server-capable CMS configuration, while GitHub Pages receives only the generated `out/` artifact.

The Pages workflow sets GITHUB_PAGES=true, NEXT_PUBLIC_BASE_PATH=/digital-observatory and NEXT_PUBLIC_SITE_URL=https://sh20raj.github.io/digital-observatory.

The Keystatic editor cannot execute its write endpoint on a static host. It remains available for local/server deployments; editorial changes are committed to GitHub and automatically published to Pages.

Reference: https://nextjs.org/docs/app/guides/static-exports
