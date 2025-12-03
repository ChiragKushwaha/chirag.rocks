import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);

// Updated CORS configuration to allow specific origins
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://chirag-rocks.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connections: Object.keys(users).length,
  });
});

// Proxy endpoint for Safari app
app.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    res.status(400).send("Missing URL parameter");
    return;
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    const text = await response.text();

    // Inject <base> tag to fix relative links
    // We try to insert it right after <head> or <html> if <head> is missing
    let modifiedHtml = text;
    if (text.includes("<head>")) {
      modifiedHtml = text.replace("<head>", `<head><base href="${url}" />`);
    } else if (text.includes("<html>")) {
      modifiedHtml = text.replace(
        "<html>",
        `<html><head><base href="${url}" /></head>`
      );
    }

    // Forward content type
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.send(modifiedHtml);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Error fetching URL");
  }
});

// CORS middleware for Express routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://chirag-rocks.vercel.app",
  ];

  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app"))
  ) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

interface User {
  id: string;
  name: string;
}

// Store users: { socketId: { id, name } }
const users: Record<string, User> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  // Send the socket ID to the client
  socket.emit("me", socket.id);

  // Handle join-user event (used by FaceTime and Messages)
  socket.on("join-user", (name: string) => {
    users[socket.id] = { id: socket.id, name };
    // Send updated user list to all clients
    io.emit("update-user-list", Object.values(users));
    console.log(`${name} joined as ${socket.id}`);
  });

  // Legacy join event (for backward compatibility)
  socket.on("join", (name: string) => {
    users[socket.id] = { id: socket.id, name };
    io.emit("users-list", Object.values(users));
    io.emit("update-user-list", Object.values(users));
    console.log(`${name} joined.`);
  });

  socket.on("disconnect", () => {
    const userName = users[socket.id]?.name;
    delete users[socket.id];
    io.emit("users-list", Object.values(users));
    io.emit("update-user-list", Object.values(users));
    console.log(`User disconnected: ${userName || socket.id}`);
  });

  // Messages app - send message
  socket.on("send-message", (data: { to: string; text: string }) => {
    io.to(data.to).emit("receive-message", {
      from: socket.id,
      text: data.text,
    });
  });

  // Legacy chat message handler
  socket.on("message", (data: any) => {
    // data: { to, from, text }
    if (data.to) {
      io.to(data.to).emit("message", data);
    } else {
      // Broadcast if no 'to' (optional, or group chat)
      socket.broadcast.emit("message", data);
    }
  });

  // FaceTime - Call Signaling
  socket.on("call-user", (data: any) => {
    // data: { userToCall, signalData, from }
    console.log(`Call from ${socket.id} to ${data.userToCall}`);
    io.to(data.userToCall).emit("call-made", {
      offer: data.signalData,
      socket: socket.id,
      name: users[socket.id]?.name || "Unknown",
    });
  });

  socket.on("make-answer", (data: any) => {
    // data: { signal, to }
    console.log(`Answer from ${socket.id} to ${data.to}`);
    io.to(data.to).emit("answer-made", {
      signal: data.signal,
      answerId: socket.id,
    });
  });

  socket.on("ice-candidate", (data: any) => {
    // data: { to, candidate }
    io.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id,
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
