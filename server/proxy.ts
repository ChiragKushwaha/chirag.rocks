import express from "express";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

const app = express();
const PORT = 3002;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://chirag-rocks.vercel.app",
  ];
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Handle CORS preflight requests
app.options("/proxy", (req, res) => {
  res.sendStatus(200);
});

app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).send("Missing URL parameter");
    return;
  }

  try {
    const headers: HeadersInit = {};

    // Forward standard headers
    const reqHeadersToForward = ["user-agent", "accept", "accept-language"];
    reqHeadersToForward.forEach((h) => {
      if (req.headers[h]) {
        headers[h] = req.headers[h] as string;
      }
    });

    // Forward Range header for video seeking
    if (req.headers.range) {
      headers["Range"] = req.headers.range;
    }

    // Spoof Referer to satisfy hotlink protection
    try {
      const targetUrl = new URL(url);
      headers["Referer"] = targetUrl.origin + "/";
      headers["Origin"] = targetUrl.origin;
    } catch (e) {
      // Ignore invalid URLs
    }

    const response = await fetch(url, { headers });
    const contentType = response.headers.get("content-type");

    // Forward critical headers
    const headersToForward = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
    ];
    headersToForward.forEach((header) => {
      const value = response.headers.get(header);
      if (value) {
        res.setHeader(header, value);
      }
    });

    // Handle status code (e.g., 206 Partial Content)
    res.status(response.status);

    if (contentType && contentType.includes("text/html")) {
      const text = await response.text();

      // Inject <base> tag to fix relative links
      let modifiedHtml = text;
      if (text.includes("<head>")) {
        modifiedHtml = text.replace("<head>", `<head><base href="${url}" />`);
      } else if (text.includes("<html>")) {
        modifiedHtml = text.replace(
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

      if (modifiedHtml.includes("</body>")) {
        modifiedHtml = modifiedHtml.replace(
          "</body>",
          `${metadataScript}</body>`
        );
      } else {
        modifiedHtml += metadataScript;
      }

      res.send(modifiedHtml);
    } else {
      // Stream binary/other content
      if (response.body) {
        // @ts-ignore
        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            return pump();
            function pump(): Promise<void> {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });

        // Convert web stream to node stream
        // @ts-ignore
        const nodeStream = Readable.fromWeb(stream);
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    }
  } catch (error) {
    console.error("Proxy error:", error);
    if (!res.headersSent) {
      res.status(500).send("Error fetching URL");
    }
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
