"use client";

import { ShoppingBag, DollarSign, Clock } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStatus";
import { formatCurrency } from "@/lib/format";

export function OrderStats() {
  const todayOrders = useOrderStore((s) => s.getTodayOrders());

  const completedOrders = todayOrders.filter((o) => o.status === "Completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue =
    completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const stats = [
    {
      label: "Total Orders",
      value: completedOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg Order",
      value: formatCurrency(avgOrderValue),
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
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
  );
}