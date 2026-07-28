import React from "react";

interface AlgoVizIconProps {
  size?: number;
  className?: string;
}

/**
 * alg0 / AlgoViz — algorithms you can see.
 * A connected graph mid-traversal: edges wired between nodes with a single
 * highlighted "current" node, evoking a running visualization.
 */
export const AlgoVizIcon: React.FC<AlgoVizIconProps> = ({
  size = 112,
  className = "",
}) => {
  return (
    <div
      className={`relative rounded-[22%] overflow-hidden shadow-2xl bg-linear-to-b from-[#131a2e] via-[#0c1220] to-[#070b14] flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="av-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="av-node" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </radialGradient>
          <radialGradient id="av-active" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>

        {/* Edges */}
        <g
          stroke="url(#av-edge)"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        >
          <path d="M28 32 L50 52" />
          <path d="M70 26 L50 52" />
          <path d="M50 52 L30 74" />
          <path d="M50 52 L74 70" />
          <path d="M28 32 L30 74" />
        </g>

        {/* Nodes */}
        <g>
          <circle cx="28" cy="32" r="8" fill="url(#av-node)" />
          <circle cx="70" cy="26" r="8" fill="url(#av-node)" />
          <circle cx="30" cy="74" r="8" fill="url(#av-node)" />
          <circle cx="74" cy="70" r="8" fill="url(#av-node)" />
          {/* Active / current node */}
          <circle
            cx="50"
            cy="52"
            r="10.5"
            fill="url(#av-active)"
            stroke="#fffbeb"
            strokeWidth="2"
          />
        </g>
      </svg>

      {/* Gloss */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/12 to-transparent" />
    </div>
  );
};
