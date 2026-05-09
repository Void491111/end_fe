"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle.tsx";
import { UserMenu } from "@/components/layout/UserMenu";
import { usePOSStore } from "@/store/usePOSStore";
import { APP_NAME } from "@/lib/constants";

export function Header() {
  const searchQuery = usePOSStore((s) => s.searchQuery);
  const setSearchQuery = usePOSStore((s) => s.setSearchQuery);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          M
        </div>
        <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      <div className="relative ml-8 flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-secondary/50 border-0"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}