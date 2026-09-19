import type { Metadata } from "next";
import Link from "next/link";
import { siteRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested Digital Observatory page could not be found.",
  robots: siteRobots(false)
};

export default function NotFound() {
  return (
    <div className="page">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">404 / Unobserved</p>
          <h1>That page is outside the current map.</h1>
          <p>The content may have moved, never existed, or is still a draft.</p>
        </div>
        <Link href="/" className="button primary">Return to the observatory</Link>
      </div>
    </div>
  );
}
