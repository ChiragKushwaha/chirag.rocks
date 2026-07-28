import { test, expect } from "@playwright/test";
import { gotoDesktop, openSpotlight } from "./helpers";

test.describe("Spotlight", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
  });

  test("opens from the menu bar and finds an app", async ({ page }) => {
    await openSpotlight(page);
    await page.getByRole("combobox").fill("Calculator");
    await expect(
      page.getByRole("option", { name: "Open Calculator" })
    ).toBeVisible();
  });

  test("launches an app from a result", async ({ page }) => {
    await openSpotlight(page);
    await page.getByRole("combobox").fill("Calculator");

    const option = page.getByRole("option", { name: "Open Calculator" });
    await expect(option).toBeVisible();
    await option.click();

    // Spotlight closes and the Calculator window opens.
    await expect(page.getByRole("combobox")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "7", exact: true })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("closes on Escape", async ({ page }) => {
    await openSpotlight(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("combobox")).toHaveCount(0);
  });
});
