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

  test("text selection is disabled on desktop and window frames", async ({
    page,
  }) => {
    const bodyUserSelect = await page.evaluate(() => {
      return window.getComputedStyle(document.body).userSelect;
    });
    expect(bodyUserSelect).toBe("none");

    await dockButton(page, "Calculator").click();
    const titlebar = page.locator(".window-titlebar").first();
    await expect(titlebar).toBeVisible({ timeout: 10_000 });

    const titlebarUserSelect = await titlebar.evaluate((el) => {
      return window.getComputedStyle(el).userSelect;
    });
    expect(titlebarUserSelect).toBe("none");
  });

  test("opens Notification Center and renders widgets including Stocks", async ({
    page,
  }) => {
    const clock = page.locator("#menu-bar-clock");
    await expect(clock).toBeVisible();
    await clock.click();

    const notifPanel = page.getByLabel("Notification Center and Widgets");
    await expect(notifPanel).toBeVisible({ timeout: 10_000 });
    await expect(notifPanel).toHaveClass(/translate-x-0/);

    // Verify Stocks widget watchlist is visible inside Notification Center
    await expect(notifPanel.getByText("WATCHLIST")).toBeVisible({ timeout: 10_000 });
    await expect(notifPanel.getByText("AAPL").first()).toBeVisible();

    // Verify Edit Widgets button is present
    await expect(notifPanel.getByRole("button", { name: /Edit Widgets/i })).toBeVisible();
  });

  test("launches System Settings and displays sidebar with functional tabs", async ({
    page,
  }) => {
    await dockButton(page, "System Settings").click();

    // Window appears with System Settings sidebar
    const settingsWindow = page.locator(".window-frame").filter({ has: page.getByRole("button", { name: "Wi-Fi" }) }).first();
    await expect(settingsWindow).toBeVisible({ timeout: 15_000 });

    // Verify Wi-Fi and General are in sidebar
    await expect(settingsWindow.getByRole("button", { name: "Wi-Fi" })).toBeVisible();
    await expect(settingsWindow.getByRole("button", { name: "General" })).toBeVisible();
  });

  test("allows dragging by header, resizing from edges, minimizing with dock preview, and restoring", async ({
    page,
  }) => {
    await dockButton(page, "Calculator").click();
    const windowEl = page.locator(".window-frame").first();
    await expect(windowEl).toBeVisible({ timeout: 10_000 });

    const titlebar = windowEl.locator(".window-titlebar");
    const initialBox = await windowEl.boundingBox();
    expect(initialBox).not.toBeNull();

    // 1. Dragging by titlebar
    const tbox = await titlebar.boundingBox();
    expect(tbox).not.toBeNull();

    await page.mouse.move(tbox!.x + tbox!.width / 2, tbox!.y + tbox!.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(tbox!.x + tbox!.width / 2 + i * 15, tbox!.y + tbox!.height / 2 + i * 8);
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const afterDragBox = await windowEl.boundingBox();
    expect(afterDragBox).not.toBeNull();
    expect(afterDragBox!.x).toBeGreaterThan(initialBox!.x + 100);
    expect(afterDragBox!.y).toBeGreaterThan(initialBox!.y + 50);

    // 2. Resizing from bottom-right corner
    const seHandle = windowEl.locator(".cursor-se-resize");
    await expect(seHandle).toBeVisible();
    const seBox = await seHandle.boundingBox();
    expect(seBox).not.toBeNull();

    await page.mouse.move(seBox!.x + seBox!.width / 2, seBox!.y + seBox!.height / 2);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(seBox!.x + seBox!.width / 2 + i * 10, seBox!.y + seBox!.height / 2 + i * 8);
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const afterResizeBox = await windowEl.boundingBox();
    expect(afterResizeBox).not.toBeNull();
    expect(afterResizeBox!.width).toBeGreaterThan(afterDragBox!.width + 70);
    expect(afterResizeBox!.height).toBeGreaterThan(afterDragBox!.height + 50);

    // 3. Minimizing with preview
    const minimizeBtn = windowEl.locator('button[aria-label="Minimize"]');
    await expect(minimizeBtn).toBeVisible();
    await minimizeBtn.click();
    await page.waitForTimeout(800);
    await expect(windowEl).toBeHidden();

    // Minimized item in dock
    const minimizedItem = page.locator('button[id^="dock-minimized-"]');
    await expect(minimizedItem).toBeVisible();
    await expect(minimizedItem.locator(".rounded-full")).toBeVisible();

    // 4. Restoring window
    await minimizedItem.click();
    await page.waitForTimeout(600);
    await expect(windowEl).toBeVisible();
  });
});


