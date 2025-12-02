import React, { useState } from "react";
import Image from "next/image";
import { useSystemStore } from "../store/systemStore";
import HelloStrokeMultiLang from "../components/HelloStrokeMultiLang";
import {
  ArrowRight,
  Globe,
  Moon,
  Sun,
  Check,
  UserCircle,
  Fingerprint,
  Users,
  Keyboard,
  Eye,
  Hand,
  Ear,
  Brain,
  Download,
  Cloud,
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
    <Image
      src="/hello-gradient-bg.webp"
      alt="Background"
      fill
      priority
      className="object-cover -z-10"
    />
    {/* Background Overlay for readability */}
    <div className="absolute inset-0 bg-black/20 pointer-events-none" />

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
    | "hello"
    | "language"
    | "region"
    | "dataprivacy"
    | "touchid"
    | "fingerprint"
    | "languages"
    | "accessibility"
    | "migration"
    | "appleid"
    | "account"
    | "theme"
    | "finish"
  >("hello");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    password: "",
  });

  const [appleID, setAppleID] = useState("");
  const [migrationChoice, setMigrationChoice] = useState("mac");

  const [selectedCountry, setSelectedCountry] = useState("Germany");
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [fingerprintComplete, setFingerprintComplete] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([
    "English (UK)",
    "German",
  ]);

  const validateAccount = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", age: "", phone: "", password: "" };

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

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
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

  const nextStep = (next: typeof step) => setStep(next);

  // --- HELLO SCREEN (Full Screen) ---
  if (step === "hello") {
    return (
      <div className="fixed inset-0 z-[9999]">
        <HelloStrokeMultiLang />
        {/* Auto-advance to language selection after animation completes */}
        <button
          onClick={() => setStep("language")}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <div className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110">
            <svg
              className="w-4 h-4 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <span className="text-white/80 text-xs font-medium tracking-wide">
            Get Started
          </span>
        </button>
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
    const countries = [
      "Germany",
      "Afghanistan",
      "Åland Islands",
      "Albania",
      "Algeria",
      "American Samoa",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua & Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
    ];

    return (
      <SetupWindow
        title="Select Your Country or Region"
        icon={Globe}
        onContinue={() => nextStep("dataprivacy")}
        onBack={() => setStep("language")}
      >
        <div className="w-[360px] h-[240px] bg-white dark:bg-[#1C1C1E] rounded-md border border-[#D1D1D6] dark:border-[#38383A] overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-y-auto flex-1 py-1">
            {countries.map((country) => (
              <div
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`
                  px-3 py-1 mx-1 rounded-[4px] text-[13px] cursor-default
                  ${
                    country === selectedCountry
                      ? "bg-[#007AFF] text-white font-medium"
                      : "text-[#86868B] dark:text-[#98989d] hover:bg-black/5 dark:hover:bg-white/10"
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

  // Data & Privacy Screen
  if (step === "dataprivacy") {
    return (
      <SetupWindow
        title="Data & Privacy"
        icon={Users}
        onContinue={() => nextStep("touchid")}
        onBack={() => setStep("region")}
      >
        <div className="max-w-md space-y-4 text-center">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
            This icon appears when an Apple feature asks to use your personal
            information.
          </p>
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
            You won't see this with every feature since Apple collects this
            information only when needed to enable features, secure our services
            or personalise your experience.
          </p>
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
            Apple believes privacy is a fundamental human right, so every Apple
            product is designed to minimise the collection and use of your data,
            use on-device processing whenever possible, and provide transparency
            and control over your information.
          </p>
          <button className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors mt-2">
            Learn More
          </button>
        </div>
      </SetupWindow>
    );
  }

  // Touch ID Setup Screen
  if (step === "touchid") {
    return (
      <SetupWindow
        title="Touch ID"
        icon={Keyboard}
        onContinue={() => nextStep("fingerprint")}
        onBack={() => setStep("dataprivacy")}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Keyboard Graphic */}
          <div className="relative">
            <div className="w-[400px] h-[180px] bg-gradient-to-b from-[#35353A] to-[#1C1C1E] rounded-t-lg shadow-2xl border-t border-l border-r border-[#4A4A4E]">
              {/* Keyboard Keys Row 1 */}
              <div className="flex gap-1 px-2 pt-3">
                {["% 5", "^ 6", "& 7", "* 8", "( 9", ") 0", "_ -", "+ ="].map(
                  (key) => (
                    <div
                      key={key}
                      className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] opacity-60">
                          {key.split(" ")[0]}
                        </span>
                        <span>{key.split(" ")[1]}</span>
                      </div>
                    </div>
                  )
                )}
                <div className="w-16 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm">
                  delete
                </div>
              </div>

              {/* Keyboard Keys Row 2 */}
              <div className="flex gap-1 px-2 pt-1">
                {["T", "Y", "U", "I", "O", "P"].map((key) => (
                  <div
                    key={key}
                    className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[11px] font-medium border border-black/40 shadow-sm"
                  >
                    {key}
                  </div>
                ))}
                <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-[8px] opacity-60">{"{"}</span>
                    <span>{"["}</span>
                  </div>
                </div>
                <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-[8px] opacity-60">{"}"}</span>
                    <span>{"]"}</span>
                  </div>
                </div>
                <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-[8px] opacity-60">|</span>
                    <span>\</span>
                  </div>
                </div>
              </div>

              {/* Keyboard Keys Row 3 */}
              <div className="flex gap-1 px-2 pt-1">
                {["G", "H", "J", "K", "L"].map((key) => (
                  <div
                    key={key}
                    className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[11px] font-medium border border-black/40 shadow-sm"
                  >
                    {key}
                  </div>
                ))}
                <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-[8px] opacity-60">:</span>
                    <span>;</span>
                  </div>
                </div>
                <div className="w-10 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] border border-black/40 shadow-sm">
                  <div className="flex flex-col items-center -space-y-0.5">
                    <span className="text-[8px] opacity-60">&quot;</span>
                    <span>&apos;</span>
                  </div>
                </div>
                <div className="w-20 h-8 bg-[#2C2C2E] rounded-sm flex items-center justify-center text-white text-[9px] font-medium border border-black/40 shadow-sm">
                  return
                </div>
              </div>

              {/* Touch ID Indicator */}
              <div className="absolute -bottom-8 right-8 w-20 h-6 bg-gradient-to-b from-[#2C2C2E] to-[#1C1C1E] rounded-sm flex items-center justify-center border border-[#4A4A4E] shadow-lg">
                <Fingerprint size={18} className="text-white opacity-80" />
              </div>
            </div>
            {/* Keyboard Base */}
            <div className="h-12 bg-gradient-to-b from-[#D5D5D8] to-[#B8B8BC] rounded-b-lg shadow-xl border-b border-l border-r border-[#A0A0A4]" />
          </div>

          <div className="max-w-md text-center">
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] leading-relaxed">
              Use your fingerprint to unlock your Mac and make purchases with
              Apple Pay. Start by placing your finger or thumb on Touch ID.
            </p>
          </div>

          <button
            onClick={() => nextStep("fingerprint")}
            className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            Set Up Touch ID Later
          </button>
        </div>
      </SetupWindow>
    );
  }

  // Fingerprint Enrollment Screen
  if (step === "fingerprint") {
    return (
      <SetupWindow
        title="Place Your Finger"
        icon={Fingerprint}
        onContinue={() => nextStep("languages")}
        onBack={() => {
          setStep("touchid");
          setFingerprintProgress(0);
          setFingerprintComplete(false);
        }}
      >
        <div className="flex flex-col items-center space-y-6">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center max-w-sm">
            Lift and rest your finger on Touch ID repeatedly
          </p>

          {/* Animated Fingerprint Graphic */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Fingerprint SVG with Animation */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{ transform: "scale(1.2)" }}
            >
              {/* Fingerprint lines with progressive reveal */}
              {[...Array(12)].map((_, i) => {
                const radius = 20 + i * 8;
                const opacity =
                  fingerprintProgress > i * 8 ? 0.8 - i * 0.05 : 0.1;
                return (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="100"
                    rx={radius}
                    ry={radius + 5}
                    fill="none"
                    stroke={
                      fingerprintComplete
                        ? "#34C759"
                        : theme === "dark"
                        ? "#E5989B"
                        : "#FF6B6B"
                    }
                    strokeWidth="1.5"
                    opacity={opacity}
                    style={{
                      transition: "opacity 0.3s, stroke 0.5s",
                      strokeDasharray: `${Math.PI * (radius * 2)} ${
                        Math.PI * (radius * 2)
                      }`,
                      strokeDashoffset:
                        fingerprintProgress > i * 8
                          ? 0
                          : Math.PI * (radius * 2),
                    }}
                  />
                );
              })}
            </svg>

            {/* Center dot with pulse effect */}
            <div
              className={`absolute w-3 h-3 rounded-full ${
                fingerprintComplete
                  ? "bg-[#34C759]"
                  : "bg-[#FF6B6B] dark:bg-[#E5989B]"
              }`}
              style={{
                animation: fingerprintComplete
                  ? "none"
                  : "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>

          {fingerprintComplete && (
            <div className="text-[#34C759] text-[13px] font-medium animate-in fade-in duration-300">
              ✓ Touch ID Configured Successfully
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep("touchid");
                setFingerprintProgress(0);
                setFingerprintComplete(false);
              }}
              className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
            >
              Set Up Touch ID Later
            </button>
            <button
              onClick={() => {
                setFingerprintProgress(0);
                setFingerprintComplete(false);
              }}
              className="text-[#6e6e73] dark:text-[#98989d] text-[13px] font-medium hover:text-black dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </SetupWindow>
    );
  }

  // Written and Spoken Languages Screen
  if (step === "languages") {
    return (
      <SetupWindow
        title="Written and Spoken Languages"
        icon={Globe}
        onContinue={() => nextStep("account")}
        onBack={() => setStep("fingerprint")}
      >
        <div className="max-w-lg space-y-6">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed mb-8">
            The following languages are commonly used in your region. You can
            set up your Mac to use these settings or customise them
            individually.
          </p>

          {/* Preferred Languages */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Globe size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
                Preferred Languages
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                {selectedLanguages.join(", ")}
              </p>
            </div>
          </div>

          {/* Input Sources */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Keyboard size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
                Input Sources
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                ABC – QWERTZ
              </p>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                German
              </p>
            </div>
          </div>

          {/* Dictation */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-b from-[#007AFF] to-[#0055B3] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-black dark:text-white mb-1">
                Dictation
              </h3>
              <p className="text-[#6e6e73] dark:text-[#98989d] text-[12px]">
                English (United Kingdom)
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
              Customise Settings
            </button>
          </div>
        </div>
      </SetupWindow>
    );
  }

  // Accessibility Screen
  if (step === "accessibility") {
    return (
      <SetupWindow
        title="Accessibility"
        icon={Users}
        onContinue={() => nextStep("migration")}
        onBack={() => setStep("languages")}
      >
        <div className="max-w-2xl space-y-6">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
            Accessibility features adapt your Mac to your individual needs. You
            can turn them on now to help you finish setting up, and further
            customise them later in System Preferences. See what&apos;s
            available in each of the categories below.
          </p>

          {/* Four Categories */}
          <div className="grid grid-cols-4 gap-4">
            {/* Vision */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Eye size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
              </div>
              <span className="text-[13px] font-medium text-black dark:text-white">
                Vision
              </span>
            </div>

            {/* Motor */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Hand
                  size={32}
                  className="text-[#6e6e73] dark:text-[#98989d]"
                />
              </div>
              <span className="text-[13px] font-medium text-black dark:text-white">
                Motor
              </span>
            </div>

            {/* Hearing */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Ear size={32} className="text-[#6e6e73] dark:text-[#98989d]" />
              </div>
              <span className="text-[13px] font-medium text-black dark:text-white">
                Hearing
              </span>
            </div>

            {/* Cognitive */}
            <div className="flex flex-col items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-[#E5E5EA] dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Brain
                  size={32}
                  className="text-[#6e6e73] dark:text-[#98989d]"
                />
              </div>
              <span className="text-[13px] font-medium text-black dark:text-white">
                Cognitive
              </span>
            </div>
          </div>
        </div>

        {/* Not Now button positioned at bottom left */}
        <div className="absolute bottom-4 left-8">
          <button
            onClick={() => nextStep("migration")}
            className="text-[#6e6e73] dark:text-[#98989d] text-[13px] font-medium hover:text-black dark:hover:text-white transition-colors"
          >
            Not Now
          </button>
        </div>
      </SetupWindow>
    );
  }

  // Migration Assistant Screen
  if (step === "migration") {
    return (
      <SetupWindow
        title="Migration Assistant"
        icon={Download}
        onContinue={() => nextStep("appleid")}
        onBack={() => setStep("accessibility")}
      >
        <div className="max-w-lg space-y-8">
          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
            If you have information on another Mac or a Windows PC, you can
            transfer it to this Mac. You can also transfer information from a
            Time Machine backup or another startup disk.
          </p>

          <div className="space-y-4">
            <p className="text-[13px] font-medium text-black dark:text-white text-center">
              How do you want to transfer your information?
            </p>

            {/* Radio Options */}
            <div className="space-y-3">
              <div
                onClick={() => setMigrationChoice("mac")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    migrationChoice === "mac"
                      ? "border-[#007AFF]"
                      : "border-[#D1D1D6] dark:border-[#38383A]"
                  }`}
                >
                  {migrationChoice === "mac" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                  )}
                </div>
                <span className="text-[13px] text-black dark:text-white">
                  From a Mac, Time Machine backup or Startup disk
                </span>
              </div>

              <div
                onClick={() => setMigrationChoice("windows")}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    migrationChoice === "windows"
                      ? "border-[#007AFF]"
                      : "border-[#D1D1D6] dark:border-[#38383A]"
                  }`}
                >
                  {migrationChoice === "windows" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF]" />
                  )}
                </div>
                <span className="text-[13px] text-black dark:text-white">
                  From a Windows PC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Not Now button at bottom left */}
        <div className="absolute bottom-4 left-8">
          <button
            onClick={() => nextStep("appleid")}
            className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            Not Now
          </button>
        </div>
      </SetupWindow>
    );
  }

  // Apple ID Sign In Screen
  if (step === "appleid") {
    return (
      <SetupWindow
        title="Sign In with Your Apple ID"
        icon={Cloud}
        onContinue={() => nextStep("account")}
        onBack={() => setStep("migration")}
      >
        <div className="max-w-md space-y-6">
          {/* Apple Services Icons */}
          <div className="flex justify-center gap-2 mb-6">
            {[Cloud, Globe, Globe, Cloud, Globe].map((Icon, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-gradient-to-b from-[#007AFF] to-[#0055B3] rounded-xl flex items-center justify-center shadow-md"
              >
                <Icon size={20} className="text-white" />
              </div>
            ))}
          </div>

          <p className="text-[#6e6e73] dark:text-[#98989d] text-[13px] text-center leading-relaxed">
            Sign in to use iCloud, the App Store and other Apple services.
          </p>

          {/* Apple ID Input */}
          <div className="space-y-2">
            <label className="text-[13px] text-black dark:text-white">
              Apple ID
            </label>
            <input
              type="email"
              value={appleID}
              onChange={(e) => setAppleID(e.target.value)}
              className="w-full bg-white dark:bg-[#1C1C1E] border border-[#D1D1D6] dark:border-[#38383A] rounded-md px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all"
              placeholder=""
            />
          </div>

          {/* Links */}
          <div className="space-y-2 text-center">
            <button className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
              Create new Apple ID
            </button>
            <br />
            <button className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
              Forgot Apple ID or password?
            </button>
            <br />
            <button className="text-[#007AFF] text-[13px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
              Use different Apple IDs for iCloud and Apple media purchases?
            </button>
          </div>

          {/* Info Section */}
          <div className="bg-white/50 dark:bg-white/5 rounded-lg p-6 text-center space-y-2">
            <div className="flex justify-center mb-2">
              <Users size={32} className="text-[#007AFF]" />
            </div>
            <p className="text-[#6e6e73] dark:text-[#98989d] text-[11px] leading-relaxed">
              This Mac will be associated with your Apple ID, and data such as
              photos, contacts and documents will be stored in iCloud so you can
              access them on other devices.
            </p>
            <button className="text-[#007AFF] text-[11px] hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors">
              See how your data is managed
            </button>
          </div>
        </div>

        {/* Set Up Later button at bottom left */}
        <div className="absolute bottom-4 left-8">
          <button
            onClick={() => nextStep("account")}
            className="text-[#007AFF] text-[13px] font-medium hover:text-[#0055B3] dark:hover:text-[#409CFF] transition-colors"
          >
            Set Up Later
          </button>
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
        onBack={() => setStep("appleid")}
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

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`
                w-full bg-white dark:bg-[#1C1C1E] border rounded-[6px] px-3 py-2 text-[13px] text-black dark:text-white outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all
                ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#D1D1D6] dark:border-[#38383A] focus:border-[#007AFF]"
                }
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-[11px] mt-1 ml-1">
                {errors.password}
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
