import type { Metadata, Viewport } from "next";
import { SITE, getCanonicalUrl, getAssetUrl } from "@/lib/site";
import { jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || "_rPi-600gMFYjNa9qzMTuIQg1_aey417EeAdaiIqgFg";
const verification = {
  google: googleVerification,
  ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {})
};

export const viewport: Viewport = {
  themeColor: "#090b0e",
  colorScheme: "light dark"
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.canonicalDomain),
  title: {
    default: SITE.name,
    template: "%s | " + SITE.name
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
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
    "digital observatory",
    "open research",
    "AI",
    "open source",
    "developer infrastructure",
    "internet research",
    "security"
  ],
  verification: Object.keys(verification).length ? verification : undefined,
  formatDetection: { telephone: false },
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: getCanonicalUrl("/"),
    locale: SITE.locale,
    images: [
      {
        url: getCanonicalUrl("/og/default.svg"),
        width: 1200,
        height: 630,
        alt: SITE.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [getCanonicalUrl("/og/default.svg")]
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
