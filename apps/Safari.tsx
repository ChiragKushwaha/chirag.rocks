import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  Share,
  Plus,
  X,
} from "lucide-react";

interface SafariProps {
  initialUrl?: string;
}

export const Safari: React.FC<SafariProps> = ({ initialUrl }) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: initialUrl ? "Search" : "Apple",
      url: initialUrl || "https://www.apple.com",
    },
    ...(initialUrl
      ? []
      : [
          { id: 2, title: "Google", url: "https://www.google.com/webhp?igu=1" },
        ]),
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState(tabs[0].url);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = urlInput;
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }
    const updatedTabs = tabs.map((t) =>
      t.id === activeTabId ? { ...t, url, title: url } : t
    );
    setTabs(updatedTabs);
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map((t) => t.id)) + 1;
    const newTab = {
      id: newId,
      title: "New Tab",
      url: "https://www.google.com/webhp?igu=1",
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setUrlInput(newTab.url);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((t) => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
      setUrlInput(newTabs[newTabs.length - 1].url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
      {/* Toolbar */}
      <div className="h-12 bg-[#f5f5f7] dark:bg-[#2b2b2b] border-b border-gray-200 dark:border-black/20 flex items-center px-4 gap-4">
        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
          <ArrowLeft
            size={18}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-white"
          />
          <ArrowRight
            size={18}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-white"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Shield size={16} />
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-gray-200 dark:bg-black/20 rounded-lg py-1.5 px-8 text-sm text-center focus:text-left focus:bg-white dark:focus:bg-[#3a3a3a] focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all"
            />
            <div className="absolute left-2 top-2 text-gray-500">
              {/* Lock icon placeholder */}
            </div>
            <RotateCw
              size={14}
              className="absolute right-2.5 top-2 text-gray-500 cursor-pointer hover:text-gray-800 dark:hover:text-white"
            />
          </div>
        </form>

        <div className="flex gap-4 text-gray-500 dark:text-gray-400">
          <Share
            size={18}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-white"
          />
          <Plus
            size={18}
            onClick={addTab}
            className="cursor-pointer hover:text-gray-800 dark:hover:text-white"
          />
          <div className="flex flex-col gap-0.5 cursor-pointer">
            <div className="w-4 h-4 border-2 border-current rounded-sm" />
          </div>
        </div>
      </div>

      {/* Tabs Bar (Below Toolbar style) */}
      <div className="h-9 bg-[#f5f5f7] dark:bg-[#2b2b2b] flex items-end px-2 gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTabId(tab.id);
              setUrlInput(tab.url);
            }}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs font-medium min-w-[120px] max-w-[200px] cursor-default transition-colors ${
              activeTabId === tab.id
                ? "bg-white dark:bg-[#1e1e1e] shadow-sm z-10"
                : "bg-transparent hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
            }`}
          >
            {/* Favicon placeholder */}
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="truncate flex-1">{tab.title}</span>
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

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-[#1e1e1e] relative">
        <iframe
          src={activeTab.url}
          className="w-full h-full border-none"
          title="Browser Content"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        {/* Overlay for blocked sites (simple check) */}
        {!activeTab.url.includes("google.com") &&
          !activeTab.url.includes("apple.com") &&
          !activeTab.url.includes("wikipedia.org") && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] pointer-events-none">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Content Loading...
                </h2>
                <p className="text-gray-500 text-sm">
                  Most sites block iframes. Try Google or Wikipedia.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
