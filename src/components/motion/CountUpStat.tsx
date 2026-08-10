"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Splits "2.8M" -> { number: 2.8, decimals: 1, suffix: "M" }, "180+" ->
// { number: 180, decimals: 0, suffix: "+" }, so the numeric part can be
// counted up from 0 while the unit/suffix stays put.
function parseTarget(target: string) {
  const match = target.match(/^([\d.]+)(.*)$/);
  if (!match) return { number: 0, decimals: 0, suffix: target };
  const [, numStr, suffix] = match;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { number: parseFloat(numStr), decimals, suffix };
}

export default function CountUpStat({ target, className = "" }: { target: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState<string>(() => {
    const { decimals, suffix } = parseTarget(target);
    return `${(0).toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const { number, decimals, suffix } = parseTarget(target);
    const controls = animate(0, number, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(`${v.toFixed(decimals)}${suffix}`),
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, target]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
