import Link from "next/link";
import { NAV_ITEMS, SITE, assetUrl } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={SITE.name + " home"}>
          <span className="brand-mark" aria-hidden="true">
            <img src={assetUrl("/icon.svg")} alt="" width={24} height={24} />
          </span>
          <span className="brand-copy">
            <strong>{SITE.name}</strong>
            <small>Signals &rarr; context &rarr; evidence</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
          <Link href="/search" className="nav-link nav-search-btn" aria-label="Search the journal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Search</span>
          </Link>
          <div className="header-divider" aria-hidden="true" />
          <ThemeToggle />
        </nav>
        <div className="mobile-nav">
          <ThemeToggle />
          <details>
            <summary aria-label="Open menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </summary>
            <nav aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/search">Search</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
