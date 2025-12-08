import { GlobalExternalLinkHandler } from "@/components/GlobalExternalLinkHandler";
import { DeviceProvider } from "@/components/ui/design-system/DeviceContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Naskh_Arabic,
  Noto_Sans,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Serif_Bengali,
  Noto_Serif_Devanagari,
  Pacifico,
} from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh-arabic",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "700"],
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
  weight: ["400", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://chirag-rocks.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: "Chirag Kushwaha - Interactive Portfolio | macOS Big Sur Experience",
  description:
    "Experience a pixel-perfect macOS Big Sur clone running entirely in your browser. Full offline support, OPFS file system, real-time features, and native-like performance. A Progressive Web App built with Next.js and React.",
  keywords: [
    "macOS Big Sur",
    "browser operating system",
    "web-based OS",
    "React macOS",
    "Progressive Web App",
    "offline web app",
    "OPFS file system",
    "browser desktop",
    "web OS",
    "macOS clone",
    "Big Sur UI",
    "browser file system",
    "service worker",
    "WebRTC",
    "Socket.IO",
    "Next.js app",
    "React desktop",
    "web desktop environment",
    "browser-based macOS",
    "offline PWA",
  ],
  authors: [{ name: "Chirag Kushwaha", url: "https://chirag.rocks" }],
  creator: "Chirag Kushwaha",
  publisher: "chirag.rocks",
  applicationName: "macOS Big Sur Clone",
  generator: "Next.js 16",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chirag-rocks.vercel.app",
    siteName: "macOS Big Sur Clone",
    title: "macOS Big Sur Clone - Full-Featured Browser OS",
    description:
      "A pixel-perfect recreation of macOS Big Sur running in your browser with full offline support, file system, and native apps.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "macOS Big Sur Clone - Browser-Based Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "macOS Big Sur Clone - Browser OS",
    description:
      "Experience macOS Big Sur in your browser with full offline support and native-like performance.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/apple-icon.png", sizes: "any" },
      { url: "/apple-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "192x192" }],
    shortcut: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
};

// Schema.org JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://chirag-rocks.vercel.app/#webapplication",
      name: "Chirag Kushwaha - Interactive Portfolio",
      alternateName: "macOS Big Sur Portfolio Experience",
      description:
        "An interactive portfolio showcasing Chirag Kushwaha's skills through a fully-functional macOS Big Sur clone running entirely in the web browser. Features offline support, file system management, and native applications demonstrating full-stack development expertise.",
      url: "https://chirag-rocks.vercel.app",
      applicationCategory: "DesktopEnhancementApplication",
      operatingSystem: "Web Browser (Chrome, Edge, Safari, Firefox)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      author: {
        "@type": "Person",
        name: "Chirag Kushwaha",
        url: "https://chirag.rocks",
      },
      browserRequirements:
        "Requires JavaScript, Modern browser with Service Worker and OPFS support",
      softwareVersion: "2.0",
      featureList: [
        "Offline-first architecture",
        "OPFS (Origin Private File System)",
        "Real-time messaging with Socket.IO",
        "WebRTC video calling",
        "Service Worker caching",
        "Progressive Web App",
        "Full desktop environment",
        "File manager with drag-and-drop",
        "Native-like applications",
        "Dark mode support",
        "Big Sur design system",
      ],
      screenshot: "https://chirag-rocks.vercel.app/screenshot.png",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "100",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://chirag-rocks.vercel.app/#softwareapplication",
      name: "macOS Big Sur Browser Clone",
      applicationCategory: "WebApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://chirag-rocks.vercel.app/#website",
      url: "https://chirag-rocks.vercel.app",
      name: "Chirag Kushwaha - Portfolio",
      description:
        "Interactive portfolio of Chirag Kushwaha - Full-stack developer showcasing skills through an immersive macOS Big Sur browser experience",
      publisher: {
        "@type": "Person",
        "@id": "https://chirag.rocks/#person",
        name: "Chirag Kushwaha",
        jobTitle: "Full-Stack Developer",
        url: "https://chirag.rocks",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://chirag.rocks/#organization",
      name: "chirag.rocks",
      url: "https://chirag.rocks",
      logo: {
        "@type": "ImageObject",
        url: "https://chirag-rocks.vercel.app/icon-512.png",
      },
    },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" translate="no">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="google" content="notranslate" />
        <meta
          name="google-site-verification"
          content="OIk6sJu3nmgUIb9c-yV6DvU_P4KyXctrKxF8ZukWjQE"
        />
        {/* Additional SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="macOS Clone" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${notoSansJP.variable} ${notoSansKR.variable} ${notoNaskhArabic.variable} ${notoSerifDevanagari.variable} ${notoSerifBengali.variable} ${pacifico.variable} antialiased`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <NextIntlClientProvider messages={messages}>
          <GlobalExternalLinkHandler>
            <DeviceProvider>{children}</DeviceProvider>
          </GlobalExternalLinkHandler>
          {process.env.NODE_ENV === "production" &&
            process.env.VERCEL === "1" && (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
