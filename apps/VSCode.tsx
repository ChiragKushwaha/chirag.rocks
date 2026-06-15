"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

// ── Activity Bar Icons ────────────────────────────────────────────────────
const ActivityIcons = [
  {
    id: "explorer",
    title: "Explorer",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M3 3h8l2 2h8v14H3V3zm0 2v12h18V7h-7.83l-2-2H3z" />
      </svg>
    ),
  },
  {
    id: "search",
    title: "Search",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
      </svg>
    ),
  },
  {
    id: "git",
    title: "Source Control",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
      </svg>
    ),
  },
  {
    id: "debug",
    title: "Run and Debug",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C13 5.06 12.51 5 12 5s-1 .06-1.42.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
      </svg>
    ),
  },
  {
    id: "extensions",
    title: "Extensions",
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" />
      </svg>
    ),
  },
];

const FILE_TREE = [
  { name: "CHIRAG.ROCKS", type: "root", indent: 0 },
  { name: "▾ app", type: "folder", indent: 1 },
  { name: "▾ apps", type: "folder", indent: 1 },
  { name: "▸ components", type: "folder", indent: 1 },
  { name: "▸ lib", type: "folder", indent: 1 },
  { name: "▸ store", type: "folder", indent: 1 },
  { name: "README.md", type: "file", indent: 1, active: true, icon: "md" },
  { name: "package.json", type: "file", indent: 1, icon: "json" },
  { name: "next.config.ts", type: "file", indent: 1, icon: "ts" },
  { name: "tailwind.config.ts", type: "file", indent: 1, icon: "ts" },
];

const FILE_ICON_COLORS: Record<string, string> = {
  md: "#519aba",
  json: "#cbcb41",
  ts: "#3178c6",
};

// ── Minimal Markdown → styled JSX renderer ────────────────────────────────
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <div key={key++} className="my-3 rounded overflow-hidden text-[12px]">
          {lang && (
            <div className="px-3 py-1 text-[10px] font-mono" style={{ background: "#252526", color: "#858585" }}>
              {lang}
            </div>
          )}
          <pre
            className="p-4 overflow-x-auto font-mono leading-5"
            style={{ background: "#1a1a1a", color: "#9cdcfe" }}
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1) {
      nodes.push(
        <h1 key={key++} className="text-[22px] font-bold mt-6 mb-3 pb-2 border-b" style={{ color: "#e8e8e8", borderColor: "#3e3e42" }}>
          {h1[1]}
        </h1>
      );
      i++; continue;
    }
    if (h2) {
      nodes.push(
        <h2 key={key++} className="text-[17px] font-semibold mt-5 mb-2 pb-1 border-b" style={{ color: "#e8e8e8", borderColor: "#3e3e42" }}>
          {h2[1]}
        </h2>
      );
      i++; continue;
    }
    if (h3) {
      nodes.push(
        <h3 key={key++} className="text-[14px] font-semibold mt-4 mb-1" style={{ color: "#e8e8e8" }}>
          {h3[1]}
        </h3>
      );
      i++; continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      nodes.push(<hr key={key++} className="my-4 border-t" style={{ borderColor: "#3e3e42" }} />);
      i++; continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={key++}
          className="pl-4 py-1 my-2 text-[13px] border-l-4"
          style={{ borderColor: "#4ec9b0", color: "#9e9e9e", fontStyle: "italic" }}
        >
          {line.slice(2)}
        </blockquote>
      );
      i++; continue;
    }

    // Bullet list
    const bullet = line.match(/^[-*+] (.+)/);
    if (bullet) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*+] (.+)/)) {
        const m = lines[i].match(/^[-*+] (.+)/);
        if (m) items.push(m[1]);
        i++;
      }
      nodes.push(
        <ul key={key++} className="pl-5 my-2 space-y-1 text-[13px] list-none" style={{ color: "#cccccc" }}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: "#4ec9b0" }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    const numbered = line.match(/^(\d+)\. (.+)/);
    if (numbered) {
      const items: string[] = [];
      let num = parseInt(numbered[1]);
      while (i < lines.length && lines[i].match(/^\d+\. .+/)) {
        const m = lines[i].match(/^\d+\. (.+)/);
        if (m) items.push(m[1]);
        i++;
      }
      nodes.push(
        <ol key={key++} className="pl-5 my-2 space-y-1 text-[13px] list-none" style={{ color: "#cccccc" }}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: "#ce9178", minWidth: 18 }}>{num + idx}.</span>
              <span dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      nodes.push(<div key={key++} className="h-2" />);
      i++; continue;
    }

    // Paragraph
    nodes.push(
      <p
        key={key++}
        className="text-[13px] leading-6 my-1"
        style={{ color: "#cccccc" }}
        dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }}
      />
    );
    i++;
  }
  return nodes;
}

function inlineMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e8e8e8">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em style="color:#d7ba7d">$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#252526;color:#ce9178;padding:1px 5px;border-radius:3px;font-family:Menlo,monospace;font-size:12px">$1</code>')
    // Link
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#4ec9b0;text-decoration:none" target="_blank">$1</a>');
}

// ── Line number gutter ─────────────────────────────────────────────────────
const LineNumbers = ({ count }: { count: number }) => (
  <div
    className="flex flex-col text-right pr-4 pt-4 shrink-0 select-none"
    style={{ color: "#4a4a4a", fontFamily: "Menlo, monospace", fontSize: 12, lineHeight: "24px", minWidth: 40 }}
  >
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>{i + 1}</div>
    ))}
  </div>
);

// ── Main VSCode component ──────────────────────────────────────────────────
export const VSCode: React.FC = () => {
  const t = useTranslations("VSCode");
  const [activeActivity, setActiveActivity] = useState("explorer");
  const [activeTab] = useState("README.md");
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch README.md via the built-in proxy (bypasses CORS + X-Frame-Options)
  useEffect(() => {
    const RAW_URL =
      "https://raw.githubusercontent.com/ChiragKushwaha/chirag.rocks/main/README.md";
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(RAW_URL)}`;

    fetch(proxyUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        setReadmeContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const lineCount = readmeContent.split("\n").length;

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{
        fontFamily: "'Menlo', 'Monaco', 'Cascadia Code', 'SF Mono', monospace",
        background: "#1e1e1e",
        color: "#d4d4d4",
      }}
    >
      {/* ── TOP MENU BAR ── */}
      <div
        className="h-[30px] flex items-center px-4 gap-4 shrink-0 text-[12px]"
        style={{ background: "#3c3c3c" }}
      >
        {["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"].map((m) => (
          <button key={m} className="text-[#cccccc] hover:text-white transition-colors" style={{ fontSize: 12 }}>
            {m}
          </button>
        ))}
        <div className="flex-1 flex justify-center">
          <div
            className="flex items-center gap-2 px-3 py-0.5 rounded text-[11px]"
            style={{ background: "#3c3c3c", border: "1px solid #555", minWidth: 240 }}
          >
            <svg viewBox="0 0 16 16" className="w-3 h-3 opacity-50" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <span className="text-[#858585]">chirag.rocks (Workspace)</span>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-1 min-h-0">
        {/* Activity Bar */}
        <div
          className="w-[48px] flex flex-col items-center py-2 gap-1 shrink-0"
          style={{ background: "#333333", borderRight: "1px solid #252526" }}
        >
          {ActivityIcons.map((act) => (
            <button
              key={act.id}
              title={act.title}
              onClick={() => setActiveActivity(act.id)}
              className="w-[48px] h-[48px] flex items-center justify-center transition-colors"
              style={{
                color: activeActivity === act.id ? "#ffffff" : "#858585",
                borderLeft: activeActivity === act.id ? "2px solid #ffffff" : "2px solid transparent",
              }}
            >
              {act.svg}
            </button>
          ))}
          <div className="flex-1" />
          <button className="w-[48px] h-[48px] flex items-center justify-center" style={{ color: "#858585" }} title="Accounts">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </button>
          <button className="w-[48px] h-[48px] flex items-center justify-center" style={{ color: "#858585" }} title="Settings">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
        </div>

        {/* Sidebar — Explorer */}
        {activeActivity === "explorer" && (
          <div
            className="w-[200px] flex flex-col shrink-0 overflow-hidden"
            style={{ background: "#252526", borderRight: "1px solid #1e1e1e" }}
          >
            <div
              className="px-3 py-1.5 text-[10px] font-bold tracking-widest"
              style={{ color: "#bdbdbd", textTransform: "uppercase" }}
            >
              Explorer
            </div>
            <div className="flex-1 overflow-y-auto text-[13px]">
              {FILE_TREE.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 py-[2px] cursor-default"
                  style={{
                    paddingLeft: `${item.indent * 12 + 8}px`,
                    background: item.active ? "#094771" : "transparent",
                    color: item.type === "root" ? "#bbbbbb" : item.active ? "#ffffff" : "#cccccc",
                    fontSize: 12,
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) (e.currentTarget as HTMLDivElement).style.background = "#2a2d2e";
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  {item.type === "folder" && (
                    <span style={{ color: "#e8ab53", fontSize: 10 }}>▸</span>
                  )}
                  {item.type === "file" && (
                    <span style={{ color: FILE_ICON_COLORS[item.icon || ""] || "#d4d4d4", fontSize: 9 }}>●</span>
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Tab bar */}
          <div
            className="h-[35px] flex items-end shrink-0"
            style={{ background: "#252526", borderBottom: "1px solid #1e1e1e" }}
          >
            <div
              className="flex items-center gap-1.5 px-3 h-full text-[12px] shrink-0"
              style={{
                background: "#1e1e1e",
                color: "#ffffff",
                borderTop: "1px solid #007acc",
                borderRight: "1px solid #252526",
              }}
            >
              <span style={{ color: "#519aba", fontSize: 11 }}>M↓</span>
              <span>{activeTab}</span>
              <button
                className="ml-1 w-4 h-4 flex items-center justify-center rounded hover:bg-white/10"
                style={{ fontSize: 10, color: "#858585" }}
              >
                ✕
              </button>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 h-full text-[12px] shrink-0"
              style={{ background: "#2d2d2d", color: "#969696", borderRight: "1px solid #252526" }}
            >
              <span style={{ color: "#cbcb41", fontSize: 11 }}>{"{ }"}</span>
              <span>package.json</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div
            className="h-[22px] flex items-center px-3 gap-1 text-[11px] shrink-0"
            style={{ background: "#1e1e1e", borderBottom: "1px solid #252526", color: "#858585" }}
          >
            <span>chirag.rocks</span>
            <span>›</span>
            <span style={{ color: "#cccccc" }}>README.md</span>
          </div>

          {/* Editor content */}
          <div
            className="flex-1 overflow-auto"
            style={{ background: "#1e1e1e" }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div
                  className="w-8 h-8 border-2 rounded-full animate-spin"
                  style={{ borderColor: "#3e3e42", borderTopColor: "#007acc" }}
                />
                <span style={{ color: "#858585", fontSize: 12 }}>Fetching README.md…</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <span style={{ color: "#f48771", fontSize: 13 }}>⚠ Could not load README.md</span>
                <span style={{ color: "#858585", fontSize: 11 }}>{error}</span>
              </div>
            ) : (
              <div className="flex min-h-full">
                {/* Gutter with line numbers */}
                <LineNumbers count={lineCount} />
                {/* Rendered markdown */}
                <div className="flex-1 px-6 py-4 overflow-hidden">
                  {renderMarkdown(readmeContent)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div
        className="h-[22px] flex items-center px-2 gap-4 shrink-0 text-[11px] text-white"
        style={{ background: "#007acc" }}
      >
        <button className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          <span>⎇ main</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          <span>✓ 0</span>
          <span>⚠ 0</span>
        </button>
        <div className="flex-1" />
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          Ln 1, Col 1
        </button>
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          Spaces: 2
        </button>
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          UTF-8
        </button>
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          LF
        </button>
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          Markdown
        </button>
        <button className="hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
          Prettier
        </button>
      </div>
    </div>
  );
};
