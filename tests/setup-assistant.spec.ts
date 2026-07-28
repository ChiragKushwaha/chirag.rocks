import { test, expect } from "@playwright/test";
import { dock } from "./helpers";

/**
 * First-run experience: with no persisted state the Setup Assistant's
 * "Get Started" screen is shown, and completing it boots into the desktop.
 */
test.describe("Setup Assistant (first run)", () => {
  test("shows Get Started and boots into the desktop", async ({ page }) => {
    await page.goto("/en");

    const getStarted = page.getByRole("button", { name: "Get Started" });
    await expect(getStarted).toBeVisible({ timeout: 30_000 });

    await getStarted.click();

    // Onboarding completes -> boot screen -> desktop dock appears.
    await expect(dock(page)).toBeVisible({ timeout: 45_000 });
  });
});
