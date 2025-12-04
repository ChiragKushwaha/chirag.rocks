import React, { useState, useEffect } from "react";
import { useSocketStore } from "../store/socketStore";
import { useSystemStore } from "../store/systemStore";

export const Messages: React.FC = () => {
  const { users, messages, sendMessage, isConnected, connect, me } =
    useSocketStore();
  const { user } = useSystemStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  // Auto-login
  useEffect(() => {
    if (!isConnected && me?.name !== user.name && user.name) {
      connect(user.name);
    }
  }, [isConnected, user.name, connect, me]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-4">
        <div className="text-2xl font-bold mb-4">iMessage</div>
        <div className="animate-pulse text-gray-400">
          Signing in as {user.name}...
        </div>
      </div>
    );
  }

  const activeMessages = selectedUser ? messages[selectedUser] || [] : [];

  return (
    <div className="flex h-full w-full bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-3 font-bold text-gray-700 border-b">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 && (
            <div className="p-4 text-gray-400 text-sm text-center">
              No one else is online.
            </div>
          )}
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={`p-3 cursor-pointer hover:bg-gray-200 flex items-center gap-2 ${
                selectedUser === user.id ? "bg-blue-100" : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedUser(user.id);
                }
              }}
              aria-label={`Chat with ${user.name}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {messages[user.id]?.slice(-1)[0]?.text || "No messages"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-3 border-b border-gray-200 font-bold bg-gray-50 flex items-center gap-2">
              To: {users.find((u) => u.id === selectedUser)?.name}
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {activeMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] p-2 rounded-xl px-4 ${
                    msg.isMe
                      ? "bg-blue-500 text-white self-end rounded-br-none"
                      : "bg-gray-200 text-black self-start rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded-full px-4 py-2 outline-none focus:border-blue-500"
                placeholder="iMessage"
                aria-label="Message input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputText) {
                    sendMessage(selectedUser, inputText);
                    setInputText("");
                  }
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
