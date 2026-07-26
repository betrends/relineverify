"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

export default function AnimatedNumber({
  value,
  prefix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const motionValue = useMotionValue(value);
  const display = useTransform(motionValue, (v) => `${prefix}${Math.round(v).toLocaleString()}`);

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <motion.span className={className}>{display}</motion.span>;
}
