"use client";

import { motion } from "framer-motion";
import LiveFeedCard from "./LiveFeedCard";

export default function HeroDemoCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <LiveFeedCard className="shadow-[0_0_60px_-15px_rgba(124,92,252,0.25)]" />
    </motion.div>
  );
}
