// src/components/splash/CashierSplashHost.tsx
"use client";

import { AnimatePresence } from "framer-motion";
import { CashierSplash } from "./CashierSplash";
import { useSplashStore } from "@/store/useSplashStore";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Wrapper client biar (main)/layout.tsx tetap server component.
 * AnimatePresence yang ngurus exit animation pas flag dimatiin.
 */
export function CashierSplashHost() {
  const show = useSplashStore((s) => s.showCashierSplash);
  const clear = useSplashStore((s) => s.clearCashierSplash);
  const name = useAuthStore((s) => s.user?.name);

  return (
    <AnimatePresence>
      {show && <CashierSplash name={name} onDone={clear} />}
    </AnimatePresence>
  );
}