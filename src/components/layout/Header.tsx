"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutGrid, History, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { usePOSStore } from "@/store/usePOSStore";
import { APP_NAME } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const searchQuery = usePOSStore((s) => s.searchQuery);
  const setSearchQuery = usePOSStore((s) => s.setSearchQuery);

  const isPos = pathname === "/pos";

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          M
        </div>
        <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      {/* Navigation Dropdown (Menggantikan NavLink) */}
      <div className="ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2 bg-secondary/50 border-0 h-9 px-3 hover:bg-secondary/80 transition-colors"
            >
              {isPos ? (
                <>
                  <LayoutGrid className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">POS</span>
                </>
              ) : (
                <>
                  <History className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Orders</span>
                </>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem asChild>
              <Link href="/pos" className="w-full cursor-pointer flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span>POS</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="w-full cursor-pointer flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search (only on POS page) */}
      {isPos && (
        <div className="relative ml-4 flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-0"
          />
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}