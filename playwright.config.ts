import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the macOS Big Sur clone.
 *
 * By default the tests boot a local dev server (`pnpm dev`) on port 3000.
 * Set `PLAYWRIGHT_WEB_SERVER="pnpm build && pnpm start"` to run against a
 * production build instead, or `PLAYWRIGHT_BASE_URL` to target a deployed URL.
 */
const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // This is a heavy client app (framer-motion, leaflet, OPFS, dozens of apps);
  // cap local parallelism to avoid exhausting memory with too many Chromium
  // instances running alongside the dev server.
  workers: process.env.CI ? 1 : 2,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "UTC",
    // Grant geolocation/notifications up front so the desktop's Weather widget
    // resolves its permission check silently instead of showing a modal
    // permission dialog that would otherwise block the whole UI.
    permissions: ["geolocation", "notifications"],
    geolocation: { latitude: 28.6139, longitude: 77.209 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: process.env.PLAYWRIGHT_WEB_SERVER ?? "pnpm dev",
        url: `${BASE_URL}/en`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
