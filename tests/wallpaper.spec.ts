import { test, expect } from "@playwright/test";
import { gotoDesktop } from "./helpers";

test.describe("Wallpaper selection & Big Sur shell", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
  });

  test("right clicking desktop and selecting Change Wallpaper opens System Settings to Wallpaper tab", async ({
    page,
  }) => {
    // Right click on empty desktop area
    await page.mouse.click(200, 200, { button: "right" });

    // Context menu should show Change Wallpaper
    const changeWallpaperItem = page.getByRole("button", {
      name: /Change Wallpaper/i,
    });
    await expect(changeWallpaperItem).toBeVisible({ timeout: 5000 });
    await changeWallpaperItem.click();

    // System Settings window should appear
    const settingsTitle = page.getByRole("heading", {
      name: "Wallpaper",
      exact: true,
    }).first();
    await expect(settingsTitle).toBeVisible({ timeout: 10000 });
  });

  test("switching wallpapers updates the desktop wallpaper image source", async ({
    page,
  }) => {
    // Open System Settings via Dock
    const dock = page.getByRole("list", { name: "Application dock" });
    await dock.getByRole("button", { name: "System Settings", exact: false }).click();

    // Click Wallpaper in Settings sidebar
    const wallpaperNav = page
      .getByRole("button", { name: "Wallpaper", exact: true })
      .first();
    await expect(wallpaperNav).toBeVisible({ timeout: 10000 });
    await wallpaperNav.click();

    // Find the wallpaper thumbnail options
    const coastOption = page.getByRole("button", { name: "Big Sur Coast" });
    await expect(coastOption).toBeVisible({ timeout: 10000 });

    // Initial wallpaper image
    const wallpaperImg = page.locator('img[alt="Wallpaper"]');
    await expect(wallpaperImg).toBeVisible();

    // Click Big Sur Coast
    await coastOption.click();

    // Desktop wallpaper src should update to BigSurCoast
    await expect(wallpaperImg).toHaveAttribute(
      "src",
      /BigSurCoast/,
      { timeout: 10000 }
    );

    // Click Monterey
    const montereyOption = page.getByRole("button", { name: "Monterey" });
    await montereyOption.click();

    await expect(wallpaperImg).toHaveAttribute(
      "src",
      /Monterey/,
      { timeout: 10000 }
    );
  });
});
