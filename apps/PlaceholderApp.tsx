import React from "react";

export const PlaceholderApp = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-[#1e1e1e] text-white font-sans">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="opacity-60">This app is not yet implemented.</p>
      </div>
    </div>
  );
};
