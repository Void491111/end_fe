"use client";

import { Loader2 } from "lucide-react";
import { STATUS_CONFIG, isTerminalStatus } from "@/lib/customerStatus";
import type { OrderStatusValue } from "@/hooks/useOrderStatus";

interface Props {
  status: OrderStatusValue;
}

export function OrderStatusHero({ status }: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const terminal = isTerminalStatus(status);

  return (
    <section className={`rounded-xl border p-5 ${config.bg} transition-colors`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 ${config.color}`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold ${config.color}`}>{config.label}</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {config.description}
          </p>
        </div>
        {!terminal && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0 mt-1" />
        )}
      </div>
    </section>
  );
}
