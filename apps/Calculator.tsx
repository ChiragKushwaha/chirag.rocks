"use client";
import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export const Calculator: React.FC = () => {
  const t = useTranslations("Calculator");
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [activeOp, setActiveOp] = useState<string | null>(null);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display.length < 12 ? display + digit : display);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) { setDisplay("0."); setWaitingForOperand(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  }, [display, waitingForOperand]);

  const calculate = (prev: number, next: number, op: string): number => {
    switch (op) {
      case "+": return prev + next;
      case "−": return prev - next;
      case "×": return prev * next;
      case "÷": return next !== 0 ? prev / next : 0;
      default: return next;
    }
  };

  const performOperation = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (nextOperator === "=") {
      if (prevValue !== null && operator) {
        const result = calculate(prevValue, inputValue, operator);
        const str = parseFloat(result.toPrecision(10)).toString();
        setDisplay(str.length > 12 ? parseFloat(result.toFixed(6)).toString() : str);
        setPrevValue(null);
        setOperator(null);
        setActiveOp(null);
        setWaitingForOperand(true);
      }
    } else {
      if (prevValue !== null && !waitingForOperand && operator) {
        const result = calculate(prevValue, inputValue, operator);
        const str = parseFloat(result.toPrecision(10)).toString();
        setDisplay(str.length > 12 ? parseFloat(result.toFixed(6)).toString() : str);
        setPrevValue(result);
      } else {
        setPrevValue(inputValue);
      }
      setWaitingForOperand(true);
      setOperator(nextOperator);
      setActiveOp(nextOperator);
    }
  }, [display, prevValue, operator, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setActiveOp(null);
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const inputPercent = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  // Dynamic font size for display
  const displayFontSize =
    display.length > 9 ? "text-4xl" :
    display.length > 6 ? "text-5xl" :
    "text-[64px]";

  const rows = [
    [
      { label: display !== "0" ? "C" : "AC", onClick: clear, type: "fn", ariaLabel: t("AllClear") },
      { label: "+/-", onClick: toggleSign, type: "fn", ariaLabel: t("ToggleSign") },
      { label: "%", onClick: inputPercent, type: "fn", ariaLabel: t("Percentage") },
      { label: "÷", onClick: () => performOperation("÷"), type: "op", ariaLabel: t("Divide") },
    ],
    [
      { label: "7", onClick: () => inputDigit("7"), type: "num" },
      { label: "8", onClick: () => inputDigit("8"), type: "num" },
      { label: "9", onClick: () => inputDigit("9"), type: "num" },
      { label: "×", onClick: () => performOperation("×"), type: "op", ariaLabel: t("Multiply") },
    ],
    [
      { label: "4", onClick: () => inputDigit("4"), type: "num" },
      { label: "5", onClick: () => inputDigit("5"), type: "num" },
      { label: "6", onClick: () => inputDigit("6"), type: "num" },
      { label: "−", onClick: () => performOperation("−"), type: "op", ariaLabel: t("Subtract") },
    ],
    [
      { label: "1", onClick: () => inputDigit("1"), type: "num" },
      { label: "2", onClick: () => inputDigit("2"), type: "num" },
      { label: "3", onClick: () => inputDigit("3"), type: "num" },
      { label: "+", onClick: () => performOperation("+"), type: "op", ariaLabel: t("Add") },
    ],
    [
      { label: "0", onClick: () => inputDigit("0"), type: "num", wide: true },
      { label: ".", onClick: inputDecimal, type: "num" },
      { label: "=", onClick: () => performOperation("="), type: "op", ariaLabel: t("Calculate") },
    ],
  ];

  return (
    <div
      className="h-full w-full flex flex-col select-none overflow-hidden"
      style={{ background: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
    >
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-4 min-h-0">
        <div
          className={`text-white font-light tracking-tight tabular-nums leading-none ${displayFontSize}`}
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-[1px] pb-4 px-4">
        {rows.map((row, ri) =>
          row.map((btn, ci) => {
            const isActiveOp = btn.type === "op" && activeOp === btn.label;
            let bg: string;
            let fg: string;
            let activeBg: string;

            if (btn.type === "op") {
              bg = isActiveOp ? "#ffffff" : "#FF9500";
              fg = isActiveOp ? "#FF9500" : "#ffffff";
              activeBg = isActiveOp ? "#e5e5e5" : "#e0860a";
            } else if (btn.type === "fn") {
              bg = "#a5a5a5";
              fg = "#000000";
              activeBg = "#d4d4d4";
            } else {
              bg = "#333333";
              fg = "#ffffff";
              activeBg = "#525252";
            }

            return (
              <button
                key={`${ri}-${ci}`}
                onClick={btn.onClick}
                aria-label={btn.ariaLabel || btn.label}
                className={`
                  ${(btn as { wide?: boolean }).wide ? "col-span-2" : "col-span-1"}
                  h-[72px] rounded-full flex items-center
                  ${(btn as { wide?: boolean }).wide ? "justify-start pl-7" : "justify-center"}
                  text-[28px] font-light transition-all duration-75 active:scale-95
                `}
                style={{ background: bg, color: fg }}
                onMouseEnter={e => (e.currentTarget.style.background = activeBg)}
                onMouseLeave={e => (e.currentTarget.style.background = bg)}
                onMouseDown={e => (e.currentTarget.style.background = activeBg)}
                onMouseUp={e => (e.currentTarget.style.background = bg)}
              >
                <span className={btn.type === "fn" ? "text-[22px] font-medium" : ""}>
                  {btn.label}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
