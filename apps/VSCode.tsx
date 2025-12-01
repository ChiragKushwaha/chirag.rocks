import React from "react";

export const VSCode: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
      <iframe
        src="https://github1s.com/ChiragKushwaha/chirag.rocks"
        className="w-full h-full border-none"
        title="VS Code"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
};
