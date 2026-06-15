"use client";
import React, { useState, useEffect, useRef } from "react";
import { Plus, Globe, AlarmClock, Timer, Hourglass, Play, Pause, RotateCcw, StopCircle } from "lucide-react";
import { useTranslations } from "next-intl";

// ─── World Clock cities ────────────────────────────────────────────────────
const CITIES = [
  { name: "New Delhi", tz: "Asia/Kolkata", offset: "+5:30" },
  { name: "New York", tz: "America/New_York", offset: "-5" },
  { name: "London", tz: "Europe/London", offset: "+0" },
  { name: "Tokyo", tz: "Asia/Tokyo", offset: "+9" },
  { name: "San Francisco", tz: "America/Los_Angeles", offset: "-8" },
  { name: "Sydney", tz: "Australia/Sydney", offset: "+11" },
];

// ─── Analogue Clock ────────────────────────────────────────────────────────
const AnalogClock = ({ date, size = 80 }: { date: Date; size?: number }) => {
  const s = date.getSeconds();
  const m = date.getMinutes();
  const h = date.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;
  const r = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Face */}
      <circle cx={r} cy={r} r={r - 1} fill="#2c2c2e" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Hour marks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = r + (r - 8) * Math.sin(angle);
        const y1 = r - (r - 8) * Math.cos(angle);
        const x2 = r + (r - 4) * Math.sin(angle);
        const y2 = r - (r - 4) * Math.cos(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      {/* Hour hand */}
      <line x1={r} y1={r} x2={r + (r * 0.45) * Math.sin((hrDeg * Math.PI) / 180)} y2={r - (r * 0.45) * Math.cos((hrDeg * Math.PI) / 180)} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={r} y1={r} x2={r + (r * 0.65) * Math.sin((minDeg * Math.PI) / 180)} y2={r - (r * 0.65) * Math.cos((minDeg * Math.PI) / 180)} stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Second hand */}
      <line x1={r} y1={r} x2={r + (r * 0.72) * Math.sin((secDeg * Math.PI) / 180)} y2={r - (r * 0.72) * Math.cos((secDeg * Math.PI) / 180)} stroke="#FF9F0A" strokeWidth="1" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={r} cy={r} r="2.5" fill="#FF9F0A" />
    </svg>
  );
};

