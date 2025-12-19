import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
}

interface IncomingCall {
  from: string;
  name: string;
  signal: unknown;
}

interface Message {
  text: string;
  isMe: boolean;
}

interface SocketState {
  socket: Socket | null;
  users: User[];
  me: User | null;
  isConnected: boolean;
  incomingCall: IncomingCall | null;
  isCallActive: boolean;
  messages: Record<string, Message[]>;

  connect: (userName: string) => void;
  disconnect: () => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  setCallActive: (active: boolean) => void;
  sendMessage: (to: string, text: string) => void;
}

const SOCKET_URL = "https://chiragrocks-production.up.railway.app";
const ENABLE_SOCKET = true; // Set to true when server is deployed

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  users: [],
  me: null,
  isConnected: false,
  incomingCall: null,
  isCallActive: false,
  messages: {},

  connect: (userName: string) => {
    if (!ENABLE_SOCKET) {
      console.warn(
        "Socket connections are disabled. Deploy the server and set ENABLE_SOCKET=true"
      );
      return;
    }

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
      (data: { offer: unknown; socket: string; name: string }) => {
        set({
          incomingCall: {
            from: data.socket,
            name: data.name,
            signal: data.offer,
          },
        });
      }
    );

    socket.on("receive-message", (data: { from: string; text: string }) => {
      set((state) => {
        const existing = state.messages[data.from] || [];
        return {
          messages: {
            ...state.messages,
            [data.from]: [...existing, { text: data.text, isMe: false }],
          },
        };
      });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        users: [],
        me: null,
        messages: {},
      });
    }
  },

  setIncomingCall: (call) => set({ incomingCall: call }),
  setCallActive: (active) => set({ isCallActive: active }),

  sendMessage: (to: string, text: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit("send-message", { to, text });
      set((state) => {
        const existing = state.messages[to] || [];
        return {
          messages: {
            ...state.messages,
            [to]: [...existing, { text, isMe: true }],
          },
        };
      });
    }
  },
}));
