import React, { useState } from "react";
import { useTranslations } from "next-intl";

export const Calculator: React.FC = () => {
  const t = useTranslations("Calculator");
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case "+":
        return prev + next;
      case "-":
        return prev - next;
      case "*":
        return prev * next;
      case "/":
        return prev / next;
      default:
        return next;
    }
  };

  const clear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="h-full w-full bg-black flex flex-col p-4 select-none">
      <div className="flex-1 flex items-end justify-end text-white text-6xl font-light mb-4 px-2 break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <Button label={t("AC")} onClick={clear} ariaLabel={t("AllClear")} />
        <Button label="+/-" onClick={toggleSign} ariaLabel={t("ToggleSign")} />
        <Button label="%" onClick={inputPercent} ariaLabel={t("Percentage")} />
        <Button
          label="÷"
          onClick={() => performOperation("/")}
          orange
          ariaLabel={t("Divide")}
        />

        <Button label="7" onClick={() => inputDigit("7")} />
        <Button label="8" onClick={() => inputDigit("8")} />
        <Button label="9" onClick={() => inputDigit("9")} />
        <Button
          label="×"
          onClick={() => performOperation("*")}
          orange
          ariaLabel={t("Multiply")}
        />

        <Button label="4" onClick={() => inputDigit("4")} />
        <Button label="5" onClick={() => inputDigit("5")} />
        <Button label="6" onClick={() => inputDigit("6")} />
        <Button
          label="-"
          onClick={() => performOperation("-")}
          orange
          ariaLabel={t("Subtract")}
        />

        <Button label="1" onClick={() => inputDigit("1")} />
        <Button label="2" onClick={() => inputDigit("2")} />
        <Button label="3" onClick={() => inputDigit("3")} />
        <Button
          label="+"
          onClick={() => performOperation("+")}
          orange
          ariaLabel={t("Add")}
        />

        <Button label="0" onClick={() => inputDigit("0")} wide />
        <Button label="." onClick={() => inputDigit(".")} />
        <Button
          label="="
          onClick={() => performOperation("=")}
          orange
          ariaLabel={t("Calculate")}
        />
      </div>
    </div>
  );
};

interface ButtonProps {
  label: string;
  onClick: () => void;
  orange?: boolean;
  wide?: boolean;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  orange = false,
  wide = false,
  ariaLabel,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${
        wide ? "col-span-2" : "col-span-1"
      } h-16 rounded-full text-2xl font-medium transition-all active:scale-95 flex items-center justify-center ${
        orange
          ? "bg-orange-500 text-white hover:bg-orange-400"
          : "bg-gray-700 text-white hover:bg-gray-600"
      }`}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};
