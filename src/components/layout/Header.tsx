"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutGrid, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle.tsx";
import { UserMenu } from "@/components/layout/UserMenu";
import { usePOSStore } from "@/store/usePOSStore";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

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

      {/* Nav */}
      <nav className="flex items-center gap-1 ml-4">
        <NavLink href="/pos" icon={LayoutGrid} active={pathname === "/pos"}>
          POS
        </NavLink>
        <NavLink
          href="/orders"
          icon={History}
          active={pathname === "/orders"}
        >
          Orders
        </NavLink>
      </nav>

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

function NavLink({
  href,
  icon: Icon,
  active,
  children,
}: {
  href: string;
  icon: React.ElementType;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}