import { test, expect } from "@playwright/test";

test.describe("API routes", () => {
  test("GET /api/stocks without a symbol returns 400", async ({ request }) => {
    const res = await request.get("/api/stocks");
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  test("GET /api/stocks?symbol=AAPL responds with JSON", async ({
    request,
  }) => {
    const res = await request.get("/api/stocks?symbol=AAPL");
    expect(res.headers()["content-type"]).toContain("application/json");
    const body = await res.json();
    // Upstream may be reachable (200 with a chart) or rate-limited (5xx with an
    // error) — both are valid JSON responses from our route.
    if (res.ok()) {
      expect(body.chart).toBeTruthy();
    } else {
      expect(body.error).toBeTruthy();
    }
  });

  test("GET /api/proxy without a url returns 400", async ({ request }) => {
    const res = await request.get("/api/proxy");
    expect(res.status()).toBe(400);
    expect(await res.text()).toContain("Missing URL parameter");
  });

  test("GET /api/photos responds with a photos payload", async ({
    request,
  }) => {
    const res = await request.get("/api/photos");
    // The route always returns JSON (an array of photos, possibly empty).
    expect(res.headers()["content-type"]).toContain("application/json");
    const body = await res.json();
    expect(Array.isArray(body.photos)).toBeTruthy();
  });
});
