import React, { useState, useRef } from "react";
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
  Flag,
  ChevronDown,
  Inbox,
  X,
  Paperclip,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Link,
} from "lucide-react";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  flagged?: boolean;
  content: string;
  avatar?: string;
  avatarColor?: string;
  mailbox: string;
}

interface ComposeState {
  to: string;
  subject: string;
  body: string;
}

const MAILBOXES = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 2 },
  { id: "favorites", label: "Favorites", icon: Star, count: 0 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "trash", label: "Trash", icon: Trash2, count: 0 },
  { id: "archive", label: "Archive", icon: Archive, count: 0 },
];

const INITIAL_EMAILS: Email[] = [
  {
    id: "1",
    sender: "Apple",
    senderEmail: "no_reply@apple.com",
    subject: "Welcome to your new Mac",
    preview: "Get started with your new MacBook Pro. Here are some tips to help you feel at home right away.",
    date: "9:41 AM",
    read: false,
    mailbox: "inbox",
    avatarColor: "from-gray-700 to-gray-900",
    content: `Dear Chirag,

Welcome to your new Mac. We're so glad you're here.

Here are a few things to help you get started:

**Set up iCloud** — Access your photos, documents, and more across all your Apple devices.

**Explore System Settings** — Personalise your Mac by visiting System Settings from the Apple menu.

**Visit the App Store** — Discover thousands of apps designed for macOS.

**Try Siri** — Just click the Siri icon in the menu bar or say "Hey Siri" to get started.

We hope you enjoy your Mac. If you have any questions, visit support.apple.com.

Warm regards,
Apple`,
  },
  {
    id: "2",
    sender: "Tim Cook",
    senderEmail: "tcook@apple.com",
    subject: "One more thing...",
    preview: "We have something incredibly exciting to share with you. Join us for a very special event.",
    date: "Yesterday",
    read: true,
    mailbox: "inbox",
    avatarColor: "from-blue-600 to-indigo-700",
    content: `Hi Chirag,

I wanted to personally reach out to share some exciting news.

Next month, we'll be hosting a very special event at Apple Park. We've been working on something incredible — something we think will change the way you interact with technology.

Save the date: September 12th, 10 AM PDT.

Join us live at apple.com/apple-events.

See you there,
Tim`,
  },
  {
    id: "3",
    sender: "Netflix",
    senderEmail: "info@mailer.netflix.com",
    subject: "New on Netflix: Stranger Things Season 5",
    preview: "Season 5 is finally here. The final chapter of Stranger Things is now streaming.",
    date: "Monday",
    read: true,
    mailbox: "inbox",
    avatarColor: "from-red-600 to-red-800",
    content: `Hi Chirag,

Season 5 is finally here.

The final chapter of Stranger Things is now streaming exclusively on Netflix.

Watch now and find out how it all ends.

— The Netflix Team`,
  },
  {
    id: "4",
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "Your repository received a new star",
    preview: "alexdev starred your repository chirag.rocks — Check out who starred your project.",
    date: "Sunday",
    read: true,
    mailbox: "inbox",
    avatarColor: "from-gray-700 to-gray-900",
    content: `Hi @chirag,

alexdev starred your repository chirag/chirag.rocks.

This means your work is being noticed! Keep building great things.

View your repository: github.com/chirag/chirag.rocks

— GitHub`,
  },
  {
    id: "5",
    sender: "Vercel",
    senderEmail: "noreply@vercel.com",
    subject: "✅ Deployment successful: chirag.rocks",
    preview: "Your latest deployment to chirag.rocks is live. Visit your site to see the changes.",
    date: "Saturday",
    read: true,
    mailbox: "inbox",
    avatarColor: "from-gray-900 to-black",
    content: `Deployment Successful

Your project chirag.rocks has been deployed successfully.

URL: https://chirag.rocks
Branch: main
Commit: feat: add macOS Big Sur portfolio

Ready to inspect? Visit your Vercel dashboard.

— The Vercel Team`,
  },
];

