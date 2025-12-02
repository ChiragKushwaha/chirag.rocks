import React from "react";

// --- FEATURE ICON (ROUND) ---
// Based on "Template - Icon - Feature.sketch"
export const FeatureIcon: React.FC<{ icon: React.ElementType }> = ({
  icon: Icon,
}) => (
  <div className="w-[64px] h-[64px] rounded-full bg-linear-to-b from-[#4F9CF8] to-[#007AFF] shadow-lg border border-black/5 flex items-center justify-center mb-5">
    <Icon className="text-white drop-shadow-md" size={32} strokeWidth={2} />
  </div>
);
