const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const fs = require("fs");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);

        // Ensure PDF worker is always served with strict application/javascript MIME type
        if (
          parsedUrl.pathname === "/pdf.worker.min.mjs" ||
          parsedUrl.pathname === "/api/pdf-worker"
        ) {
          const workerPath = path.join(__dirname, "public", "pdf.worker.min.mjs");
          if (fs.existsSync(workerPath)) {
            res.writeHead(200, {
              "Content-Type": "application/javascript; charset=utf-8",
              "Cache-Control": "public, max-age=31536000, immutable",
            });
            fs.createReadStream(workerPath).pipe(res);
            return;
          }
        }

        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error handling request:", req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    });

    server.once("error", (err) => {
      console.error("Server error:", err);
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`> Next.js production server ready on http://${hostname}:${port}`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      if (server && server.listening) {
        server.close((err) => {
          if (err) {
            console.error("Error during server.close:", err);
          }
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    process.exit(1);
  });
