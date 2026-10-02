const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

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
