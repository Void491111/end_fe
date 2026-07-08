"use client";

import { ShoppingBag, Wallet, Calculator, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface OrderStatsProps {
  totalOrders: number;
  totalRevenue: number;
  avgOrder: number;
  voidedCount: number;
  voidedAmount: number;
}

export function OrderStats({
  totalOrders,
  totalRevenue,
  avgOrder,
  voidedCount,
  voidedAmount,
}: OrderStatsProps) {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg Order",
      value: formatCurrency(avgOrder),
      icon: Calculator,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Row 1: Main stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2: Voided summary */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
            <XCircle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Total Voided</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-lg font-bold text-destructive">
                {voidedCount} order
              </p>
              <span className="text-muted-foreground text-sm">•</span>
              <p className="text-lg font-bold text-destructive truncate">
                {formatCurrency(voidedAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}