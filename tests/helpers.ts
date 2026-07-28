import { type Page, expect } from "@playwright/test";

/** The four external web-apps added to the Launchpad. */
export const WEB_APPS = [
  {
    id: "sacred-texts",
    name: "Sacred Texts",
    domain: "sacred-texts.vercel.app",
    url: "https://sacred-texts.vercel.app/",
  },
  {
    id: "algoviz",
    name: "AlgoViz",
    domain: "alg0.vercel.app",
    url: "https://alg0.vercel.app/",
  },
  {
    id: "speakspanish",
    name: "SpeakSpanish",
    domain: "sp4nish.vercel.app",
    url: "https://sp4nish.vercel.app/",
  },
  {
    id: "toonflix",
    name: "Toonflix",
    domain: "t00nflix.vercel.app",
    url: "https://t00nflix.vercel.app/",
  },
] as const;

const SYSTEM_STORAGE_KEY = "macOS-system-storage";

/** Persisted Zustand state that marks onboarding as finished. */
export const SEEDED_STATE = {
  isSetupComplete: true,
  isLocked: false,
  theme: "light",
  isDark: false,
  language: "English",
  wallpaperName: "WhiteSur",
  user: {
    name: "Test User",
    email: "test@example.com",
    phone: "",
    age: "30",
    password: "test-password",
  },
  hasCreatedWelcomeFile: true,
  hasSeededResume: true,
};

/**
 * Seed localStorage before any app script runs so the Setup Assistant is
 * skipped and the desktop renders straight away.
 */
export async function seedSetupComplete(page: Page): Promise<void> {
  await page.addInitScript(
    ([key, state]) => {
      window.localStorage.setItem(
        key as string,
        JSON.stringify({ state, version: 0 })
      );
    },
    [SYSTEM_STORAGE_KEY, SEEDED_STATE] as const
  );
}

/** The application dock (`<ul role="list" aria-label="Application dock">`). */
export function dock(page: Page) {
  return page.getByRole("list", { name: "Application dock" });
}

/** A dock launcher button by (possibly-running) app name. */
export function dockButton(page: Page, name: string) {
  return dock(page)
    .getByRole("button", { name, exact: false })
    .first();
}

/**
 * Navigate to the desktop for a given locale, skipping onboarding, and wait
 * for the boot sequence to complete (the dock becomes visible).
 */
export async function gotoDesktop(page: Page, locale = "en"): Promise<void> {
  await seedSetupComplete(page);
  await page.goto(`/${locale}`);
  await expect(dock(page)).toBeVisible({ timeout: 45_000 });
}

/** Open the Launchpad from the dock and wait for its grid to render. */
export async function openLaunchpad(page: Page): Promise<void> {
  await dockButton(page, "Launchpad").click();
  await expect(
    page.getByRole("button", { name: "Launch Finder" })
  ).toBeVisible({ timeout: 20_000 });
}

/** Open Spotlight from the menu bar and wait for the search box. */
export async function openSpotlight(page: Page): Promise<void> {
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Spotlight" })
    .first()
    .click();
  await expect(page.getByRole("combobox")).toBeVisible({ timeout: 15_000 });
}
