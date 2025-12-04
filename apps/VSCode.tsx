import React from "react";

export const VSCode: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
      <iframe
        src="https://github1s.com/ChiragKushwaha/mac-os-web/blob/main/README.md"
        className="w-full h-full border-none"
        title="VS Code Editor"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
};
