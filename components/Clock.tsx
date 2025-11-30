import React, { useState, useEffect } from "react";

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="tabular-nums">
      {time.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}{" "}
      {time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
    </span>
  );
};
