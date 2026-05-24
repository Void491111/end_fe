"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartHeaderProps {
  itemCount: number;
  hasItems: boolean;
  onClearClick: () => void;
}

export function CartHeader({
  itemCount,
  hasItems,
  onClearClick,
}: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">Order Details</h2>
        {itemCount > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {itemCount}
          </span>
        )}
      </div>
      {hasItems && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearClick}
          className="h-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}