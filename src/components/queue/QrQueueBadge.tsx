"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { queueApi } from "@/lib/api";

export function QrQueueBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await queueApi.count();
        setCount(res.data.count ?? 0);
      } catch { /* ignore */ }
    };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <Link href="/queue" className="relative inline-flex items-center p-2 rounded-lg hover:bg-muted transition">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white animate-pulse">
          {count}
        </span>
      )}
    </Link>
  );
}