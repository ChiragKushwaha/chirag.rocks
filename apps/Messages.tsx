import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocketStore } from "../store/socketStore";
import { useSystemStore } from "../store/systemStore";
import { useTranslations } from "next-intl";
import {
  Search,
  Plus,
  Smile,
  Video,
  Phone,
  ChevronDown,
  Image as ImageIcon,
  X,
} from "lucide-react";

// Avatar gradient colors for contacts
const avatarGradients = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-orange-500 to-amber-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-cyan-500",
  "from-red-500 to-pink-500",
];

const getAvatarGradient = (id: string) => {
  const hash = id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return avatarGradients[hash % avatarGradients.length];
};

// Emoji categories with emojis
const emojiCategories = {
  "😀 Smileys": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "😉",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😚",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "😮‍💨",
    "🤥",
    "😌",
    "😔",
    "😪",
  ],
  "👋 Gestures": [
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
  ],
  "❤️ Hearts": [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❤️‍🔥",
    "❤️‍🩹",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
  ],
  "🎉 Celebrations": [
    "🎉",
    "🎊",
    "🎂",
    "🎁",
    "🎈",
    "🎀",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "🏅",
    "🎖️",
    "🎗️",
    "🎄",
    "🎃",
    "🎆",
    "🎇",
    "✨",
    "🎋",
    "🎍",
  ],
  "🐶 Animals": [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
  ],
  "🍕 Food": [
    "🍕",
    "🍔",
    "🍟",
    "🌭",
    "🍿",
    "🧂",
    "🥓",
    "🥚",
    "🍳",
    "🧇",
    "🥞",
    "🧈",
    "🍞",
    "🥐",
    "🥨",
    "🥯",
    "🥖",
    "🧀",
    "🥗",
    "🥙",
    "🌮",
    "🌯",
    "🫔",
    "🥪",
    "🍱",
    "🍣",
    "🍜",
    "🍝",
    "🍛",
    "🍲",
  ],
  "⚽ Sports": [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛼",
    "🛷",
  ],
  "🔥 Popular": [
    "🔥",
    "💯",
    "✅",
    "❌",
    "⭐",
    "🌟",
    "💫",
    "⚡",
    "💥",
    "💢",
    "💦",
    "💨",
    "🕳️",
    "💣",
    "💬",
    "👁️‍🗨️",
    "🗨️",
    "🗯️",
    "💭",
    "💤",
  ],
};

interface GifResult {
  id: string;
  url: string;
  preview: string;
  title: string;
}

