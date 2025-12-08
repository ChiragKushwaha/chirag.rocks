import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Optional: Use edge runtime for better performance if possible, but Node is fine too. Let's stick to default/Node if we need "stream" module, but fetch is standard.

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 });
  }

  try {
    const targetUrl = new URL(url);
    const headers = new Headers();

    // Forward standard headers
    const reqHeadersToForward = ["user-agent", "accept", "accept-language"];
    reqHeadersToForward.forEach((h) => {
      const val = request.headers.get(h);
      if (val) headers.set(h, val);
    });

    // Forward Range header
    const range = request.headers.get("range");
    if (range) headers.set("Range", range);

    // Spoof Referer/Origin
    headers.set("Referer", targetUrl.origin + "/");
    headers.set("Origin", targetUrl.origin);

    const response = await fetch(url, { headers });

    // Create response headers
    const resHeaders = new Headers();
    const headersToForward = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
    ];
    headersToForward.forEach((h) => {
      const val = response.headers.get(h);
      if (val) resHeaders.set(h, val);
    });

    // If HTML, modify it
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      let text = await response.text();

      // Inject <base> tag
      if (text.includes("<head>")) {
        text = text.replace("<head>", `<head><base href="${url}" />`);
      } else if (text.includes("<html>")) {
        text = text.replace(
          "<html>",
          `<html><head><base href="${url}" /></head>`
        );
      }

      // Inject metadata script
      const metadataScript = `
        <script>
          (function() {
            function sendMetadata() {
              try {
                const title = document.title;
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
                window.parent.postMessage({ type: "safari-metadata", title, icon }, "*");
              } catch (e) {
                console.error("Metadata extraction failed", e);
              }
            }
            window.addEventListener("load", sendMetadata);
            if (document.readyState === "complete") sendMetadata();
          })();
        </script>
      `;

      if (text.includes("</body>")) {
        text = text.replace("</body>", `${metadataScript}</body>`);
      } else {
        text += metadataScript;
      }

      return new NextResponse(text, {
        status: response.status,
        headers: resHeaders,
      });
    } else {
      // Stream binary/other content
      // response.body is a ReadableStream in standard fetch
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
