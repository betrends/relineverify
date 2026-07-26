"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export default function MotionButton({
  children,
  disabled,
  ...props
}: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