export const Messages: React.FC = () => {
  const t = useTranslations("Messages");
  const { users, messages, sendMessage, isConnected, connect, me } =
    useSocketStore();
  const { user } = useSystemStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] =
    useState<string>("😀 Smileys");
  const [gifSearchQuery, setGifSearchQuery] = useState("");
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gifSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  // Auto-login
  useEffect(() => {
    if (!isConnected && me?.name !== user.name && user.name) {
      connect(user.name);
    }
  }, [isConnected, user.name, connect, me]);

  // Load trending GIFs when picker opens
  useEffect(() => {
    if (showGifPicker && gifs.length === 0) {
      fetchTrendingGifs();
    }
  }, [showGifPicker, gifs.length]);

  // Fetch trending GIFs from Tenor
  const fetchTrendingGifs = async () => {
    setIsLoadingGifs(true);
    try {
      // Using Tenor's free API with a demo key (limited requests)
      const response = await fetch(
        `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&limit=20&media_filter=gif,tinygif`
      );
      const data = await response.json();
      if (data.results) {
        setGifs(
          data.results.map(
            (gif: {
              id: string;
              media_formats: {
                gif: { url: string };
                tinygif: { url: string };
              };
              title: string;
            }) => ({
              id: gif.id,
              url: gif.media_formats.gif?.url || gif.media_formats.tinygif?.url,
              preview: gif.media_formats.tinygif?.url,
              title: gif.title,
            })
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch GIFs:", error);
    } finally {
      setIsLoadingGifs(false);
    }
  };

  // Search GIFs with debounce
  const searchGifs = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchTrendingGifs();
      return;
    }

    setIsLoadingGifs(true);
    try {
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&q=${encodeURIComponent(
          query
        )}&limit=20&media_filter=gif,tinygif`
      );
      const data = await response.json();
      if (data.results) {
        setGifs(
          data.results.map(
            (gif: {
              id: string;
              media_formats: {
                gif: { url: string };
                tinygif: { url: string };
              };
              title: string;
            }) => ({
              id: gif.id,
              url: gif.media_formats.gif?.url || gif.media_formats.tinygif?.url,
              preview: gif.media_formats.tinygif?.url,
              title: gif.title,
            })
          )
        );
      }
    } catch (error) {
      console.error("Failed to search GIFs:", error);
    } finally {
      setIsLoadingGifs(false);
    }
  }, []);

  // Handle GIF search input with debounce
  const handleGifSearchChange = (value: string) => {
    setGifSearchQuery(value);
    if (gifSearchTimeoutRef.current) {
      clearTimeout(gifSearchTimeoutRef.current);
    }
    gifSearchTimeoutRef.current = setTimeout(() => {
      searchGifs(value);
    }, 300);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputText.trim();
    if (messageText && selectedUser) {
      sendMessage(selectedUser, messageText);
      setInputText("");
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const handleGifClick = (gif: GifResult) => {
    if (selectedUser) {
      sendMessage(selectedUser, `[GIF: ${gif.url}]`);
      setShowGifPicker(false);
      setGifSearchQuery("");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedUser) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        sendMessage(selectedUser, `[IMG: ${imageData}]`);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Render message content (text, image, or GIF)
  const renderMessageContent = (text: string) => {
    if (text.startsWith("[GIF: ") && text.endsWith("]")) {
      const gifUrl = text.slice(6, -1);
      return (
        <img
          src={gifUrl}
          alt="GIF"
          className="max-w-full max-h-48 rounded-lg"
          loading="lazy"
        />
      );
    }
    if (text.startsWith("[IMG: ") && text.endsWith("]")) {
      const imgData = text.slice(6, -1);
      return (
        <img
          src={imgData}
          alt="Image"
          className="max-w-full max-h-48 rounded-lg"
          loading="lazy"
        />
      );
    }
    return text;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-[#1e1e1e] p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <div className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {t("AppTitle")}
        </div>
        <div className="animate-pulse text-gray-500 dark:text-gray-400 text-sm">
          {t("SigningIn", { name: user.name })}
        </div>
      </div>
    );
  }

  const activeMessages = selectedUser ? messages[selectedUser] || [] : [];
  const selectedUserData = users.find((u) => u.id === selectedUser);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-full bg-white dark:bg-[#1e1e1e] select-none">
      {/* Hidden file input for image picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="w-72 bg-[#f2f2f7]/90 dark:bg-[#2d2d2d]/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10 flex flex-col">
        {/* Sidebar Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/10">
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
              aria-label="New message"
            >
              <Plus
                size={18}
                className="text-gray-600 dark:text-gray-400"
                strokeWidth={2}
              />
            </button>
          </div>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {t("SidebarTitle")}
          </span>
          <button
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
            aria-label="Filter"
          >
            <ChevronDown
              size={18}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              aria-label="Search conversations"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 && (
            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">
              {searchQuery ? "No results found" : t("NoOnlineUsers")}
            </div>
          )}
          {filteredUsers.map((chatUser) => {
            const lastMessage = messages[chatUser.id]?.slice(-1)[0];
            const isSelected = selectedUser === chatUser.id;

            return (
              <div
                key={chatUser.id}
                onClick={() => setSelectedUser(chatUser.id)}
                className={`px-3 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${
                  isSelected
                    ? "bg-blue-500"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedUser(chatUser.id);
                  }
                }}
                aria-label={`Chat with ${chatUser.name}`}
              >
                {/* Avatar with gradient */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                    chatUser.id
                  )} flex items-center justify-center text-white font-semibold text-sm shrink-0`}
                >
                  {chatUser.name.slice(0, 2).toUpperCase()}
                </div>

                {/* Name and preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium text-sm truncate ${
                        isSelected
                          ? "text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {chatUser.name}
                    </span>
                    <span
                      className={`text-xs shrink-0 ml-2 ${
                        isSelected
                          ? "text-white/70"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {lastMessage ? "now" : ""}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate mt-0.5 ${
                      isSelected
                        ? "text-white/80"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {lastMessage?.text?.startsWith("[")
                      ? "📷 Media"
                      : lastMessage?.text || t("NoMessages")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        {selectedUser && selectedUserData ? (
          <>
            {/* Chat Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarGradient(
                    selectedUser
                  )} flex items-center justify-center text-white text-xs font-semibold`}
                >
                  {selectedUserData.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">
                    {selectedUserData.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                  aria-label="Video call"
                >
                  <Video
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
                <button
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                  aria-label="Audio call"
                >
                  <Phone
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {activeMessages.map((msg, idx) => {
                const isMe = msg.isMe;
                const showTail =
                  idx === activeMessages.length - 1 ||
                  activeMessages[idx + 1]?.isMe !== isMe;
                const isMedia =
                  msg.text.startsWith("[GIF:") || msg.text.startsWith("[IMG:");

                return (
                  <div
                    key={idx}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[65%] ${
                        isMedia ? "p-1" : "px-3 py-2"
                      } text-sm ${
                        isMe
                          ? `bg-gradient-to-br from-blue-500 to-blue-600 text-white ${
                              showTail
                                ? "rounded-2xl rounded-br-md"
                                : "rounded-2xl"
                            }`
                          : `bg-gray-200 dark:bg-[#3a3a3c] text-gray-900 dark:text-white ${
                              showTail
                                ? "rounded-2xl rounded-bl-md"
                                : "rounded-2xl"
                            }`
                      }`}
                    >
                      {renderMessageContent(msg.text)}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-80 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-white/10">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Emoji
                  </span>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                {/* Category tabs */}
                <div className="flex gap-1 px-2 py-1 border-b border-gray-200 dark:border-white/10 overflow-x-auto">
                  {Object.keys(emojiCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveEmojiCategory(category)}
                      className={`px-2 py-1 text-sm rounded-md whitespace-nowrap transition-colors ${
                        activeEmojiCategory === category
                          ? "bg-blue-500 text-white"
                          : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {category.split(" ")[0]}
                    </button>
                  ))}
                </div>
                {/* Emoji grid */}
                <div className="p-2 h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {emojiCategories[
                      activeEmojiCategory as keyof typeof emojiCategories
                    ]?.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 rounded-md text-xl transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GIF Picker */}
            {showGifPicker && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white dark:bg-[#2d2d2d] rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 w-96 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-white/10">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    GIFs
                  </span>
                  <button
                    onClick={() => {
                      setShowGifPicker(false);
                      setGifSearchQuery("");
                    }}
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                {/* Search bar */}
                <div className="p-2 border-b border-gray-200 dark:border-white/10">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search GIFs..."
                      value={gifSearchQuery}
                      onChange={(e) => handleGifSearchChange(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
                    />
                  </div>
                </div>
                {/* GIF grid */}
                <div className="p-2 h-64 overflow-y-auto">
                  {isLoadingGifs ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {gifs.map((gif) => (
                        <button
                          key={gif.id}
                          onClick={() => handleGifClick(gif)}
                          className="relative overflow-hidden rounded-lg hover:ring-2 hover:ring-blue-500 transition-all group"
                        >
                          <img
                            src={gif.preview || gif.url}
                            alt={gif.title}
                            className="w-full h-24 object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-3 py-1.5 border-t border-gray-200 dark:border-white/10 text-xs text-gray-400 text-center">
                  Powered by Tenor
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200/50 dark:border-white/10 bg-white dark:bg-[#1e1e1e]">
              <div className="flex items-center gap-2">
                {/* Attachment Button */}
                <button
                  onClick={openFilePicker}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Attach image"
                >
                  <Plus
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>

                {/* Input Field */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full bg-gray-100 dark:bg-[#3a3a3c] rounded-full px-4 py-2 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={t("InputPlaceholder")}
                    aria-label="Message input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && inputText.trim()) {
                        handleSendMessage();
                      }
                    }}
                  />

                  {/* Emoji & GIF buttons inside input */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {/* Emoji Button */}
                    <button
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                        setShowGifPicker(false);
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        showEmojiPicker
                          ? "bg-blue-500 text-white"
                          : "hover:bg-black/5 dark:hover:bg-white/10"
                      }`}
                      aria-label="Add emoji"
                    >
                      <Smile
                        size={18}
                        className={
                          showEmojiPicker
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      />
                    </button>

                    {/* GIF Button */}
                    <button
                      onClick={() => {
                        setShowGifPicker(!showGifPicker);
                        setShowEmojiPicker(false);
                      }}
                      className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors ${
                        showGifPicker
                          ? "bg-blue-500 text-white"
                          : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
                      }`}
                      aria-label="Add GIF"
                    >
                      GIF
                    </button>
                  </div>
                </div>

                {/* Image Button */}
                <button
                  onClick={openFilePicker}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Send image"
                >
                  <ImageIcon
                    size={20}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#3a3a3c] flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-400 dark:text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </div>
            <p className="text-lg font-medium">{t("NoContactSelected")}</p>
            <p className="text-sm mt-1">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
