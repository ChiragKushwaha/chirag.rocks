import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  Share,
  Plus,
  X,
  WifiOff,
  Lock,
} from "lucide-react";

interface SafariProps {
  initialUrl?: string;
}

interface Tab {
  id: number;
  history: string[];
  currentIndex: number;
  title: string;
  loading: boolean;
  icon?: string;
}

const FAVORITES = [
  { name: "Apple", url: "https://www.apple.com", icon: "apple" },
  { name: "Google", url: "https://www.google.com", icon: "google" },
  { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "book" },
  { name: "GitHub", url: "https://github.com", icon: "github" },
];

export const Safari: React.FC<SafariProps> = ({ initialUrl }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 1,
      history: [initialUrl || ""],
      currentIndex: 0,
      title: initialUrl ? "Loading..." : "Start Page",
      loading: !!initialUrl,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentUrl = activeTab.history[activeTab.currentIndex];

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl, activeTabId]);

  // Listen for metadata messages from proxy
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "safari-metadata") {
        const { title, icon } = event.data;
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? { ...t, title: title || t.title, icon: icon || t.icon } // Assuming Tab interface has icon
              : t
          )
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeTabId]);

  // Service Worker disabled - causes issues intercepting app APIs
  /*
  // Register Service Worker for proxy interception
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/safari-sw.js")
        .then((registration) => {
          console.log(
            "[Safari] Service Worker registered:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("[Safari] Service Worker registration failed:", error);
        });
    }

    return () => {
      // Cleanup: unregister service worker when component unmounts
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            if (registration.active?.scriptURL.includes("safari-sw.js")) {
              registration.unregister();
            }
          });
        });
      }
    };
  }, []);
  */

  const updateTab = (id: number, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const navigateTo = (input: string) => {
    let targetUrl = input.trim();

    // Intelligent Omnibar Logic
    const hasProtocol = /^https?:\/\//i.test(targetUrl);
    const hasDomain =
      /\.[a-z]{2,}$/i.test(targetUrl) || targetUrl.includes("localhost");
    const hasSpaces = targetUrl.includes(" ");

    if (!hasProtocol) {
      if (hasSpaces || !hasDomain) {
        // Treat as search query
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(
          targetUrl
        )}`;
      } else {
        // Treat as URL, add https://
        targetUrl = `https://${targetUrl}`;
      }
    }

    const newHistory = activeTab.history.slice(0, activeTab.currentIndex + 1);
    newHistory.push(targetUrl);

    updateTab(activeTabId, {
      history: newHistory,
      currentIndex: newHistory.length - 1,
      title: "Loading...",
      loading: !!targetUrl,
    });
  };

  const goBack = () => {
    if (activeTab.currentIndex > 0) {
      updateTab(activeTabId, {
        currentIndex: activeTab.currentIndex - 1,
        loading: true,
      });
    }
  };

  const goForward = () => {
    if (activeTab.currentIndex < activeTab.history.length - 1) {
      updateTab(activeTabId, {
        currentIndex: activeTab.currentIndex + 1,
        loading: true,
      });
    }
  };

  const reload = () => {
    if (iframeRef.current) {
      // Force reload by resetting src (or just let the loading state handle it if we toggle)
      // Simple way: just set loading true, the effect/render will handle it?
      // Actually, for iframe, re-setting src works.
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = currentSrc;
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map((t) => t.id)) + 1;
    const newTab: Tab = {
      id: newId,
      history: [""],
      currentIndex: 0,
      title: "Start Page",
      loading: false,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // If closing last tab, just reset it to start page
      updateTab(id, { history: [""], currentIndex: 0, title: "Start Page" });
      return;
    }
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const { wifiEnabled } = useSystemStore();

  if (!wifiEnabled) {
    return (
      <div className="flex flex-col h-full bg-[#f5f5f7] dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400 items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <WifiOff size={48} className="text-gray-400" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            You are not connected to the Internet
          </h2>
          <p className="max-w-md text-center">
            This page can&apos;t be displayed because your computer is currently
            offline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#2b2b2b] text-gray-900 dark:text-gray-100 font-sans">
      {/* Toolbar */}
      <div className="h-12 bg-[#f5f5f7] dark:bg-[#323232] border-b border-gray-200 dark:border-black/20 flex items-center px-4 gap-4 relative z-20">
        {/* Window Controls Placeholder (handled by OS, but we need spacing if not in full OS mode, 
            but here we assume OS handles it or we just have standard toolbar) */}

        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
          <button
            onClick={goBack}
            disabled={activeTab.currentIndex === 0}
            className="hover:text-gray-800 dark:hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={goForward}
            disabled={activeTab.currentIndex === activeTab.history.length - 1}
            className="hover:text-gray-800 dark:hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Go forward"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Shield size={16} />
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex justify-center">
          <div className="w-full max-w-xl relative group">
            <div className="absolute inset-0 bg-gray-200 dark:bg-[#1e1e1e] rounded-lg transition-all group-focus-within:ring-2 ring-blue-500/50" />
            <div className="relative flex items-center px-3 h-8">
              {currentUrl && <Lock size={12} className="text-gray-500 mr-2" />}
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search or enter website name"
                aria-label="Address bar"
                className="w-full bg-transparent border-none outline-none text-sm text-center group-focus-within:text-left text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={reload}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-white ml-2"
                aria-label="Reload page"
              >
                <RotateCw size={14} />
              </button>
            </div>
          </div>
        </form>

        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            aria-label="Share"
          >
            <Share size={18} />
          </button>
          <button
            onClick={addTab}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            aria-label="New tab"
          >
            <Plus size={18} />
          </button>
          <div className="flex flex-col gap-0.5 cursor-pointer">
            <div className="w-4 h-4 border-2 border-current rounded-sm" />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        className="h-8 bg-[#f5f5f7] dark:bg-[#323232] flex items-end px-2 gap-1 overflow-x-auto border-b border-gray-200 dark:border-black/20"
        role="tablist"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              group relative flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-medium 
              min-w-[100px] max-w-[200px] flex-1 cursor-default transition-all
              ${
                activeTabId === tab.id
                  ? "bg-white dark:bg-[#2b2b2b] text-gray-800 dark:text-gray-100 shadow-sm"
                  : "bg-transparent hover:bg-gray-200 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400"
              }
              }
              }
            `}
            role="tab"
            tabIndex={activeTabId === tab.id ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setActiveTabId(tab.id);
              }
            }}
            aria-label={`Tab: ${tab.title || "Start Page"}`}
            aria-selected={activeTabId === tab.id}
          >
            {/* Favicon */}
            {tab.icon ? (
              <Image
                src={tab.icon}
                alt=""
                width={12}
                height={12}
                className="w-3 h-3 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
            )}
            <span className="truncate flex-1 text-center">
              {tab.title || "Start Page"}
            </span>
            <button
              onClick={(e) => closeTab(tab.id, e)}
              className={`p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 ${
                activeTabId === tab.id
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-[#2b2b2b] relative overflow-hidden">
        {currentUrl ? (
          <iframe
            ref={iframeRef}
            src={`http://localhost:3002/proxy?url=${encodeURIComponent(
              currentUrl
            )}`}
            className="w-full h-full border-none"
            title="Browser Content"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() =>
              updateTab(activeTabId, { loading: false, title: currentUrl })
            }
          />
        ) : (
          /* Start Page */
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-[#2b2b2b] text-gray-800 dark:text-gray-100">
            <div className="mb-12 flex flex-col items-center">
              <h1 className="text-4xl font-bold mb-8 text-gray-300 dark:text-gray-600 select-none">
                Safari
              </h1>
              <div className="grid grid-cols-4 gap-8">
                {FAVORITES.map((fav) => (
                  <button
                    key={fav.name}
                    onClick={() => navigateTo(fav.url)}
                    className="flex flex-col items-center gap-3 group"
                    aria-label={`Go to ${fav.name}`}
                  >
                    <div className="w-16 h-16 bg-white dark:bg-[#3a3a3a] rounded-xl shadow-sm group-hover:shadow-md transition-all flex items-center justify-center text-2xl">
                      {fav.name[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                      {fav.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
