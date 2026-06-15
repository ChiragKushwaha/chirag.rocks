import { NextRequest, NextResponse } from "next/server";

interface ActiveUser {
  id: string;
  name: string;
  lastSeen: number;
}

interface ChatEvent {
  type: string;
  data: unknown;
}

interface ChatState {
  users: Record<string, ActiveUser>;
  eventQueues: Record<string, ChatEvent[]>;
}

// Keep state in global context to persist across hot reloads in development
const globalForChat = global as unknown as { chatState?: ChatState };
const globalState: ChatState = globalForChat.chatState || {
  users: {},
  eventQueues: {},
};
globalForChat.chatState = globalState;

// Prune inactive users (> 6 seconds since last check-in)
function pruneUsers() {
  const now = Date.now();
  let changed = false;

  for (const [userId, user] of Object.entries(globalState.users)) {
    if (now - user.lastSeen > 6000) {
      delete globalState.users[userId];
      delete globalState.eventQueues[userId];
      changed = true;
      console.log(`User ${user.name} (${userId}) inactive. Pruned.`);
    }
  }

  if (changed) {
    broadcastUserList();
  }
}

function broadcastEvent(type: string, data: unknown) {
  Object.keys(globalState.users).forEach((userId) => {
    if (!globalState.eventQueues[userId]) {
      globalState.eventQueues[userId] = [];
    }
    globalState.eventQueues[userId].push({ type, data });
  });
}

function broadcastUserList() {
  const list = Object.values(globalState.users).map((u) => ({
    id: u.id,
    name: u.name,
  }));
  broadcastEvent("update-user-list", list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    pruneUsers();

    if (action === "join") {
      const { name, userId } = body;
      if (!name || !userId) {
        return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });
      }

      globalState.users[userId] = {
        id: userId,
        name,
        lastSeen: Date.now(),
      };

      if (!globalState.eventQueues[userId]) {
        globalState.eventQueues[userId] = [];
      }

      console.log(`User joined: ${name} (${userId})`);
      broadcastUserList();

      return NextResponse.json({ success: true });
    }

    if (action === "poll") {
      const { userId, name } = body;
      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      // Update heartbeat
      if (globalState.users[userId]) {
        globalState.users[userId].lastSeen = Date.now();
        if (name && globalState.users[userId].name !== name) {
          globalState.users[userId].name = name;
          broadcastUserList();
        }
      } else if (name) {
        // Auto-rejoin if pruned
        globalState.users[userId] = {
          id: userId,
          name,
          lastSeen: Date.now(),
        };
        if (!globalState.eventQueues[userId]) {
          globalState.eventQueues[userId] = [];
        }
        broadcastUserList();
      }

      const events = globalState.eventQueues[userId] || [];
      globalState.eventQueues[userId] = [];

      return NextResponse.json({ events });
    }

    if (action === "send") {
      const { from, to, event, data } = body;
      if (!from || !to || !event) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      // Route event to recipient queue
      if (!globalState.eventQueues[to]) {
        globalState.eventQueues[to] = [];
      }

      let serverEventName = event;
      let serverEventData = data;

      // Map client-emitted socket event to matching server-received socket event
      if (event === "send-message") {
        serverEventName = "receive-message";
        serverEventData = { from, text: data.text };
      } else if (event === "call-user") {
        serverEventName = "call-made";
        serverEventData = {
          offer: data.signalData,
          socket: from,
          name: globalState.users[from]?.name || "Unknown",
        };
      } else if (event === "make-answer") {
        serverEventName = "answer-made";
        serverEventData = {
          signal: data.signal,
          answerId: from,
        };
      } else if (event === "ice-candidate") {
        serverEventName = "ice-candidate";
        serverEventData = {
          candidate: data.candidate,
          from,
        };
      }

      globalState.eventQueues[to].push({
        type: serverEventName,
        data: serverEventData,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
