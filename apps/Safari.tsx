import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSystemStore } from "../store/systemStore";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shield,
  Share2,
  Plus,
  X,
  WifiOff,
  Lock,
  Search,
  Sidebar as SidebarIcon,
  LayoutGrid,
  Image as ImageIcon,
  History as HistoryIcon,
  Bookmark,
  Sparkles,
  AlertCircle,
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
  error?: string;
  icon?: string;
}

const WALLPAPERS = [
  { id: "default", name: "Default (Slate)", css: "bg-slate-50 dark:bg-[#1e1e1e]" },
  { id: "sequoia", name: "Sequoia Sunrise", css: "bg-gradient-to-tr from-amber-100 via-rose-200 to-indigo-400 text-slate-800 dark:text-slate-800" },
  { id: "sonoma", name: "Sonoma Organic", css: "bg-gradient-to-br from-green-200 via-yellow-100 to-amber-300 text-slate-800 dark:text-slate-800" },
  { id: "ventura", name: "Ventura Horizon", css: "bg-gradient-to-tr from-orange-300 via-pink-400 to-indigo-500 text-slate-800 dark:text-slate-800" },
  { id: "monterey", name: "Monterey Dusk", css: "bg-gradient-to-r from-purple-800 via-pink-600 to-red-500 text-white dark:text-white" },
];

/** Rewrite URL attributes in HTML so all cross-origin assets go through /api/proxy.
 *  IMPORTANT: srcdoc iframes have null origin, so we must use ABSOLUTE proxy URLs. */
