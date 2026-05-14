"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PAGE_ORDER = ["/pos", "/orders"];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Compute direction langsung — pure, ga ada side effect
  const currentIndex = PAGE_ORDER.indexOf(pathname);
  const prevIndex = PAGE_ORDER.indexOf(prevPathname);
  const direction = currentIndex >= prevIndex ? 1 : -1;

  // Update prev pathname pas render berubah (legal di React 19)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
  }

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        initial={{ opacity: 0, x: 30 * direction }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 * direction }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex flex-1 w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}