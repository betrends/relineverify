"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// A soft glow that follows the cursor within its parent section — wrap
// this around hero content so moving the mouse feels like it's actually
// lighting up the gradient mesh underneath. Desktop-only in spirit (mouse
// events simply never fire on touch devices, so it's a no-op there).
export default function CursorSpotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  const background = useTransform([springX, springY], ([x, y]: number[]) => {
    return `radial-gradient(600px circle at ${x}px ${y}px, rgba(124,92,252,0.15), rgba(59,130,246,0.08) 40%, transparent 70%)`;
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`relative ${className}`}>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background }} />
      {children}
    </div>
  );
}
