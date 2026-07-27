// src/components/splash/CashierSplash.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const OVERLAY_CLASS =
  "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background";

// easeOutExpo — kunci "smooth"-nya di sini
const SMOOTH = [0.16, 1, 0.3, 1] as const;

const container = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] as const } },
};

const item = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: SMOOTH } },
};

interface CashierSplashProps {
  name?: string;
  onDone: () => void;
  holdMs?: number;
}

export function CashierSplash({ name, onDone, holdMs = 1900 }: CashierSplashProps) {
  useEffect(() => {
    const t = setTimeout(onDone, holdMs);
    return () => clearTimeout(t);
  }, [onDone, holdMs]);

  return (
    <motion.div
      className={OVERLAY_CLASS}
      variants={container}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground shadow-lg"
        initial={{ opacity: 0, scale: 0.4, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        M
      </motion.div>

      <motion.h1 variants={item} className="text-2xl font-semibold tracking-tight">
        {name ? `Halo, ${name} 👋` : "Mooiste Cafe"}
      </motion.h1>

      <motion.p variants={item} className="mt-2 text-sm text-muted-foreground">
        Menyiapkan sistem kasir…
      </motion.p>

      <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          style={{ originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 0.25 }}
        />
      </div>
    </motion.div>
  );
}