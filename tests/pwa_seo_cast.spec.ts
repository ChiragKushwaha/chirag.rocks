import { test, expect } from "@playwright/test";
import { gotoDesktop } from "./helpers";

test.describe("PWA, SEO, Agent Navigation & Web Capabilities", () => {
  test("PWA manifest meets all PWA builder guidelines with dual screenshots and required fields", async ({
    request,
  }) => {
    const res = await request.get("/manifest.json");
    expect(res.ok()).toBeTruthy();
    const manifest = await res.json();

    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBeTruthy();
    expect(manifest.background_color).toBeTruthy();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    // Verify maskable and standard icons
    const hasAny = manifest.icons.some((i: { purpose?: string }) =>
      i.purpose?.includes("any")
    );
    const hasMaskable = manifest.icons.some((i: { purpose?: string }) =>
      i.purpose?.includes("maskable")
    );
    expect(hasAny).toBeTruthy();
    expect(hasMaskable).toBeTruthy();

    // Verify dual screenshots (wide and narrow for PWA Builder 100% score)
    const wideScreenshot = manifest.screenshots.find(
      (s: { form_factor?: string }) => s.form_factor === "wide"
    );
    const narrowScreenshot = manifest.screenshots.find(
      (s: { form_factor?: string }) => s.form_factor === "narrow"
    );
    expect(wideScreenshot).toBeTruthy();
    expect(narrowScreenshot).toBeTruthy();

    // Verify shortcuts and categories
    expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(1);
    expect(manifest.categories.length).toBeGreaterThanOrEqual(1);
  });

  test("llms.txt and llms-full.txt are served for AI agent discovery and navigation", async ({
    request,
  }) => {
    const res1 = await request.get("/llms.txt");
    expect(res1.ok()).toBeTruthy();
    const text1 = await res1.text();
    expect(text1).toContain("Chirag Kushwaha");
    expect(text1).toContain("macOS");

    const res2 = await request.get("/llms-full.txt");
    expect(res2.ok()).toBeTruthy();
    const text2 = await res2.text();
    expect(text2).toContain("Core Competencies");
    expect(text2).toContain("Sacred Texts");
  });

  test("SEO provides hreflang alternates for locales and x-default", async ({
    page,
  }) => {
    await gotoDesktop(page);

    const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
    await expect(xDefault).toHaveAttribute("href", "https://chirag.rocks/en");

    const enAlternate = page.locator('link[rel="alternate"][hreflang="en"]');
    await expect(enAlternate).toHaveAttribute("href", "https://chirag.rocks/en");
  });

  test("Schema.org includes Person, WebApplication, ProfilePage, and WebSite", async ({
    page,
  }) => {
    await gotoDesktop(page);

    const script = page.locator('script[type="application/ld+json"]');
    await expect(script).toBeAttached();
    const json = JSON.parse((await script.textContent()) || "{}");

    const types = (json["@graph"] || []).map((item: { "@type": string }) => item["@type"]);
    expect(types).toContain("Person");
    expect(types).toContain("WebApplication");
    expect(types).toContain("WebSite");
    expect(types).toContain("ProfilePage");
    expect(types).toContain("BreadcrumbList");
  });

  test("WCAG AAA skip links are present in DOM for keyboard and agent navigation", async ({
    page,
  }) => {
    await gotoDesktop(page);

    const desktopSkip = page.locator('a[href="#main-desktop-area"]');
    await expect(desktopSkip).toBeAttached();

    const menuSkip = page.locator('a[href="#main-menubar"]');
    await expect(menuSkip).toBeAttached();

    const dockSkip = page.locator('a[href="#main-dock"]');
    await expect(dockSkip).toBeAttached();
  });
});