function patchHtml(html: string, finalUrl: string, origin: string): string {
  const proxyBase = `${origin}/api/proxy?url=`;

  // Helper: resolve any URL to an absolute proxy URL
  function toProxy(href: string): string {
    if (!href) return href;
    const trimmed = href.trim();
    if (
      !trimmed ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("blob:") ||
      trimmed.startsWith("javascript:") ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("//") && false // protocol-relative: keep and resolve below
    ) {
      return trimmed;
    }
    try {
      const abs = new URL(trimmed, finalUrl).href;
      if (abs.startsWith("http://") || abs.startsWith("https://")) {
        return proxyBase + encodeURIComponent(abs);
      }
    } catch {
      // ignore bad URLs
    }
    return href;
  }

  // Helper: rewrite a srcset string ("url 1x, url2 2x, ...")
  function proxySrcset(srcset: string): string {
    return srcset.split(",").map(entry => {
      const parts = entry.trim().split(/\s+/);
      if (parts.length === 0) return entry;
      parts[0] = toProxy(parts[0]);
      return parts.join(" ");
    }).join(", ");
  }

  // Helper: rewrite CSS url(...) references in a CSS string
  function proxyCssUrls(css: string): string {
    return css.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi, (match, quote, url) => {
      return `url(${quote}${toProxy(url)}${quote})`;
    });
  }

  // --- Rewrite HTML attributes ---

  // <a href="..."> — preserve original in data-proxy-href for interceptor
  html = html.replace(/<a(\s[^>]*?)href=(["'])([^"']*)\2/gi, (match, attrs, quote, href) => {
    return `<a${attrs}href=${quote}${toProxy(href)}${quote} data-proxy-href=${quote}${href}${quote}`;
  });

  // <link href="..."> (stylesheets, icons, preload)
  html = html.replace(/<link(\s[^>]*?)>/gi, (match, attrs) => {
    return match.replace(/href=(["'])([^"']*)\1/gi, (_, quote, href) => `href=${quote}${toProxy(href)}${quote}`);
  });

  // <script src="...">
  html = html.replace(/<script(\s[^>]*?)>/gi, (match, attrs) => {
    return match.replace(/src=(["'])([^"']*)\1/gi, (_, quote, src) => `src=${quote}${toProxy(src)}${quote}`);
  });

  // <img src="..." srcset="..." data-src="..." data-srcset="...">
  html = html.replace(/<img(\s[^>]*?)>/gi, (match, attrs: string) => {
    let result = attrs;
    result = result.replace(/\bsrc=(["'])([^"']*)\1/gi, (_: string, q: string, src: string) => `src=${q}${toProxy(src)}${q}`);
    result = result.replace(/\bsrcset=(["'])([^"']*)\1/gi, (_: string, q: string, srcset: string) => `srcset=${q}${proxySrcset(srcset)}${q}`);
    result = result.replace(/\bdata-src=(["'])([^"']*)\1/gi, (_: string, q: string, src: string) => `data-src=${q}${toProxy(src)}${q}`);
    result = result.replace(/\bdata-srcset=(["'])([^"']*)\1/gi, (_: string, q: string, srcset: string) => `data-srcset=${q}${proxySrcset(srcset)}${q}`);
    return `<img${result}>`;
  });

  // <source src="..." srcset="..."> (picture, video, audio)
  html = html.replace(/<source(\s[^>]*?)>/gi, (match, attrs: string) => {
    let result = attrs;
    result = result.replace(/\bsrc=(["'])([^"']*)\1/gi, (_: string, q: string, src: string) => `src=${q}${toProxy(src)}${q}`);
    result = result.replace(/\bsrcset=(["'])([^"']*)\1/gi, (_: string, q: string, srcset: string) => `srcset=${q}${proxySrcset(srcset)}${q}`);
    return `<source${result}>`;
  });

  // <video src="..."> and <audio src="...">
  html = html.replace(/<(video|audio)(\s[^>]*?)>/gi, (match, tag: string, attrs: string) => {
    const result = attrs.replace(/\bsrc=(["'])([^"']*)\1/gi, (_: string, q: string, src: string) => `src=${q}${toProxy(src)}${q}`);
    return `<${tag}${result}>`;
  });

  // Inline style="background-image: url(...)"
  html = html.replace(/\bstyle=(["'])([^"']*)\1/gi, (match, quote: string, css: string) => {
    return `style=${quote}${proxyCssUrls(css)}${quote}`;
  });

  // <style>...</style> blocks — rewrite url() references
  html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (match, open: string, css: string, close: string) => {
    return `${open}${proxyCssUrls(css)}${close}`;
  });

  // NOTE: No <base> tag is injected here — the server-side proxy already removed any
  // existing base tags and rewrote all asset URLs to absolute proxy URLs.
  // Adding a base tag would cause any missed relative paths to bypass the proxy.

  const interceptScript = `
<script>
(function() {
  var PROXY = '${origin}/api/proxy?url=';
  var FINAL_URL = ${JSON.stringify(finalUrl)};

  // Send metadata to parent
  function sendMeta() {
    try {
      var title = document.title || FINAL_URL;
      var icon = '';
      var links = document.querySelectorAll('link[rel*="icon"]');
      if (links.length) icon = links[0].href;
      if (!icon) icon = new URL('/favicon.ico', FINAL_URL).href;
      window.parent.postMessage({ type: 'safari-metadata', title: title, icon: icon, url: FINAL_URL }, '*');
    } catch(e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendMeta);
  } else {
    sendMeta();
  }
  window.addEventListener('load', sendMeta);

  // Watch for title changes
  var titleEl = document.querySelector('title');
  if (titleEl) {
    new MutationObserver(sendMeta).observe(titleEl, { childList: true, characterData: true, subtree: true });
  }

  // Intercept all clicks on <a> tags
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el) return;

    var href = el.getAttribute('data-proxy-href') || el.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    try {
      var abs = new URL(href, FINAL_URL).href;
      if (abs.startsWith('http://') || abs.startsWith('https://')) {
        e.preventDefault();
        e.stopPropagation();
        if (el.target === '_blank') {
          window.parent.postMessage({ type: 'safari-new-tab', url: abs }, '*');
        } else {
          window.parent.postMessage({ type: 'safari-navigate', url: abs }, '*');
        }
      }
    } catch(err) {}
  }, true);

  // Intercept form submissions
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form || !form.action) return;
    try {
      var action = new URL(form.action, FINAL_URL).href;
      if (!action.startsWith('http')) return;
      e.preventDefault();
      e.stopPropagation();
      var method = (form.method || 'GET').toUpperCase();
      var fd = new FormData(form);
      var params = new URLSearchParams();
      fd.forEach(function(v, k) { params.append(k, v.toString()); });

      if (method === 'GET') {
        var sep = action.includes('?') ? '&' : '?';
        window.parent.postMessage({ type: 'safari-navigate', url: action + sep + params.toString() }, '*');
      } else {
        window.parent.postMessage({ type: 'safari-navigate', url: action, method: 'POST', body: params.toString() }, '*');
      }
    } catch(err) {}
  }, true);

  // Override fetch
  var _fetch = window.fetch;
  window.fetch = function(input, init) {
    var url = typeof input === 'string' ? input : (input.url || '');
    try {
      var abs = new URL(url, FINAL_URL).href;
      if (abs.startsWith('http') && !abs.includes(window.location.hostname + '/api/proxy')) {
        var proxyUrl = PROXY + encodeURIComponent(abs);
        return _fetch(proxyUrl, init);
      }
    } catch(e) {}
    return _fetch(input, init);
  };

  // Override XHR
  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    try {
      var abs = new URL(url, FINAL_URL).href;
      if (abs.startsWith('http') && !abs.includes('/api/proxy')) {
        var proxyUrl = PROXY + encodeURIComponent(abs);
        return _open.apply(this, [method, proxyUrl].concat(Array.prototype.slice.call(arguments, 2)));
      }
    } catch(e) {}
    return _open.apply(this, arguments);
  };

  // Block window.location changes
  try {
    var _loc = window.location;
    Object.defineProperty(window, 'location', {
      get: function() { return _loc; },
      set: function(v) {
        try {
          var abs = new URL(v.toString(), FINAL_URL).href;
          window.parent.postMessage({ type: 'safari-navigate', url: abs }, '*');
        } catch(e) {}
      }
    });
  } catch(e) {}
})();
</script>`;

  const bodyClose = /<\/body>/i;
  if (bodyClose.test(html)) {
    html = html.replace(bodyClose, interceptScript + "</body>");
  } else {
    html += interceptScript;
  }

  return html;
}

export const Safari: React.FC<SafariProps> = ({ initialUrl }) => {
  const t = useTranslations("Safari");
  const tFav = useTranslations("Safari.Favorites");

  const FAVORITES = [
    { name: tFav("Apple") || "Apple", url: "https://www.apple.com", icon: "", color: "from-zinc-800 to-black text-white" },
    { name: tFav("Google") || "Google", url: "https://www.google.com", icon: "G", color: "from-blue-500 via-red-500 to-yellow-500 text-white" },
    { name: tFav("Wikipedia") || "Wikipedia", url: "https://www.wikipedia.org", icon: "W", color: "from-slate-300 to-slate-500 text-white" },
    { name: tFav("GitHub") || "GitHub", url: "https://github.com", icon: "GH", color: "from-zinc-900 to-neutral-800 text-white" },
    { name: "Chirag.rocks", url: "https://chirag.rocks", icon: "C", color: "from-indigo-500 to-purple-600 text-white" },
  ];

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 1,
      history: [initialUrl || ""],
      currentIndex: 0,
      title: initialUrl ? (t("Loading") || "Loading...") : (t("StartPage") || "Start Page"),
      loading: !!initialUrl,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [wallpaper, setWallpaper] = useState("default");
  const [showWallpaperMenu, setShowWallpaperMenu] = useState(false);
  const [historyList, setHistoryList] = useState<{ url: string; title: string; timestamp: Date }[]>([]);
  const [iframeSrcDoc, setIframeSrcDoc] = useState<string>("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const currentUrl = activeTab.history[activeTab.currentIndex];
  const selectedWallpaper = WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];

  // Sync urlInput with currentUrl
  useEffect(() => {
    setUrlInput(currentUrl || "");
  }, [currentUrl]);

  const updateTab = useCallback((id: number, updates: Partial<Tab>) => {
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)));
  }, []);

  // Fetch page HTML from proxy and inject into iframe via srcdoc
  const loadUrl = useCallback(
    async (url: string, tabId: number) => {
      if (!url) {
        setIframeSrcDoc("");
        updateTab(tabId, { loading: false, error: undefined });
        return;
      }

      // Cancel any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      updateTab(tabId, { loading: true, error: undefined });

      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) {
          // Open non-HTML directly (PDF, etc.)
          window.open(proxyUrl, "_blank");
          updateTab(tabId, { loading: false });
          return;
        }

        // Get the final URL after redirects (from response header or fallback)
        const finalUrl = response.headers.get("x-final-url") || url;

        let html = await response.text();
        html = patchHtml(html, finalUrl, window.location.origin);

        setIframeSrcDoc(html);
        updateTab(tabId, { loading: false, error: undefined });
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") return;
        const msg = (err as Error)?.message || "Failed to load page";
        updateTab(tabId, {
          loading: false,
          error: msg,
        });
        setIframeSrcDoc("");
      }
    },
    [updateTab]
  );

  // Trigger load whenever the active tab URL changes
  useEffect(() => {
    if (activeTab && currentUrl) {
      loadUrl(currentUrl, activeTabId);
    } else {
      setIframeSrcDoc("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUrl, activeTabId]);

  // Listen for navigation/metadata messages from iframe srcdoc
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === "safari-metadata") {
        const { title, icon, url } = event.data;
        if (url) {
          setHistoryList((prev) => {
            if (prev.some((h) => h.url === url)) return prev;
            return [{ url, title: title || url, timestamp: new Date() }, ...prev].slice(0, 50);
          });
        }
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === activeTabId
              ? { ...tab, title: title || tab.title, icon: icon || tab.icon }
              : tab
          )
        );
      } else if (event.data.type === "safari-navigate") {
        const { url } = event.data;
        if (!url) return;
        setTabs((prev) =>
          prev.map((tab) => {
            if (tab.id !== activeTabId) return tab;
            const newHistory = tab.history.slice(0, tab.currentIndex + 1);
            newHistory.push(url);
            return { ...tab, history: newHistory, currentIndex: newHistory.length - 1, loading: true };
          })
        );
        setUrlInput(url);
      } else if (event.data.type === "safari-new-tab") {
        const { url } = event.data;
        if (!url) return;
        const newId = Math.max(...tabs.map((tab) => tab.id), 0) + 1;
        setTabs((prev) => [
          ...prev,
          { id: newId, history: [url], currentIndex: 0, title: "Loading...", loading: true },
        ]);
        setActiveTabId(newId);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeTabId, tabs]);

  const navigateTo = (input: string) => {
    let targetUrl = input.trim();
    if (!targetUrl) return;

    const hasProtocol = /^https?:\/\//i.test(targetUrl);
    const hasDomain = /\.[a-z]{2,}$/i.test(targetUrl) || targetUrl.includes("localhost");
    const hasSpaces = targetUrl.includes(" ");

    if (!hasProtocol) {
      if (hasSpaces || !hasDomain) {
        targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
      } else {
        targetUrl = `https://${targetUrl}`;
      }
    }

    const newHistory = activeTab.history.slice(0, activeTab.currentIndex + 1);
    newHistory.push(targetUrl);

    updateTab(activeTabId, {
      history: newHistory,
      currentIndex: newHistory.length - 1,
      title: "Loading...",
      loading: true,
    });
    setUrlInput(targetUrl);
  };

  const goBack = () => {
    if (activeTab.currentIndex > 0) {
      updateTab(activeTabId, { currentIndex: activeTab.currentIndex - 1, loading: true });
    }
  };

  const goForward = () => {
    if (activeTab.currentIndex < activeTab.history.length - 1) {
      updateTab(activeTabId, { currentIndex: activeTab.currentIndex + 1, loading: true });
    }
  };

  const reload = () => {
    if (currentUrl) {
      loadUrl(currentUrl, activeTabId);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map((tab) => tab.id), 0) + 1;
    setTabs([
      ...tabs,
      { id: newId, history: [""], currentIndex: 0, title: t("StartPage") || "Start Page", loading: false },
    ]);
    setActiveTabId(newId);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      updateTab(id, { history: [""], currentIndex: 0, title: t("StartPage") || "Start Page" });
      return;
    }
    const newTabs = tabs.filter((tab) => tab.id !== id);
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
            {t("NoInternet") || "You are not connected to the Internet"}
          </h2>
          <p className="max-w-md text-center text-sm">
            {t("NoInternetDesc") || "This page can't be displayed because your computer is currently offline."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans select-none">

      {/* --- SEQUOIA STYLED METALLIC/GLASS TOOLBAR --- */}
      <div className="h-14 bg-linear-to-b from-[#f5f5f7] to-[#ebebeb] dark:from-[#2d2d2d] dark:to-[#222222] border-b border-gray-300 dark:border-black/35 flex items-center px-4 gap-3 relative z-30 shadow-xs">

        {/* Left Side Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1.5 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
              showSidebar ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
            }`}
            title="Toggle Sidebar"
          >
            <SidebarIcon size={16} />
          </button>

          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 ml-1">
            <button
              onClick={goBack}
              disabled={activeTab.currentIndex === 0}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              onClick={goForward}
              disabled={activeTab.currentIndex === activeTab.history.length - 1}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
              aria-label="Go forward"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Center Smart Omnibar Address Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex justify-center z-10">
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-0 bg-white/70 dark:bg-[#151515]/65 rounded-lg border border-gray-300/60 dark:border-black/35 shadow-xs group-focus-within:ring-2 ring-blue-500/50 group-focus-within:bg-white dark:group-focus-within:bg-[#121212]" />
            <div className="relative flex items-center px-3 h-8">
              {currentUrl ? (
                <Lock size={11} className="text-green-500 dark:text-green-400 mr-2 shrink-0" />
              ) : (
                <Search size={11} className="text-gray-400 mr-2 shrink-0" />
              )}

              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={t("SearchPlaceholder") || "Search or enter website name"}
                aria-label="Address bar"
                className="w-full bg-transparent border-none outline-none text-xs text-center group-focus-within:text-left text-gray-800 dark:text-gray-200 placeholder-gray-400 select-text"
              />

              <button
                type="button"
                onClick={reload}
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ml-2 cursor-default shrink-0"
                aria-label="Reload page"
              >
                <RotateCw size={11} className={activeTab.loading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Real macOS loading progress bar */}
            {activeTab.loading && (
              <div className="absolute bottom-0 left-0 h-[2.5px] bg-blue-500/90 rounded-b-lg animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "70%" }} />
            )}
          </div>
        </form>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <button
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Share Page"
          >
            <Share2 size={15} />
          </button>

          <button
            onClick={addTab}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="New Tab"
          >
            <Plus size={15} />
          </button>

          <button
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Tab Switcher"
          >
            <LayoutGrid size={15} />
          </button>
        </div>
      </div>

      {/* --- SUB-TOOLBAR TABS BAR --- */}
      <div
        className="h-9 bg-[#ebebeb] dark:bg-[#252525] flex items-end px-3 gap-0.5 border-b border-gray-300 dark:border-black/35 overflow-x-auto select-none"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`
                group relative flex items-center justify-between gap-2 px-3 py-1.5 rounded-t-[5px] text-[11px] font-medium 
                min-w-[120px] max-w-[190px] flex-1 cursor-default transition-all border-t border-x
                ${
                  isActive
                    ? "bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-black/35 shadow-xs font-semibold"
                    : "bg-black/[0.03] hover:bg-black/[0.07] dark:bg-white/[0.02] dark:hover:bg-white/[0.05] text-gray-500 dark:text-gray-400 border-transparent"
                }
              `}
              role="tab"
              aria-selected={isActive}
            >
              <div className="flex items-center gap-1.5 truncate flex-1 justify-center">
                {tab.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tab.icon}
                    alt=""
                    className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
                )}
                <span className="truncate">{tab.title || t("StartPage") || "Start Page"}</span>
              </div>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`p-0.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {/* --- CORE CONTENT LAYOUT --- */}
      <div className="flex-1 flex flex-row overflow-hidden relative">

        {/* --- SIDEBAR --- */}
        {showSidebar && (
          <div className="w-56 bg-[#f5f5f7]/95 dark:bg-[#252525]/95 backdrop-blur-md border-r border-gray-200 dark:border-black/25 flex flex-col gap-6 p-4 overflow-y-auto select-none shrink-0">
            {/* Open Tabs */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Open Tabs ({tabs.length})
              </span>
              <div className="flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center justify-between text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                      activeTabId === tab.id
                        ? "bg-blue-500 text-white font-medium"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className="truncate flex-1 pr-2">{tab.title || "Start Page"}</span>
                    {tabs.length > 1 && (
                      <X
                        size={12}
                        onClick={(e) => closeTab(tab.id, e)}
                        className="opacity-70 hover:opacity-100 shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <Bookmark size={10} />
                <span>Favorites</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {FAVORITES.map((fav) => (
                  <button
                    key={fav.name}
                    onClick={() => navigateTo(fav.url)}
                    className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-left truncate py-0.5"
                  >
                    <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[9px] shrink-0">
                      {fav.icon}
                    </div>
                    <span className="truncate">{fav.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <HistoryIcon size={10} />
                <span>History</span>
              </div>
              <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
                {historyList.length === 0 ? (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 italic px-2">No history</span>
                ) : (
                  historyList.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => navigateTo(h.url)}
                      className="text-xs text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 text-left truncate py-0.5"
                      title={h.title}
                    >
                      {h.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN PAGE VIEWPORT --- */}
        <div className="flex-1 bg-white dark:bg-[#1e1e1e] relative overflow-hidden">
          {currentUrl ? (
            <>
              {activeTab.error ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#f9f9f9] dark:bg-[#1a1a1a]">
                  <AlertCircle size={48} className="text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Safari Can&apos;t Open the Page
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
                    {activeTab.error}
                  </p>
                  <button
                    onClick={reload}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  srcDoc={iframeSrcDoc}
                  className="w-full h-full border-none select-text"
                  title="Browser Content"
                  sandbox="allow-scripts allow-forms allow-popups allow-modals"
                  onLoad={() => updateTab(activeTabId, { loading: false })}
                />
              )}

              {/* Loading overlay */}
              {activeTab.loading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-black/40 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Loading…</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* --- SEQUOIA PREMIUM START PAGE --- */
            <div className={`w-full h-full flex flex-col items-center justify-center p-8 transition-colors duration-500 relative ${selectedWallpaper.css}`}>

              {/* Wallpaper Menu Trigger */}
              <div className="absolute bottom-4 right-4 z-20">
                <button
                  onClick={() => setShowWallpaperMenu(!showWallpaperMenu)}
                  className="p-2 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full shadow-md hover:bg-white dark:hover:bg-black border border-gray-200/50 dark:border-zinc-800 transition-colors"
                  title="Customize Wallpaper"
                >
                  <ImageIcon size={18} className="text-gray-700 dark:text-gray-300" />
                </button>

                {showWallpaperMenu && (
                  <div className="absolute bottom-12 right-0 w-44 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800 rounded-lg shadow-xl py-1 flex flex-col z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase border-b border-gray-100 dark:border-zinc-800 mb-1">
                      Start Page Background
                    </div>
                    {WALLPAPERS.map((wp) => (
                      <button
                        key={wp.id}
                        onClick={() => {
                          setWallpaper(wp.id);
                          setShowWallpaperMenu(false);
                        }}
                        className={`px-3 py-1.5 text-xs text-left hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2 ${
                          wallpaper === wp.id ? "font-bold text-blue-500" : ""
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full border border-gray-300 ${wp.css}`} />
                        <span>{wp.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Page Header */}
              <div className="w-full max-w-xl flex flex-col items-center select-none z-10 px-4">
                <h1 className="text-5xl font-extrabold tracking-tight mb-8 text-black/25 dark:text-white/20 select-none font-sans">
                  Safari
                </h1>

                {/* Search Bar */}
                <form
                  onSubmit={handleUrlSubmit}
                  className="w-full max-w-lg mb-12 relative flex items-center"
                >
                  <Search size={16} className="absolute left-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search or enter website name"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800 rounded-xl shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 text-sm placeholder-gray-400 text-gray-800 dark:text-gray-100 select-text"
                  />
                </form>

                {/* Favorites Grid */}
                <div className="w-full flex flex-col items-start gap-4 mb-10">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} />
                    <span>Favorites</span>
                  </h3>
                  <div className="grid grid-cols-5 gap-6 w-full">
                    {FAVORITES.map((fav) => (
                      <button
                        key={fav.name}
                        onClick={() => navigateTo(fav.url)}
                        className="flex flex-col items-center gap-2 group cursor-default"
                        aria-label={`Go to ${fav.name}`}
                      >
                        <div className={`w-14 h-14 bg-gradient-to-tr ${fav.color} rounded-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all flex items-center justify-center text-xl font-bold select-none`}>
                          {fav.icon}
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors truncate w-16 text-center">
                          {fav.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Report widget card */}
                <div className="w-full flex flex-col items-start gap-4 mb-6">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield size={11} />
                    <span>Privacy Report</span>
                  </h3>
                  <div className="w-full p-4 bg-white/70 dark:bg-black/30 backdrop-blur-md border border-gray-200/50 dark:border-zinc-800 rounded-2xl shadow-md flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                      <Shield size={24} />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        127 Trackers Prevented
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        Safari prevented trackers from profiling you across 14 visited websites.
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-extrabold text-blue-500">100%</span>
                      <span className="block text-[8px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">
                        Blocked
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
