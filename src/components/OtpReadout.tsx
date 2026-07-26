"use client";

import { useEffect, useState } from "react";

const DIGITS = "0123456789";

function randomDigits(length: number) {
  return Array.from({ length }, () => DIGITS[Math.floor(Math.random() * 10)]).join("");
}

/**
 * Renders a code that appears to "resolve" from scrambled digits into a
 * final value. When `resolved` is undefined, it loops scrambled digits
 * (used as a waiting/pending indicator). When `resolved` is provided, it
 * locks onto that value.
 */
export default function OtpReadout({
  resolved,
  length = 6,
  className = "",
}: {
  resolved?: string;
  length?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(() => resolved ?? DIGITS[0].repeat(length));

  useEffect(() => {
    if (resolved) {
      setDisplay(resolved);
      return;
    }
    setDisplay(randomDigits(length));
    const interval = setInterval(() => setDisplay(randomDigits(length)), 120);
    return () => clearInterval(interval);
  }, [resolved, length]);

  return (
    <span
      className={`font-mono tabular-nums tracking-[0.2em] ${className}`}
      aria-label={resolved ? `Code received: ${resolved}` : "Waiting for code"}
    >
      {display}
    </span>
  );
}
