import type {Metadata,Viewport} from "next";
import {SITE,absoluteUrl} from "@/lib/site";
import {jsonLd,organizationJsonLd,websiteJsonLd} from "@/lib/seo";
import {SiteHeader} from "@/components/site-header";
import {SiteFooter} from "@/components/site-footer";
import {PwaRegister} from "@/components/pwa-register";
import "./globals.css";

const verification={...(process.env.GOOGLE_SITE_VERIFICATION?{google:process.env.GOOGLE_SITE_VERIFICATION}:{}),...(process.env.BING_SITE_VERIFICATION?{other:{"msvalidate.01":process.env.BING_SITE_VERIFICATION}}:{})};
export const viewport:Viewport={themeColor:"#111316",colorScheme:"light dark"};
export const metadata:Metadata={
  metadataBase:new URL(SITE.url),title:{default:SITE.name,template:"%s | "+SITE.name},description:SITE.description,
  applicationName:SITE.name,generator:"Next.js",manifest:"/manifest.webmanifest",
  icons:{icon:absoluteUrl("/icon.svg"),apple:absoluteUrl("/icon.svg")},
  alternates:{canonical:"/",types:{"application/rss+xml":absoluteUrl("/feed.xml")}},
  keywords:["digital observatory","AI","open source","developer infrastructure","internet research","security"],
  verification:Object.keys(verification).length?verification:undefined,
  openGraph:{type:"website",siteName:SITE.name,title:SITE.name,description:SITE.description,url:"/",locale:SITE.locale,images:[{url:absoluteUrl("/og/default.svg"),width:1200,height:630,alt:SITE.name}]},
  twitter:{card:"summary_large_image",title:SITE.name,description:SITE.description,images:[absoluteUrl("/og/default.svg")]},
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}}
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="en" suppressHydrationWarning><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/><PwaRegister/><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteJsonLd())}/><script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())}/></body></html>;
}