export const Mail: React.FC = () => {
  const t = useTranslations("Mail");

  const [emails, setEmails] = useState<Email[]>(INITIAL_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0].id);
  const [selectedMailbox, setSelectedMailbox] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState<ComposeState>({ to: "", subject: "", body: "" });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId);

  const filteredEmails = emails.filter((email) => {
    const inMailbox = selectedMailbox === "inbox" ? true : email.mailbox === selectedMailbox;
    const matchesSearch =
      !searchQuery ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return inMailbox && matchesSearch;
  });

  const handleSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  };

  const handleDelete = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, mailbox: "trash" } : e))
    );
    const next = filteredEmails.find((e) => e.id !== emailId);
    if (next) setSelectedEmailId(next.id);
  };

  const handleFlag = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, flagged: !e.flagged } : e))
    );
  };

  const handleSend = () => {
    if (!compose.to || !compose.subject) return;
    const newEmail: Email = {
      id: Date.now().toString(),
      sender: "Me",
      senderEmail: "me@chirag.rocks",
      subject: compose.subject,
      preview: compose.body.slice(0, 80),
      date: "Just now",
      read: true,
      mailbox: "sent",
      content: compose.body,
      avatarColor: "from-blue-500 to-purple-600",
    };
    setEmails((prev) => [newEmail, ...prev]);
    setCompose({ to: "", subject: "", body: "" });
    setShowCompose(false);
  };

  const unreadCount = emails.filter((e) => !e.read && e.mailbox === "inbox").length;

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-[13px] font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif] text-gray-900 dark:text-gray-100 select-none relative">

      {/* ── MAILBOXES SIDEBAR ── */}
      <div className="w-[200px] bg-[#f5f5f7] dark:bg-[#272727] border-r border-gray-200/70 dark:border-black/30 flex flex-col shrink-0">
        {/* Search */}
        <div className="pt-4 px-3 pb-3">
          <div className="relative">
            <Search size={12} className="absolute left-2 top-[7px] text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-[#e0e0e5] dark:bg-[#3a3a3a] rounded-[6px] pl-7 pr-2 py-1 text-[12px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border-none"
            />
          </div>
        </div>

        {/* Mailboxes label */}
        <div className="px-4 mb-1">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mailboxes</span>
        </div>

        <div className="flex flex-col gap-0.5 px-2">
          {MAILBOXES.map((box) => {
            const Icon = box.icon;
            const isActive = selectedMailbox === box.id;
            const count = box.id === "inbox" ? unreadCount : box.count;
            return (
              <button
                key={box.id}
                onClick={() => setSelectedMailbox(box.id)}
                className={`flex items-center justify-between px-2 py-1.5 rounded-[6px] text-left transition-colors ${
                  isActive
                    ? "bg-[#007AFF] text-white"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} className={isActive ? "text-white" : "text-[#007AFF]"} />
                  <span className="text-[13px] font-medium">{box.label}</span>
                </div>
                {count > 0 && (
                  <span className={`text-[11px] font-semibold min-w-[18px] text-center rounded-full px-1 ${
                    isActive ? "bg-white/25 text-white" : "bg-[#007AFF] text-white"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Bottom compose */}
        <div className="px-3 py-3 border-t border-gray-200/50 dark:border-black/20">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-[#007AFF] hover:bg-[#0063d1] text-white rounded-[6px] text-[12px] font-semibold transition-colors"
          >
            <PenSquare size={13} />
            New Message
          </button>
        </div>
      </div>

      {/* ── EMAIL LIST ── */}
      <div className="w-[280px] bg-white dark:bg-[#1e1e1e] border-r border-gray-200/70 dark:border-black/30 flex flex-col shrink-0">
        {/* List header */}
        <div className="h-[52px] px-4 flex items-center justify-between border-b border-gray-200/70 dark:border-black/20 shrink-0">
          <div>
            <div className="font-bold text-[15px] capitalize">{selectedMailbox}</div>
            <div className="text-[11px] text-gray-400">
              {filteredEmails.length} message{filteredEmails.length !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[#007AFF] transition-colors"
            aria-label="Compose"
          >
            <PenSquare size={16} />
          </button>
        </div>

        {/* Email rows */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
              <MailIcon size={36} strokeWidth={1} />
              <span className="text-sm">No messages</span>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const isSelected = selectedEmailId === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => handleSelect(email.id)}
                  className={`px-4 py-3 border-b border-gray-100 dark:border-white/5 cursor-default relative transition-colors ${
                    isSelected
                      ? "bg-[#007AFF]"
                      : "hover:bg-gray-50 dark:hover:bg-white/3"
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect(email.id)}
                >
                  {/* Unread indicator */}
                  {!email.read && !isSelected && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#007AFF]" />
                  )}

                  <div className="flex justify-between items-baseline mb-0.5 pl-2">
                    <span className={`font-semibold truncate max-w-[160px] ${
                      isSelected ? "text-white" : !email.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-200"
                    }`}>
                      {email.sender}
                    </span>
                    <span className={`text-[11px] shrink-0 ml-2 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                      {email.date}
                    </span>
                  </div>
                  <div className={`text-[12px] font-medium truncate mb-0.5 pl-2 ${isSelected ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                    {email.subject}
                  </div>
                  <div className={`text-[11px] truncate pl-2 ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {email.preview}
                  </div>

                  {email.flagged && (
                    <Flag size={10} className={`absolute right-3 top-3 ${isSelected ? "text-yellow-200" : "text-orange-400"}`} fill="currentColor" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── READING PANE ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e]">
        {selectedEmail ? (
          <>
            {/* Toolbar */}
            <div className="h-[52px] flex items-center justify-between px-5 border-b border-gray-200/70 dark:border-black/20 shrink-0">
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => handleDelete(selectedEmail.id)}
                  className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
                <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Archive">
                  <Archive size={16} />
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-1" />
                <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Reply">
                  <Reply size={16} />
                </button>
                <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Reply All">
                  <ReplyAll size={16} />
                </button>
                <button className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Forward">
                  <Forward size={16} />
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-1" />
                <button
                  onClick={() => handleFlag(selectedEmail.id)}
                  className={`p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                    selectedEmail.flagged ? "text-orange-400" : ""
                  }`}
                  title="Flag"
                >
                  <Flag size={16} fill={selectedEmail.flagged ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${selectedEmail.avatarColor || "from-gray-600 to-gray-800"} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {selectedEmail.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-bold text-[17px] truncate">{selectedEmail.sender}</h2>
                    <span className="text-[12px] text-gray-400 shrink-0">{selectedEmail.date}</span>
                  </div>
                  <div className="text-[12px] text-gray-400 mt-0.5">
                    to me
                    <span className="text-[11px] ml-1 text-gray-300 dark:text-gray-600">
                      &lt;{selectedEmail.senderEmail}&gt;
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-[22px] font-bold mb-6 leading-tight">{selectedEmail.subject}</h1>

              <div className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.content}
              </div>

              {/* Reply button at bottom */}
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/5">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-200 transition-colors">
                  <Reply size={14} />
                  Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-300 dark:text-gray-600">
            <MailIcon size={56} strokeWidth={0.8} />
            <span className="text-[15px] font-medium text-gray-400">No Message Selected</span>
          </div>
        )}
      </div>

      {/* ── COMPOSE MODAL ── */}
      {showCompose && (
        <div className="absolute bottom-0 right-0 w-[540px] h-[420px] bg-white dark:bg-[#2a2a2a] rounded-t-xl shadow-2xl border border-gray-200/70 dark:border-black/30 flex flex-col z-50" style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.2)" }}>
          {/* Compose toolbar */}
          <div className="h-10 bg-[#f5f5f7] dark:bg-[#323232] rounded-t-xl flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-black/20 shrink-0">
            <span className="text-[13px] font-semibold text-gray-600 dark:text-gray-300">New Message</span>
            <button
              onClick={() => setShowCompose(false)}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Fields */}
          <div className="flex flex-col border-b border-gray-100 dark:border-white/5 shrink-0">
            <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-white/5">
              <span className="text-[12px] font-medium text-gray-400 w-12">To:</span>
              <input
                autoFocus
                value={compose.to}
                onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-300"
                placeholder="recipient@example.com"
              />
            </div>
            <div className="flex items-center px-4 py-2">
              <span className="text-[12px] font-medium text-gray-400 w-12">Subject:</span>
              <input
                value={compose.subject}
                onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-300"
                placeholder="Subject"
              />
            </div>
          </div>

          {/* Body */}
          <textarea
            value={compose.body}
            onChange={(e) => setCompose({ ...compose, body: e.target.value })}
            className="flex-1 resize-none px-4 py-3 bg-transparent outline-none text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-300 leading-relaxed"
            placeholder="Write your message here..."
          />

          {/* Bottom bar */}
          <div className="h-10 flex items-center justify-between px-4 border-t border-gray-100 dark:border-white/5 shrink-0">
            <div className="flex items-center gap-2 text-gray-400">
              <button className="p-1 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Attach file"><Paperclip size={15} /></button>
              <button className="p-1 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Bold"><Bold size={15} /></button>
              <button className="p-1 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Italic"><Italic size={15} /></button>
              <button className="p-1 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Underline"><Underline size={15} /></button>
              <button className="p-1 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="Insert Link"><Link size={15} /></button>
            </div>
            <button
              onClick={handleSend}
              disabled={!compose.to || !compose.subject}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#007AFF] disabled:bg-gray-200 dark:disabled:bg-gray-700 hover:bg-[#0063d1] text-white disabled:text-gray-400 rounded-[6px] text-[12px] font-semibold transition-colors"
            >
              <Send size={12} />
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
