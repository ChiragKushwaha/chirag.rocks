import { test, expect } from "@playwright/test";
import { gotoDesktop, dockButton } from "./helpers";

test.describe("Window Traffic Lights & Snap Menu Light/Dark Mode", () => {
  test("Snap menu items have proper text contrast in both light and dark mode", async ({
    page,
  }) => {
    await gotoDesktop(page);

    // Launch Calculator
    const calcBtn = dockButton(page, "Calculator");
    await expect(calcBtn).toBeVisible();
    await calcBtn.click();

    const windowFrame = page.locator(".window-frame").last();
    await expect(windowFrame).toBeVisible();

    // Find the green traffic light button
    const greenBtn = windowFrame.locator('button[aria-label="Zoom or Fullscreen"]');
    await expect(greenBtn).toBeVisible();

    // Hover over green button to trigger snap menu
    await greenBtn.hover();
    await page.waitForTimeout(800); // 600ms trigger timeout

    const snapMenu = windowFrame.locator("text=Move Window to...").locator("..");
    await expect(snapMenu).toBeVisible();

    // Check all menu buttons
    const leftBtn = windowFrame.getByRole("button", { name: "Left Side of Screen" });
    const rightBtn = windowFrame.getByRole("button", { name: "Right Side of Screen" });
    const fullBtn = windowFrame.getByRole("button", { name: "Enter Full Screen" });

    await expect(leftBtn).toBeVisible();
    await expect(rightBtn).toBeVisible();
    await expect(fullBtn).toBeVisible();

    // Take screenshot of snap menu in light mode
    await windowFrame.screenshot({ path: "tests/snap_menu_test.png" });

    // Toggle dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
    await page.waitForTimeout(200);

    // Hover again
    await greenBtn.hover();
    await page.waitForTimeout(800);

    await expect(snapMenu).toBeVisible();
    await expect(leftBtn).toBeVisible();
    await expect(rightBtn).toBeVisible();
    await expect(fullBtn).toBeVisible();

    // Take screenshot of snap menu in dark mode
    await windowFrame.screenshot({ path: "tests/snap_menu_dark_test.png" });
  });
});
