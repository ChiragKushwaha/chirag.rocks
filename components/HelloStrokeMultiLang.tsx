import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";

// Default “Hello” list (add/remove freely)
const DEFAULT_WORDS = [
  {
    label: "English",
    lang: "en",
    dir: "ltr",
    text: "hello",
    font: "var(--font-pacifico), cursive",
  },
  {
    label: "Español",
    lang: "es",
    dir: "ltr",
    text: "Hola",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Français",
    lang: "fr",
    dir: "ltr",
    text: "Bonjour",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Deutsch",
    lang: "de",
    dir: "ltr",
    text: "Hallo",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Italiano",
    lang: "it",
    dir: "ltr",
    text: "Ciao",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Português",
    lang: "pt",
    dir: "ltr",
    text: "Olá",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Русский",
    lang: "ru",
    dir: "ltr",
    text: "Привет",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "العربية",
    lang: "ar",
    dir: "rtl",
    text: "مرحبا",
    font: 'var(--font-noto-naskh-arabic), "Amiri", "Scheherazade", serif',
  },
  {
    label: "فارسی",
    lang: "fa",
    dir: "rtl",
    text: "سلام",
    font: 'var(--font-noto-naskh-arabic), "Amiri", "Scheherazade", serif',
  },
  {
    label: "اردو",
    lang: "ur",
    dir: "rtl",
    text: "سلام",
    font: 'var(--font-noto-naskh-arabic), "Amiri", "Scheherazade", serif',
  },
  {
    label: "עברית",
    lang: "he",
    dir: "rtl",
    text: "שלום",
    font: '"Rubik","Noto Sans Hebrew", var(--font-noto-sans), system-ui, sans-serif',
  },
  {
    label: "हिन्दी",
    lang: "hi",
    dir: "ltr",
    text: "नमस्ते",
    font: 'var(--font-noto-serif-devanagari), "Kohinoor Devanagari", serif',
  },
  {
    label: "বাংলা",
    lang: "bn",
    dir: "ltr",
    text: "নমস্কার",
    font: 'var(--font-noto-serif-bengali), "Noto Sans Bengali", serif',
  },
  {
    label: "中文（简体）",
    lang: "zh-CN",
    dir: "ltr",
    text: "你好",
    font: 'var(--font-noto-sans), "PingFang SC","Microsoft YaHei", sans-serif',
  },
  {
    label: "日本語",
    lang: "ja",
    dir: "ltr",
    text: "こんにちは",
    font: 'var(--font-noto-sans-jp), "Hiragino Kaku Gothic ProN","Yu Gothic", sans-serif',
  },
  {
    label: "한국어",
    lang: "ko",
    dir: "ltr",
    text: "안녕하세요",
    font: 'var(--font-noto-sans-kr), "Apple SD Gothic Neo","Malgun Gothic", sans-serif',
  },
  {
    label: "Українська",
    lang: "uk",
    dir: "ltr",
    text: "Привіт",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Türkçe",
    lang: "tr",
    dir: "ltr",
    text: "Merhaba",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Ελληνικά",
    lang: "el",
    dir: "ltr",
    text: "Γειά σου",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Polski",
    lang: "pl",
    dir: "ltr",
    text: "Cześć",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Čeština",
    lang: "cs",
    dir: "ltr",
    text: "Ahoj",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Română",
    lang: "ro",
    dir: "ltr",
    text: "Salut",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Svenska",
    lang: "sv",
    dir: "ltr",
    text: "Hej",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Norsk",
    lang: "no",
    dir: "ltr",
    text: "Hei",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Dansk",
    lang: "da",
    dir: "ltr",
    text: "Hej",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Suomi",
    lang: "fi",
    dir: "ltr",
    text: "Hei",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Nederlands",
    lang: "nl",
    dir: "ltr",
    text: "Hallo",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Tiếng Việt",
    lang: "vi",
    dir: "ltr",
    text: "Xin chào",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "ภาษาไทย",
    lang: "th",
    dir: "ltr",
    text: "สวัสดี",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Kiswahili",
    lang: "sw",
    dir: "ltr",
    text: "Hujambo",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  {
    label: "Filipino",
    lang: "fil",
    dir: "ltr",
    text: "Kumusta",
    font: "var(--font-noto-sans), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
];

export default function HelloStrokeMultiLang({
  words = DEFAULT_WORDS,
  durationMs = 5000, // stroke animation time per word
  pauseMs = 800, // small pause between words
  viewBox = { w: 1230, h: 414 },
  paddingX = 90, // horizontal padding inside viewBox units
  className = "", // extra Tailwind classes for wrapper
}) {
  // const { setSetupComplete } = useSystemStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const [index, setIndex] = useState(0);
  const current = words[index];

  // Cycle through words (respect reduced motion)
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduced = mq?.matches ?? false;
    if (reduced) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, durationMs + pauseMs);

    return () => clearInterval(id);
  }, [words.length, durationMs, pauseMs]);

  // Fit text to width, set stroke width, and compute dash length each time the word changes
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Ensure correct font for shaping
    el.style.fontFamily =
      current.font ||
      "Noto Sans, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
    el.style.unicodeBidi = current.dir === "rtl" ? "bidi-override" : "normal";
    el.setAttribute("lang", current.lang || "en");

    const targetW = viewBox.w - paddingX * 2;

    // Fit font-size (SVG user units) to target width using advance width
    const fitTextToWidth = (node: SVGTextElement, maxWidth: number) => {
      let fs = 220; // start large
      node.setAttribute("font-size", String(fs));
      let loops = 0;
      while (getAdvance(node) > maxWidth && fs > 24 && loops < 50) {
        fs -= 6;
        node.setAttribute("font-size", String(fs));
        loops++;
      }
      // stroke width scales with size
      const stroke = Math.max(10, Math.round(fs / 8));
      node.style.setProperty("--stroke", String(stroke));
      return { fs, stroke };
    };

    const getAdvance = (node: SVGTextElement) => {
      try {
        return node.getComputedTextLength();
      } catch {
        const bbox = node.getBBox?.();
        return bbox?.width || 600;
      }
    };

    const layout = () => {
      fitTextToWidth(el, targetW);
      const adv = getAdvance(el);
      // Dash needs to exceed the total outline length; advance*12 is robust across scripts
      const dash = Math.max(adv * 12, 1200);
      el.style.setProperty("--gap", String(dash));
    };

    // Run once now, and again after fonts are ready (important for CJK/Arabic)
    layout();
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }
  }, [index, current, paddingX, viewBox.w]);

  return (
    <div
      className={`min-h-screen w-screen flex items-center justify-center relative ${className}`}
    >
      <Image
        src="/hello-gradient-bg.webp"
        alt="Background"
        fill
        priority
        className="object-cover -z-10"
      />
      <div className="w-[min(92vw,1200px)] mx-auto text-center flex flex-col gap-2">
        <svg
          ref={svgRef}
          className="w-full h-auto block"
          viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label={`${current.label} — ${current.text}`}
        >
          <defs>
            <linearGradient
              id="textGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#fce4ec", stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#f8bbd0", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#f48fb1", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          {/* Key={index} forces a new <text> node each cycle, cleanly restarting CSS animation */}
          <text
            key={index}
            ref={textRef}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontWeight="700"
            fontSize="220"
            fill="url(#textGradient)"
            // Tailwind via arbitrary properties for SVG stroke + dash + vector-effect
            className="stroke-white [stroke-linecap:round] [stroke-linejoin:round] [paint-order:stroke] [vector-effect:non-scaling-stroke] [stroke-width:var(--stroke)] [stroke-dasharray:var(--gap)] [stroke-dashoffset:var(--gap)] animate-draw"
            // CSS vars for timing; gap/stroke are set in JS on the node
            style={{ "--dur": `${durationMs}ms` } as React.CSSProperties}
          >
            {current.text}
          </text>
        </svg>

        <div className="font-semibold text-white/85 tracking-wide text-sm select-none drop-shadow-sm">
          {current.label} — {current.text}
        </div>
      </div>
    </div>
  );
}
