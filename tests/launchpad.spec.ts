import { test, expect } from "@playwright/test";
import { gotoDesktop, openLaunchpad } from "./helpers";

test.describe("Launchpad", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
    await openLaunchpad(page);
  });

  test("shows a grid of applications", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Launch Finder" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Launch Safari" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Launch Calculator" })
    ).toBeVisible();
  });

  test("search filters the app grid", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Search applications" });
    await search.fill("calc");

    await expect(
      page.getByRole("button", { name: "Launch Calculator" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Launch Safari" })
    ).toHaveCount(0);
  });

  test("closes on Escape", async ({ page }) => {
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Launch Finder" })
    ).toHaveCount(0);
  });
});
