import { test, expect } from "@playwright/test";

test.describe("Routing & SEO", () => {
  test("root redirects to the default (en) locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en(\/|$)/);
  });

  test("localized home renders with a title and lang attribute", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("Arabic locale is served with the correct lang attribute", async ({
    page,
  }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  });

  test("exposes Open Graph and description metadata", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.locator('meta[property="og:title"]')
    ).toHaveAttribute("content", /.+/);
    await expect(
      page.locator('meta[name="description"]')
    ).toHaveAttribute("content", /.+/);
  });

  test("emits JSON-LD structured data", async ({ page }) => {
    await page.goto("/en");
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(jsonLd).toBeTruthy();
    const parsed = JSON.parse(jsonLd ?? "{}");
    expect(parsed["@context"]).toBe("https://schema.org");
  });

  test("robots.txt allows crawling and references the sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/user-agent:\s*\*/i);
    expect(body).toMatch(/allow:\s*\//i);
    expect(body).toContain("https://chirag.rocks/sitemap.xml");
  });

  test("sitemap.xml lists the base URL and localized routes", async ({
    request,
  }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("https://chirag.rocks/en");
    expect(body).toContain("https://chirag.rocks/ja");
  });

  test("unknown locale returns 404", async ({ page }) => {
    const res = await page.goto("/zz-not-a-locale");
    expect(res?.status()).toBe(404);
  });
});
