import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface User {
  id: string;
  name: string;
}

// Store users: { socketId: { id, name } }
const users: Record<string, User> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (name: string) => {
    users[socket.id] = { id: socket.id, name };
    io.emit("users-list", Object.values(users));
    console.log(`${name} joined.`);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users-list", Object.values(users));
    console.log("User disconnected:", socket.id);
  });

  // Chat
  socket.on("message", (data: any) => {
    // data: { to, from, text }
    if (data.to) {
      io.to(data.to).emit("message", data);
    } else {
      // Broadcast if no 'to' (optional, or group chat)
      socket.broadcast.emit("message", data);
    }
  });

  // Call Signaling
  socket.on("call-user", (data: any) => {
    // data: { userToCall, signalData, from }
    io.to(data.userToCall).emit("call-made", {
      signal: data.signalData,
      from: data.from,
      name: users[socket.id]?.name,
    });
  });

  socket.on("make-answer", (data: any) => {
    // data: { signal, to }
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

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
