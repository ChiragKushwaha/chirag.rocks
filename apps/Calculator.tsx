import React, { useState } from "react";

export const Calculator: React.FC = () => {
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

  const Button = ({
    label,
    onClick,
    className = "",
    orange = false,
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    orange?: boolean;
    wide?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        h-12 text-xl font-medium rounded-full m-1 transition-all active:brightness-125
        ${wide ? "w-[6.5rem] text-left pl-6" : "w-12"}
        ${orange ? "bg-orange-500 text-white" : "bg-gray-700 text-white"}
        ${
          !orange && !wide && label !== "AC" && label !== "+/-" && label !== "%"
            ? "bg-gray-800"
            : ""
        }
        ${
          label === "AC" || label === "+/-" || label === "%"
            ? "bg-gray-400 text-black"
            : ""
        }
        ${className}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full w-full bg-black flex flex-col p-4 select-none">
      <div className="flex-1 flex items-end justify-end text-white text-5xl font-light px-2 mb-2 break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1">
        <Button label="AC" onClick={clear} />
        <Button label="+/-" onClick={toggleSign} />
        <Button label="%" onClick={inputPercent} />
        <Button label="÷" onClick={() => performOperation("/")} orange />

        <Button label="7" onClick={() => inputDigit("7")} />
        <Button label="8" onClick={() => inputDigit("8")} />
        <Button label="9" onClick={() => inputDigit("9")} />
        <Button label="×" onClick={() => performOperation("*")} orange />

        <Button label="4" onClick={() => inputDigit("4")} />
        <Button label="5" onClick={() => inputDigit("5")} />
        <Button label="6" onClick={() => inputDigit("6")} />
        <Button label="-" onClick={() => performOperation("-")} orange />

        <Button label="1" onClick={() => inputDigit("1")} />
        <Button label="2" onClick={() => inputDigit("2")} />
        <Button label="3" onClick={() => inputDigit("3")} />
        <Button label="+" onClick={() => performOperation("+")} orange />

        <Button label="0" onClick={() => inputDigit("0")} wide />
        <Button label="." onClick={() => inputDigit(".")} />
        <Button label="=" onClick={() => performOperation("=")} orange />
      </div>
    </div>
  );
};
