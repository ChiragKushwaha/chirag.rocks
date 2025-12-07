import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  PenSquare,
  Mail as MailIcon,
  Star,
  Send,
  Trash2,
  Archive,
  Reply,
  ReplyAll,
  Forward,
} from "lucide-react";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  content: string;
}

export const Mail: React.FC = () => {
  const t = useTranslations("Mail");

  const [emails] = useState<Email[]>([
    {
      id: "1",
      sender: "Apple",
      subject: "Welcome to your new Mac",
      preview: "Get started with your new MacBook Pro...",
      date: "9:41 AM",
      read: false,
      content:
        "Welcome to your new Mac. Here are some tips to get you started...",
    },
    {
      id: "2",
      sender: "Tim Cook",
      subject: "One more thing...",
      preview: "We have something exciting to share.",
      date: "Yesterday",
      read: true,
      content: "Join us for our special event at Apple Park.",
    },
    {
      id: "3",
      sender: "Netflix",
      subject: "New Arrival: Stranger Things",
      preview: "Season 5 is finally here!",
      date: "Monday",
      read: true,
      content: "Watch the new season of Stranger Things now on Netflix.",
    },
  ]);

  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0].id);
  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar - Mailboxes */}
      <div className="w-48 bg-[#f5f5f7] dark:bg-[#2b2b2b]/90 border-r border-gray-200 dark:border-black/20 flex flex-col pt-4">
        <div className="px-3 mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">
            {t("Favorites")}
          </span>
        </div>
        <div className="space-y-0.5 px-2">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-gray-200 dark:bg-white/10">
            <div className="flex items-center gap-2">
              <MailIcon size={14} className="text-blue-500" />
              <span className="text-sm font-medium">{t("AllInboxes")}</span>
            </div>
            <span className="text-xs text-gray-500">3</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-blue-500" />
              <span className="text-sm">{t("VIP")}</span>
            </div>
            <span className="text-xs text-gray-500">0</span>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-white/5">
            <div className="flex items-center gap-2">
              <Send size={14} className="text-blue-500" />
              <span className="text-sm">{t("Sent")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-72 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-black/20 flex flex-col">
        <div className="h-12 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between px-3">
          <div className="flex flex-col">
            <span className="text-sm font-bold">{t("Inbox")}</span>
            <span className="text-xs text-gray-500">
              {t("MessagesCount", { count: emails.length })}
            </span>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Compose new message"
          >
            <PenSquare size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedEmailId(email.id)}
              className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${
                selectedEmailId === email.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedEmailId(email.id);
                }
              }}
              aria-label={`Email from ${email.sender}: ${email.subject}`}
            >
              <div className="flex justify-between items-baseline mb-0.5">
                <span
                  className={`text-sm font-bold truncate ${
                    selectedEmailId === email.id
                      ? "text-white"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {email.sender}
                </span>
                <span
                  className={`text-xs ${
                    selectedEmailId === email.id
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {email.date}
                </span>
              </div>
              <div
                className={`text-xs font-medium mb-0.5 truncate ${
                  selectedEmailId === email.id
                    ? "text-white"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {email.subject}
              </div>
              <div
                className={`text-xs truncate ${
                  selectedEmailId === email.id
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                {email.preview}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
        {selectedEmail ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-between px-6">
              <div className="flex gap-4 text-gray-500">
                <button aria-label="Delete">
                  <Trash2
                    size={18}
                    className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </button>
                <button aria-label="Archive">
                  <Archive
                    size={18}
                    className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </button>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-700" />
                <button aria-label="Reply">
                  <Reply
                    size={18}
                    className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </button>
                <button aria-label="Reply All">
                  <ReplyAll
                    size={18}
                    className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </button>
                <button aria-label="Forward">
                  <Forward
                    size={18}
                    className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200"
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Search size={14} />
                <span>{t("Search")}</span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-lg">
                    {selectedEmail.sender[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold leading-tight">
                      {selectedEmail.sender}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {t("To", { name: "Chirag" })}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {selectedEmail.date}
                </span>
              </div>

              <h1 className="text-2xl font-bold mb-6">
                {selectedEmail.subject}
              </h1>

              <div className="text-gray-800 dark:text-gray-300 leading-relaxed">
                {selectedEmail.content}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            {t("NoMessageSelected")}
          </div>
        )}
      </div>
    </div>
  );
};
