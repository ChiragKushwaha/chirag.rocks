import { test, expect } from "@playwright/test";
import { gotoDesktop, openLaunchpad, openSpotlight, WEB_APPS } from "./helpers";

test.describe("External web-apps · Launchpad", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
    await openLaunchpad(page);
  });

  test("all four external web-apps are registered", async ({ page }) => {
    for (const app of WEB_APPS) {
      await expect(
        page.getByRole("button", { name: `Launch ${app.name}` })
      ).toBeVisible();
    }
  });

  test("each web-app renders a custom SVG icon", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Search applications" });
    for (const app of WEB_APPS) {
      await search.fill(app.name);
      const tile = page.getByRole("button", { name: `Launch ${app.name}` });
      await expect(tile).toBeVisible();
      await expect(tile.locator("svg").first()).toBeVisible();
    }
  });

  for (const app of WEB_APPS) {
    test(`${app.name} asks to open ${app.domain} in a new window`, async ({
      page,
    }) => {
      const search = page.getByRole("textbox", {
        name: "Search applications",
      });
      await search.fill(app.name);
      await page.getByRole("button", { name: `Launch ${app.name}` }).click();

      // The external-link confirmation names the destination domain.
      await expect(page.getByText("Do you want to allow this?")).toBeVisible();
      await expect(page.getByText(app.domain)).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Allow", exact: true })
      ).toBeVisible();

      // Dismiss without leaving the page.
      await page.getByRole("button", { name: "Don't Allow" }).click();
      await expect(page.getByText("Do you want to allow this?")).toHaveCount(0);
    });
  }
});

test.describe("External web-apps · Spotlight", () => {
  test("all four web-apps are searchable in Spotlight", async ({ page }) => {
    await gotoDesktop(page);

    for (const app of WEB_APPS) {
      await openSpotlight(page);
      const box = page.getByRole("combobox");
      await box.fill(app.name);
      await expect(
        page.getByRole("option", { name: `Open ${app.name}` })
      ).toBeVisible({ timeout: 15_000 });

      // Reset for the next lookup.
      await box.clear();
      await page.keyboard.press("Escape");
    }
  });
});
