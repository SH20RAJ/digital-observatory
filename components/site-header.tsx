import Link from "next/link";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={SITE.name + " home"}>
          <span className="brand-mark">DO</span>
          <span className="brand-copy"><strong>{SITE.name}</strong><small>Signals → context → understanding</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className="nav-link">{item.label}</Link>)}
          <ThemeToggle />
        </nav>
        <div className="mobile-nav">
          <ThemeToggle />
          <details>
            <summary aria-label="Open menu">Menu</summary>
            <nav aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
              <Link href="/search">Search</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}