// ─── Stopwatch ─────────────────────────────────────────────────────────────
const StopwatchTab = () => {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const baseRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => setElapsed(baseRef.current + Date.now() - startRef.current), 50);
    return () => clearInterval(id);
  }, [running]);

  const fmt = (ms: number) => {
    const min = Math.floor(ms / 60000).toString().padStart(2, "0");
    const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, "0");
    return { min, sec, cs };
  };

  const { min, sec, cs } = fmt(elapsed);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-8">
      <div className="text-center">
        <div className="text-[72px] font-thin tracking-tight text-white leading-none tabular-nums">
          {min}:{sec}
        </div>
        <div className="text-[28px] font-thin text-white/50 tabular-nums">.{cs}</div>
      </div>
      <div className="flex gap-6">
        <button
          onClick={() => { if (running) { baseRef.current = elapsed; } setRunning(!running); }}
          className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
          style={{ background: running ? "#2c2c2e" : "#30d158" }}
        >
          {running ? <Pause size={22} /> : <Play size={22} />}
        </button>
        {running || elapsed > 0 ? (
          <button
            onClick={() => {
              if (running) {
                setLaps(prev => [...prev, elapsed]);
              } else {
                setElapsed(0); baseRef.current = 0; setLaps([]);
              }
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
            style={{ background: "#2c2c2e" }}
          >
            {running ? "Lap" : <RotateCcw size={18} />}
          </button>
        ) : null}
      </div>
      {laps.length > 0 && (
        <div className="w-full max-w-sm space-y-1 px-6 overflow-y-auto max-h-40">
          {[...laps].reverse().map((lap, i) => {
            const lapIndex = laps.length - i;
            const { min, sec, cs } = fmt(lap);
            return (
              <div key={i} className="flex justify-between text-[13px] border-b border-white/10 py-1.5">
                <span className="text-white/50">Lap {lapIndex}</span>
                <span className="text-white tabular-nums">{min}:{sec}.{cs}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Timer ─────────────────────────────────────────────────────────────────
const TimerTab = () => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [inputH, setInputH] = useState("0");
  const [inputM, setInputM] = useState("0");
  const [inputS, setInputS] = useState("0");

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { setRunning(false); return; }
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  const start = () => {
    const t = parseInt(inputH) * 3600 + parseInt(inputM) * 60 + parseInt(inputS);
    setTotalSeconds(t);
    setRemaining(t);
    setRunning(true);
  };

  const h = Math.floor(remaining / 3600).toString().padStart(2, "0");
  const m = Math.floor((remaining % 3600) / 60).toString().padStart(2, "0");
  const s = (remaining % 60).toString().padStart(2, "0");
  const pct = totalSeconds > 0 ? remaining / totalSeconds : 1;
  const circumference = 2 * Math.PI * 100;

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6">
      {/* Ring */}
      <div className="relative">
        <svg width={240} height={240} className="-rotate-90">
          <circle cx={120} cy={120} r={100} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
          <circle
            cx={120} cy={120} r={100} fill="none"
            stroke="#FF9F0A" strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[44px] font-thin text-white tabular-nums">{h}:{m}:{s}</div>
        </div>
      </div>
      {!running && (
        <div className="flex gap-4">
          {[
            { label: "Hrs", val: inputH, set: setInputH },
            { label: "Min", val: inputM, set: setInputM },
            { label: "Sec", val: inputS, set: setInputS },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <input
                type="number" min={0} max={59} value={val}
                onChange={e => set(e.target.value)}
                className="w-16 h-12 text-center text-white text-[20px] font-thin rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:border-orange-400 tabular-nums"
              />
              <span className="text-[11px] text-white/40">{label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-4">
        {running ? (
          <>
            <button onClick={() => setRunning(false)} className="px-6 py-2 rounded-full text-white font-medium" style={{ background: "#2c2c2e" }}>Pause</button>
            <button onClick={() => { setRunning(false); setRemaining(totalSeconds); }} className="px-6 py-2 rounded-full text-white font-medium flex items-center gap-2" style={{ background: "#2c2c2e" }}>
              <RotateCcw size={14} /> Reset
            </button>
          </>
        ) : (
          <button onClick={start} className="px-8 py-2 rounded-full text-white font-medium" style={{ background: "#FF9F0A" }}>
            {remaining > 0 && remaining < totalSeconds ? "Resume" : "Start"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Alarms ────────────────────────────────────────────────────────────────
const AlarmsTab = ({ now }: { now: Date }) => {
  const hours = now.getHours();
  const displayHour = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  const minutes = now.getMinutes();
  const timeStr = `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  const alarms = [
    { time: "7:00 AM", label: "Wake Up", enabled: true, days: "Weekdays" },
    { time: "9:00 AM", label: "Work Start", enabled: false, days: "Mon, Wed, Fri" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Current time big display */}
      <div className="flex flex-col items-center justify-center py-8 border-b border-white/10">
        <div className="text-[52px] font-extralight text-white tracking-tight tabular-nums">{timeStr}</div>
        <div className="text-[14px] text-white/50 mt-1">
          {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Alarm list */}
      <div className="flex-1 px-6 py-4 space-y-3">
        {alarms.map((alarm, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: "#2c2c2e" }}>
            <div>
              <div className={`text-[28px] font-light tabular-nums ${alarm.enabled ? "text-white" : "text-white/30"}`}>{alarm.time}</div>
              <div className={`text-[12px] ${alarm.enabled ? "text-white/60" : "text-white/25"}`}>{alarm.label} · {alarm.days}</div>
            </div>
            <div
              className="w-12 h-7 rounded-full relative cursor-pointer transition-colors"
              style={{ background: alarm.enabled ? "#30d158" : "#3a3a3c" }}
            >
              <div
                className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"
                style={{ transform: alarm.enabled ? "translateX(22px)" : "translateX(2px)" }}
              />
            </div>
          </div>
        ))}
        <button className="w-full flex items-center gap-2 p-4 rounded-xl text-[#FF9F0A] font-medium" style={{ background: "#2c2c2e" }}>
          <Plus size={18} /> Add Alarm
        </button>
      </div>
    </div>
  );
};

// ─── Main Clock ────────────────────────────────────────────────────────────
export const Clock: React.FC = () => {
  const t = useTranslations("Clock");
  const [activeTab, setActiveTab] = useState("WorldClock");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const TABS = [
    { id: "WorldClock", label: t("Tabs.WorldClock"), icon: Globe },
    { id: "Alarms", label: t("Tabs.Alarms"), icon: AlarmClock },
    { id: "Stopwatch", label: t("Tabs.Stopwatch"), icon: Timer },
    { id: "Timers", label: t("Tabs.Timers"), icon: Hourglass },
  ];

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{
        background: "#1c1c1e",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
      }}
    >
      {/* Header */}
      <div className="h-[52px] flex items-center justify-between px-4 shrink-0" style={{ background: "#2c2c2e", borderBottom: "1px solid rgba(0,0,0,0.3)" }}>
        <div className="w-8" />
        {/* Tab switcher */}
        <div className="flex rounded-[8px] p-1 gap-1" style={{ background: "#1c1c1e" }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors"
              style={{
                background: activeTab === id ? "#3a3a3c" : "transparent",
                color: activeTab === id ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#3a3a3c" }}
          aria-label={t("AddClock")}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === "WorldClock" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Map */}
            <div className="relative flex-1 overflow-hidden" style={{ background: "#000" }}>
              <svg className="w-full h-full opacity-25 absolute inset-0" viewBox="0 0 1000 500" preserveAspectRatio="none">
                <rect width="1000" height="500" fill="#1a1a2e" />
                <path fill="#252540" d="M80,60 Q120,30 180,60 Q220,90 260,70 Q290,50 320,65 Q350,80 380,65 Q430,40 470,70 Q500,90 520,70 Q560,40 610,60 Q660,80 700,60 Q740,40 780,60 Q810,80 850,65 Q880,50 920,65 V200 Q880,220 850,200 Q810,180 780,200 Q740,220 700,200 Q660,180 610,200 Q560,220 520,200 Q500,180 470,200 Q430,220 380,200 Q350,180 320,200 Q290,220 260,200 Q220,180 180,200 Q120,220 80,200 Z" />
                <path fill="#252540" d="M100,230 Q130,210 170,225 Q200,240 230,225 Q260,210 290,225 V380 Q260,390 230,375 Q200,360 170,375 Q130,390 100,380 Z" />
                <path fill="#252540" d="M300,240 Q360,210 420,235 Q470,260 510,245 Q560,225 610,240 Q650,260 690,245 V380 Q650,395 610,380 Q560,360 510,375 Q470,390 420,375 Q360,395 300,380 Z" />
                <path fill="#252540" d="M650,100 Q710,75 770,100 Q820,125 870,110 Q910,95 950,110 V260 Q910,275 870,260 Q820,240 770,260 Q710,275 650,260 Z" />
                <path fill="#252540" d="M680,290 Q730,270 780,285 Q820,300 860,290 V380 Q820,395 780,380 Q730,395 680,380 Z" />
              </svg>
              {/* Night overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, rgba(0,0,30,0.5) 0%, transparent 40%, rgba(0,0,30,0.5) 100%)" }} />
              {/* City markers */}
              {[
                { name: "New York", left: "22%", top: "38%", city: CITIES[1] },
                { name: "London", left: "45%", top: "28%", city: CITIES[2] },
                { name: "New Delhi", left: "65%", top: "43%", city: CITIES[0] },
                { name: "Tokyo", left: "82%", top: "35%", city: CITIES[3] },
              ].map(({ name, left, top, city }) => {
                const cityTime = new Date(time.toLocaleString("en-US", { timeZone: city.tz }));
                return (
                  <div key={name} className="absolute flex flex-col items-center" style={{ left, top }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: "#FF9F0A", boxShadow: "0 0 8px #FF9F0A" }} />
                    <div className="mt-1 text-[10px] font-medium text-white drop-shadow">{name}</div>
                    <div className="text-[9px] text-white/60">
                      {cityTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* City list */}
            <div className="h-[180px] flex gap-4 px-6 py-4 overflow-x-auto shrink-0" style={{ background: "#1c1c1e", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {CITIES.map((city) => {
                const cityTime = new Date(time.toLocaleString("en-US", { timeZone: city.tz }));
                const diffH = Math.round((cityTime.getTime() - time.getTime()) / 3600000);
                return (
                  <div key={city.name} className="flex flex-col items-center gap-2 shrink-0 cursor-default group">
                    <AnalogClock date={cityTime} size={76} />
                    <div className="text-center">
                      <div className="text-[12px] font-medium text-white">{city.name}</div>
                      <div className="text-[11px] text-white/40">
                        {diffH === 0 ? "Same time" : diffH > 0 ? `+${diffH} HRS` : `${diffH} HRS`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "Alarms" && <AlarmsTab now={time} />}
        {activeTab === "Stopwatch" && <StopwatchTab />}
        {activeTab === "Timers" && <TimerTab />}
      </div>
    </div>
  );
};
