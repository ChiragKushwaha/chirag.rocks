import React from "react";

interface MacOSKeyboardProps {
  onKeyPress?: (key: string) => void;
  className?: string;
}

export const MacOSKeyboard: React.FC<MacOSKeyboardProps> = ({
  onKeyPress,
  className = "",
}) => {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["⇧", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
    ["123", "space", "return"],
  ];

  return (
    <div
      className={`bg-[#D1D5DB] dark:bg-[#1C1C1E] p-1.5 pb-safe rounded-t-2xl shadow-lg ${className}`}
    >
      <div className="flex flex-col gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => {
              let widthClass = "w-[8.5%]"; // Default key width
              if (key === "space") widthClass = "w-[40%]";
              if (key === "return" || key === "123") widthClass = "w-[15%]";
              if (key === "⇧" || key === "⌫") widthClass = "w-[12%]";

              return (
                <button
                  key={key}
                  onClick={() => onKeyPress?.(key)}
                  className={`
                    ${widthClass} h-[42px] rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.3)]
                    flex items-center justify-center text-[20px] font-normal active:bg-opacity-50
                    ${
                      ["⇧", "⌫", "123", "return"].includes(key)
                        ? "bg-[#ACB3BC] dark:bg-[#4A4A4A] text-black dark:text-white"
                        : "bg-white dark:bg-[#636366] text-black dark:text-white"
                    }
                  `}
                >
                  {key === "space" ? "space" : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
