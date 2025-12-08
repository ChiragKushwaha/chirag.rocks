import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const locale = useLocale();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="tabular-nums">
      {time.toLocaleDateString(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}{" "}
      {time.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" })}
    </span>
  );
};
