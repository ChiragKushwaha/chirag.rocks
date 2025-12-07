import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    "en",
    "es",
    "fr",
    "de",
    "it",
    "ja",
    "zh",
    "pt",
    "ru",
    "ko",
    "nl",
    "sv",
    "da",
    "no",
    "fi",
    "pl",
    "tr",
    "ar",
    "hi",
    "bn",
    "vi",
    "th",
    "el",
    "cs",
    "hu",
    "ro",
    "uk",
    "id",
    "ms",
    "hr",
    "sk",
    "sl",
    "bg",
    "sr",
    "he",
  ],

  // Used when no locale matches
  defaultLocale: "en",
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
