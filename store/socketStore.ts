/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { create } from "zustand";

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

export interface MockSocket {
  id: string;
  on: (event: string, callback: any) => void;
  off: (event: string, callback: any) => void;
  emit: (event: string, data: any) => void;
  trigger: (event: string, data: any) => void;
  disconnect: () => void;
}

class CustomMockSocket implements MockSocket {
  public id: string;
  private listeners: Record<string, Function[]> = {};

  constructor(id: string) {
    this.id = id;
  }

  on(event: string, callback: any) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  off(event: string, callback: any) {
    if (!this.listeners[event]) return this;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    return this;
  }

  emit(event: string, data: any) {
    const toId = data.to || data.userToCall;
    if (!toId) {
      console.warn(`Attempted to emit ${event} without a destination target.`);
      return this;
    }

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "send",
        from: this.id,
        to: toId,
        event,
        data,
      }),
    }).catch((err) => console.error("Failed to emit event:", err));
    return this;
  }

  trigger(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  disconnect() {
    this.listeners = {};
  }
}

interface SocketState {
  socket: MockSocket | null;
  users: User[];
  me: User | null;
  isConnected: boolean;
  incomingCall: IncomingCall | null;
  isCallActive: boolean;
  messages: Record<string, Message[]>;
  pollIntervalId: any | null;

  connect: (userName: string) => void;
  disconnect: () => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  setCallActive: (active: boolean) => void;
  sendMessage: (to: string, text: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  users: [],
  me: null,
  isConnected: false,
  incomingCall: null,
  isCallActive: false,
  messages: {},
  pollIntervalId: null,

  connect: async (userName: string) => {
    // Generate or fetch client userId
    let clientUserId = typeof window !== "undefined" ? window.sessionStorage.getItem("chat_user_id") : null;
    if (!clientUserId) {
      clientUserId = "user_" + Math.random().toString(36).substring(2, 11);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("chat_user_id", clientUserId);
      }
    }

    const nameToRegister = userName.trim() || `Guest_${clientUserId.substring(5, 9)}`;

    // Avoid duplicate connections
    if (get().isConnected && get().me?.name === nameToRegister) return;

    // Disconnect existing if any
    get().disconnect();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          userId: clientUserId,
          name: nameToRegister,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join chat server");
      }

      const mockSocket = new CustomMockSocket(clientUserId);

      // Start polling
      const poll = async () => {
        try {
          const pollResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "poll",
              userId: clientUserId,
              name: nameToRegister,
            }),
          });

          if (!pollResponse.ok) return;

          const data = await pollResponse.json();
          if (data.events && Array.isArray(data.events)) {
            data.events.forEach((event: { type: string; data: any }) => {
              const { type, data: eventData } = event;

              if (type === "update-user-list") {
                set({ users: eventData.filter((u: User) => u.id !== clientUserId) });
              } else if (type === "receive-message") {
                set((state) => {
                  const existing = state.messages[eventData.from] || [];
                  return {
                    messages: {
                      ...state.messages,
                      [eventData.from]: [...existing, { text: eventData.text, isMe: false }],
                    },
                  };
                });
              } else if (type === "call-made") {
                set({
                  incomingCall: {
                    from: eventData.socket,
                    name: eventData.name,
                    signal: eventData.offer,
                  },
                });
                mockSocket.trigger("call-made", eventData);
              } else {
                // Forward FaceTime WebRTC events directly to listeners on the mock socket
                mockSocket.trigger(type, eventData);
              }
            });
          }
        } catch (err) {
          console.error("Error during poll request:", err);
        }
      };

      // Poll immediately and then set interval
      await poll();
      const intervalId = setInterval(poll, 1500);

      set({
        socket: mockSocket,
        me: { id: clientUserId, name: nameToRegister },
        isConnected: true,
        pollIntervalId: intervalId,
      });

      console.log(`Connected to polling server as ${nameToRegister} (${clientUserId})`);
    } catch (error) {
      console.error("Chat connection failed:", error);
    }
  },

  disconnect: () => {
    const { pollIntervalId, socket } = get();
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
    }
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      isConnected: false,
      users: [],
      me: null,
      messages: {},
      pollIntervalId: null,
    });
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
