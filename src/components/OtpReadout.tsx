"use client";

export default function OtpReadout({
  resolved,
  length = 6,
  className = "",
}: {
  resolved?: string;
  length?: number;
  className?: string;
}) {
  const display = resolved ?? "•".repeat(length);

  return (
    <span
      className={`font-mono tabular-nums tracking-[0.2em] ${className}`}
      aria-label={resolved ? `Code received: ${resolved}` : "Waiting for code"}
    >
      {display}
    </span>
  );
}
