"use client";

import React from "react";
import HelloStrokeMultiLang from "@/components/HelloStrokeMultiLang";

export default function HelloPage() {
  return (
    <div className="min-h-screen">
      {/* You can pass custom props: durationMs, pauseMs, words, etc. */}
      <HelloStrokeMultiLang
        durationMs={5000}
        pauseMs={800}
        // className allows you to tweak outer spacing with Tailwind
        className="p-4"
      />
    </div>
  );
}
