import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
// import { useSystemStore } from "../store/systemStore";
import { useAsset } from "./hooks/useIconManager";

// ... existing code ...

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

  const bgUrl = useAsset("/hello-gradient-bg.webp");

  return (
    <div
      className={`min-h-screen w-screen flex items-center justify-center relative ${className}`}
    >
      {bgUrl && (
        <Image
          src={bgUrl}
          alt="Background"
          fill
          priority
          className="object-cover -z-10"
        />
      )}
      <div className="w-full max-w-[600px] md:max-w-[700px] px-8 mx-auto text-center flex flex-col gap-2">
        <svg
          ref={svgRef}
          className="w-full h-auto block overflow-visible"
          viewBox={
            current.label === "English"
              ? "-50 -50 1331 515" // Added padding for stroke width
              : `0 0 ${viewBox.w} ${viewBox.h}`
          }
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

          {current.label === "English" ? (
            <path
              d="M-293.58-104.62S-103.61-205.49-60-366.25c9.13-32.45,9-58.31,0-74-10.72-18.82-49.69-33.21-75.55,31.94-27.82,70.11-52.22,377.24-44.11,322.48s34-176.24,99.89-183.19c37.66-4,49.55,23.58,52.83,47.92a117.06,117.06,0,0,1-3,45.32c-7.17,27.28-20.47,97.67,33.51,96.86,66.93-1,131.91-53.89,159.55-84.49,31.1-36.17,31.1-70.64,19.27-90.25-16.74-29.92-69.47-33-92.79,16.73C62.78-179.86,98.7-93.8,159-81.63S302.7-99.55,393.3-269.92c29.86-58.16,52.85-114.71,46.14-150.08-7.44-39.21-59.74-54.5-92.87-8.7-47,65-61.78,266.62-34.74,308.53S416.62-58,481.52-130.31s133.2-188.56,146.54-256.23c14-71.15-56.94-94.64-88.4-47.32C500.53-375,467.58-229.49,503.3-127a73.73,73.73,0,0,0,23.43,33.67c25.49,20.23,55.1,16,77.46,6.32a111.25,111.25,0,0,0,30.44-19.87c37.73-34.23,29-36.71,64.58-127.53C724-284.3,785-298.63,821-259.13a71,71,0,0,1,13.69,22.56c17.68,46,6.81,80-6.81,107.89-12,24.62-34.56,42.72-61.45,47.91-23.06,4.45-48.37-.35-66.48-24.27a78.88,78.88,0,0,1-12.66-25.8c-14.75-51,4.14-88.76,11-101.41,6.18-11.39,37.26-69.61,103.42-42.24,55.71,23.05,100.66-23.31,100.66-23.31"
              transform="translate(311.08 476.02)"
              style={{
                fill: "none",
                stroke: "#fff",
                strokeLinecap: "round",
                strokeMiterlimit: 10,
                strokeWidth: "48px",
                strokeDasharray: "5800px",
                strokeDashoffset: "5800px",
              }}
              className="animate-draw-hello"
            />
          ) : (
            /* Key={index} forces a new <text> node each cycle, cleanly restarting CSS animation */
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
          )}
        </svg>

        <div className="font-semibold text-white/85 tracking-wide text-sm select-none drop-shadow-sm">
          {current.label} — {current.text}
        </div>
      </div>
    </div>
  );
}
