import type { Metadata, Viewport } from "next";
import { SITE, getCanonicalUrl, getAssetUrl } from "@/lib/site";
import { jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION || "_rPi-600gMFYjNa9qzMTuIQg1_aey417EeAdaiIqgFg";
const verification = {
  google: googleVerification,
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {})
};

export const viewport: Viewport = {
  themeColor: "#090b0e",
  colorScheme: "light dark"
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.canonicalDomain),
  title: {
    default: "Digital Observatory — Computer Science, AI, Security & Student Technology",
    template: "%s | " + SITE.name
  },
  description:
    "Open-source research, long-form technical guides, and current observations across computer science, AI, web development, data, cybersecurity, open source, cloud systems, finance, and digital culture.",
  applicationName: SITE.name,
  generator: "Next.js",
  creator: SITE.name,
  publisher: SITE.name,
  category: "Technology",
  classification:
    "Computer Science, Artificial Intelligence, Software Engineering, Cybersecurity, Open Source, Digital Research, Student Education",
  manifest: getAssetUrl("/manifest.webmanifest"),
  icons: {
    icon: getAssetUrl("/icon.svg"),
    apple: getAssetUrl("/icon.svg")
  },
  alternates: {
    canonical: getCanonicalUrl("/"),
    types: { "application/rss+xml": getCanonicalUrl("/feed.xml") }
  },
  keywords: [
    "Digital Observatory",
    "computer science",
    "artificial intelligence",
    "AI research",
    "web development",
    "software engineering",
    "cybersecurity",
    "data engineering",
    "open source",
    "cloud computing",
    "networking",
    "database systems",
    "student technology",
    "technical guides",
    "research journal"
  ],
  verification: Object.keys(verification).length ? verification : undefined,
  formatDetection: { telephone: false },
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Digital Observatory — Computer Science, AI, Security & Student Technology",
    description:
      "Open-source research and long-form technical guides across computer science, AI, web development, data, cybersecurity, open source, cloud systems, finance, and digital culture.",
    url: getCanonicalUrl("/"),
    locale: SITE.locale,
    images: [
      {
        url: getCanonicalUrl("/og/default.svg"),
        width: 1200,
        height: 630,
        alt: "Digital Observatory — open-source technology research"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Observatory — Computer Science, AI, Security & Student Technology",
    description:
      "Open-source research and long-form technical guides across computer science, AI, web development, data, cybersecurity, open source, and digital systems.",
    images: [
      {
        url: getCanonicalUrl("/og/default.svg"),
        alt: "Digital Observatory — open-source technology research"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd())} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
      </body>
    </html>
  );
}
