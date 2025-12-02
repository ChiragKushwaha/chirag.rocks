import React from "react";

export const SocialApp: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#1e1e1e] text-white p-8 text-center">
      <div className="text-6xl mb-4">😔</div>
      <h1 className="text-2xl font-bold mb-2">Sorry</h1>
      <p className="text-gray-400">I'm not on {title} yet.</p>
    </div>
  );
};
