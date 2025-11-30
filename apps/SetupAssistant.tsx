import React, { useState, useEffect, useRef } from "react";
import { useSystemStore } from "../store/systemStore";
import {
  ArrowRight,
  Globe,
  MapPin,
  Moon,
  Sun,
  Check,
  UserCircle,
} from "lucide-react";

// --- SETUP WINDOW COMPONENT ---
const SetupWindow = ({
  title,
  icon: Icon,
  children,
  onBack,
  onContinue,
  continueDisabled = false,
  description,
}: any) => (
  <div className="fixed inset-0 bg-[#2b2b2b] flex items-center justify-center z-[9999] font-sans selection:bg-[#007AFF] selection:text-white">
    {/* Background Ambient Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-[#1c1c1c] to-black opacity-80 pointer-events-none" />

    {/* Main Window - Dimensions matched to macOS Setup Assistant */}
    <div className="w-[780px] h-[560px] bg-[#F2F2F7]/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl rounded-[12px] shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Title Bar (Empty/Draggable) */}
      <div className="h-8 w-full flex-shrink-0 drag-region" />

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center pt-8 px-12 overflow-y-auto">
        {/* Feature Icon Style - Matching 'Template - Icon - Feature' */}
        <div className="mb-6 relative">
          <div className="w-[72px] h-[72px] bg-gradient-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center shadow-lg border border-white/10">
            <Icon
              size={36}
              className="text-white drop-shadow-md"
              strokeWidth={2}
            />
          </div>
        </div>

        <h1 className="text-[26px] font-bold text-center text-black dark:text-white mb-3 tracking-tight leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center mb-8 max-w-md leading-relaxed">
            {description}
          </p>
        )}

        <div className="w-full flex-1 flex flex-col items-center">
          {children}
        </div>
      </div>

      {/* Footer Actions - Matching macOS Button Styles */}
      <div className="h-[60px] flex items-center justify-between px-8 pb-4">
        <div className="w-24">
          {onBack && (
            <button
              onClick={onBack}
              className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
            >
              Back
            </button>
          )}
        </div>

        {/* Pagination Indicators */}
        {/* Note: Pagination logic moved to parent or passed as prop if needed dynamic active state */}
        <div className="flex gap-2">
          {["language", "region", "account", "theme"].map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-colors bg-[#D1D1D6] dark:bg-[#3A3A3C]`}
            />
          ))}
        </div>

        <div className="w-24 flex justify-end">
          <button
            onClick={onContinue}
            disabled={continueDisabled}
            className={`
              flex items-center justify-center gap-1.5 bg-[#007AFF] text-white px-4 py-[5px] rounded-[6px] 
              text-[13px] font-medium shadow-sm hover:bg-[#0071E3] active:bg-[#005BB5] transition-all
              disabled:opacity-30 disabled:cursor-default
            `}
          >
            Continue
            <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const SetupAssistant: React.FC = () => {
  const { setSetupComplete, setTheme, theme, updateUser } = useSystemStore();
  const [step, setStep] = useState<
    "hello" | "language" | "region" | "account" | "theme" | "finish"
  >("hello");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
  });

  const validateAccount = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", age: "", phone: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required.";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1) {
      newErrors.age = "Enter a valid age.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAccountSubmit = () => {
    if (validateAccount()) {
      updateUser(formData);
      nextStep("theme");
    }
  };

  // Hello Animation State
  const [helloIndex, setHelloIndex] = useState(0);
  const [animState, setAnimState] = useState<
    "hidden" | "drawing" | "filled" | "exit"
  >("hidden");
  const [strokeLength, setStrokeLength] = useState(0);

  const textRef = useRef<SVGTextElement>(null);

  // Authentic Mac Fonts simulation
  const greetings = [
    {
      text: "hello",
      fontFamily: "'Brush Script MT', 'cursive'",
      weight: "normal",
      fontSize: "180px",
      yOffset: "50%",
    },
    {
      text: "hola",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      weight: "800",
      fontSize: "150px",
      yOffset: "50%",
    },
    {
      text: "bonjour",
      fontFamily: "Didot, serif",
      weight: "normal",
      fontSize: "150px",
      yOffset: "50%",
    },
    {
      text: "hallo",
      fontFamily: "monospace",
      weight: "normal",
      fontSize: "140px",
      yOffset: "50%",
    },
    {
      text: "ciao",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      weight: "300",
      fontSize: "150px",
      yOffset: "50%",
    },
    {
      text: "你好",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      weight: "800",
      fontSize: "150px",
      yOffset: "55%",
    },
    {
      text: "こんにちは",
      fontFamily: "-apple-system, BlinkMacSystemFont, serif",
      weight: "800",
      fontSize: "140px",
      yOffset: "55%",
    },
  ];

  // 1. Run the "Hello" Animation Sequence
  useEffect(() => {
    if (step === "hello") {
      const cycle = async () => {
        for (let i = 0; i < greetings.length; i++) {
          setHelloIndex(i);
          setAnimState("hidden");

          await new Promise((r) => setTimeout(r, 50));

          if (textRef.current) {
            const width = textRef.current.getComputedTextLength();
            setStrokeLength(Math.ceil(width * 4));
          }

          await new Promise((r) => setTimeout(r, 100));
          setAnimState("drawing");
          await new Promise((r) => setTimeout(r, 1500));
          setAnimState("filled");
          await new Promise((r) => setTimeout(r, 2000));
          setAnimState("exit");
          await new Promise((r) => setTimeout(r, 800));
        }
        setStep("language");
      };
      cycle();
    }
  }, [step]);

  const nextStep = (next: typeof step) => setStep(next);

  // --- HELLO SCREEN (Full Screen Black) ---
  if (step === "hello") {
    const current = greetings[helloIndex];
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] cursor-none overflow-hidden select-none">
        <svg viewBox="0 0 1000 300" className="w-full max-w-5xl h-auto px-10">
          <text
            ref={textRef}
            x="50%"
            y={current.yOffset || "50%"}
            textAnchor="middle"
            dominantBaseline="middle"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              fontFamily: current.fontFamily,
              fontWeight: current.weight,
              fontSize: current.fontSize,
              strokeDasharray: strokeLength,
              strokeDashoffset: animState === "hidden" ? strokeLength : 0,
              fill: "white",
              stroke: "white",
              strokeWidth: "2px",
              fillOpacity:
                animState === "filled" || animState === "exit" ? 1 : 0,
              strokeOpacity: animState === "exit" ? 0 : 1,
              transitionProperty:
                "stroke-dashoffset, fill-opacity, stroke-opacity, opacity, transform",
              transitionDuration: animState === "drawing" ? "1.5s" : "0.8s",
              transitionTimingFunction: "cubic-bezier(0.7, 0, 0.3, 1)",
            }}
            className={`${
              animState === "exit"
                ? "opacity-0 scale-110 blur-xl origin-center"
                : "opacity-100 scale-100 blur-0"
            }`}
          >
            {current.text}
          </text>
        </svg>
      </div>
    );
  }

  // --- STEPS ---

  if (step === "language") {
    return (
      <SetupWindow
        title="Select Your Language"
        description="Select the language you would like to use for your Mac."
        icon={Globe}
        onContinue={() => nextStep("region")}
        onBack={() => setStep("hello")}
      >
        <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
          {/* NSTableView Header */}
          <div className="h-6 bg-[#F5F5F5] dark:bg-[#2C2C2E] border-b border-[#D1D1D6] dark:border-[#38383A] flex items-center px-3">
            <span className="text-[11px] font-semibold text-[#6e6e73] dark:text-[#98989d]">
              Language
            </span>
          </div>

          {/* NSTableView Rows */}
          <div className="overflow-y-auto flex-1 py-1">
            {[
              "English",
              "Español",
              "Français",
              "Deutsch",
              "Italiano",
              "日本語",
              "中文",
            ].map((lang, idx) => (
              <div
                key={lang}
                className={`
                  px-3 py-1 mx-1 rounded-[4px] text-[13px] cursor-default flex items-center justify-between
                  ${
                    idx === 0
                      ? "bg-[#007AFF] text-white font-medium"
                      : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 even:bg-black/[0.02] dark:even:bg-white/[0.02]"
                  }
                `}
              >
                <span>{lang}</span>
                {idx === 0 && (
                  <span className="text-[11px] opacity-90 font-normal">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </SetupWindow>
    );
  }

  if (step === "region") {
    return (
      <SetupWindow
        title="Select Your Country or Region"
        description="Select the country or region where you are currently located."
        icon={MapPin}
        onContinue={() => nextStep("account")}
        onBack={() => setStep("language")}
      >
        <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
          <div className="h-6 bg-[#F5F5F5] dark:bg-[#2C2C2E] border-b border-[#D1D1D6] dark:border-[#38383A] flex items-center px-3">
            <span className="text-[11px] font-semibold text-[#6e6e73] dark:text-[#98989d]">
              Region
            </span>
          </div>
          <div className="overflow-y-auto flex-1 py-1">
            {[
              "United States",
              "United Kingdom",
              "Canada",
              "Australia",
              "India",
              "Japan",
              "France",
            ].map((country, idx) => (
              <div
                key={country}
                className={`
                  px-3 py-1 mx-1 rounded-[4px] text-[13px] cursor-default
                  ${
                    idx === 0
                      ? "bg-[#007AFF] text-white font-medium"
                      : "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 even:bg-black/[0.02] dark:even:bg-white/[0.02]"
                  }
                `}
              >
                {country}
              </div>
            ))}
          </div>
        </div>
      </SetupWindow>
    );
  }

  if (step === "account") {
    return (
      <SetupWindow
        title="Create Your Computer Account"
        description="Enter your name and account details to set up your computer."
        icon={UserCircle}
        onContinue={handleAccountSubmit}
        onBack={() => setStep("region")}
      >
        <div className="w-full max-w-sm space-y-4 mt-2">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
            />
            {errors.name && (
              <p className="text-red-500 text-[11px] mt-1 ml-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-[11px] mt-1 ml-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Age & Phone Row */}
          <div className="flex gap-3">
            <div className="w-24">
              <input
                type="text"
                placeholder="Age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className={`
                  w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                  ${
                    errors.age
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                  }
                `}
              />
            </div>
            <div className="flex-1">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`
                  w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                  ${
                    errors.phone
                      ? "border-red-500 focus:border-red-500"
                      : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                  }
                `}
              />
            </div>
          </div>
          <div className="flex gap-3">
            {errors.age && (
              <p className="text-red-500 text-[11px] ml-1 w-24 leading-tight">
                {errors.age}
              </p>
            )}
            {errors.phone && (
              <p className="text-red-500 text-[11px] ml-1 flex-1 leading-tight">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </SetupWindow>
    );
  }

  if (step === "theme") {
    return (
      <SetupWindow
        title="Select Your Appearance"
        description="Select Light or Dark appearance. The system interface and apps will adapt automatically."
        icon={Moon}
        onContinue={() => setSetupComplete(true)}
        onBack={() => setStep("account")}
      >
        <div className="flex gap-8 mt-4">
          {/* Light Mode Option */}
          <div
            onClick={() => setTheme("light")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={`
              w-[190px] h-[130px] rounded-[10px] border transition-all duration-200 relative overflow-hidden shadow-sm group-hover:shadow-md
              ${
                theme === "light"
                  ? "border-[#007AFF] ring-[3px] ring-[#007AFF]/30"
                  : "border-[#D1D1D6] dark:border-[#38383A] opacity-70 hover:opacity-100"
              }
            `}
            >
              <div className="absolute inset-0 bg-[#F5F5F7]">
                <div className="h-[22px] bg-white border-b border-[#D1D1D6] flex items-center px-2 space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57] shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-[#FEBC2E] shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840] shadow-sm" />
                </div>
                <div className="p-4 flex items-center justify-center h-full pb-8">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Sun className="text-gray-400" size={32} />
                  </div>
                </div>
              </div>
              {/* Checkmark Badge */}
              {theme === "light" && (
                <div className="absolute bottom-2 right-2 bg-[#007AFF] text-white rounded-full p-0.5 shadow-sm scale-in-center animate-in fade-in zoom-in duration-200">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <span
              className={`text-[13px] font-medium ${
                theme === "light"
                  ? "text-black dark:text-white"
                  : "text-[#6e6e73] dark:text-[#98989d]"
              }`}
            >
              Light
            </span>
          </div>

          {/* Dark Mode Option */}
          <div
            onClick={() => setTheme("dark")}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className={`
              w-[190px] h-[130px] rounded-[10px] border transition-all duration-200 relative overflow-hidden shadow-sm group-hover:shadow-md
              ${
                theme === "dark"
                  ? "border-[#007AFF] ring-[3px] ring-[#007AFF]/30"
                  : "border-[#D1D1D6] dark:border-[#38383A] opacity-70 hover:opacity-100"
              }
            `}
            >
              <div className="absolute inset-0 bg-[#1E1E1E]">
                <div className="h-[22px] bg-[#2C2C2E] border-b border-black/50 flex items-center px-2 space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
                  <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
                  <div className="w-2 h-2 rounded-full bg-[#5E5E5E]" />
                </div>
                <div className="p-4 flex items-center justify-center h-full pb-8">
                  <div className="w-16 h-16 rounded-full bg-[#3A3A3C] shadow-md flex items-center justify-center">
                    <Moon className="text-gray-200" size={32} />
                  </div>
                </div>
              </div>
              {theme === "dark" && (
                <div className="absolute bottom-2 right-2 bg-[#007AFF] text-white rounded-full p-0.5 shadow-sm scale-in-center animate-in fade-in zoom-in duration-200">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <span
              className={`text-[13px] font-medium ${
                theme === "dark"
                  ? "text-black dark:text-white"
                  : "text-[#6e6e73] dark:text-[#98989d]"
              }`}
            >
              Dark
            </span>
          </div>
        </div>
      </SetupWindow>
    );
  }

  return null;
};
