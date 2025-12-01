import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  name: string;
}

interface Message {
  from: string;
  text: string;
  timestamp: number;
  isMe: boolean;
}

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  users: User[];
  messages: Record<string, Message[]>; // userId -> messages
  me: User | null;

  // Call State
  incomingCall: { from: string; signal: any; name: string } | null;
  isCallActive: boolean;
  remoteStream: MediaStream | null;
  localStream: MediaStream | null;

  // Actions
  connect: (name: string) => void;
  sendMessage: (to: string, text: string) => void;
  setIncomingCall: (
    call: { from: string; signal: any; name: string } | null
  ) => void;
  setCallActive: (active: boolean) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setLocalStream: (stream: MediaStream | null) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  users: [],
  messages: {},
  me: null,
  incomingCall: null,
  isCallActive: false,
  remoteStream: null,
  localStream: null,

  connect: (name: string) => {
    if (get().socket) return;

    const socket = io("https://honest-art.up.railway.app");

    socket.on("connect", () => {
      set({ isConnected: true, me: { id: socket.id!, name } });
      socket.emit("join", name);
    });

    socket.on("users-list", (users: User[]) => {
      // Filter out self
      set((state) => ({
        users: users.filter((u) => u.id !== state.me?.id),
      }));
    });

    socket.on("message", (data: { from: string; text: string }) => {
      set((state) => {
        const otherId = data.from;
        const newMsg = {
          from: otherId,
          text: data.text,
          timestamp: Date.now(),
          isMe: false,
        };
        return {
          messages: {
            ...state.messages,
            [otherId]: [...(state.messages[otherId] || []), newMsg],
          },
        };
      });
    });

    socket.on("call-made", (data) => {
      set({
        incomingCall: { from: data.from, signal: data.signal, name: data.name },
      });
    });

    set({ socket });
  },

  sendMessage: (to: string, text: string) => {
    const { socket, me } = get();
    if (!socket || !me) return;

    socket.emit("message", { to, from: me.id, text });

    set((state) => {
      const newMsg = {
        from: me.id,
        text,
        timestamp: Date.now(),
        isMe: true,
      };
      return {
        messages: {
          ...state.messages,
          [to]: [...(state.messages[to] || []), newMsg],
        },
      };
    });
  },

  setIncomingCall: (call) => set({ incomingCall: call }),
  setCallActive: (active) => set({ isCallActive: active }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setLocalStream: (stream) => set({ localStream: stream }),
}));
