"use client";

import { motion } from "framer-motion";

export default function HoverLift({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      whileHover={{ y: -6, borderColor: "rgba(124,92,252,0.5)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
