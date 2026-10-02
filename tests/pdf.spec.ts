import { test, expect } from "@playwright/test";
import { gotoDesktop, dockButton } from "./helpers";

test.describe("PDF Viewer & Resume", () => {
  test.beforeEach(async ({ page }) => {
    await gotoDesktop(page);
  });

  test("opens PDFViewer from Desktop and renders resume pages", async ({ page }) => {
    const resumeIcon = page.getByText("Resume.pdf");
    await expect(resumeIcon).toBeVisible({ timeout: 15000 });

    await resumeIcon.dblclick();

    // Check that canvas elements (PDF page renders) are visible
    const pdfPage = page.locator(".react-pdf__Page").first();
    await expect(pdfPage).toBeVisible({ timeout: 15000 });

    // Check toolbar controls
    await expect(page.getByRole("button", { name: "Zoom In" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Zoom Out" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Download PDF" })).toBeVisible();
  });

  test("opens Preview from Launchpad and renders default resume", async ({ page }) => {
    await dockButton(page, "Launchpad").click();
    const previewBtn = page.getByText("Preview").first();
    await expect(previewBtn).toBeVisible({ timeout: 10000 });

    await previewBtn.click();

    // Expect PDF page to be rendered
    const pdfPage = page.locator(".react-pdf__Page").first();
    await expect(pdfPage).toBeVisible({ timeout: 15000 });
  });

  test("subsequent opening of Resume after closing does not show failed to load error", async ({ page }) => {
    const resumeIcon = page.getByText("Resume.pdf");
    await expect(resumeIcon).toBeVisible({ timeout: 15000 });

    // 1st opening
    await resumeIcon.dblclick();
    const pdfPageFirst = page.locator(".react-pdf__Page").first();
    await expect(pdfPageFirst).toBeVisible({ timeout: 15000 });

    // Close the window via traffic light Close button
    const closeBtn = page.getByRole("button", { name: "Close" }).last();
    await closeBtn.click();
    await expect(pdfPageFirst).not.toBeVisible({ timeout: 5000 });

    // 2nd opening (subsequent opening)
    await resumeIcon.dblclick();
    const pdfPageSecond = page.locator(".react-pdf__Page").first();
    await expect(pdfPageSecond).toBeVisible({ timeout: 15000 });

    // Ensure no error banner is displayed
    await expect(page.getByText("Failed to load PDF file")).not.toBeVisible();
    await expect(page.getByText("Retry")).not.toBeVisible();
  });
});
