import { GlobalExternalLinkHandler } from "@/components/GlobalExternalLinkHandler";
import { DeviceProvider } from "@/components/ui/design-system/DeviceContext";
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
  width: "device-width",
  initialScale: 1,
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
    metadataBase: new URL("https://chirag-rocks.vercel.app"),
    alternates: {
      canonical: `/${locale}`,
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
      url: "https://chirag-rocks.vercel.app",
      siteName: "macOS Big Sur Clone",
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
        image: "https://chirag-rocks.vercel.app/apple-icon.png",
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
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://chirag-rocks.vercel.app/#webapplication",
        name: t("Title"),
        alternateName: t("StructuredData.AlternateName"),
        description: t("StructuredData.Description"),
        url: "https://chirag-rocks.vercel.app",
        applicationCategory: "Portfolio",
        operatingSystem: "Web Browser",
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
        "@type": "WebSite",
        "@id": "https://chirag-rocks.vercel.app/#website",
        url: "https://chirag-rocks.vercel.app",
        name: t("Title"),
        description: t("Description"),
        publisher: {
          "@id": "https://chirag.rocks/#person",
        },
      },
    ],
  };

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
        className={`antialiased`}
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
