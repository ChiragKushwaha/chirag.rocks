import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
}

interface IncomingCall {
  from: string;
  name: string;
  signal: any;
}

interface SocketState {
  socket: Socket | null;
  users: User[];
  me: User | null;
  isConnected: boolean;
  incomingCall: IncomingCall | null;
  isCallActive: boolean;

  connect: (userName: string) => void;
  disconnect: () => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  setCallActive: (active: boolean) => void;
}

const SOCKET_URL = "https://mac-os-socket-server.onrender.com";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  users: [],
  me: null,
  isConnected: false,
  incomingCall: null,
  isCallActive: false,

  connect: (userName: string) => {
    const currentSocket = get().socket;
    if (currentSocket) return;

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to socket server");
      socket.emit("join-user", userName);
    });

    socket.on("update-user-list", (users: User[]) => {
      set({ users: users.filter((u) => u.id !== socket.id) });
    });

    socket.on("me", (id: string) => {
      set({ me: { id, name: userName }, isConnected: true });
    });

    socket.on(
      "call-made",
      (data: { offer: any; socket: string; name: string }) => {
        set({
          incomingCall: {
            from: data.socket,
            name: data.name,
            signal: data.offer,
          },
        });
      }
    );

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, users: [], me: null });
    }
  },

  setIncomingCall: (call) => set({ incomingCall: call }),
  setCallActive: (active) => set({ isCallActive: active }),
}));
