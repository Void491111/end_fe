// src/components/splash/CustomerSplash.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";

const OVERLAY_CLASS =
  "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background";

const SMOOTH = [0.16, 1, 0.3, 1] as const;

const container = {
  animate: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 1, 1] as const } },
};

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SMOOTH } },
};

interface CustomerSplashProps {
  tableName?: string;
  onDone: () => void;
  holdMs?: number;
}

export function CustomerSplash({
  tableName,
  onDone,
  holdMs = 1800,
}: CustomerSplashProps) {
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
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        />
        {/* pulse halus biar “alive” */}
        <motion.span
          className="absolute inset-0 rounded-full bg-primary/10"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, delay: 0.4 }}
        />
        <motion.span
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        >
          <Coffee className="h-11 w-11 text-primary" />
        </motion.span>
      </div>

      <motion.h1 variants={item} className="text-xl font-bold tracking-tight">
        {tableName ?? "Selamat datang"}
      </motion.h1>
      <motion.p variants={item} className="mt-2 text-sm text-muted-foreground">
        Menyiapkan menu untukmu…
      </motion.p>
    </motion.div>
  );
}