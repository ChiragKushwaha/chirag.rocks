import React from "react";

interface MacOSActivityIndicatorProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export const MacOSActivityIndicator: React.FC<MacOSActivityIndicatorProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-1/2 w-[12%] h-[25%] bg-[var(--label)] rounded-full opacity-20 animate-spinner"
          style={{
            transform: `rotate(${i * 45}deg) translate(0, -140%)`,
            animationDelay: `${-(7 - i) * 0.1}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes spinner {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
        .animate-spinner {
          animation: spinner 0.8s linear infinite;
          transform-origin: center 150%; /* Adjust origin to center of the spinner */
        }
      `}</style>
    </div>
  );
};
