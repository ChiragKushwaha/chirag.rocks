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
    const headers = new Headers();

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
      if (val) headers.set(h, val);
    });

    // Forward Range header for video/audio streams
    const range = request.headers.get("range");
    if (range) headers.set("Range", range);

    // Spoof referrer and origin to bypass basic hotlink/security restrictions
    headers.set("Referer", targetUrl.origin + "/");
    headers.set("Origin", targetUrl.origin);

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
      headers,
      body,
      redirect: "follow",
    });

    // Create custom response headers
    const resHeaders = new Headers();
    const headersToForward = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "set-cookie",
    ];
    headersToForward.forEach((h) => {
      const val = response.headers.get(h);
      if (val) resHeaders.set(h, val);
    });

    // Inject CORS headers so that client-side fetch overrides don't hit pre-flight blocks
    resHeaders.set("Access-Control-Allow-Origin", "*");
    resHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    resHeaders.set("Access-Control-Allow-Headers", "*");

    // Check if the response is HTML
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      let text = await response.text();

      // Resolve redirect url to use as the base tag reference
      const finalUrl = response.url || url;

      // Inject <base> tag to force relative asset URLs (JS, CSS, images) to load directly from target origin
      const headRegex = /<head(?:\s[^>]*)?>/i;
      const htmlRegex = /<html(?:\s[^>]*)?>/i;
      if (headRegex.test(text)) {
        text = text.replace(headRegex, (match) => `${match}<base href="${finalUrl}" />`);
      } else if (htmlRegex.test(text)) {
        text = text.replace(
          htmlRegex,
          (match) => `${match}<head><base href="${finalUrl}" /></head>`
        );
      }

      // Inject sandbox container hooks (intercepts link clicks, forms, and fetch/XHR AJAX queries)
      const metadataScript = `
        <script>
          (function() {
            window.__PROXY_FINAL_URL__ = "${finalUrl}";
            // 1. Dispatch page details (title, favicon, current url) back to Safari app UI
            function sendMetadata() {
              try {
                const title = document.title || window.location.href;
                let icon = "";
                const links = document.getElementsByTagName("link");
                for (let i = 0; i < links.length; i++) {
                  if (links[i].rel.includes("icon")) {
                    icon = links[i].href;
                    break;
                  }
                }
                if (!icon) {
                  icon = new URL("/favicon.ico", window.location.href).href;
                }
                const currentUrl = window.__PROXY_FINAL_URL__ || window.location.href;
                window.parent.postMessage({ type: "safari-metadata", title, icon, url: currentUrl }, "*");
              } catch (e) {
                console.error("Metadata extraction failed", e);
              }
            }
            window.addEventListener("load", sendMetadata);
            if (document.readyState === "complete") sendMetadata();

            // Observe dynamic title modifications
            const titleEl = document.querySelector('title');
            if (titleEl) {
              const observer = new MutationObserver(sendMetadata);
              observer.observe(titleEl, { childList: true, characterData: true });
            }

            // 2. Intercept link navigations to remain within proxy sandbox
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href) {
                const targetUrl = link.href;
                if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                  const targetObj = new URL(targetUrl);
                  // Allow direct interaction with proxy-specific links
                  if (targetObj.origin === window.location.origin && targetObj.pathname === '/api/proxy') {
                    return;
                  }
                  // Handle target="_blank" links by sending request to open new tab
                  if (link.target === '_blank') {
                    e.preventDefault();
                    e.stopPropagation();
                    window.parent.postMessage({ type: 'safari-new-tab', url: targetUrl }, '*');
                    return;
                  }
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/api/proxy?url=' + encodeURIComponent(targetUrl);
                }
              }
            }, true);

            // 3. Intercept GET and POST forms to forward payloads through route handler
            document.addEventListener('submit', function(e) {
              const form = e.target;
              if (form.action) {
                const targetUrl = form.action;
                if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                  e.preventDefault();
                  e.stopPropagation();

                  const method = (form.method || 'GET').toUpperCase();
                  if (method === 'GET') {
                    const formData = new FormData(form);
                    const params = new URLSearchParams();
                    for (const [key, value] of formData.entries()) {
                      params.append(key, value.toString());
                    }
                    const separator = targetUrl.includes('?') ? '&' : '?';
                    const finalUrl = targetUrl + separator + params.toString();
                    window.location.href = '/api/proxy?url=' + encodeURIComponent(finalUrl);
                  } else {
                    const proxyForm = document.createElement('form');
                    proxyForm.method = 'POST';
                    proxyForm.action = '/api/proxy?url=' + encodeURIComponent(targetUrl);

                    const formData = new FormData(form);
                    for (const [key, value] of formData.entries()) {
                      const input = document.createElement('input');
                      input.type = 'hidden';
                      input.name = key;
                      input.value = value.toString();
                      proxyForm.appendChild(input);
                    }

                    document.body.appendChild(proxyForm);
                    proxyForm.submit();
                    document.body.removeChild(proxyForm);
                  }
                }
              }
            }, true);

            // 4. Override Fetch API to bypass CORS limitations
            const originalFetch = window.fetch;
            window.fetch = function(input, init) {
              let url = '';
              if (typeof input === 'string') {
                url = input;
              } else if (input instanceof URL) {
                url = input.href;
              } else if (input && input.url) {
                url = input.url;
              }

              const absoluteUrl = new URL(url, window.location.href).href;

              if (absoluteUrl.startsWith('http') && !absoluteUrl.startsWith(window.location.origin)) {
                const proxyUrl = '/api/proxy?url=' + encodeURIComponent(absoluteUrl);
                if (typeof input === 'string') {
                  return originalFetch(proxyUrl, init);
                } else {
                  const newRequest = new Request(proxyUrl, init);
                  return originalFetch(newRequest);
                }
              }
              return originalFetch(input, init);
            };

            // 5. Override XMLHttpRequest API to bypass CORS limitations
            const originalOpen = window.XMLHttpRequest.prototype.open;
            window.XMLHttpRequest.prototype.open = function(method, url, ...args) {
              const absoluteUrl = new URL(url, window.location.href).href;
              if (absoluteUrl.startsWith('http') && !absoluteUrl.startsWith(window.location.origin)) {
                const proxyUrl = '/api/proxy?url=' + encodeURIComponent(absoluteUrl);
                return originalOpen.call(this, method, proxyUrl, ...args);
              }
              return originalOpen.call(this, method, url, ...args);
            };
          })();
        </script>
      `;

      const bodyCloseRegex = /<\/body>/i;
      if (bodyCloseRegex.test(text)) {
        text = text.replace(bodyCloseRegex, (match) => `${metadataScript}${match}`);
      } else {
        text += metadataScript;
      }

      return new NextResponse(text, {
        status: response.status,
        headers: resHeaders,
      });
    } else {
      // Stream assets (CSS, JS, images, media)
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
