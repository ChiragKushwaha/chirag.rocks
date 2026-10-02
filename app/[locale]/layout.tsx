import { GlobalExternalLinkHandler } from "@/components/GlobalExternalLinkHandler";
import { DeviceProvider } from "@/components/ui/design-system/DeviceContext";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
// Google Fonts removed for performance

import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

// Font definitions removed

export const viewport: Viewport = {
  // Force desktop width on mobile devices
  width: 1280,
  initialScale: 0.3, // Start zoomed out to fit the width
  minimumScale: 0.3,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });

  return {
    metadataBase: new URL("https://chirag.rocks"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((loc) => [loc, `https://chirag.rocks/${loc}`])
        ),
        "x-default": "https://chirag.rocks/en",
      },
    },
    title: t("Title"),
    description: t("Description"),
    keywords: t("Keywords").split(", "),
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
      locale: locale === "en" ? "en_US" : locale,
      url: `https://chirag.rocks/${locale}`,
      siteName: "Chirag Kushwaha - macOS Portfolio",
      title: t("Title"),
      description: t("Description"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("Title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("Title"),
      description: t("Description"),
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: "/apple-icon.webp", sizes: "any" },
        { url: "/apple-icon.webp", sizes: "192x192", type: "image/webp" },
        { url: "/icon-512.webp", sizes: "512x512", type: "image/webp" },
      ],
      apple: [{ url: "/apple-icon.webp", sizes: "192x192" }],
      shortcut: "/apple-icon.webp",
    },
    manifest: "/manifest.json",
    category: "technology",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "SEO" });

  // Schema.org JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://chirag.rocks/#person",
        name: "Chirag Kushwaha",
        jobTitle: t("StructuredData.JobTitle"),
        url: "https://chirag.rocks",
        image: "https://chirag.rocks/apple-icon.webp",
        sameAs: [
          "https://github.com/chirag-kushwaha",
          "https://linkedin.com/in/chirag-kushwaha",
        ],
        worksFor: [
          {
            "@type": "Organization",
            name: "IPD Analytics",
          },
          {
            "@type": "Organization",
            name: "Eka Care",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        knowsAbout: [
          "Full Stack Development",
          "React",
          "Next.js",
          "TypeScript",
          "macOS",
          "Software Engineering",
          "Progressive Web Apps",
          "Web APIs",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://chirag.rocks/#website",
        url: "https://chirag.rocks",
        name: t("Title"),
        description: t("Description"),
        publisher: {
          "@id": "https://chirag.rocks/#person",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://chirag.rocks/en?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": "https://chirag.rocks/#webapplication",
        name: t("Title"),
        alternateName: t("StructuredData.AlternateName"),
        description: t("StructuredData.Description"),
        url: "https://chirag.rocks",
        applicationCategory: "PortfolioApplication",
        operatingSystem: "Web Browser",
        screenshot: "https://chirag.rocks/og-image.png",
        featureList: [
          "macOS Big Sur Desktop User Interface",
          "Window Management with Drag, Resize, and Dock Minimization",
          "Presentation API and Screen Mirroring Cast",
          "Native Offline File System with OPFS",
          "VoiceOver Speech Synthesis Accessibility",
          "Real-time Hardware and Battery Monitoring",
        ],
        author: {
          "@id": "https://chirag.rocks/#person",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        browserRequirements:
          "Requires JavaScript, Modern browser with Service Worker and OPFS support",
      },
      {
        "@type": "ProfilePage",
        "@id": "https://chirag.rocks/#profilepage",
        url: `https://chirag.rocks/${locale}`,
        name: t("Title"),
        mainEntity: {
          "@id": "https://chirag.rocks/#person",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://chirag.rocks/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Portfolio",
            item: "https://chirag.rocks",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: locale.toUpperCase(),
            item: `https://chirag.rocks/${locale}`,
          },
        ],
      },
    ],
  };

  const isRtl = locale === "ar" || locale === "he";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} translate="no">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="google" content="notranslate" />
        <meta name="google-site-verification" content="9Jisn5XzVn5HXT_8R8bY7LCLZJCx3fUIa01-BEmATpM" />
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
        className={`antialiased`}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* WCAG AAA Skip Links */}
        <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
          <a
            href="#main-desktop-area"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-10000 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-xl focus:outline-none"
          >
            Skip to desktop content
          </a>
          <a
            href="#main-menubar"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-48 focus:z-10000 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-xl focus:outline-none"
          >
            Skip to menu bar
          </a>
          <a
            href="#main-dock"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-96 focus:z-10000 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-xl focus:outline-none"
          >
            Skip to applications dock
          </a>
        </nav>
        <NextIntlClientProvider messages={messages}>
          <GlobalExternalLinkHandler>
            <Providers>
              <DeviceProvider>{children}</DeviceProvider>
            </Providers>
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
