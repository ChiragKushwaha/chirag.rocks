import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  try {
    const targetUrl = new URL(url);
    const reqHeaders = new Headers();

    // Forward standard headers to the destination site
    const reqHeadersToForward = [
      "user-agent",
      "accept",
      "accept-language",
      "cookie",
      "content-type",
    ];
    reqHeadersToForward.forEach((h) => {
      const val = request.headers.get(h);
      if (val) reqHeaders.set(h, val);
    });

    // Forward Range header for video/audio streams
    const range = request.headers.get("range");
    if (range) reqHeaders.set("Range", range);

    // Spoof referrer and origin to bypass basic hotlink/security restrictions
    reqHeaders.set("Referer", targetUrl.origin + "/");
    reqHeaders.set("Origin", targetUrl.origin);

    // Read the request body for POST/PUT methods
    let body: ArrayBuffer | undefined = undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        body = await request.arrayBuffer();
      } catch (e) {
        console.warn("Failed to parse request body:", e);
      }
    }

    const response = await fetch(url, {
      method: request.method,
      headers: reqHeaders,
      body,
      redirect: "follow",
    });

    // Create custom response headers – strip ALL security headers by not forwarding them
    const resHeaders = new Headers();
    const headersToForward = [
      "content-type",
      "content-range",
      "accept-ranges",
    ];
    headersToForward.forEach((h) => {
      const val = response.headers.get(h);
      if (val) resHeaders.set(h, val);
    });

    // CORS + expose final URL
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    resHeaders.set("Access-Control-Allow-Headers", "*");
    const finalUrl = response.url || url;
    resHeaders.set("x-final-url", finalUrl);
    resHeaders.set("Access-Control-Expose-Headers", "x-final-url");

    // ── HTML: rewrite all asset URLs server-side ──────────────────────────────
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      let html = await response.text();

      // Derive the proxy origin from the incoming request
      const host = request.headers.get("host") || "localhost:3000";
      const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
      const proxyOrigin = `${isLocalhost ? "http" : "https"}://${host}`;
      const proxyBase = `${proxyOrigin}/api/proxy?url=`;

      // Helper: resolve a URL and route it through the proxy
      function toProxy(href: string): string {
        if (!href) return href;
        const t = href.trim();
        if (!t || t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("javascript:") || t.startsWith("#")) return t;
        try {
          const abs = new URL(t, finalUrl).href;
          if (abs.startsWith("http://") || abs.startsWith("https://")) {
            return proxyBase + encodeURIComponent(abs);
          }
        } catch { /* ignore */ }
        return href;
      }

      // Helper: rewrite srcset values
      function proxySrcset(srcset: string): string {
        return srcset.split(",").map(entry => {
          const parts = entry.trim().split(/\s+/);
          if (!parts.length) return entry;
          parts[0] = toProxy(parts[0]);
          return parts.join(" ");
        }).join(", ");
      }

      // Helper: rewrite CSS url() references
      function proxyCss(css: string): string {
        return css.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi, (_m, q, u) => `url(${q}${toProxy(u)}${q})`);
      }

      // Remove any existing <base> tags (they'd bypass proxy for remaining relative URLs)
      html = html.replace(/<base\s[^>]*>/gi, "");

      // <script src="..."> — must come BEFORE other replacements to avoid double-rewriting
      html = html.replace(/<script(\s[^>]*?)>/gi, (match: string, attrs: string) =>
        match.replace(/\bsrc=(["'])([^"']*)\1/gi, (_: string, q: string, s: string) => `src=${q}${toProxy(s)}${q}`)
      );

      // <link href="...">
      html = html.replace(/<link(\s[^>]*?)>/gi, (match: string) =>
        match.replace(/\bhref=(["'])([^"']*)\1/gi, (_: string, q: string, s: string) => `href=${q}${toProxy(s)}${q}`)
      );

      // <a href="..."> — rewrite to proxy and preserve original in data-proxy-href
      html = html.replace(/<a(\s[^>]*?)href=(["'])([^"']*)\2/gi, (_: string, attrs: string, q: string, href: string) =>
        `<a${attrs}href=${q}${toProxy(href)}${q} data-proxy-href=${q}${href}${q}`
      );

      // <img src srcset data-src data-srcset>
      html = html.replace(/<img(\s[^>]*?)>/gi, (_: string, attrs: string) => {
        let a = attrs;
        a = a.replace(/\bsrc=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `src=${q}${toProxy(s)}${q}`);
        a = a.replace(/\bsrcset=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `srcset=${q}${proxySrcset(s)}${q}`);
        a = a.replace(/\bdata-src=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `data-src=${q}${toProxy(s)}${q}`);
        a = a.replace(/\bdata-srcset=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `data-srcset=${q}${proxySrcset(s)}${q}`);
        return `<img${a}>`;
      });

      // <source srcset src>
      html = html.replace(/<source(\s[^>]*?)>/gi, (_: string, attrs: string) => {
        let a = attrs;
        a = a.replace(/\bsrc=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `src=${q}${toProxy(s)}${q}`);
        a = a.replace(/\bsrcset=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `srcset=${q}${proxySrcset(s)}${q}`);
        return `<source${a}>`;
      });

      // <video> <audio>
      html = html.replace(/<(video|audio)(\s[^>]*?)>/gi, (_: string, tag: string, attrs: string) => {
        const a = attrs.replace(/\bsrc=(["'])([^"']*)\1/gi, (_2: string, q: string, s: string) => `src=${q}${toProxy(s)}${q}`);
        return `<${tag}${a}>`;
      });

      // Inline style="..." attributes
      html = html.replace(/\bstyle=(["'])([^"']*)\1/gi, (_: string, q: string, css: string) =>
        `style=${q}${proxyCss(css)}${q}`
      );

      // <style> blocks
      html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (_: string, open: string, css: string, close: string) =>
        `${open}${proxyCss(css)}${close}`
      );

      // Inject fetch/XHR override + metadata postMessage script
      const proxyBaseLiteral = proxyBase.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
      const metadataScript = `
<script>
(function() {
  var __PURL__ = ${JSON.stringify(finalUrl)};
  var __PROXY__ = ${JSON.stringify(proxyBase)};

  // Send page metadata to parent Safari UI
  function sendMeta() {
    try {
      var title = document.title || __PURL__;
      var icon = '';
      var links = document.querySelectorAll('link[rel*="icon"]');
      if (links.length) icon = links[0].href;
      if (!icon) icon = new URL('/favicon.ico', __PURL__).href;
      window.parent.postMessage({ type: 'safari-metadata', title: title, icon: icon, url: __PURL__ }, '*');
    } catch(e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendMeta);
  } else { sendMeta(); }
  window.addEventListener('load', sendMeta);
  var _te = document.querySelector('title');
  if (_te) new MutationObserver(sendMeta).observe(_te, { childList: true, characterData: true, subtree: true });

  // Override fetch to route cross-origin requests through proxy
  var _fetch = window.fetch;
  window.fetch = function(input, init) {
    var u = typeof input === 'string' ? input : (input && (input.url || input));
    try {
      var abs = new URL(u, __PURL__).href;
      if ((abs.startsWith('http://') || abs.startsWith('https://')) && abs.indexOf('/api/proxy') === -1) {
        var pu = __PROXY__ + encodeURIComponent(abs);
        return _fetch(typeof input === 'string' ? pu : new Request(pu, init), typeof input === 'string' ? init : undefined);
      }
    } catch(e) {}
    return _fetch(input, init);
  };

  // Override XHR
  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(m, u) {
    try {
      var abs = new URL(u, __PURL__).href;
      if ((abs.startsWith('http://') || abs.startsWith('https://')) && abs.indexOf('/api/proxy') === -1) {
        return _open.apply(this, [m, __PROXY__ + encodeURIComponent(abs)].concat(Array.prototype.slice.call(arguments, 2)));
      }
    } catch(e) {}
    return _open.apply(this, arguments);
  };
})();
</script>`;

      const bodyCloseRegex = /<\/body>/i;
      if (bodyCloseRegex.test(html)) {
        html = html.replace(bodyCloseRegex, metadataScript + "</body>");
      } else {
        html += metadataScript;
      }

      return new NextResponse(html, {
        status: response.status,
        headers: resHeaders,
      });
    } else {
      // Stream assets (CSS, JS, images, media) as-is
      return new NextResponse(response.body, {
        status: response.status,
        headers: resHeaders,
      });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Error fetching URL", { status: 500 });
  }
}
