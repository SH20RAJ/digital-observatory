# Digital Observatory Design System

This document is the UI and design source of truth for **Digital Observatory**.

## 1. Visual Principles

The Observatory design language is:
**Editorial + Technical + Calm + Premium + Research-Oriented + Open Source**

- **Calm over hype**: No flashy gradients, noisy animations, or generic AI-SaaS purple blobs.
- **Evidence before narrative**: Visual elements give primacy to measurements, primary sources, and verified data.
- **Readability first**: Generous measure (~68-72ch), comfortable line height (1.6-1.75), and balanced typographic hierarchy.
- **Accessible by default**: Strict adherence to WCAG AA/AAA contrast ratios in both light and dark themes.
- **Deterministic telemetry**: Monospace accents for dates, measurements, and provenance badges.

---

## 2. Design Tokens

Design tokens are defined in [app/globals.css](file:///Users/shaswatraj/Desktop/open-source/digital-observatory/app/globals.css) as CSS custom properties.

### Colors & Surfaces

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--bg` | `#f8fafc` | `#090b0e` | Canvas background |
| `--surface` | `#ffffff` | `#11141a` | Cards, panels, inputs |
| `--surface-2` | `#f1f5f9` | `#181d24` | Hover states, pill backgrounds |
| `--surface-3` | `#e2e8f0` | `#222934` | Subtle borders, elevated chips |
| `--line` | `#e2e8f0` | `#202632` | Structural borders & dividers |
| `--line-subtle` | `#f1f5f9` | `#161b24` | Table dividers, subtle rules |
| `--text` | `#0f172a` | `#f8fafc` | Primary titles & text |
| `--text-secondary` | `#334155` | `#cbd5e1` | Secondary body text |
| `--prose-text` | `#1e293b` | `#e2e8f0` | Long-form reading prose |
| `--muted` | `#64748b` | `#94a3b8` | Metadata, timestamps, captions |
| `--accent` | `#2563eb` | `#3b82f6` | Brand blue, links, active state |
| `--accent-hover` | `#1d4ed8` | `#60a5fa` | Interactive hover |
| `--accent-soft` | `#eff6ff` | `#14223d` | Active pill background |
| `--success` | `#10b981` | `#34d399` | Verification indicators |
| `--warning` | `#d97706` | `#fbbf24` | Unlisted / pending status |
| `--error` | `#dc2626` | `#f87171` | Alerts, validation errors |

### Spacing & Layout

- Container maximum width: `--shell: 1160px`
- Reading measure: `--measure-prose: 70ch`
- Lead measure: `--measure-lead: 65ch`
- Border radii:
  - Small: `--radius-sm: 8px` (buttons, inputs, code)
  - Default: `--radius: 14px` (cards, post grid, TOC)
  - Large: `--radius-lg: 20px` (hero boxes, featured spotlight)

### Typography Scale

- Font family UI: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif`
- Font family Telemetry/Code: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`
- Hierarchy:
  - `--text-display`: `56px` (Homepage Hero)
  - `--text-4xl`: `48px` (Article H1)
  - `--text-3xl`: `36px` (Section H2)
  - `--text-2xl`: `28px` (Card Titles)
  - `--text-xl`: `22px` (H3, Subheadings)
  - `--text-lg`: `18px` (Lead paragraph, Dek)
  - `--text-base`: `16px` (Body text)
  - `--text-sm`: `13.5px` (Navigation, Metadata)
  - `--text-xs`: `11.5px` (Eyebrow labels, badges)

---

## 3. Reusable Components

### Buttons (`.button`)
- `.button.primary`: Solid brand fill with high contrast text.
- `.button`: Subdued outline with neutral hover.
- Full keyboard focus ring (`:focus-visible`) support.

### Cards (`.post-card`)
- Clean surface elevation (`--surface`), 1px border (`--line`), subtle hover shadow (`--shadow-hover`) with 2px translateY motion.
- Category tag at top-left, estimated reading time at top-right.
- Post title with title-hover underline.
- 2-line description clamp.
- Footer row with publication date and first 2 tags.

### Source & Provenance Cards (`.sources-list`)
- Rendered in a dedicated `<section id="sources-and-evidence">`.
- Numbered citation indicator `[1]`, `[2]`.
- Source title with external domain badge and accessible external-link icon.
- Note explaining exactly what fact or metric the source grounds.

### Table of Contents (`.toc`)
- Sticky right-rail on desktop (`min-width: 1080px`).
- Collapsible or flowing on mobile.
- Active heading highlighting and smooth scrolling.

### Search Interface
- Live query bar with instant, lightweight client filtering over `/api/posts.json`.
- Category filter chips (`.filter-chip.active`).
- Live screen reader status readout (`role="status" aria-live="polite"`).
- Accessible pagination.

---

## 4. Accessibility Rules

1. **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<article>`, `<figure>`, `<aside>`, `<footer>`.
2. **Landmarks & Skip Link**: `.skip-link` positioned off-screen until focused, jumping directly to `#main-content`.
3. **Contrast Standards**: All text elements satisfy WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).
4. **Interactive Target Sizes**: Minimum 44×44px click/tap target for buttons, links, and pagination items.
5. **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` by disabling all animations and transitions.

---

## 5. Responsive Breakpoints

- **320px–480px**: Single column layout, collapsed header into accessible `<details>` hamburger menu, stacked pagination.
- **481px–768px**: 2-column category grid, full-width article hero, stacked telemetry strips.
- **769px–1024px**: 2-column post card grid, expanded navigation.
- **1025px–1200px+**: 3-column post card grid, sticky Table of Contents rail, full 1160px max shell.
