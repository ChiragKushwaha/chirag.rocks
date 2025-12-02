import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DeviceProvider } from "@/components/ui/design-system/DeviceContext";
import { GlobalExternalLinkHandler } from "@/components/GlobalExternalLinkHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "macOS Big Sur Clone - Browser-Based Operating System",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-192.png", sizes: "192x192" }],
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
  category: "technology",
};

// Schema.org JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://chirag-rocks.vercel.app/#webapplication",
      name: "macOS Big Sur Clone",
      alternateName: "Browser-Based macOS",
      description:
        "A fully-functional macOS Big Sur clone running entirely in the web browser with offline support, file system management, and native applications.",
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
      name: "macOS Big Sur Clone",
      description: "Browser-based operating system inspired by macOS Big Sur",
      publisher: {
        "@type": "Person",
        name: "Chirag Kushwaha",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://chirag-rocks.vercel.app/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <meta
          name="google-site-verification"
          content="Ret-iSE1zLvQXAF88Yv_TTM8RNJlWAh2-aOuwfavx6o"
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

        {/* Performance & Security */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700&family=Noto+Sans+JP:wght@700&family=Noto+Sans+KR:wght@700&family=Noto+Naskh+Arabic:wght@700&family=Noto+Serif+Devanagari:wght@700&family=Noto+Serif+Bengali:wght@700&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <GlobalExternalLinkHandler>
          <DeviceProvider>{children}</DeviceProvider>
        </GlobalExternalLinkHandler>
      </body>
    </html>
  );
}
