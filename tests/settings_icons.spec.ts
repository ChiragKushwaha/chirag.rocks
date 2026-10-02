import { test, expect } from "@playwright/test";
import { gotoDesktop, dockButton } from "./helpers";

test.describe("System Settings Icons & Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
  });

  test("Accessibility and Bluetooth icons are perfect 1:1 circles and not squished into ovals", async ({
    page,
  }) => {
    // Open System Settings from Dock
    const settingsBtn = dockButton(page, "System Settings");
    await expect(settingsBtn).toBeVisible({ timeout: 10000 });
    await settingsBtn.click();

    const windowFrame = page.locator(".window-frame").last();
    await expect(windowFrame).toBeVisible({ timeout: 10000 });

    // 1. Accessibility Tab
    const accessibilityTab = windowFrame.getByRole("button", {
      name: "Accessibility",
    });
    await expect(accessibilityTab).toBeVisible();
    await accessibilityTab.click();

    const accessibilityIcon = windowFrame
      .locator('div[class*="bg-[#007AFF]"]')
      .first();
    await expect(accessibilityIcon).toBeVisible();

    const accessBox = await accessibilityIcon.boundingBox();
    expect(accessBox).not.toBeNull();
    // Verify width and height are nearly identical (perfect circle, not squished oval)
    expect(Math.abs(accessBox!.width - accessBox!.height)).toBeLessThanOrEqual(2);
    expect(accessBox!.width).toBeGreaterThanOrEqual(48);

    // Screenshot Accessibility
    await windowFrame.screenshot({
      path: "tests/accessibility_full_window.png",
    });

    // 2. Bluetooth Tab
    const bluetoothTab = windowFrame.getByRole("button", {
      name: "Bluetooth",
    });
    await expect(bluetoothTab).toBeVisible();
    await bluetoothTab.click();

    const bluetoothIcon = windowFrame
      .locator('div[class*="bg-[#007AFF]"]')
      .first();
    await expect(bluetoothIcon).toBeVisible();

    const blueBox = await bluetoothIcon.boundingBox();
    expect(blueBox).not.toBeNull();
    // Verify width and height are nearly identical (perfect circle, not squished oval)
    expect(Math.abs(blueBox!.width - blueBox!.height)).toBeLessThanOrEqual(2);
    expect(blueBox!.width).toBeGreaterThanOrEqual(48);

    // Screenshot Bluetooth
    await windowFrame.screenshot({
      path: "tests/bluetooth_full_window.png",
    });
  });
});
