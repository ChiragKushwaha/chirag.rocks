import { test, expect } from "@playwright/test";
import { gotoDesktop, dock, dockButton } from "./helpers";

test.describe("Desktop shell", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
  });

  test("renders the dock with core apps", async ({ page }) => {
    await expect(dock(page)).toBeVisible();
    await expect(dockButton(page, "Finder")).toBeVisible();
    await expect(dockButton(page, "Launchpad")).toBeVisible();
    await expect(dockButton(page, "Trash")).toBeVisible();
  });

  test("renders the top menu bar (banner) with the clock", async ({ page }) => {
    const banner = page.getByRole("banner");
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("button", { name: "Spotlight" })).toBeVisible();
    // Clock shows a time such as "10:24" or "10:24 AM".
    await expect(banner).toContainText(/\d{1,2}:\d{2}/);
  });

  test("launches Calculator from the dock and accepts input", async ({
    page,
  }) => {
    await dockButton(page, "Calculator").click();

    // Window rendered -> number pad is visible.
    const seven = page.getByRole("button", { name: "7", exact: true });
    await expect(seven).toBeVisible({ timeout: 15_000 });

    // Digits are language-independent, so entering 7-8-9 is a stable check.
    await seven.click();
    await page.getByRole("button", { name: "8", exact: true }).click();
    await page.getByRole("button", { name: "9", exact: true }).click();

    await expect(page.getByText("789", { exact: true })).toBeVisible();
  });
});
